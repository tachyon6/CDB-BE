import win32com.client as win32
import sys
import time

def init_hwp():
    hwp = win32.gencache.EnsureDispatch("hwpframe.hwpobject")
    hwp.XHwpWindows.Item(0).Visible = False
    hwp.RegisterModule("FilePathCheckDLL", "FilePathCheckerModule")
    return hwp

def basic_file():
    filePath = "C:\\Users\\송준혁\\CDB-BE\\cdb-be\\test_hwp\\Basic.hwp"
    hwp.Open(filePath, "HWP", "forceopen:true")
    hwp.Run("MoveTopLevelEnd")

def save_file(filePath):
    hwp.SaveAs(filePath, "HWP", "HWP")

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

def add_question(question_number, index):
    append_hwp("C:\\Users\\송준혁\\CDB-BE\\cdb-be\\test_hwp\\{}번.hwp".format(question_number))
    if index != 1:
        number_style()
    hwp.Run("MoveTopLevelEnd")

    if(index != 0):
        hwp.Run("BreakColumn")

def hwpToPDF(filePath):
    hwp.HAction.GetDefault("FileSaveAsPdf", hwp.HParameterSet.HFileOpenSave.HSet)
    hwp.HParameterSet.HFileOpenSave.filename = filePath
    hwp.HParameterSet.HFileOpenSave.Format = "PDF"  
    hwp.HParameterSet.HFileOpenSave.Attributes = 16384
    hwp.HAction.Execute("FileSaveAsPdf", hwp.HParameterSet.HFileOpenSave.HSet)

def makeUniqueFileName():
    return time.strftime("%Y%m%d-%H%M%S")

if __name__ == "__main__":
    hwp = init_hwp()
    basic_file()

# number_input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

    number_input = [int(num) for num in sys.argv[1:]]

##문항 출력
    k=1
    for i in number_input:
        if(k == number_input.__len__()):
            k = 0
        add_question(i, k)
        k = k+1

    fileName = makeUniqueFileName()
    #save_file("C:\\Users\\송준혁\\CDB-BE\\cdb-be\\test_hwp\\{}.hwp".format(fileName))
    hwpToPDF("C:\\Users\\송준혁\\CDB-BE\\cdb-be\\test_hwp\\{}.pdf".format(fileName))
    hwp.Clear(option=1)
    hwp.Quit()
    print("Done" + fileName)
