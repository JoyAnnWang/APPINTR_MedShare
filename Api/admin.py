from django.contrib import admin
from .models import Role, Status, ItemStatus, ItemType, Staff, Patient, Item, Issuance, Return






@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
   list_display = ('id', 'role_name', 'description')
   search_fields = ('role_name',)




@admin.register(Status)
class StatusAdmin(admin.ModelAdmin):
   list_display = ('id', 'status_name')
   search_fields = ('status_name',)


@admin.register(ItemStatus)
class ItemStatusAdmin(admin.ModelAdmin):
   list_display = ('id', 'status_name')
   search_fields = ('status_name',)




@admin.register(ItemType)
class ItemTypeAdmin(admin.ModelAdmin):
   list_display = ('id', 'item_type_name')
   search_fields = ('item_type_name',)




@admin.register(Staff)
class StaffAdmin(admin.ModelAdmin):
   list_display = (
       'id',
       'staff_id',
       'last_name',
       'first_name',
       'middle_initial',
       'department',
       'gender',
       'email',
       'phone',
       'role',
       'created_at',
   )
   search_fields = (
       'staff_id',
       'last_name',
       'first_name',
       'email',
       'phone',
   )
   list_filter = ('department','gender', 'role')




@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
   list_display = (
       'id',
       'patient_id',
       'last_name',
       'first_name',
       'middle_initial',
       'course',
       'email',
       'phone',
       'status',
       'created_at',
   )
   search_fields = (
       'patient_id',
       'last_name',
       'first_name',
       'email',
       'phone',
   )
   list_filter = ('course','status')


@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
   list_display = (
       'id',
       'item_id',
       'item_name',
       'item_type',
       'status',
       'created_at',
   )
   search_fields = (
       'item_id',
       'item_name',
       'item_type',
   )
   list_filter = ('status','item_type')


@admin.register(Issuance)
class IssuanceAdmin(admin.ModelAdmin):
   list_display = (
       'id',
       'issuance_id',
       'item',
       'patient',
       'created_at',
   )
   search_fields = (
       'issuance_id',
       'item',
       'patient',
   )


@admin.register(Return)
class ReturnAdmin(admin.ModelAdmin):
   list_display = (
       'id',
       'return_id',
       'item',
       'patient',
       'created_at',
   )
   search_fields = (
       'return_id',
       'item',
       'patient',
   )

