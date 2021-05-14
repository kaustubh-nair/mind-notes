from django.contrib import admin
from django.apps import apps

for _, model in apps.get_app_config('api').models.items():                              
    admin.site.register(model) 
