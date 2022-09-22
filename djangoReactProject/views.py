import base64
import io
import json
import os
import zipfile

from django.core.files.base import ContentFile
from django.views.decorators.csrf import csrf_protect, csrf_exempt


from django.http import HttpResponse, JsonResponse, FileResponse
from django.shortcuts import render
from django.views.generic import TemplateView
from djangoReactProject.api import getInfoList, getInfoData, \
    getInfoByWord, addNewInfo, updateAttachments, getAttachment, updateNotice, deleteInformation
from djangoReactProject.object_models.file import Attachment


class Main(TemplateView):
    template_name = 'index.html'

    def get(self, request):
        return render(request, self.template_name, {})


def getInfoListHandler(request):
    data = getInfoList()
    return JsonResponse({'data': json.loads(data)})


def getInfoDataHandler(request):
    key = request.GET.get('key')
    data = getInfoData(int(key))
    return JsonResponse({'data': json.loads(data)})


def getInfoByWordHandler(request):
    word = request.GET.get('word')
    period = request.GET.get('period')
    data = getInfoByWord(word, period)
    return JsonResponse({'data': json.loads(data)})


def updateNoticeHandler(request):
    key = request.GET.get('key')
    notice = request.GET.get('notice')
    data = updateNotice(key, notice)
    return JsonResponse({'data': data})


def deleteInformationHandler(request):
    key = request.GET.get('key')
    data = deleteInformation(key)
    return JsonResponse({'data': data})


@csrf_exempt
def addNewInformationHandler(request):
    info_data = request.body
    result = addNewInfo(info_data.decode('utf-8'))
    return JsonResponse({'key': result})


@csrf_exempt
def uploadFilesHandler(request):
    files = request.FILES.getlist('files')
    key = request.POST.get('key')
    file_names = ''
    content_files = b''
    for file in files:
        file_names += f'*****{file.name}'
        start_seq = [255, 254, 253, 252, 251]
        stop_seq = [251, 252, 253, 254, 255]
        content_files += bytes(start_seq) + file.read() + bytes(stop_seq)

    result = updateAttachments(int(key), content_files, file_names) if file_names != '' else True
    return JsonResponse({'data': result})


def getAttachmentHandler(request):
    key = request.GET.get('key')
    attachments = getAttachment(key)

    attch_data = bytes(attachments.Application)
    attch_data_split = attch_data.split(bytes([255, 254, 253, 252, 251]))

    attch_fileNames = attachments.WithApplication.split("*****")
    attch_fileNames.reverse()
    attch_fileNames.remove('')

    attachments_result = []
    for attch_d_s in attch_data_split:
        if attch_d_s != b'':
            data = attch_d_s.replace(bytes([251, 252, 253, 254, 255]),b'')
            #data = base64.b64decode(data)

            attachments_result\
                .append(Attachment(data, attch_fileNames.pop()))

    in_memory = io.BytesIO()
    zf = zipfile.ZipFile(in_memory, mode="w")
    for attachment in attachments_result:
        zf.writestr(attachment.name, attachment.data) # name,  b'12345'
    zf.close()

    response = HttpResponse(in_memory.getbuffer(), 'application/x-gzip')
    response['Content-Length'] = len(in_memory.getbuffer())
    response['Content-Disposition'] = 'attachment; filename="attachment.zip"'
    return response


