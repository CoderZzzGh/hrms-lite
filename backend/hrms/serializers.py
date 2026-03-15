from rest_framework import serializers
from .models import Employee, AttendanceRecord


class EmployeeSerializer(serializers.ModelSerializer):
    present_days = serializers.SerializerMethodField()
    total_days = serializers.SerializerMethodField()
    attendance_rate = serializers.SerializerMethodField()

    class Meta:
        model = Employee
        fields = [
            'id', 'employee_id', 'full_name', 'email', 'department',
            'created_at', 'present_days', 'total_days', 'attendance_rate'
        ]
        read_only_fields = ['id', 'created_at']

    def validate_employee_id(self, value):
        value = value.strip().upper()
        if not value:
            raise serializers.ValidationError("Employee ID is required.")
        instance = self.instance
        qs = Employee.objects.filter(employee_id=value)
        if instance:
            qs = qs.exclude(pk=instance.pk)
        if qs.exists():
            raise serializers.ValidationError("An employee with this ID already exists.")
        return value

    def validate_email(self, value):
        value = value.strip().lower()
        instance = self.instance
        qs = Employee.objects.filter(email=value)
        if instance:
            qs = qs.exclude(pk=instance.pk)
        if qs.exists():
            raise serializers.ValidationError("An employee with this email already exists.")
        return value

    def validate_full_name(self, value):
        value = value.strip()
        if len(value) < 2:
            raise serializers.ValidationError("Full name must be at least 2 characters.")
        return value

    def validate_department(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Department is required.")
        return value

    def get_present_days(self, obj):
        return obj.attendance_records.filter(status='Present').count()

    def get_total_days(self, obj):
        return obj.attendance_records.count()

    def get_attendance_rate(self, obj):
        total = obj.attendance_records.count()
        if total == 0:
            return None
        present = obj.attendance_records.filter(status='Present').count()
        return round(present / total * 100, 1)


class AttendanceRecordSerializer(serializers.ModelSerializer):
    employee_id = serializers.CharField(source='employee.employee_id', read_only=True)
    employee_name = serializers.CharField(source='employee.full_name', read_only=True)
    employee_department = serializers.CharField(source='employee.department', read_only=True)
    employee_pk = serializers.PrimaryKeyRelatedField(
        queryset=Employee.objects.all(),
        source='employee',
        write_only=True
    )

    class Meta:
        model = AttendanceRecord
        fields = [
            'id', 'employee_pk', 'employee_id', 'employee_name',
            'employee_department', 'date', 'status', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

    def validate_date(self, value):
        from datetime import date
        if value > date.today():
            raise serializers.ValidationError("Attendance date cannot be in the future.")
        return value

    def validate_status(self, value):
        if value not in ('Present', 'Absent'):
            raise serializers.ValidationError("Status must be 'Present' or 'Absent'.")
        return value
