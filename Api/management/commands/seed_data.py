from django.core.management.base import BaseCommand
from Api.models import Role, Status, ItemStatus, ItemType, Staff, Patient, Item, Issuance, Return




class Command(BaseCommand):
   help = "Insert dummy data"




   def handle(self, *args, **kwargs):


       # ---------- ROLES ----------


       roles = ["Admin", "Doctor", "Nurse"]


       role_objs = {}


       for r in roles:
           obj, created = Role.objects.get_or_create(
               role_name=r
           )
           role_objs[r] = obj


       self.stdout.write(self.style.SUCCESS("Roles inserted"))




       # ---------- STATUS ----------


       statuses = ["Resume", "Excuse"]


       status_objs = {}


       for s in statuses:
           obj, created = Status.objects.get_or_create(
               status_name=s
           )
           status_objs[s] = obj


       self.stdout.write(self.style.SUCCESS("Status inserted"))


       # ---------- ITEM STATUS ----------


       item_statuses = ["Out of Stock", "In Stocks"]


       item_status_objs = {}


       for s in item_statuses:
           obj, created = ItemStatus.objects.get_or_create(
               status_name=s
           )
           item_status_objs[s] = obj


       self.stdout.write(self.style.SUCCESS("Status inserted"))




       # ---------- ITEM TYPE ----------


       types = ["Liquid", "Pill", "Tool"]


       types_objs = {}


       for t in types:
           obj, created = ItemType.objects.get_or_create(
               item_type_name=t
           )
           types_objs[t] = obj


       self.stdout.write(self.style.SUCCESS("Item Type inserted"))




       # ---------- STAFFS ----------


       staffs = [


           {
               "staff_id": "12411484",
               "last_name": "Wang",
               "first_name": "Joy Ann",
               "middle_initial": "H",
               "department": "SMIT",
               "gender": "Female",
               "email": "joyannakayiqianhong.wang@benilde.edu.ph",
               "phone": "09179619557",
               "role": "Admin",
           },


       ]




       for s in staffs:


           Staff.objects.get_or_create(
               staff_id=s["staff_id"],
               defaults={
                   **s,
                   "role": role_objs["Nurse"]
               }
           )


       self.stdout.write(self.style.SUCCESS("Staff inserted"))




       # ---------- PATIENT ----------


       patients = [


           {
               "patient_id": "EMP-0001",
               "last_name": "Santos",
               "first_name": "Maria",
               "middle_initial": "L",
               "gender": "Female",
               "email": "maria@example.com",
               "course": "BSIS",
               "phone": "09980000001"
           },


       ]


       patients_objs = {}




       for p in patients:


           obj, created = Patient.objects.get_or_create(
               patient_id=p["patient_id"],
               defaults={
                   "last_name": p["last_name"],
                   "first_name": p["first_name"],
                   "middle_initial": p["middle_initial"],
                   "gender": p["gender"],
                   "email": p["email"],
                   "course": p["course"],
                   "phone": p["phone"],
                   "status": status_objs["Resume"],
               }
           )
           patients_objs[p["patient_id"]] = obj


       self.stdout.write(self.style.SUCCESS("Patient inserted"))


       # ---------- ITEM ----------


       items = [


           {
               "item_id": "IM-001",
               "item_name": "Band-aid",
               "item_type": "Tool"
           },


       ]


       items_objs = {}


       for i in items:
           obj, created = Item.objects.get_or_create(
               item_id=i["item_id"],
               defaults={
                   "item_type": types_objs["Liquid"],
                   "status": item_status_objs["Out of Stock"],
               }
           )
           items_objs[i["item_id"]] = obj


       self.stdout.write(self.style.SUCCESS("Item inserted"))


       # ---------- ISSUANCE ----------


       issuances = [


           {
               "issuance_id": "IS-001",
               "item": "IM-001",
               "patient": "Santos Maria"
           },


       ]


       for i in issuances:
           Issuance.objects.get_or_create(
               issuance_id=i["issuance_id"],
               defaults={
                   "item": items_objs["IM-001"],
                   "patient": patients_objs["EMP-0001"]
               }
           )


       self.stdout.write(self.style.SUCCESS("Issuance inserted"))


       # ---------- Return ----------


       returns = [


           {
               "return_id": "RT-001",
               "item": "IM-001",
               "patient": "Santos Maria"
           },


       ]


       for r in returns:
           Return.objects.get_or_create(
               return_id=r["return_id"],
               defaults={
                   "item": items_objs["IM-001"],
                   "patient": patients_objs["EMP-0001"]
               }
           )


       self.stdout.write(self.style.SUCCESS("Return inserted"))


       self.stdout.write(self.style.SUCCESS("DONE"))

