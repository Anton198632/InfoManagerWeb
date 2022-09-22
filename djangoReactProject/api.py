import os
import clr

projectPath = os.path.dirname(os.path.abspath(__file__))
projectPath = projectPath[0: projectPath.rfind('\\')]
infoMAPI_dll = f'{projectPath}\\InfoManageAPI\\InfoMAPI\\bin\\Debug\\InfoMAPI.dll'

clr.AddReference(infoMAPI_dll)  # f'{os.path.dirname(os.path.abspath(__file__))}/InfoMAPI.dll'
import InfoMAPI

InfoMAPI.Database.DBHelper("localhost", f'{projectPath}\\info_base_v2.ib')


def getInfoList():
    return InfoMAPI.Database.DBHelper.GetInfoList(100, 1)


def getInfoData(key):
    return InfoMAPI.Database.DBHelper.GetInfoData(key)


def getInfoByWord(word, period):
    return InfoMAPI.Database.DBHelper.GetInfoListByWorld(word, period, 100, 1)


def addNewInfo(info_data):
    return InfoMAPI.Database.DBHelper.AddNewInfo(info_data)


def updateAttachments(key, filesData, filesNames):
    return InfoMAPI.Database.DBHelper.UpdateAttachments(key, filesData, filesNames)


def getAttachment(key):
    return InfoMAPI.Database.DBHelper.GetAttachment(key)


def updateNotice(key, notice):
    return InfoMAPI.Database.DBHelper.UpdateNotice(key, notice)


def deleteInformation(key):
    return InfoMAPI.Database.DBHelper.DeleteInformation(key)