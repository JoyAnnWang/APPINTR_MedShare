from django.db import models




class Role(models.Model):
   role_name = models.CharField(max_length=100, unique=True)
   description = models.TextField(blank=True, null=True)


   def __str__(self):
       return self.role_name




class Status(models.Model):
   status_name = models.CharField(max_length=100, unique=True)


   def __str__(self):
       return self.status_name


class ItemStatus(models.Model):
   status_name = models.CharField(max_length=100, unique=True)


   def __str__(self):
       return self.status_name


class ItemType(models.Model):
   item_type_name = models.CharField(max_length=100, unique=True)
   def __str__(self):
       return self.item_type_name


class Staff(models.Model):
   GENDER_CHOICES = [
       ('Male', 'Male'),
       ('Female', 'Female'),
       ('Other', 'Other'),
   ]


   staff_id = models.CharField(max_length=50, unique=True)
   last_name = models.CharField(max_length=100)
   first_name = models.CharField(max_length=100)
   middle_initial = models.CharField(max_length=10, blank=True, null=True)
   department = models.CharField(max_length=150)
   gender = models.CharField(max_length=20, choices=GENDER_CHOICES)
   email = models.EmailField(blank=True, null=True)
   phone = models.CharField(max_length=20, blank=True, null=True)
   photo = models.ImageField(upload_to='staffs/', blank=True, null=True)
   role = models.ForeignKey(Role, on_delete=models.PROTECT, related_name='staffs')
   created_at = models.DateTimeField(auto_now_add=True)


   def __str__(self):
       return f"{self.staff_id} - {self.last_name}, {self.first_name}"




class Patient(models.Model):
   GENDER_CHOICES = [
       ('Male', 'Male'),
       ('Female', 'Female'),
       ('Other', 'Other'),
   ]
   patient_id = models.CharField(max_length=50, unique=True)
   last_name = models.CharField(max_length=100)
   first_name = models.CharField(max_length=100)
   middle_initial = models.CharField(max_length=10, blank=True, null=True)
   gender = models.CharField(max_length=20, choices=GENDER_CHOICES)
   email = models.EmailField(blank=True, null=True)
   course= models.CharField(max_length=50, blank=True, null=True)
   phone = models.CharField(max_length=20, blank=True, null=True)
   photo = models.ImageField(upload_to='patients/', blank=True, null=True)
   status = models.ForeignKey(Status, on_delete=models.PROTECT, related_name='patients')
   created_at = models.DateTimeField(auto_now_add=True)


   def __str__(self):
       return f"{self.patient_id} - {self.last_name}, {self.first_name}"


class Item(models.Model):
   item_id = models.CharField(max_length=50, unique=True)
   item_name = models.CharField(max_length=100)
   item_type = models.ForeignKey(ItemType, on_delete=models.PROTECT, related_name='items')
   photo = models.ImageField(upload_to='items/', blank=True, null=True)
   status = models.ForeignKey(ItemStatus, on_delete=models.PROTECT, related_name='items')
   created_at = models.DateTimeField(auto_now_add=True)


   def __str__(self):
       return f"{self.item_id} - {self.item_name}"


class Issuance(models.Model):
   issuance_id = models.CharField(max_length=50, unique=True)
   item = models.ForeignKey(Item, on_delete=models.PROTECT, related_name='issuances')
   patient = models.ForeignKey(Patient, on_delete=models.PROTECT, related_name='issuances')
   created_at = models.DateTimeField(auto_now_add=True)


   def __str__(self):
       return self.issuance_id


class Return(models.Model):
   return_id = models.CharField(max_length=50, unique=True)
   item= models.ForeignKey(Item,on_delete=models.PROTECT, max_length=100)
   patient = models.ForeignKey(Patient, on_delete=models.PROTECT, related_name='returns')
   created_at = models.DateTimeField(auto_now_add=True)


   def __str__(self):
       return self.return_id