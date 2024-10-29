from django.urls import path
from .views import get_live_data, run_streaming_layer


urlpatterns = [
    path('data', views.get_live_data, name='get_live_data'),
    path('inference', views.get_inference, name='get_inference'),
    path('/fakedata', get_live_data, name='get_live_data'),
    path('/streaminglayer', run_streaming_layer, name='run_strlayer'),
]
