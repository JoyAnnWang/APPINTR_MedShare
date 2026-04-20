const API_BASE_URL = "http://127.0.0.1:8000/api";


async function loadStaffs() {
   const message = document.getElementById("staffs-message");
   const table = document.getElementById("staffs-table");
   const body = document.getElementById("staffs-body");


   try {
       const response = await fetch(`${API_BASE_URL}/staffs/`);
       const staffs = await response.json();


       body.innerHTML = "";


       if (!staffs.length) {
           message.textContent = "No staff records found.";
           table.classList.add("hidden");
           return;
       }


       staffs.forEach(staffs => {
           body.innerHTML += `
               <tr>
                   <td>${staffs.id}</td>
                   <td>${staffs.staff_id}</td>
                   <td>${staffs.last_name}</td>
                   <td>${staffs.first_name}</td>
                   <td>${staffs.department}</td>
                   <td>${staffs.gender}</td>
                   <td>${staffs.role_name}</td>
               </tr>
           `;
       });


       message.textContent = "";
       table.classList.remove("hidden");


   } catch (error) {
       message.textContent = "Failed to load staffs.";
       table.classList.add("hidden");
       console.error("Staffs error:", error);
   }
}


async function loadPatients() {
   const message = document.getElementById("patients-message");
   const table = document.getElementById("patients-table");
   const body = document.getElementById("patients-body");


   try {
       const response = await fetch(`${API_BASE_URL}/patients/`);
       const patients = await response.json();


       body.innerHTML = "";


       if (!patients.length) {
           message.textContent = "No patient records found.";
           table.classList.add("hidden");
           return;
       }


       patients.forEach(patients => {
           body.innerHTML += `
               <tr>
                   <td>${patients.id}</td>
                   <td>${patients.patient_id}</td>
                   <td>${patients.last_name}</td>
                   <td>${patients.first_name}</td>
                   <td>${patients.gender}</td>
                   <td>${patients.email ?? ""}</td>
                   <td>${patients.course}</td>
                   <td>${patients.status_name}</td>
               </tr>
           `;
       });


       message.textContent = "";
       table.classList.remove("hidden");


   } catch (error) {
       message.textContent = "Failed to load patients.";
       table.classList.add("hidden");
       console.error("Patients error:", error);
   }
}


async function loadItems() {
   const message = document.getElementById("items-message");
   const table = document.getElementById("items-table");
   const body = document.getElementById("items-body");


   try {
       const response = await fetch(`${API_BASE_URL}/items/`);
       const items = await response.json();


       body.innerHTML = "";


       if (!items.length) {
           message.textContent = "No item records found.";
           table.classList.add("hidden");
           return;
       }


       items.forEach(items => {
           body.innerHTML += `
               <tr>
                   <td>${items.id}</td>
                   <td>${items.item_id}</td>
                   <td>${items.item_name}</td>
                   <td>${items.item_type}</td>
                   <td>${items.status}</td>
               </tr>
           `;
       });


       message.textContent = "";
       table.classList.remove("hidden");


   } catch (error) {
       message.textContent = "Failed to load items.";
       table.classList.add("hidden");
       console.error("Items error:", error);
   }
}


async function loadIssuances() {
   const message = document.getElementById("issuances-message");
   const table = document.getElementById("issuances-table");
   const body = document.getElementById("issuances-body");


   try {
       const response = await fetch(`${API_BASE_URL}/issuance/`);
       const issuances = await response.json();


       body.innerHTML = "";


       if (!issuances.length) {
           message.textContent = "No issuance records found.";
           table.classList.add("hidden");
           return;
       }


       issuances.forEach(issuances => {
           body.innerHTML += `
               <tr>
                   <td>${issuances.id}</td>
                   <td>${issuances.issuance_id}</td>
                   <td>${issuances.item}</td>
                   <td>${issuances.patient}</td>
               </tr>
           `;
       });


       message.textContent = "";
       table.classList.remove("hidden");


   } catch (error) {
       message.textContent = "Failed to load issuances.";
       table.classList.add("hidden");
       console.error("Issuances error:", error);
   }
}


async function loadReturns() {
   const message = document.getElementById("returns-message");
   const table = document.getElementById("returns-table");
   const body = document.getElementById("returns-body");


   try {
       const response = await fetch(`${API_BASE_URL}/return/`);
       const returns = await response.json();


       body.innerHTML = "";


       if (!returns.length) {
           message.textContent = "No return records found.";
           table.classList.add("hidden");
           return;
       }


       returns.forEach(returns => {
           body.innerHTML += `
               <tr>
                   <td>${returns.id}</td>
                   <td>${returns.return_id}</td>
                   <td>${returns.item}</td>
                   <td>${returns.patient}</td>
               </tr>
           `;
       });


       message.textContent = "";
       table.classList.remove("hidden");


   } catch (error) {
       message.textContent = "Failed to load returns.";
       table.classList.add("hidden");
       console.error("Returns error:", error);
   }
}


loadStaffs();
loadPatients();
loadItems();
loadIssuances();
loadReturns();

