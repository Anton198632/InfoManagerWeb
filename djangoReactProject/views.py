import base64
import io
import json
import os
import zipfile

from asgiref.sync import sync_to_async, async_to_sync
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.layers import get_channel_layer
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

@sync_to_async
@csrf_exempt
@async_to_sync
async def addNewInformationHandler(request):

    info_data = request.body
    result = addNewInfo(info_data.decode('utf-8'))

    await Consumer.broadcast_message(result)

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



class Consumer(AsyncJsonWebsocketConsumer):
    __SERVICE = 'service'
    __RESPONSE_TEMPLATE = ''

    @classmethod
    async def broadcast_message(cls, message: str):

        layer = get_channel_layer()
        groups = layer.groups
        for gr in groups:
            if gr == 'room_2':
                await layer.group_send(gr, {  # 'room_2'
                    'type': 'send_message',
                    'event': message,
                })

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_code']
        self.room_group_name = 'room_%s' % self.room_name

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        response = json.loads(text_data)
        event = response.get("event", None)
        if event == 'START':
            await self.__create_response_async('Соединение с сервером - OK')

    async def send_message(self, res):
        await self.send(text_data=json.dumps({
            "event": res,
        }))

    async def __create_response_async(self, text):
        response = text
        await Consumer.broadcast_message(response)
