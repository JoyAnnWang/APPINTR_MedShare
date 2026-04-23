from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from rest_framework import generics
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
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


class StaffListCreateAPIView(generics.ListCreateAPIView):
   queryset = Staff.objects.select_related('role').all().order_by('last_name', 'first_name')
   serializer_class = StaffSerializer
   parser_classes = [MultiPartParser, FormParser, JSONParser]

   def perform_create(self, serializer):
      serializer.save()


class StaffRetrieveUpdateAPIView(generics.RetrieveUpdateAPIView):
   queryset = Staff.objects.select_related('role').all()
   serializer_class = StaffSerializer
   parser_classes = [MultiPartParser, FormParser, JSONParser]

   def perform_update(self, serializer):
      instance = serializer.save()
      instance.refresh_from_db()


class StaffDeleteAPIView(generics.DestroyAPIView):
   queryset = Staff.objects.all()
   serializer_class = StaffSerializer


class PatientListCreateAPIView(generics.ListCreateAPIView):
   queryset = Patient.objects.select_related('status').all().order_by('last_name', 'first_name')
   serializer_class = PatientSerializer
   parser_classes = [MultiPartParser, FormParser, JSONParser]

   def perform_create(self, serializer):
      serializer.save()


class PatientRetrieveUpdateAPIView(generics.RetrieveUpdateAPIView):
   queryset = Patient.objects.select_related('status').all()
   serializer_class = PatientSerializer
   parser_classes = [MultiPartParser, FormParser, JSONParser]

   def perform_update(self, serializer):
      instance = serializer.save()
      instance.refresh_from_db()


class PatientDeleteAPIView(generics.DestroyAPIView):
   queryset = Patient.objects.all()
   serializer_class = PatientSerializer


class ItemListCreateAPIView(generics.ListCreateAPIView):
   queryset = Item.objects.select_related('item_type', 'status').all().order_by('item_name')
   serializer_class = ItemSerializer
   parser_classes = [MultiPartParser, FormParser, JSONParser]

   def perform_create(self, serializer):
      serializer.save()


class ItemRetrieveUpdateAPIView(generics.RetrieveUpdateAPIView):
   queryset = Item.objects.select_related('item_type', 'status').all()
   serializer_class = ItemSerializer
   parser_classes = [MultiPartParser, FormParser, JSONParser]

   def perform_update(self, serializer):
      instance = serializer.save()
      instance.refresh_from_db()


class ItemDeleteAPIView(generics.DestroyAPIView):
   queryset = Item.objects.all()
   serializer_class = ItemSerializer


class IssuanceListCreateAPIView(generics.ListCreateAPIView):
   queryset = Issuance.objects.select_related('item', 'patient').all().order_by('-created_at')
   serializer_class = IssuanceSerializer
   parser_classes = [JSONParser]

   def perform_create(self, serializer):
      serializer.save()


class IssuanceRetrieveUpdateAPIView(generics.RetrieveUpdateAPIView):
   queryset = Issuance.objects.select_related('item', 'patient').all()
   serializer_class = IssuanceSerializer
   parser_classes = [JSONParser]

   def perform_update(self, serializer):
      instance = serializer.save()
      instance.refresh_from_db()


class IssuanceDeleteAPIView(generics.DestroyAPIView):
   queryset = Issuance.objects.all()
   serializer_class = IssuanceSerializer


class ReturnListCreateAPIView(generics.ListCreateAPIView):
   queryset = Return.objects.select_related('item', 'patient').all().order_by('-created_at')
   serializer_class = ReturnSerializer
   parser_classes = [JSONParser]

   def perform_create(self, serializer):
      serializer.save()


class ReturnRetrieveUpdateAPIView(generics.RetrieveUpdateAPIView):
   queryset = Return.objects.select_related('item', 'patient').all()
   serializer_class = ReturnSerializer
   parser_classes = [JSONParser]

   def perform_update(self, serializer):
      instance = serializer.save()
      instance.refresh_from_db()


class ReturnDeleteAPIView(generics.DestroyAPIView):
   queryset = Return.objects.all()
   serializer_class = ReturnSerializer


# ─── Auth Views ───────────────────────────────────────────────────────────────

def login_view(request):
   if request.user.is_authenticated:
      return redirect('index')
   if request.method == "POST":
      username = request.POST.get("username", "").strip()
      password = request.POST.get("password", "")
      user = authenticate(request, username=username, password=password)
      if user is not None:
         login(request, user)
         return redirect('index')
      else:
         messages.error(request, "Invalid username or password. Please try again.")
   return render(request, "login.html")


def logout_view(request):
   logout(request)
   return redirect('login')


# ─── Page Views ───────────────────────────────────────────────────────────────

@login_required
def index(request):
   return render(request, "admindashboard.html")

@login_required
def staff_list(request):
   return render(request, "staff.html")

@login_required
def patient_list(request):
   return render(request, "patient.html")

@login_required
def item_list(request):
   return render(request, "item.html")

@login_required
def issuance_list(request):
   return render(request, "Issuance.html")

@login_required
def return_list(request):
   return render(request, "return.html")