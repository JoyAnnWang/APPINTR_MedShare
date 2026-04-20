const API_BASE_URL = "http://127.0.0.1:8000/api";

let allStaff = [];


const staffTableBody   = document.getElementById("staffTableBody");
const staffSummary     = document.getElementById("staffSummary");
const staffSearch      = document.getElementById("staffSearch");
const departmentFilter = document.getElementById("departmentFilter");
const genderFilter     = document.getElementById("genderFilter");
const roleFilter       = document.getElementById("roleFilter");
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


function populateFilters(staff) {
    const departments = [...new Set(staff.map(s => s.department).filter(Boolean))].sort();
    const roles       = [...new Set(staff.map(s => s.role_name).filter(Boolean))].sort();

    departmentFilter.innerHTML = `<option value="">All Departments</option>`;
    roleFilter.innerHTML       = `<option value="">All Roles</option>`;

    departments.forEach(department => {
        departmentFilter.innerHTML += `<option value="${department}">${department}</option>`;
    });

    roles.forEach(role => {
        roleFilter.innerHTML += `<option value="${role}">${role}</option>`;
    });
}

function applyFilters() {
    const searchValue        = staffSearch.value.trim().toLowerCase();
    const selectedDepartment = departmentFilter.value;
    const selectedGender     = genderFilter.value;
    const selectedRole       = roleFilter.value;

    const filtered = allStaff.filter(s => {
        const fullName = `${s.last_name} ${s.first_name} ${s.middle_initial ?? ""}`.toLowerCase();
        const staffId  = (s.staff_id ?? "").toLowerCase();

        const matchesSearch     = fullName.includes(searchValue) || staffId.includes(searchValue);
        const matchesDepartment = !selectedDepartment || s.department === selectedDepartment;
        const matchesGender     = !selectedGender     || s.gender     === selectedGender;
        const matchesRole       = !selectedRole       || s.role_name  === selectedRole;

        return matchesSearch && matchesDepartment && matchesGender && matchesRole;
    });

    renderStaff(filtered);
}


function renderStaff(staff) {
    if (!staff.length) {
        staffTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="px-6 py-10 text-center text-sm text-slate-500">
                    No staff records found.
                </td>
            </tr>
        `;
        staffSummary.innerHTML = `Showing <span class="font-semibold">0</span> staff`;
        return;
    }

    staffTableBody.innerHTML = staff.map(s => {
        const photoHtml = s.photo
            ? `<img
                    src="${s.photo}"
                    alt="${s.first_name} ${s.last_name}"
                    class="size-10 rounded-full bg-slate-100 object-cover"
                />`
            : `<div class="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                    ${getInitials(s.first_name, s.last_name)}
                </div>`;

        return `
            <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">

                <!-- Name & ID -->
                <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                        ${photoHtml}
                        <div>
                            <p class="font-bold text-slate-900 dark:text-slate-100">
                                ${s.last_name}, ${s.first_name}${s.middle_initial ? ` ${s.middle_initial}.` : ""}
                            </p>
                            <p class="text-xs text-slate-500">ID: ${s.staff_id}</p>
                        </div>
                    </div>
                </td>

                <!-- Department & Role -->
                <td class="px-6 py-4">
                    <div class="text-sm">
                        <p class="font-semibold text-slate-700 dark:text-slate-200">${s.department ?? "-"}</p>
                        <p class="text-xs text-slate-500">${s.role_name  ?? "-"}</p>
                    </div>
                </td>

                <!-- Contact -->
                <td class="px-6 py-4">
                    <div class="text-sm">
                        <p class="text-slate-700 dark:text-slate-200 flex items-center gap-1">
                            <span class="material-symbols-outlined text-sm">phone</span>
                            ${s.phone ?? "-"}
                        </p>
                        <p class="text-xs text-slate-500">${s.email ?? "-"}</p>
                    </div>
                </td>

                <!-- Gender -->
                <td class="px-6 py-4">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGenderBadge(s.gender)}">
                        ${s.gender}
                    </span>
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

    staffSummary.innerHTML = `Showing <span class="font-semibold">${staff.length}</span> staff member${staff.length > 1 ? "s" : ""}`;
}


async function loadStaff() {
    try {
        const response = await fetch(`${API_BASE_URL}/staffs/`);

        if (!response.ok) {
            throw new Error("Failed to fetch staff");
        }

        allStaff = await response.json();
        populateFilters(allStaff);
        renderStaff(allStaff);

    } catch (error) {
        staffTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="px-6 py-10 text-center text-sm text-red-500">
                    Failed to load staff.
                </td>
            </tr>
        `;
        staffSummary.innerHTML = `Showing <span class="font-semibold">0</span> staff`;
        console.error("Staff error:", error);
    }
}


staffSearch.addEventListener("input", applyFilters);
departmentFilter.addEventListener("change", applyFilters);
genderFilter.addEventListener("change", applyFilters);
roleFilter.addEventListener("change", applyFilters);

resetFilters.addEventListener("click", () => {
    staffSearch.value      = "";
    departmentFilter.value = "";
    genderFilter.value     = "";
    roleFilter.value       = "";
    renderStaff(allStaff);
});


loadStaff();