const API_BASE_URL = "http://127.0.0.1:8000/api";

let allStaff = [];
let allRoles = [];

document.addEventListener("DOMContentLoaded", () => {

    const staffTableBody   = document.getElementById("staffTableBody");
    const staffSummary     = document.getElementById("staffSummary");
    const staffSearch      = document.getElementById("staffSearch");
    const departmentFilter = document.getElementById("departmentFilter");
    const roleFilter       = document.getElementById("roleFilter");
    const genderFilter     = document.getElementById("genderFilter");
    const resetFilters     = document.getElementById("resetFilters");

    const openAddStaffModal  = document.getElementById("openAddStaffModal");
    const addStaffModal      = document.getElementById("addStaffModal");
    const closeAddStaffModal = document.getElementById("closeAddStaffModal");
    const cancelAddStaff     = document.getElementById("cancelAddStaff");
    const addStaffForm       = document.getElementById("addStaffForm");
    const addStaffMessage    = document.getElementById("addStaffMessage");
    const saveStaffButton    = document.getElementById("saveStaffButton");
    const modalRole          = document.getElementById("modalRole");

    const viewStaffModal        = document.getElementById("viewStaffModal");
    const closeViewStaffModal   = document.getElementById("closeViewStaffModal");
    const viewStaffDoneButton   = document.getElementById("viewStaffDoneButton");
    const viewStaffPhotoWrapper = document.getElementById("viewStaffPhotoWrapper");
    const viewFullName          = document.getElementById("viewFullName");
    const viewStaffId           = document.getElementById("viewStaffId");
    const viewGenderBadge       = document.getElementById("viewGenderBadge");
    const viewRoleBadge         = document.getElementById("viewRoleBadge");
    const viewFirstName         = document.getElementById("viewFirstName");
    const viewLastName          = document.getElementById("viewLastName");
    const viewMiddleInitial     = document.getElementById("viewMiddleInitial");
    const viewGenderText        = document.getElementById("viewGenderText");
    const viewDepartment        = document.getElementById("viewDepartment");
    const viewRoleText          = document.getElementById("viewRoleText");
    const viewEmail             = document.getElementById("viewEmail");
    const viewPhone             = document.getElementById("viewPhone");

    const editStaffModal      = document.getElementById("editStaffModal");
    const closeEditStaffModal = document.getElementById("closeEditStaffModal");
    const cancelEditStaff     = document.getElementById("cancelEditStaff");
    const editStaffForm       = document.getElementById("editStaffForm");
    const editStaffMessage    = document.getElementById("editStaffMessage");
    const updateStaffButton   = document.getElementById("updateStaffButton");
    const editStaffId         = document.getElementById("edit_staff_id");
    const editStaffIdField    = document.getElementById("edit_staff_id_field");
    const editLastName        = document.getElementById("edit_last_name");
    const editFirstName       = document.getElementById("edit_first_name");
    const editMiddleInitial   = document.getElementById("edit_middle_initial");
    const editGender          = document.getElementById("edit_gender");
    const editDepartment      = document.getElementById("edit_department");
    const editModalRole       = document.getElementById("edit_modalRole");
    const editEmail           = document.getElementById("edit_email");
    const editPhone           = document.getElementById("edit_phone");
    const editPhoto           = document.getElementById("edit_photo");

    const deleteStaffModal          = document.getElementById("deleteStaffModal");
    const closeDeleteStaffModal     = document.getElementById("closeDeleteStaffModal");
    const cancelDeleteStaff         = document.getElementById("cancelDeleteStaff");
    const confirmDeleteStaffButton  = document.getElementById("confirmDeleteStaffButton");
    const deleteStaffId             = document.getElementById("delete_staff_id");
    const deleteStaffName           = document.getElementById("deleteStaffName");
    const deleteStaffIdDisplay      = document.getElementById("deleteStaffIdDisplay");
    const deleteStaffMessage        = document.getElementById("deleteStaffMessage");

    // ─── Helpers ─────────────────────────────────────────────────────────────

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

    function showFormMessage(container, message, type = "success") {
        container.className = "rounded-lg px-4 py-3 text-sm";
        container.classList.remove("hidden");
        if (type === "error") {
            container.classList.add("bg-red-100", "text-red-700", "border", "border-red-200");
        } else {
            container.classList.add("bg-emerald-100", "text-emerald-700", "border", "border-emerald-200");
        }
        container.textContent = message;
    }

    function clearFormMessage(container) {
        container.classList.add("hidden");
        container.textContent = "";
    }

    // ─── Add Modal ────────────────────────────────────────────────────────────

    function openModal() {
        addStaffModal.classList.remove("hidden");
        addStaffModal.classList.add("flex");
        document.body.classList.add("overflow-hidden");
        clearFormMessage(addStaffMessage);
    }

    function closeModal() {
        addStaffModal.classList.add("hidden");
        addStaffModal.classList.remove("flex");
        document.body.classList.remove("overflow-hidden");
        addStaffForm.reset();
        clearFormMessage(addStaffMessage);
        resetRoleDropdown();
    }

    // ─── View Modal ───────────────────────────────────────────────────────────

    function openViewModal() {
        viewStaffModal.classList.remove("hidden");
        viewStaffModal.classList.add("flex");
        document.body.classList.add("overflow-hidden");
    }

    function closeViewModal() {
        viewStaffModal.classList.add("hidden");
        viewStaffModal.classList.remove("flex");
        document.body.classList.remove("overflow-hidden");
    }

    // ─── Edit Modal ───────────────────────────────────────────────────────────

    function openEditModal() {
        editStaffModal.classList.remove("hidden");
        editStaffModal.classList.add("flex");
        document.body.classList.add("overflow-hidden");
        clearFormMessage(editStaffMessage);
    }

    function closeEditModal() {
        editStaffModal.classList.add("hidden");
        editStaffModal.classList.remove("flex");
        document.body.classList.remove("overflow-hidden");
        editStaffForm.reset();
        clearFormMessage(editStaffMessage);
    }

    // ─── Delete Modal ─────────────────────────────────────────────────────────

    function openDeleteModal() {
        deleteStaffModal.classList.remove("hidden");
        deleteStaffModal.classList.add("flex");
        document.body.classList.add("overflow-hidden");
        clearFormMessage(deleteStaffMessage);
    }

    function closeDeleteModal() {
        deleteStaffModal.classList.add("hidden");
        deleteStaffModal.classList.remove("flex");
        document.body.classList.remove("overflow-hidden");
        deleteStaffId.value = "";
        deleteStaffName.textContent      = "-";
        deleteStaffIdDisplay.textContent = "-";
        clearFormMessage(deleteStaffMessage);
    }

    // ─── Filters ──────────────────────────────────────────────────────────────

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

    function populateModalRoles() {
        modalRole.innerHTML     = `<option value="">Select role</option>`;
        editModalRole.innerHTML = `<option value="">Select role</option>`;
        allRoles.forEach(role => {
            modalRole.innerHTML     += `<option value="${role.id}">${role.role_name}</option>`;
            editModalRole.innerHTML += `<option value="${role.id}">${role.role_name}</option>`;
        });
    }

    function resetRoleDropdown() {
        modalRole.value = "";
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

    // ─── Render ───────────────────────────────────────────────────────────────

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
                ? `<img src="${s.photo}" alt="${s.first_name} ${s.last_name}" class="size-10 rounded-full bg-slate-100 object-cover" />`
                : `<div class="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">${getInitials(s.first_name, s.last_name)}</div>`;

            return `
                <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
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
                    <td class="px-6 py-4">
                        <div class="text-sm">
                            <p class="font-semibold text-slate-700 dark:text-slate-200">${s.department ?? "-"}</p>
                            <p class="text-xs text-slate-500">${s.role_name ?? "-"}</p>
                        </div>
                    </td>
                    <td class="px-6 py-4">
                        <div class="text-sm">
                            <p class="text-slate-700 dark:text-slate-200 flex items-center gap-1">
                                <span class="material-symbols-outlined text-sm">phone</span>
                                ${s.phone ?? "-"}
                            </p>
                            <p class="text-xs text-slate-500">${s.email ?? "-"}</p>
                        </div>
                    </td>
                    <td class="px-6 py-4">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGenderBadge(s.gender)}">
                            ${s.gender}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-right">
                        <div class="flex justify-end gap-2">
                            <button class="view-staff-btn p-2 text-slate-400 hover:text-primary transition-colors" title="View" data-staff-id="${s.id}">
                                <span class="material-symbols-outlined">visibility</span>
                            </button>
                            <button class="edit-staff-btn p-2 text-slate-400 hover:text-blue-500 transition-colors" title="Edit" data-staff-id="${s.id}">
                                <span class="material-symbols-outlined">edit</span>
                            </button>
                            <button class="delete-staff-btn p-2 text-slate-400 hover:text-red-500 transition-colors" title="Delete" data-staff-id="${s.id}">
                                <span class="material-symbols-outlined">delete</span>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join("");

        staffSummary.innerHTML = `Showing <span class="font-semibold">${staff.length}</span> staff member${staff.length > 1 ? "s" : ""}`;
        bindViewButtons();
        bindEditButtons();
        bindDeleteButtons();
    }

    // ─── Fill View Modal ──────────────────────────────────────────────────────

    function fillViewModal(s) {
        const fullName = `${s.last_name}, ${s.first_name}${s.middle_initial ? ` ${s.middle_initial}.` : ""}`;

        viewFullName.textContent        = fullName;
        viewStaffId.textContent         = `Staff ID: ${s.staff_id ?? "-"}`;
        viewFirstName.textContent       = s.first_name      ?? "-";
        viewLastName.textContent        = s.last_name       ?? "-";
        viewMiddleInitial.textContent   = s.middle_initial  ?? "-";
        viewGenderText.textContent      = s.gender          ?? "-";
        viewDepartment.textContent      = s.department      ?? "-";
        viewRoleText.textContent        = s.role_name       ?? "-";
        viewEmail.textContent           = s.email           ?? "-";
        viewPhone.textContent           = s.phone           ?? "-";

        viewGenderBadge.className   = `inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getGenderBadge(s.gender)}`;
        viewGenderBadge.textContent = s.gender ?? "-";

        viewRoleBadge.className     = "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary";
        viewRoleBadge.textContent   = s.role_name ?? "-";

        if (s.photo) {
            viewStaffPhotoWrapper.innerHTML = `<img src="${s.photo}" alt="${s.first_name} ${s.last_name}" class="h-full w-full object-cover" />`;
        } else {
            viewStaffPhotoWrapper.innerHTML = getInitials(s.first_name, s.last_name);
        }
    }

    function bindViewButtons() {
        document.querySelectorAll(".view-staff-btn").forEach(button => {
            button.addEventListener("click", () => {
                const staffId       = Number(button.getAttribute("data-staff-id"));
                const selectedStaff = allStaff.find(s => s.id === staffId);
                if (!selectedStaff) return;
                fillViewModal(selectedStaff);
                openViewModal();
            });
        });
    }

    // ─── Fill Edit Modal ──────────────────────────────────────────────────────

    function fillEditModal(s) {
        editStaffId.value       = s.id;
        editStaffIdField.value  = s.staff_id       ?? "";
        editLastName.value      = s.last_name      ?? "";
        editFirstName.value     = s.first_name     ?? "";
        editMiddleInitial.value = s.middle_initial ?? "";
        editGender.value        = s.gender         ?? "";
        editDepartment.value    = s.department     ?? "";
        editEmail.value         = s.email          ?? "";
        editPhone.value         = s.phone          ?? "";
        editModalRole.value     = s.role != null ? String(s.role) : "";
    }

    function bindEditButtons() {
        document.querySelectorAll(".edit-staff-btn").forEach(button => {
            button.addEventListener("click", () => {
                const staffId       = Number(button.getAttribute("data-staff-id"));
                const selectedStaff = allStaff.find(s => s.id === staffId);
                if (!selectedStaff) return;
                fillEditModal(selectedStaff);
                openEditModal();
            });
        });
    }

    // ─── Fill Delete Modal ────────────────────────────────────────────────────

    function fillDeleteModal(s) {
        deleteStaffId.value              = s.id;
        deleteStaffName.textContent      = `${s.last_name}, ${s.first_name}${s.middle_initial ? ` ${s.middle_initial}.` : ""}`;
        deleteStaffIdDisplay.textContent = `Staff ID: ${s.staff_id ?? "-"}`;
    }

    function bindDeleteButtons() {
        document.querySelectorAll(".delete-staff-btn").forEach(button => {
            button.addEventListener("click", () => {
                const staffId       = Number(button.getAttribute("data-staff-id"));
                const selectedStaff = allStaff.find(s => s.id === staffId);
                if (!selectedStaff) return;
                fillDeleteModal(selectedStaff);
                openDeleteModal();
            });
        });
    }

    // ─── Data Fetching ────────────────────────────────────────────────────────

    async function loadStaff() {
        try {
            const response = await fetch(`${API_BASE_URL}/staffs/`);
            if (!response.ok) {
                throw new Error(`Failed to fetch staff: ${response.status}`);
            }
            allStaff = await response.json();
            populateFilters(allStaff);
            renderStaff(allStaff);
        } catch (error) {
            console.error("Staff error:", error);
            staffTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="px-6 py-10 text-center text-sm text-red-500">
                        Failed to load staff.
                    </td>
                </tr>
            `;
            staffSummary.innerHTML = `Showing <span class="font-semibold">0</span> staff`;
        }
    }

    async function loadRoleData() {
        try {
            const response = await fetch(`${API_BASE_URL}/roles/`);
            if (!response.ok) {
                throw new Error("Failed to load role dropdown data.");
            }
            allRoles = await response.json();
            populateModalRoles();
        } catch (error) {
            console.error("Role dropdown error:", error);
            modalRole.innerHTML     = `<option value="">Failed to load roles</option>`;
            editModalRole.innerHTML = `<option value="">Failed to load roles</option>`;
        }
    }

    // ─── Form Submissions ─────────────────────────────────────────────────────

    async function submitStaffForm(event) {
        event.preventDefault();
        clearFormMessage(addStaffMessage);
        saveStaffButton.disabled    = true;
        saveStaffButton.textContent = "Saving...";

        try {
            const formData = new FormData(addStaffForm);
            const response = await fetch(`${API_BASE_URL}/staffs/`, {
                method: "POST",
                body:   formData
            });

            if (!response.ok) {
                let errorMessage = "Failed to save staff.";
                try {
                    const errorData = await response.json();
                    errorMessage = JSON.stringify(errorData);
                } catch {
                    errorMessage = `Failed to save staff. Status: ${response.status}`;
                }
                throw new Error(errorMessage);
            }

            showFormMessage(addStaffMessage, "Staff added successfully.", "success");
            await loadStaff();
            setTimeout(() => { closeModal(); }, 800);

        } catch (error) {
            console.error("Add staff error:", error);
            showFormMessage(addStaffMessage, error.message, "error");
        } finally {
            saveStaffButton.disabled    = false;
            saveStaffButton.textContent = "Save Staff";
        }
    }

    async function submitEditStaffForm(event) {
        event.preventDefault();
        clearFormMessage(editStaffMessage);
        updateStaffButton.disabled    = true;
        updateStaffButton.textContent = "Updating...";

        try {
            const staffId  = editStaffId.value;
            const formData = new FormData(editStaffForm);

            if (!editPhoto.files.length) {
                formData.delete("photo");
            }

            const response = await fetch(`${API_BASE_URL}/staffs/${staffId}/`, {
                method: "PATCH",
                body:   formData
            });

            if (!response.ok) {
                let errorMessage = "Failed to update staff.";
                try {
                    const errorData = await response.json();
                    errorMessage = JSON.stringify(errorData);
                } catch {
                    errorMessage = `Failed to update staff. Status: ${response.status}`;
                }
                throw new Error(errorMessage);
            }

            showFormMessage(editStaffMessage, "Staff updated successfully.", "success");
            await loadStaff();
            setTimeout(() => { closeEditModal(); }, 800);

        } catch (error) {
            console.error("Edit staff error:", error);
            showFormMessage(editStaffMessage, error.message, "error");
        } finally {
            updateStaffButton.disabled    = false;
            updateStaffButton.textContent = "Update Staff";
        }
    }

    async function confirmDeleteStaff() {
        clearFormMessage(deleteStaffMessage);
        confirmDeleteStaffButton.disabled    = true;
        confirmDeleteStaffButton.textContent = "Deleting...";

        try {
            const staffId  = deleteStaffId.value;
            const response = await fetch(`${API_BASE_URL}/staffs/${staffId}/delete/`, {
                method: "DELETE"
            });

            if (!response.ok) {
                let errorMessage = "Failed to delete staff.";
                try {
                    const errorData = await response.json();
                    errorMessage = JSON.stringify(errorData);
                } catch {
                    errorMessage = `Failed to delete staff. Status: ${response.status}`;
                }
                throw new Error(errorMessage);
            }

            showFormMessage(deleteStaffMessage, "Staff deleted successfully.", "success");
            await loadStaff();
            setTimeout(() => { closeDeleteModal(); }, 800);

        } catch (error) {
            console.error("Delete staff error:", error);
            showFormMessage(deleteStaffMessage, error.message, "error");
        } finally {
            confirmDeleteStaffButton.disabled    = false;
            confirmDeleteStaffButton.textContent = "Delete Staff";
        }
    }

    // ─── Event Listeners ──────────────────────────────────────────────────────

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

    openAddStaffModal.addEventListener("click", openModal);
    closeAddStaffModal.addEventListener("click", closeModal);
    cancelAddStaff.addEventListener("click", closeModal);
    addStaffModal.addEventListener("click", (event) => {
        if (event.target === addStaffModal) closeModal();
    });

    closeViewStaffModal.addEventListener("click", closeViewModal);
    viewStaffDoneButton.addEventListener("click", closeViewModal);
    viewStaffModal.addEventListener("click", (event) => {
        if (event.target === viewStaffModal) closeViewModal();
    });

    closeEditStaffModal.addEventListener("click", closeEditModal);
    cancelEditStaff.addEventListener("click", closeEditModal);
    editStaffModal.addEventListener("click", (event) => {
        if (event.target === editStaffModal) closeEditModal();
    });

    closeDeleteStaffModal.addEventListener("click", closeDeleteModal);
    cancelDeleteStaff.addEventListener("click", closeDeleteModal);
    confirmDeleteStaffButton.addEventListener("click", confirmDeleteStaff);
    deleteStaffModal.addEventListener("click", (event) => {
        if (event.target === deleteStaffModal) closeDeleteModal();
    });

    addStaffForm.addEventListener("submit", submitStaffForm);
    editStaffForm.addEventListener("submit", submitEditStaffForm);

    // ─── Init ─────────────────────────────────────────────────────────────────

    loadStaff();
    loadRoleData();

});