from . import views
from django.urls import path
from .views import (
   RoleListAPIView,
   StatusListAPIView,
   ItemStatusListAPIView,
   ItemTypeListAPIView,
   StaffListCreateAPIView,
   StaffRetrieveUpdateAPIView,
   StaffDeleteAPIView,
   PatientListCreateAPIView,
   PatientRetrieveUpdateAPIView,
   PatientDeleteAPIView,
   ItemListCreateAPIView,
   ItemRetrieveUpdateAPIView,
   ItemDeleteAPIView,
   IssuanceListCreateAPIView,
   IssuanceRetrieveUpdateAPIView,
   IssuanceDeleteAPIView,
   ReturnListCreateAPIView,
   ReturnRetrieveUpdateAPIView,
   ReturnDeleteAPIView,
)


urlpatterns = [
   path('roles/', RoleListAPIView.as_view()),
   path('status/', StatusListAPIView.as_view()),
   path('itemstatus/', ItemStatusListAPIView.as_view()),
   path('itemtypes/', ItemTypeListAPIView.as_view()),
   path('staffs/', StaffListCreateAPIView.as_view()),
   path('staffs/<int:pk>/', StaffRetrieveUpdateAPIView.as_view(), name='staffdetail-update'),
   path('staffs/<int:pk>/delete/', StaffDeleteAPIView.as_view(), name='staffdelete'),
   path('patients/', PatientListCreateAPIView.as_view()),
   path('patients/<int:pk>/', PatientRetrieveUpdateAPIView.as_view(), name='patientdetail-update'),
   path('patients/<int:pk>/delete/', PatientDeleteAPIView.as_view(), name='patientdelete'),
   path('items/', ItemListCreateAPIView.as_view()),
   path('items/<int:pk>/', ItemRetrieveUpdateAPIView.as_view(), name='itemdetail-update'),
   path('items/<int:pk>/delete/', ItemDeleteAPIView.as_view(), name='itemdelete'),
   path('issuance/', IssuanceListCreateAPIView.as_view()),
   path('issuance/<int:pk>/', IssuanceRetrieveUpdateAPIView.as_view(), name='issuancedetail-update'),
   path('issuance/<int:pk>/delete/', IssuanceDeleteAPIView.as_view(), name='issuancedelete'),
   path('return/', ReturnListCreateAPIView.as_view()),
   path('return/<int:pk>/', ReturnRetrieveUpdateAPIView.as_view(), name='returndetail-update'),
   path('return/<int:pk>/delete/', ReturnDeleteAPIView.as_view(), name='returndelete'),
   path('', views.index, name='index'),
]

