from django.shortcuts import render
from rest_framework import generics
from .models import Role, Status, ItemStatus, ItemType, Staff, Patient, Item, Issuance, Return
from .serializers import (
   RoleSerializer,
   StatusSerializer,
   ItemStatusSerializer,
   ItemTypeSerializer,
   StaffSerializer,
   PatientSerializer,
   ItemSerializer,
   IssuanceSerializer,
   ReturnSerializer,
)




class RoleListAPIView(generics.ListAPIView):
   queryset = Role.objects.all().order_by('id')
   serializer_class = RoleSerializer




class StatusListAPIView(generics.ListAPIView):
   queryset = Status.objects.all().order_by('id')
   serializer_class = StatusSerializer




class ItemStatusListAPIView(generics.ListAPIView):
   queryset = ItemStatus.objects.all().order_by('id')
   serializer_class = ItemStatusSerializer




class ItemTypeListAPIView(generics.ListAPIView):
   queryset = ItemType.objects.all().order_by('id')
   serializer_class = ItemTypeSerializer




class StaffListAPIView(generics.ListAPIView):
   queryset = Staff.objects.select_related(
       'role'
   ).all().order_by('last_name','first_name')
   serializer_class = StaffSerializer




class PatientListAPIView(generics.ListAPIView):
   queryset = Patient.objects.select_related(
       'status'
   ).all().order_by('last_name','first_name')
   serializer_class = PatientSerializer




class ItemListAPIView(generics.ListAPIView):
   queryset = Item.objects.select_related(
       'item_type',
       'status'
   ).all().order_by('item_name')
   serializer_class = ItemSerializer




class IssuanceListAPIView(generics.ListAPIView):
   queryset = Issuance.objects.select_related(
       'item',
       'patient',
   ).all().order_by('created_at')
   serializer_class = IssuanceSerializer




class ReturnListAPIView(generics.ListAPIView):
   queryset = Return.objects.select_related(
       'item',
       'patient',
   ).all().order_by('created_at')
   serializer_class = ReturnSerializer




def index(request):
   return render(request, 'index.html')

