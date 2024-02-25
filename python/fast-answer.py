import win32com.client as win32
import sys
import os
import boto3
import uuid

project_root = os.getcwd()

ans_pdf_result_path = os.path.join(project_root, "test_hwp", "pdf_results_ans")

def init_hwp():
    hwp = win32.gencache.EnsureDispatch("hwpframe.hwpobject")
    hwp.XHwpWindows.Item(0).Visible = False
    hwp.RegisterModule("FilePathCheckDLL", "FilePathCheckerModule")
    return hwp

def basic_file(filePath):
    hwp.Open(filePath, "HWP", "forceopen:true")

def push_number_and_answer(num, answer):
    if(answer == "#1"):
        answer = "①"
    elif(answer == "#2"):
        answer = "②"
    elif(answer == "#3"):
        answer = "③"
    elif(answer == "#4"):
        answer = "④"
    elif(answer == "#5"):
        answer = "⑤"
    hwp.HAction.GetDefault("InsertText", hwp.HParameterSet.HInsertText.HSet)
    hwp.HParameterSet.HInsertText.Text = f"{num}"
    hwp.HAction.Execute("InsertText", hwp.HParameterSet.HInsertText.HSet)
    hwp.Run("MoveRight")
    hwp.HAction.GetDefault("InsertText", hwp.HParameterSet.HInsertText.HSet)
    hwp.HParameterSet.HInsertText.Text = f"{answer}"
    hwp.HAction.Execute("InsertText", hwp.HParameterSet.HInsertText.HSet)
    hwp.Run("MoveRight")

def make_box_size(length):
    additional_row = (length-11)//5 + 1
    if(length > 10):
        for _ in range(additional_row):
            hwp.Run("TableAppendRow")
            hwp.Run("MoveUp")

def hwpToPDF(filePath):
    hwp.HAction.GetDefault("FileSaveAsPdf", hwp.HParameterSet.HFileOpenSave.HSet)
    hwp.HParameterSet.HFileOpenSave.filename = filePath
    hwp.HParameterSet.HFileOpenSave.Format = "PDF"  
    hwp.HParameterSet.HFileOpenSave.Attributes = 16384
    hwp.HAction.Execute("FileSaveAsPdf", hwp.HParameterSet.HFileOpenSave.HSet)

def cleanup_file(file_path):
    if os.path.exists(file_path):
        os.remove(file_path)
        print(f"Deleted file {file_path}")

def upload_file_to_s3(local_file_name, bucket_name, object_name):
    s3 = boto3.client('s3')
    s3.upload_file(local_file_name, bucket_name, object_name)
    print(f"Uploaded {local_file_name} to s3://{bucket_name}/{object_name}")

def download_file_from_s3(bucket_name, object_name, local_file_name):
    s3 = boto3.client('s3')
    s3.download_file(bucket_name, object_name, local_file_name)

def download_answer_file(file_name):
    download_file_from_s3("cdb-math", "basic_files/Answer.hwp", file_name)  
        
def generate_fileName():
    unique_id = uuid.uuid4()
    filename = f"hwp_{unique_id}"
    return filename

if __name__ == "__main__":
    try:
        fileName = sys.argv[1]
        answers = sys.argv[2:]

        ans_basic_hwp_path = os.path.join(project_root, "test_hwp", generate_fileName()+ "_answer.hwp")
        download_answer_file(ans_basic_hwp_path)

        hwp = init_hwp()
        basic_file(ans_basic_hwp_path)
        make_box_size(len(answers))

        for i in range(len(answers)):
            push_number_and_answer(i+1, answers[i])

        file_pdf = os.path.join(ans_pdf_result_path, f"{fileName}.pdf")
        hwpToPDF(file_pdf)

        upload_file_to_s3(file_pdf, "cdb-math", f"uploads/results_ans/{fileName}.pdf")
        cleanup_file(file_pdf)
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        if 'hwp' in locals():
            hwp.Clear(option=1)
            hwp.Quit()
            cleanup_file(ans_basic_hwp_path)
            print("HWP Application has been closed.")
