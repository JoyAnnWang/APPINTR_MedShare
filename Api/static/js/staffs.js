const API_BASE_URL = "http://127.0.0.1:8000/api";

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith(name + "=")) {
                cookieValue = decodeURIComponent(cookie.slice(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

let allStaff = [];
let allRoles = [];

document.addEventListener("DOMContentLoaded", () => {

    // ─── DOM Elements ─────────────────────────────────────────────────────────

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

    const deleteStaffModal         = document.getElementById("deleteStaffModal");
    const closeDeleteStaffModal    = document.getElementById("closeDeleteStaffModal");
    const cancelDeleteStaff        = document.getElementById("cancelDeleteStaff");
    const confirmDeleteStaffButton = document.getElementById("confirmDeleteStaffButton");
    const deleteStaffId            = document.getElementById("delete_staff_id");
    const deleteStaffName          = document.getElementById("deleteStaffName");
    const deleteStaffIdDisplay     = document.getElementById("deleteStaffIdDisplay");
    const deleteStaffMessage       = document.getElementById("deleteStaffMessage");

    // ─── Helpers ──────────────────────────────────────────────────────────────

    function getInitials(firstName = "", lastName = "") {
        const first = firstName.charAt(0).toUpperCase();
        const last  = lastName.charAt(0).toUpperCase();
        return `${last}${first}`;
    }

    function getGenderBadge(gender) {
        if (gender === "Male")   return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
        if (gender === "Female") return "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300";
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

    function showTableError(message) {
        staffTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="px-6 py-10 text-center text-sm text-red-500">
                    ${message}
                </td>
            </tr>
        `;
        staffSummary.innerHTML = `Showing <span class="font-semibold">0</span> staff`;
    }

    // ─── Theme Toggle ─────────────────────────────────────────────────────────

    const html        = document.documentElement;
    const themeToggle = document.getElementById("themeToggle");
    const themeIcon   = document.getElementById("themeIcon");

    function updateThemeIcon() {
        if (themeIcon) {
            themeIcon.textContent = html.classList.contains("dark") ? "light_mode" : "dark_mode";
        }
    }

    updateThemeIcon();

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            html.classList.toggle("dark");
            html.classList.toggle("light");
            localStorage.setItem("theme", html.classList.contains("dark") ? "dark" : "light");
            updateThemeIcon();
        });
    }

    // ─── Modal Helpers ────────────────────────────────────────────────────────

    function openModal(modal) {
        modal.classList.remove("hidden");
        modal.classList.add("flex");
        document.body.classList.add("overflow-hidden");
    }

    function closeModal(modal, form = null, msgEl = null) {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
        document.body.classList.remove("overflow-hidden");
        if (form)  form.reset();
        if (msgEl) clearFormMessage(msgEl);
    }

    // ─── Add Modal ────────────────────────────────────────────────────────────

    function openAddModal() {
        clearFormMessage(addStaffMessage);
        openModal(addStaffModal);
    }

    function closeAddModal() {
        closeModal(addStaffModal, addStaffForm, addStaffMessage);
        modalRole.value = "";
    }

    // ─── View Modal ───────────────────────────────────────────────────────────

    function openViewModal()  { openModal(viewStaffModal); }
    function closeViewModal() { closeModal(viewStaffModal); }

    // ─── Edit Modal ───────────────────────────────────────────────────────────

    function openEditModal()  {
        clearFormMessage(editStaffMessage);
        openModal(editStaffModal);
    }

    function closeEditModal() {
        closeModal(editStaffModal, editStaffForm, editStaffMessage);
    }

    // ─── Delete Modal ─────────────────────────────────────────────────────────

    function openDeleteModal()  {
        clearFormMessage(deleteStaffMessage);
        openModal(deleteStaffModal);
    }

    function closeDeleteModal() {
        closeModal(deleteStaffModal, null, deleteStaffMessage);
        deleteStaffId.value              = "";
        deleteStaffName.textContent      = "-";
        deleteStaffIdDisplay.textContent = "-";
    }

    // ─── Filters ──────────────────────────────────────────────────────────────

    function populateFilters(staff) {
        const departments = [...new Set(staff.map(s => s.department).filter(Boolean))].sort();
        const roles       = [...new Set(staff.map(s => s.role_name).filter(Boolean))].sort();

        departmentFilter.innerHTML = `<option value="">All Departments</option>`;
        roleFilter.innerHTML       = `<option value="">All Roles</option>`;

        departments.forEach(d => {
            departmentFilter.innerHTML += `<option value="${d}">${d}</option>`;
        });
        roles.forEach(r => {
            roleFilter.innerHTML += `<option value="${r}">${r}</option>`;
        });
    }

    function populateModalRoles() {
        const options = allRoles.map(r => `<option value="${r.id}">${r.role_name}</option>`).join("");
        modalRole.innerHTML     = `<option value="">Select role</option>${options}`;
        editModalRole.innerHTML = `<option value="">Select role</option>${options}`;
    }

    function applyFilters() {
        const searchValue        = staffSearch.value.trim().toLowerCase();
        const selectedDepartment = departmentFilter.value;
        const selectedGender     = genderFilter.value;
        const selectedRole       = roleFilter.value;

        const filtered = allStaff.filter(s => {
            const fullName = `${s.last_name} ${s.first_name} ${s.middle_initial ?? ""}`.toLowerCase();
            const staffId  = (s.staff_id ?? "").toLowerCase();

            return (
                (fullName.includes(searchValue) || staffId.includes(searchValue)) &&
                (!selectedDepartment || s.department === selectedDepartment)       &&
                (!selectedGender     || s.gender     === selectedGender)           &&
                (!selectedRole       || s.role_name  === selectedRole)
            );
        });

        renderStaff(filtered);
    }

    // ─── Render ───────────────────────────────────────────────────────────────

    function renderStaff(staff) {
        if (!Array.isArray(staff) || !staff.length) {
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
                            ${s.gender ?? "-"}
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

        viewFullName.textContent      = fullName;
        viewStaffId.textContent       = `Staff ID: ${s.staff_id ?? "-"}`;
        viewFirstName.textContent     = s.first_name     ?? "-";
        viewLastName.textContent      = s.last_name      ?? "-";
        viewMiddleInitial.textContent = s.middle_initial ?? "-";
        viewGenderText.textContent    = s.gender         ?? "-";
        viewDepartment.textContent    = s.department     ?? "-";
        viewRoleText.textContent      = s.role_name      ?? "-";
        viewEmail.textContent         = s.email          ?? "-";
        viewPhone.textContent         = s.phone          ?? "-";

        viewGenderBadge.className   = `inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getGenderBadge(s.gender)}`;
        viewGenderBadge.textContent = s.gender   ?? "-";
        viewRoleBadge.className     = "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary";
        viewRoleBadge.textContent   = s.role_name ?? "-";

        viewStaffPhotoWrapper.innerHTML = s.photo
            ? `<img src="${s.photo}" alt="${s.first_name} ${s.last_name}" class="h-full w-full object-cover" />`
            : getInitials(s.first_name, s.last_name);
    }

    function bindViewButtons() {
        document.querySelectorAll(".view-staff-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const s = allStaff.find(x => x.id === Number(btn.dataset.staffId));
                if (!s) return;
                fillViewModal(s);
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
        document.querySelectorAll(".edit-staff-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const s = allStaff.find(x => x.id === Number(btn.dataset.staffId));
                if (!s) return;
                fillEditModal(s);
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
        document.querySelectorAll(".delete-staff-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const s = allStaff.find(x => x.id === Number(btn.dataset.staffId));
                if (!s) return;
                fillDeleteModal(s);
                openDeleteModal();
            });
        });
    }

    // ─── Data Fetching ────────────────────────────────────────────────────────

    async function loadStaff() {
        // Show loading state
        staffTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="px-6 py-10 text-center text-sm text-slate-500">Loading staff...</td>
            </tr>
        `;

        try {
            const response = await fetch(`${API_BASE_URL}/staffs/`);

            if (!response.ok) {
                throw new Error(`Server returned ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            // Handle both array responses and paginated {results: [...]} responses
            allStaff = Array.isArray(data) ? data : (data.results ?? []);

            console.log(`Loaded ${allStaff.length} staff records.`);

            populateFilters(allStaff);
            renderStaff(allStaff);

        } catch (error) {
            console.error("Staff fetch error:", error);
            showTableError(`Failed to load staff: ${error.message}`);
        }
    }

    async function loadRoleData() {
        try {
            const response = await fetch(`${API_BASE_URL}/roles/`);

            if (!response.ok) {
                throw new Error(`Server returned ${response.status}`);
            }

            const data = await response.json();
            allRoles   = Array.isArray(data) ? data : (data.results ?? []);

            populateModalRoles();

        } catch (error) {
            console.error("Role fetch error:", error);
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
            const response = await fetch(`${API_BASE_URL}/staffs/`, {
                method: "POST",
                headers: { "X-CSRFToken": getCookie("csrftoken") },
                body:   new FormData(addStaffForm),
            });

            if (!response.ok) {
                let msg = `Failed to save staff (${response.status}).`;
                try   { msg = JSON.stringify(await response.json()); } catch {}
                throw new Error(msg);
            }

            showFormMessage(addStaffMessage, "Staff added successfully.", "success");
            await loadStaff();
            setTimeout(() => closeAddModal(), 800);

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
            const formData = new FormData(editStaffForm);
            if (!editPhoto.files.length) formData.delete("photo");

            const response = await fetch(`${API_BASE_URL}/staffs/${editStaffId.value}/`, {
                method: "PATCH",
                headers: { "X-CSRFToken": getCookie("csrftoken") },
                body:   formData,
            });

            if (!response.ok) {
                let msg = `Failed to update staff (${response.status}).`;
                try   { msg = JSON.stringify(await response.json()); } catch {}
                throw new Error(msg);
            }

            showFormMessage(editStaffMessage, "Staff updated successfully.", "success");
            await loadStaff();
            setTimeout(() => closeEditModal(), 800);

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
            const response = await fetch(`${API_BASE_URL}/staffs/${deleteStaffId.value}/delete/`, {
                method: "DELETE",
                headers: { "X-CSRFToken": getCookie("csrftoken") },
            });

            if (!response.ok) {
                let msg = `Failed to delete staff (${response.status}).`;
                try   { msg = JSON.stringify(await response.json()); } catch {}
                throw new Error(msg);
            }

            showFormMessage(deleteStaffMessage, "Staff deleted successfully.", "success");
            await loadStaff();
            setTimeout(() => closeDeleteModal(), 800);

        } catch (error) {
            console.error("Delete staff error:", error);
            showFormMessage(deleteStaffMessage, error.message, "error");
        } finally {
            confirmDeleteStaffButton.disabled    = false;
            confirmDeleteStaffButton.textContent = "Delete Staff";
        }
    }

    // ─── Event Listeners ──────────────────────────────────────────────────────

    staffSearch.addEventListener("input",  applyFilters);
    departmentFilter.addEventListener("change", applyFilters);
    genderFilter.addEventListener("change",     applyFilters);
    roleFilter.addEventListener("change",       applyFilters);

    resetFilters.addEventListener("click", () => {
        staffSearch.value      = "";
        departmentFilter.value = "";
        genderFilter.value     = "";
        roleFilter.value       = "";
        renderStaff(allStaff);
    });

    openAddStaffModal.addEventListener("click",  openAddModal);
    closeAddStaffModal.addEventListener("click", closeAddModal);
    cancelAddStaff.addEventListener("click",     closeAddModal);
    addStaffModal.addEventListener("click", e => { if (e.target === addStaffModal) closeAddModal(); });

    closeViewStaffModal.addEventListener("click", closeViewModal);
    viewStaffDoneButton.addEventListener("click", closeViewModal);
    viewStaffModal.addEventListener("click", e => { if (e.target === viewStaffModal) closeViewModal(); });

    closeEditStaffModal.addEventListener("click", closeEditModal);
    cancelEditStaff.addEventListener("click",     closeEditModal);
    editStaffModal.addEventListener("click", e => { if (e.target === editStaffModal) closeEditModal(); });

    closeDeleteStaffModal.addEventListener("click", closeDeleteModal);
    cancelDeleteStaff.addEventListener("click",     closeDeleteModal);
    deleteStaffModal.addEventListener("click", e => { if (e.target === deleteStaffModal) closeDeleteModal(); });

    confirmDeleteStaffButton.addEventListener("click", confirmDeleteStaff);
    addStaffForm.addEventListener("submit",  submitStaffForm);
    editStaffForm.addEventListener("submit", submitEditStaffForm);

    // ─── Init ─────────────────────────────────────────────────────────────────

    loadStaff();
    loadRoleData();

});