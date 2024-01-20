from time import sleep
import win32com.client as win32

# 한글 애플리케이션 연결
hwp = win32.gencache.EnsureDispatch("HWPFrame.HwpObject")
hwp.RegisterModule("FilePathCheckDLL", "FilePathCheckerModule")
hwp.XHwpWindows.Item(0).Visible = True

def insert_text(text):
    """텍스트 삽입"""
    hwp.HAction.GetDefault("InsertText", hwp.HParameterSet.HInsertText.HSet)
    hwp.HParameterSet.HInsertText.Text = text
    hwp.HAction.Execute("InsertText", hwp.HParameterSet.HInsertText.HSet)

def create_equation(eq_str):
    hwp.HAction.GetDefault("style", hwp.HParameterSet.HStyle.HSet)
    hwp.HParameterSet.HStyle.Apply = 1
    hwp.HAction.Execute("style", hwp.HParameterSet.HStyle.HSet)
    hwp.HAction.GetDefault("EquationCreate", hwp.HParameterSet.HEqEdit.HSet)
    hwp.HParameterSet.HEqEdit.EqFontName = "HYhwpEQ"
    hwp.HParameterSet.HEqEdit.string =  eq_str
    hwp.HParameterSet.HEqEdit.BaseUnit = hwp.PointToHwpUnit(11.5) 
    hwp.HAction.Execute("EquationCreate", hwp.HParameterSet.HEqEdit.HSet)
    sleep(1)  # 시연을 위해 1초 멈춤
    hwp.FindCtrl()  # 다시 선택
    hwp.HAction.GetDefault("EquationPropertyDialog", hwp.HParameterSet.HShapeObject.HSet)
    hwp.HParameterSet.HShapeObject.HSet.SetItem("ShapeType",2)
    hwp.HParameterSet.HShapeObject.Version = "Equation Version 60"
    hwp.HParameterSet.HShapeObject.HSet.SetItem("ApplyTo", 0)
    hwp.HParameterSet.HShapeObject.HSet.SetItem("TreatAsChar", 1)
    hwp.HAction.Execute("EquationPropertyDialog", hwp.HParameterSet.HShapeObject.HSet)
    hwp.Run("Cancel")  # 폰트 예뻐짐
    hwp.Run("MoveRight")  # 다음 수식 삽입 준비
    sleep(1)   


hwpeqn_text = "a _{1} =1`"


insert_text("첫째항이 ")
create_equation(hwpeqn_text)
insert_text("이고, 공비가 양수인 등비수열 ")
