const API_BASE_URL = "http://127.0.0.1:8000/api";

let allReturns = [];

const returnTableBody = document.getElementById("returnTableBody");
const returnSummary   = document.getElementById("returnSummary");
const returnSearch    = document.getElementById("returnSearch");
const itemFilter      = document.getElementById("itemFilter");
const patientFilter   = document.getElementById("patientFilter");
const resetFilters    = document.getElementById("resetFilters");


function populateFilters(returns) {
    const items    = [...new Set(returns.map(r => r.item_name).filter(Boolean))].sort();
    const patients = [...new Set(returns.map(r => r.patient_name).filter(Boolean))].sort();

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
    const searchValue     = returnSearch.value.trim().toLowerCase();
    const selectedItem    = itemFilter.value;
    const selectedPatient = patientFilter.value;

    const filtered = allReturns.filter(r => {
        const returnId    = (r.return_id    ?? "").toLowerCase();
        const itemName    = (r.item_name    ?? "").toLowerCase();
        const patientName = (r.patient_name ?? "").toLowerCase();

        const matchesSearch  = returnId.includes(searchValue) || itemName.includes(searchValue) || patientName.includes(searchValue);
        const matchesItem    = !selectedItem    || r.item_name    === selectedItem;
        const matchesPatient = !selectedPatient || r.patient_name === selectedPatient;

        return matchesSearch && matchesItem && matchesPatient;
    });

    renderReturns(filtered);
}


function renderReturns(returns) {
    if (!returns.length) {
        returnTableBody.innerHTML = `
            <tr>
                <td colspan="4" class="px-6 py-10 text-center text-sm text-slate-500">
                    No return records found.
                </td>
            </tr>
        `;
        returnSummary.innerHTML = `Showing <span class="font-semibold">0</span> returns`;
        return;
    }

    returnTableBody.innerHTML = returns.map(r => {
        const date = r.created_at
            ? new Date(r.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
            : "-";

        return `
            <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">

         
                <td class="px-6 py-4">
                    <div>
                        <p class="font-bold text-slate-900 dark:text-slate-100">${r.return_id}</p>
                        <p class="text-xs text-slate-500">${date}</p>
                    </div>
                </td>


                <td class="px-6 py-4">
                    <div class="text-sm">
                        <p class="font-semibold text-slate-700 dark:text-slate-200">${r.item_name     ?? "-"}</p>
                        <p class="text-xs text-slate-500">${r.item_type_name ?? "-"}</p>
                    </div>
                </td>


                <td class="px-6 py-4">
                    <div class="text-sm">
                        <p class="font-semibold text-slate-700 dark:text-slate-200">${r.patient_name ?? "-"}</p>
                        <p class="text-xs text-slate-500">ID: ${r.patient_id  ?? "-"}</p>
                    </div>
                </td>


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

    returnSummary.innerHTML = `Showing <span class="font-semibold">${returns.length}</span> return${returns.length > 1 ? "s" : ""}`;
}



async function loadReturns() {
    try {
        const response = await fetch(`${API_BASE_URL}/returns/`);

        if (!response.ok) {
            throw new Error("Failed to fetch returns");
        }

        allReturns = await response.json();
        populateFilters(allReturns);
        renderReturns(allReturns);

    } catch (error) {
        returnTableBody.innerHTML = `
            <tr>
                <td colspan="4" class="px-6 py-10 text-center text-sm text-red-500">
                    Failed to load returns.
                </td>
            </tr>
        `;
        returnSummary.innerHTML = `Showing <span class="font-semibold">0</span> returns`;
        console.error("Returns error:", error);
    }
}


returnSearch.addEventListener("input", applyFilters);
itemFilter.addEventListener("change", applyFilters);
patientFilter.addEventListener("change", applyFilters);

resetFilters.addEventListener("click", () => {
    returnSearch.value  = "";
    itemFilter.value    = "";
    patientFilter.value = "";
    renderReturns(allReturns);
});


loadReturns();