from . import views
from django.urls import path
from .views import (
   RoleListAPIView,
   StatusListAPIView,
   ItemStatusListAPIView,
   ItemTypeListAPIView,
   StaffListAPIView,
   PatientListAPIView,
   ItemListAPIView,
   IssuanceListAPIView,
   ReturnListAPIView,
)


urlpatterns = [
   path('roles/', RoleListAPIView.as_view()),
   path('status/', StatusListAPIView.as_view()),
   path('itemstatus/', ItemStatusListAPIView.as_view()),
   path('itemtypes/', ItemTypeListAPIView.as_view()),
   path('staffs/', StaffListAPIView.as_view()),
   path('patients/', PatientListAPIView.as_view()),
   path('items/', ItemListAPIView.as_view()),
   path('issuance/', IssuanceListAPIView.as_view()),
   path('return/', ReturnListAPIView.as_view()),
   path('', views.index, name='index'),
]

