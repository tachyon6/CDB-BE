import win32com.client as win32

hwp = win32.Dispatch('HWPFrame.HwpObject')
hwp.RegisterModule("FilePathCheckDLL", "FilePathCheckerModule")
hwp.XHwpWindows.Item(0).Visible = False

filePath = "C:\\Users\\송준혁\\CDB-BE\\maker\\1.hwp"
hwp.Open(filePath, "HWP", "forceopen:true")


newFilePath = "C:\\Users\\송준혁\\CDB-BE\\maker\\1-3.hwp"
hwp.SaveAs(newFilePath, "HWP", "HWP")
hwp.Quit()

hwp.XHwpWindows.Item(0).Visible = True
