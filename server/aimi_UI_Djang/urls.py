# projectname/urls.py

from django.contrib import admin
from django.http import HttpResponseNotFound
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/eeg', include('eegdata.urls')),
]