import win32com.client as win32

def init_hwp():
    """
    아래아한글 시작
    """
    hwp = win32.gencache.EnsureDispatch("hwpframe.hwpobject")
    hwp.XHwpWindows.Item(0).Visible = True
    hwp.RegisterModule("FilePathCheckDLL", "FilePathCheckerModule")
    return hwp

def append_hwp(filename):
    """
    문서 끼워넣기
    """
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

def add_question(question_number):
    append_hwp("C:\\Users\\송준혁\\OneDrive\\바탕 화면\\{}번.hwp".format(question_number))
    if question_number != 1:
        number_style()
    hwp.Run("MoveTopLevelEnd")
    hwp.Run("BreakColumn")



hwp = init_hwp()

##문항 출력
for i in range(1, 11):
    add_question(i)
