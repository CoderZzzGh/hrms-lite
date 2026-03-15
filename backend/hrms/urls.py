from django.urls import path
from . import views

urlpatterns = [
    # Dashboard
    path('dashboard/', views.DashboardStatsView.as_view(), name='dashboard-stats'),

    # Employees
    path('employees/', views.EmployeeListCreateView.as_view(), name='employee-list-create'),
    path('employees/<int:pk>/', views.EmployeeDetailView.as_view(), name='employee-detail'),

    # Attendance
    path('attendance/', views.AttendanceListCreateView.as_view(), name='attendance-list-create'),
    path('attendance/<int:pk>/', views.AttendanceDetailView.as_view(), name='attendance-detail'),
]
