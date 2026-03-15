from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse, HttpResponse


def health_check(request):
    return JsonResponse({
        'status': 'ok',
        'message': 'HRMS Lite API is running',
        'version': '1.0.0',
        'endpoints': {
            'dashboard':  '/api/dashboard/',
            'employees':  '/api/employees/',
            'attendance': '/api/attendance/',
            'admin':      '/admin/',
        }
    })


def favicon(request):
    return HttpResponse(status=204)


urlpatterns = [
    path('',            health_check, name='health-check'),
    path('favicon.ico', favicon,      name='favicon'),
    path('admin/',      admin.site.urls),
    path('api/',        include('hrms.urls')),
]



