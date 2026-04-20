const API_BASE_URL = "http://127.0.0.1:8000/api";

let allIssuances = [];

const issuanceTableBody = document.getElementById("issuanceTableBody");
const issuanceSummary   = document.getElementById("issuanceSummary");
const issuanceSearch    = document.getElementById("issuanceSearch");
const itemFilter        = document.getElementById("itemFilter");
const patientFilter     = document.getElementById("patientFilter");
const resetFilters      = document.getElementById("resetFilters");


function populateFilters(issuances) {
    const items    = [...new Set(issuances.map(r => r.item_name).filter(Boolean))].sort();
    const patients = [...new Set(issuances.map(r => r.patient_name).filter(Boolean))].sort();

    itemFilter.innerHTML    = `<option value="">All Items</option>`;
    patientFilter.innerHTML = `<option value="">All Patients</option>`;

    items.forEach(item => {
        itemFilter.innerHTML += `<option value="${item}">${item}</option>`;
    });

    patients.forEach(patient => {
        patientFilter.innerHTML += `<option value="${patient}">${patient}</option>`;
    });
}

function applyFilters() {
    const searchValue    = issuanceSearch.value.trim().toLowerCase();
    const selectedItem   = itemFilter.value;
    const selectedPatient = patientFilter.value;

    const filtered = allIssuances.filter(r => {
        const issuanceId  = (r.issuance_id   ?? "").toLowerCase();
        const itemName    = (r.item_name      ?? "").toLowerCase();
        const patientName = (r.patient_name   ?? "").toLowerCase();

        const matchesSearch  = issuanceId.includes(searchValue) || itemName.includes(searchValue) || patientName.includes(searchValue);
        const matchesItem    = !selectedItem    || r.item_name    === selectedItem;
        const matchesPatient = !selectedPatient || r.patient_name === selectedPatient;

        return matchesSearch && matchesItem && matchesPatient;
    });

    renderIssuances(filtered);
}


function renderIssuances(issuances) {
    if (!issuances.length) {
        issuanceTableBody.innerHTML = `
            <tr>
                <td colspan="4" class="px-6 py-10 text-center text-sm text-slate-500">
                    No issuance records found.
                </td>
            </tr>
        `;
        issuanceSummary.innerHTML = `Showing <span class="font-semibold">0</span> issuances`;
        return;
    }

    issuanceTableBody.innerHTML = issuances.map(r => {
        const date = r.created_at
            ? new Date(r.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
            : "-";

        return `
            <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">

                <!-- Issuance ID & Date -->
                <td class="px-6 py-4">
                    <div>
                        <p class="font-bold text-slate-900 dark:text-slate-100">${r.issuance_id}</p>
                        <p class="text-xs text-slate-500">${date}</p>
                    </div>
                </td>

                <!-- Item -->
                <td class="px-6 py-4">
                    <div class="text-sm">
                        <p class="font-semibold text-slate-700 dark:text-slate-200">${r.item_name    ?? "-"}</p>
                        <p class="text-xs text-slate-500">${r.item_type_name ?? "-"}</p>
                    </div>
                </td>

                <!-- Patient -->
                <td class="px-6 py-4">
                    <div class="text-sm">
                        <p class="font-semibold text-slate-700 dark:text-slate-200">${r.patient_name ?? "-"}</p>
                        <p class="text-xs text-slate-500">ID: ${r.patient_id   ?? "-"}</p>
                    </div>
                </td>

                <!-- Actions -->
                <td class="px-6 py-4 text-right">
                    <div class="flex justify-end gap-2">
                        <button class="p-2 text-slate-400 hover:text-primary transition-colors" title="View">
                            <span class="material-symbols-outlined">visibility</span>
                        </button>
                        <button class="p-2 text-slate-400 hover:text-blue-500 transition-colors" title="Edit">
                            <span class="material-symbols-outlined">edit</span>
                        </button>
                        <button class="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Delete">
                            <span class="material-symbols-outlined">delete</span>
                        </button>
                    </div>
                </td>

            </tr>
        `;
    }).join("");

    issuanceSummary.innerHTML = `Showing <span class="font-semibold">${issuances.length}</span> issuance${issuances.length > 1 ? "s" : ""}`;
}


async function loadIssuances() {
    try {
        const response = await fetch(`${API_BASE_URL}/issuances/`);

        if (!response.ok) {
            throw new Error("Failed to fetch issuances");
        }

        allIssuances = await response.json();
        populateFilters(allIssuances);
        renderIssuances(allIssuances);

    } catch (error) {
        issuanceTableBody.innerHTML = `
            <tr>
                <td colspan="4" class="px-6 py-10 text-center text-sm text-red-500">
                    Failed to load issuances.
                </td>
            </tr>
        `;
        issuanceSummary.innerHTML = `Showing <span class="font-semibold">0</span> issuances`;
        console.error("Issuances error:", error);
    }
}


issuanceSearch.addEventListener("input", applyFilters);
itemFilter.addEventListener("change", applyFilters);
patientFilter.addEventListener("change", applyFilters);

resetFilters.addEventListener("click", () => {
    issuanceSearch.value  = "";
    itemFilter.value      = "";
    patientFilter.value   = "";
    renderIssuances(allIssuances);
});


loadIssuances();