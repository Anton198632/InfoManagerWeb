from django.urls import re_path

from djangoReactProject.views import Consumer

websocket_urlpatterns = [
    re_path(r'^ws/event/(?P<room_code>\w+)/$', Consumer.as_asgi()),
]