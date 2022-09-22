from django.contrib import admin
from django.urls import path, re_path

from djangoReactProject import views
from djangoReactProject.views import Main

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', Main.as_view()),

    path('getInfoList', views.getInfoListHandler),
    path('updateNotice', views.updateNoticeHandler),
    path('getInfoData', views.getInfoDataHandler),
    path('getInfoByWord', views.getInfoByWordHandler),
    path('addNewInformation', views.addNewInformationHandler),
    path('uploadFiles', views.uploadFilesHandler),
    path('getAttachment', views.getAttachmentHandler),
    path('deleteInformation', views.deleteInformationHandler)

]
