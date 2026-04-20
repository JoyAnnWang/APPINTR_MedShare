from rest_framework import serializers
from .models import Role, Status, ItemStatus, ItemType, Staff, Patient, Item, Issuance, Return




class RoleSerializer(serializers.ModelSerializer):
   class Meta:
       model = Role
       fields = '__all__'




class StatusSerializer(serializers.ModelSerializer):
   class Meta:
       model = Status
       fields = '__all__'




class ItemStatusSerializer(serializers.ModelSerializer):
   class Meta:
       model = ItemStatus
       fields = '__all__'




class ItemTypeSerializer(serializers.ModelSerializer):
   class Meta:
       model = ItemType
       fields = '__all__'




class StaffSerializer(serializers.ModelSerializer):
   role_name = serializers.CharField(source='role.role_name', read_only=True)


   class Meta:
       model = Staff
       fields = [
           'id',
           'staff_id',
           'last_name',
           'first_name',
           'middle_initial',
           'department',
           'gender',
           'email',
           'phone',
           'photo',
           'role',
           'role_name',
           'created_at',
       ]
       extra_kwargs = {
           'role': {'read_only': True}
       }



class PatientSerializer(serializers.ModelSerializer):
   status_name = serializers.CharField(source='status.status_name', read_only=True)


   class Meta:
       model = Patient
       fields = [
           'id',
           'patient_id',
           'last_name',
           'first_name',
           'middle_initial',
           'gender',
           'email',
           'course',
           'phone',
           'photo',
           'status',
           'status_name',
           'created_at',
       ]
       extra_kwargs = {
           'status': {'read_only': True}
       }



class ItemSerializer(serializers.ModelSerializer):
   status_name = serializers.CharField(source='itemstatus.status_name', read_only=True)
   item_type_name = serializers.CharField(source='itemtype.item_type_name', read_only=True)


   class Meta:
       model = Item
       fields = [
           'id',
           'item_id',
           'item_name',
           'item_type',
           'item_type_name',
           'status',
           'status_name',
           'created_at',
       ]




class IssuanceSerializer(serializers.ModelSerializer):
   item_name = serializers.CharField(source='item.item_name', read_only=True)
   patient_name = serializers.CharField(source='patient.patient_name', read_only=True)


   class Meta:
       model = Issuance
       fields = [
           'id',
           'issuance_id',
           'item',
           'item_name',
           'patient',
           'patient_name',
           'created_at',
       ]




class ReturnSerializer(serializers.ModelSerializer):
   item_name = serializers.CharField(source='item.item_name', read_only=True)
   patient_name = serializers.CharField(source='patient.patient_name', read_only=True)


   class Meta:
       model = Return
       fields = [
           'id',
           'return_id',
           'item',
           'item_name',
           'patient',
           'patient_name',
           'created_at',
       ]

