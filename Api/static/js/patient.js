const API_BASE_URL = "http://127.0.0.1:8000/api";

let allPatients = [];

const patientTableBody = document.getElementById("patientTableBody");
const patientSummary   = document.getElementById("patientSummary");
const patientSearch    = document.getElementById("patientSearch");
const courseFilter     = document.getElementById("courseFilter");
const genderFilter     = document.getElementById("genderFilter");
const statusFilter     = document.getElementById("statusFilter");
const resetFilters     = document.getElementById("resetFilters");


function getInitials(firstName = "", lastName = "") {
    const first = firstName.charAt(0).toUpperCase();
    const last  = lastName.charAt(0).toUpperCase();
    return `${last}${first}`;
}

function getGenderBadge(gender) {
    if (gender === "Male") {
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    }
    if (gender === "Female") {
        return "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300";
    }
    return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300";
}


function populateFilters(patients) {
    const courses  = [...new Set(patients.map(p => p.course).filter(Boolean))].sort();
    const statuses = [...new Set(patients.map(p => p.status_name).filter(Boolean))].sort();

    courseFilter.innerHTML = `<option value="">All Courses</option>`;
    statusFilter.innerHTML = `<option value="">All Statuses</option>`;

    courses.forEach(course => {
        courseFilter.innerHTML += `<option value="${course}">${course}</option>`;
    });

    statuses.forEach(status => {
        statusFilter.innerHTML += `<option value="${status}">${status}</option>`;
    });
}

function applyFilters() {
    const searchValue    = patientSearch.value.trim().toLowerCase();
    const selectedCourse = courseFilter.value;
    const selectedGender = genderFilter.value;
    const selectedStatus = statusFilter.value;

    const filtered = allPatients.filter(p => {
        const fullName  = `${p.last_name} ${p.first_name} ${p.middle_initial ?? ""}`.toLowerCase();
        const patientId = (p.patient_id ?? "").toLowerCase();

        const matchesSearch = fullName.includes(searchValue) || patientId.includes(searchValue);
        const matchesCourse = !selectedCourse || p.course      === selectedCourse;
        const matchesGender = !selectedGender || p.gender      === selectedGender;
        const matchesStatus = !selectedStatus || p.status_name === selectedStatus;

        return matchesSearch && matchesCourse && matchesGender && matchesStatus;
    });

    renderPatients(filtered);
}


function renderPatients(patients) {
    if (!patients.length) {
        patientTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="px-6 py-10 text-center text-sm text-slate-500">
                    No patient records found.
                </td>
            </tr>
        `;
        patientSummary.innerHTML = `Showing <span class="font-semibold">0</span> patients`;
        return;
    }

    patientTableBody.innerHTML = patients.map(p => {
        const photoHtml = p.photo
            ? `<img
                    src="${p.photo}"
                    alt="${p.first_name} ${p.last_name}"
                    class="size-10 rounded-full bg-slate-100 object-cover"
                />`
            : `<div class="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                    ${getInitials(p.first_name, p.last_name)}
                </div>`;

        return `
            <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">

                <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                        ${photoHtml}
                        <div>
                            <p class="font-bold text-slate-900 dark:text-slate-100">
                                ${p.last_name}, ${p.first_name}${p.middle_initial ? ` ${p.middle_initial}.` : ""}
                            </p>
                            <p class="text-xs text-slate-500">ID: ${p.patient_id}</p>
                        </div>
                    </div>
                </td>

                <td class="px-6 py-4">
                    <div class="text-sm">
                        <p class="font-semibold text-slate-700 dark:text-slate-200">${p.course      ?? "-"}</p>
                        <p class="text-xs text-slate-500">${p.status_name ?? "-"}</p>
                    </div>
                </td>

                <td class="px-6 py-4">
                    <div class="text-sm">
                        <p class="text-slate-700 dark:text-slate-200 flex items-center gap-1">
                            <span class="material-symbols-outlined text-sm">phone</span>
                            ${p.phone ?? "-"}
                        </p>
                        <p class="text-xs text-slate-500">${p.email ?? "-"}</p>
                    </div>
                </td>

                <td class="px-6 py-4">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGenderBadge(p.gender)}">
                        ${p.gender}
                    </span>
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

    patientSummary.innerHTML = `Showing <span class="font-semibold">${patients.length}</span> patient${patients.length > 1 ? "s" : ""}`;
}


async function loadPatients() {
    try {
        const response = await fetch(`${API_BASE_URL}/patients/`);

        if (!response.ok) {
            throw new Error("Failed to fetch patients");
        }

        allPatients = await response.json();
        populateFilters(allPatients);
        renderPatients(allPatients);

    } catch (error) {
        patientTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="px-6 py-10 text-center text-sm text-red-500">
                    Failed to load patients.
                </td>
            </tr>
        `;
        patientSummary.innerHTML = `Showing <span class="font-semibold">0</span> patients`;
        console.error("Patients error:", error);
    }
}


patientSearch.addEventListener("input", applyFilters);
courseFilter.addEventListener("change", applyFilters);
genderFilter.addEventListener("change", applyFilters);
statusFilter.addEventListener("change", applyFilters);

resetFilters.addEventListener("click", () => {
    patientSearch.value  = "";
    courseFilter.value   = "";
    genderFilter.value   = "";
    statusFilter.value   = "";
    renderPatients(allPatients);
});


loadPatients();