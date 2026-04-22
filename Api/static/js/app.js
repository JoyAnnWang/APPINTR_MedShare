const API_BASE_URL = "http://127.0.0.1:8000/api";


async function loadStaffs() {
    const message = document.getElementById("staffs-message");
    const table   = document.getElementById("staffs-table");
    const body    = document.getElementById("staffs-body");

    try {
        const response = await fetch(`${API_BASE_URL}/staffs/`);
        const staffs   = await response.json();

        body.innerHTML = "";

        if (!staffs.length) {
            message.textContent = "No staff records found.";
            table.classList.add("hidden");
            return;
        }

        staffs.forEach(s => {
            body.innerHTML += `
                <tr>
                    <td>${s.id}</td>
                    <td>${s.staff_id}</td>
                    <td>${s.last_name}</td>
                    <td>${s.first_name}</td>
                    <td>${s.department}</td>
                    <td>${s.gender}</td>
                    <td>${s.role_name ?? ""}</td>
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
    const table   = document.getElementById("patients-table");
    const body    = document.getElementById("patients-body");

    try {
        const response = await fetch(`${API_BASE_URL}/patients/`);
        const patients = await response.json();

        body.innerHTML = "";

        if (!patients.length) {
            message.textContent = "No patient records found.";
            table.classList.add("hidden");
            return;
        }

        patients.forEach(p => {
            body.innerHTML += `
                <tr>
                    <td>${p.id}</td>
                    <td>${p.patient_id}</td>
                    <td>${p.last_name}</td>
                    <td>${p.first_name}</td>
                    <td>${p.gender}</td>
                    <td>${p.email ?? ""}</td>
                    <td>${p.course ?? ""}</td>
                    <td>${p.status_name ?? ""}</td>
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
    const table   = document.getElementById("items-table");
    const body    = document.getElementById("items-body");

    try {
        const response = await fetch(`${API_BASE_URL}/items/`);
        const items    = await response.json();

        body.innerHTML = "";

        if (!items.length) {
            message.textContent = "No item records found.";
            table.classList.add("hidden");
            return;
        }

        items.forEach(item => {
            body.innerHTML += `
                <tr>
                    <td>${item.id}</td>
                    <td>${item.item_id}</td>
                    <td>${item.item_name}</td>
                    <td>${item.item_type_name ?? ""}</td>
                    <td>${item.status_name ?? ""}</td>
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
    const table   = document.getElementById("issuances-table");
    const body    = document.getElementById("issuances-body");

    try {
        const response  = await fetch(`${API_BASE_URL}/issuance/`);
        const issuances = await response.json();

        body.innerHTML = "";

        if (!issuances.length) {
            message.textContent = "No issuance records found.";
            table.classList.add("hidden");
            return;
        }

        issuances.forEach(i => {
            body.innerHTML += `
                <tr>
                    <td>${i.id}</td>
                    <td>${i.issuance_id}</td>
                    <td>${i.item_id_code ?? ""} - ${i.item_name ?? ""}</td>
                    <td>${i.patient_id_code ?? ""} - ${i.patient_name ?? ""}</td>
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
    const table   = document.getElementById("returns-table");
    const body    = document.getElementById("returns-body");

    try {
        const response = await fetch(`${API_BASE_URL}/return/`);
        const returns  = await response.json();

        body.innerHTML = "";

        if (!returns.length) {
            message.textContent = "No return records found.";
            table.classList.add("hidden");
            return;
        }

        returns.forEach(r => {
            body.innerHTML += `
                <tr>
                    <td>${r.id}</td>
                    <td>${r.return_id}</td>
                    <td>${r.item_id_code ?? ""} - ${r.item_name ?? ""}</td>
                    <td>${r.patient_id_code ?? ""} - ${r.patient_name ?? ""}</td>
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