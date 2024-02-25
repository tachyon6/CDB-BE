import win32com.client as win32
import sys
import pikepdf
from decimal import Decimal
import boto3
import os
import traceback

project_root = os.getcwd()
basic_hwp_path = os.path.join(project_root, "test_hwp", "Basic.hwp")
temp_hwp_path = os.path.join(project_root, "test_hwp", "temp")
hwp_result_path = os.path.join(project_root, "test_hwp", "hwp_results")
pdf_result_path = os.path.join(project_root, "test_hwp", "pdf_results")
resized_pdf_result_path = os.path.join(project_root, "test_hwp", "resized_pdf_results")

def init_hwp():
    hwp = win32.gencache.EnsureDispatch("hwpframe.hwpobject")
    hwp.XHwpWindows.Item(0).Visible = False
    hwp.RegisterModule("FilePathCheckDLL", "FilePathCheckerModule")
    return hwp

def basic_file():
    filePath = basic_hwp_path
    hwp.Open(filePath, "HWP", "forceopen:true")
    hwp.Run("MoveTopLevelEnd")

def set_title(title):
    hwp.Run("MoveViewBegin")
    hwp.HAction.GetDefault("InsertText", hwp.HParameterSet.HInsertText.HSet)
    hwp.HParameterSet.HInsertText.Text = title
    hwp.HAction.Execute("InsertText", hwp.HParameterSet.HInsertText.HSet)
    hwp.Run("MoveTopLevelEnd")
    

def save_file(filePath):
    hwp.SaveAs(filePath, "HWP", "HWP")

def download_file_from_s3(bucket_name, object_name, local_file_name):
    s3 = boto3.client('s3')
    s3.download_file(bucket_name, object_name, local_file_name)

def upload_file_to_s3(local_file_name, bucket_name, object_name):
    s3 = boto3.client('s3')
    s3.upload_file(local_file_name, bucket_name, object_name)
    print(f"Uploaded {local_file_name} to s3://{bucket_name}/{object_name}")


def cleanup_file(file_path):
    if os.path.exists(file_path):
        os.remove(file_path)
        print(f"Deleted file {file_path}")

def append_hwp(filename):
    hwp.HAction.GetDefault("InsertFile", hwp.HParameterSet.HInsertFile.HSet)
    hwp.HParameterSet.HInsertFile.KeepSection = 0
    hwp.HParameterSet.HInsertFile.KeepCharshape = 0
    hwp.HParameterSet.HInsertFile.KeepParashape = 0
    hwp.HParameterSet.HInsertFile.KeepStyle = 0
    hwp.HParameterSet.HInsertFile.filename = filename
    hwp.HAction.Execute("InsertFile", hwp.HParameterSet.HInsertFile.HSet)

def number_style():
    hwp.Run("PutParaNumber")
    hwp.Run("PutParaNumber")

def add_question(question_code, index):
    try:
        bucket_name = "cdb-math"
        object_name = f"uploads/{question_code}.hwp"
        local_file_name = os.path.join(temp_hwp_path, f"{question_code}.hwp")
        download_file_from_s3(bucket_name, object_name, local_file_name)

        append_hwp(local_file_name)
        if index != 1:
            number_style()
        hwp.Run("MoveTopLevelEnd")
        if index != 0:
            hwp.Run("BreakColumn")

        cleanup_file(local_file_name)
    except Exception as e:
        print(f"An error occurred in add_question: {e}")
        traceback.print_exc()

def hwpToPDF(filePath):
    hwp.HAction.GetDefault("FileSaveAsPdf", hwp.HParameterSet.HFileOpenSave.HSet)
    hwp.HParameterSet.HFileOpenSave.filename = filePath
    hwp.HParameterSet.HFileOpenSave.Format = "PDF"  
    hwp.HParameterSet.HFileOpenSave.Attributes = 16384
    hwp.HAction.Execute("FileSaveAsPdf", hwp.HParameterSet.HFileOpenSave.HSet)

def resize_pdf_centered(input_pdf_path, output_pdf_path, scale_factor):
    with pikepdf.open(input_pdf_path) as pdf:
        for page in pdf.pages:
            # 현재 페이지의 MediaBox를 가져옵니다.
            media_box = page.MediaBox

            # 원래 크기
            original_width = Decimal(media_box[2]) - Decimal(media_box[0])
            original_height = Decimal(media_box[3]) - Decimal(media_box[1])

            # 새로운 크기 계산
            new_width = original_width * Decimal(scale_factor)
            new_height = original_height * Decimal(scale_factor)

            # 중앙 기준으로 조정하기 위해 변화량 계산
            delta_width = (original_width - new_width) / Decimal(2)
            delta_height = (original_height - new_height) / Decimal(2)

            # 새로운 MediaBox 설정
            page.MediaBox = [
                Decimal(media_box[0]) + delta_width,
                Decimal(media_box[1]) + delta_height,
                Decimal(media_box[2]) - delta_width,
                Decimal(media_box[3]) - delta_height
            ]

        pdf.save(output_pdf_path)

if __name__ == "__main__":
    try:
        fileName = sys.argv[1]
        title = sys.argv[2]
        question_input = sys.argv[3:]
    
        hwp = init_hwp()
        basic_file()
        set_title(title)

        k=1
        for i in question_input:
            if(k == question_input.__len__()):
                k = 0
            add_question(i, k)
            k = k+1
        file_hwp = hwp_result_path + "\\" + fileName + ".hwp"
        #hwp 파일 저장
        #save_file(file_hwp)
    
        file_pdf = pdf_result_path + "\\" + fileName + ".pdf"
        #pdf 파일로 변환
        hwpToPDF(file_pdf)

        resized_pdf = resized_pdf_result_path + "\\" + fileName + ".pdf"
        resize_pdf_centered(file_pdf, resized_pdf, 0.9)
        upload_file_to_s3(resized_pdf, "cdb-math", f"uploads/results/{fileName}.pdf")
        cleanup_file(file_pdf)
        cleanup_file(resized_pdf)
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        if 'hwp' in locals():
            hwp.Clear(option=1)
            hwp.Quit()
            print("HWP Application has been closed.")