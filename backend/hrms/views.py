from datetime import date
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Employee, AttendanceRecord
from .serializers import EmployeeSerializer, AttendanceRecordSerializer


def error_response(message, errors=None, status_code=400):
    payload = {'error': message}
    if errors:
        payload['details'] = errors
    return Response(payload, status=status_code)



class EmployeeListCreateView(APIView):
    

    def get(self, request):
        qs = Employee.objects.all()
        dept = request.query_params.get('dept')
        if dept:
            qs = qs.filter(department__iexact=dept)
        search = request.query_params.get('search')
        if search:
            from django.db.models import Q
            qs = qs.filter(
                Q(full_name__icontains=search) |
                Q(employee_id__icontains=search) |
                Q(email__icontains=search)
            )
        serializer = EmployeeSerializer(qs, many=True)
        return Response({'count': qs.count(), 'results': serializer.data})

    def post(self, request):
        serializer = EmployeeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return error_response("Validation failed", serializer.errors)


class EmployeeDetailView(APIView):
   

    def get(self, request, pk):
        emp = get_object_or_404(Employee, pk=pk)
        serializer = EmployeeSerializer(emp)
        return Response(serializer.data)

    def delete(self, request, pk):
        emp = get_object_or_404(Employee, pk=pk)
        emp_id = emp.employee_id
        emp.delete()
        return Response(
            {'message': f'Employee {emp_id} and all related records deleted.'},
            status=status.HTTP_200_OK
        )




class AttendanceListCreateView(APIView):
   

    def get(self, request):
        qs = AttendanceRecord.objects.select_related('employee').all()

        emp_pk = request.query_params.get('employee_id')
        if emp_pk:
            qs = qs.filter(employee__id=emp_pk)

        att_date = request.query_params.get('date')
        if att_date:
            qs = qs.filter(date=att_date)

        att_status = request.query_params.get('status')
        if att_status:
            qs = qs.filter(status=att_status)

        serializer = AttendanceRecordSerializer(qs, many=True)
        return Response({'count': qs.count(), 'results': serializer.data})

    def post(self, request):
        employee_pk = request.data.get('employee_pk')
        att_date = request.data.get('date')

        # Upsert: update if record exists for employee+date
        if employee_pk and att_date:
            existing = AttendanceRecord.objects.filter(
                employee__id=employee_pk, date=att_date
            ).first()
            if existing:
                serializer = AttendanceRecordSerializer(
                    existing, data=request.data, partial=True
                )
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_200_OK)
                return error_response("Validation failed", serializer.errors)

        serializer = AttendanceRecordSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return error_response("Validation failed", serializer.errors)


class AttendanceDetailView(APIView):
   

    def get(self, request, pk):
        record = get_object_or_404(AttendanceRecord, pk=pk)
        return Response(AttendanceRecordSerializer(record).data)

    def patch(self, request, pk):
        record = get_object_or_404(AttendanceRecord, pk=pk)
        serializer = AttendanceRecordSerializer(record, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return error_response("Validation failed", serializer.errors)

    def delete(self, request, pk):
        record = get_object_or_404(AttendanceRecord, pk=pk)
        record.delete()
        return Response({'message': 'Record deleted.'}, status=status.HTTP_200_OK)



class DashboardStatsView(APIView):
   

    def get(self, request):
        today = date.today()
        total_employees = Employee.objects.count()
        departments = Employee.objects.values('department').distinct().count()
        today_records = AttendanceRecord.objects.filter(date=today)
        present_today = today_records.filter(status='Present').count()
        absent_today = today_records.filter(status='Absent').count()
        marked_today = today_records.count()
        rate = round(present_today / marked_today * 100) if marked_today else 0

        # Department breakdown
        from django.db.models import Count
        dept_breakdown = list(
            Employee.objects.values('department')
            .annotate(count=Count('id'))
            .order_by('-count')
        )

        return Response({
            'total_employees': total_employees,
            'departments': departments,
            'present_today': present_today,
            'absent_today': absent_today,
            'not_marked_today': total_employees - marked_today,
            'attendance_rate_today': rate,
            'department_breakdown': dept_breakdown,
        })
