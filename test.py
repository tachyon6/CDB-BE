import os
import win32com.client as win32
project_root = os.getcwd() 
basic_hwp_path = os.path.join(project_root, "test_hwp", "Basic.hwp")

def init_hwp():
    hwp = win32.gencache.EnsureDispatch("hwpframe.hwpobject")
    hwp.XHwpWindows.Item(0).Visible = True
    hwp.RegisterModule("FilePathCheckDLL", "FilePathCheckerModule")
    return hwp
def basic_file():
    filePath = basic_hwp_path
    hwp.Open(filePath, "HWP", "forceopen:true")
    hwp.Run("MoveTopLevelEnd")

if __name__ == "__main__":
    hwp = init_hwp()
    basic_file()