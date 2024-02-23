import win32com.client as win32
import os
import sys
import boto3

project_root = os.getcwd()
basic_hwp_path = "C:\\Users\\Administrator\\Desktop\\CDB-BE\\test_hwp\\Basic.hwp"
hwp_result_path = os.path.join(project_root, "test_hwp", "hwp_results")
pdf_result_path = os.path.join(project_root, "test_hwp", "pdf_results")
temp_hwp_path = os.path.join(project_root, "test_hwp", "temp")


def init_hwp():
    hwp = win32.gencache.EnsureDispatch("hwpframe.hwpobject")
    hwp.XHwpWindows.Item(0).Visible = True
    hwp.RegisterModule("FilePathCheckDLL", "FilePathCheckerModule")
    return hwp

def basic_file():
    filePath = basic_hwp_path
    hwp.Open(filePath, "HWP", "forceopen:true")
    print(filePath)
    hwp.Run("MoveTopLevelEnd")

def hwpToPDF(filePath):
    hwp.HAction.GetDefault("FileSaveAsPdf", hwp.HParameterSet.HFileOpenSave.HSet)
    hwp.HParameterSet.HFileOpenSave.filename = filePath
    hwp.HParameterSet.HFileOpenSave.Format = "PDF"  
    hwp.HParameterSet.HFileOpenSave.Attributes = 16384
    hwp.HAction.Execute("FileSaveAsPdf", hwp.HParameterSet.HFileOpenSave.HSet)

def download_file_from_s3(bucket_name, object_name, local_file_name):
    s3 = boto3.client('s3')
    s3.download_file(bucket_name, object_name, local_file_name)

def upload_file_to_s3(local_file_name, bucket_name, object_name):
    s3 = boto3.client('s3')
    s3.upload_file(local_file_name, bucket_name, object_name)
    print(f"Uploaded {local_file_name} to s3://{bucket_name}/{object_name}")

def set_title(title):
    hwp.Run("MoveViewBegin")
    hwp.HAction.GetDefault("InsertText", hwp.HParameterSet.HInsertText.HSet)
    hwp.HParameterSet.HInsertText.Text = title
    hwp.HAction.Execute("InsertText", hwp.HParameterSet.HInsertText.HSet)
    hwp.Run("MoveTopLevelEnd")

if __name__ == "__main__":
    fileName = sys.argv[1]
    title = sys.argv[2]
    question_input = sys.argv[3:]
    hwp = init_hwp()
    basic_file()
    set_title(title)
    
    hwp.Clear(option=1)
    hwp.Quit()