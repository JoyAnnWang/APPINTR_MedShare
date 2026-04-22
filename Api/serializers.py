from rest_framework import serializers
from .models import Role, Status, ItemStatus, ItemType, Staff, Patient, Item, Issuance, Return


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['id', 'role_name', 'description']


class StatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Status
        fields = ['id', 'status_name']


class ItemStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemStatus
        fields = ['id', 'status_name']


class ItemTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemType
        fields = ['id', 'item_type_name']


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
            'role',        # writable FK (ID)
            'role_name',   # readable display name
            'created_at',
        ]


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
            'status',       # writable FK (ID)
            'status_name',  # readable display name
            'created_at',
        ]


class ItemSerializer(serializers.ModelSerializer):
    item_type_name = serializers.CharField(source='item_type.item_type_name', read_only=True)
    status_name    = serializers.CharField(source='status.status_name', read_only=True)

    class Meta:
        model = Item
        fields = [
            'id',
            'item_id',
            'item_name',
            'item_type',       # writable FK (ID)
            'item_type_name',  # readable display name
            'photo',
            'status',          # writable FK (ID)
            'status_name',     # readable display name
            'created_at',
        ]


class IssuanceSerializer(serializers.ModelSerializer):
    item_name    = serializers.CharField(source='item.item_name', read_only=True)
    item_id_code = serializers.CharField(source='item.item_id',   read_only=True)
    patient_name = serializers.SerializerMethodField()
    patient_id_code = serializers.CharField(source='patient.patient_id', read_only=True)

    def get_patient_name(self, obj):
        return f"{obj.patient.last_name}, {obj.patient.first_name}"

    class Meta:
        model = Issuance
        fields = [
            'id',
            'issuance_id',
            'item',           # writable FK (ID)
            'item_id_code',   # e.g. "ITEM-001"
            'item_name',      # e.g. "Crutches"
            'patient',        # writable FK (ID)
            'patient_id_code',
            'patient_name',   # "Dela Cruz, Juan"
            'created_at',
        ]


class ReturnSerializer(serializers.ModelSerializer):
    item_name    = serializers.CharField(source='item.item_name', read_only=True)
    item_id_code = serializers.CharField(source='item.item_id',   read_only=True)
    patient_name = serializers.SerializerMethodField()
    patient_id_code = serializers.CharField(source='patient.patient_id', read_only=True)

    def get_patient_name(self, obj):
        return f"{obj.patient.last_name}, {obj.patient.first_name}"

    class Meta:
        model = Return
        fields = [
            'id',
            'return_id',
            'item',           # writable FK (ID)
            'item_id_code',
            'item_name',
            'patient',        # writable FK (ID)
            'patient_id_code',
            'patient_name',
            'created_at',
        ]