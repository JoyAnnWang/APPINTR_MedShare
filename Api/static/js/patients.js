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

const API_BASE_URL = "http://127.0.0.1:8000/api";

let allPatients = [];
let allStatuses = [];

document.addEventListener("DOMContentLoaded", () => {

    // ─── DOM Elements ─────────────────────────────────────────────────────────

    const patientTableBody = document.getElementById("patientTableBody");
    const patientSummary   = document.getElementById("patientSummary");
    const patientSearch    = document.getElementById("patientSearch");
    const courseFilter     = document.getElementById("courseFilter");
    const statusFilter     = document.getElementById("statusFilter");
    const genderFilter     = document.getElementById("genderFilter");
    const resetFilters     = document.getElementById("resetFilters");

    // Add Modal
    const openAddPatientModal  = document.getElementById("openAddPatientModal");
    const addPatientModal      = document.getElementById("addPatientModal");
    const closeAddPatientModal = document.getElementById("closeAddPatientModal");
    const cancelAddPatient     = document.getElementById("cancelAddPatient");
    const addPatientForm       = document.getElementById("addPatientForm");
    const addPatientMessage    = document.getElementById("addPatientMessage");
    const savePatientButton    = document.getElementById("savePatientButton");
    const modalStatus          = document.getElementById("modalStatus");

    // View Modal
    const viewPatientModal        = document.getElementById("viewPatientModal");
    const closeViewPatientModal   = document.getElementById("closeViewPatientModal");
    const viewPatientDoneButton   = document.getElementById("viewPatientDoneButton");
    const viewPatientPhotoWrapper = document.getElementById("viewPatientPhotoWrapper");
    const viewFullName            = document.getElementById("viewFullName");
    const viewPatientId           = document.getElementById("viewPatientId");
    const viewGenderBadge         = document.getElementById("viewGenderBadge");
    const viewStatusBadge         = document.getElementById("viewStatusBadge");
    const viewFirstName           = document.getElementById("viewFirstName");
    const viewLastName            = document.getElementById("viewLastName");
    const viewMiddleInitial       = document.getElementById("viewMiddleInitial");
    const viewGenderText          = document.getElementById("viewGenderText");
    const viewCourse              = document.getElementById("viewCourse");
    const viewStatusText          = document.getElementById("viewStatusText");
    const viewEmail               = document.getElementById("viewEmail");
    const viewPhone               = document.getElementById("viewPhone");

    // Edit Modal
    const editPatientModal      = document.getElementById("editPatientModal");
    const closeEditPatientModal = document.getElementById("closeEditPatientModal");
    const cancelEditPatient     = document.getElementById("cancelEditPatient");
    const editPatientForm       = document.getElementById("editPatientForm");
    const editPatientMessage    = document.getElementById("editPatientMessage");
    const updatePatientButton   = document.getElementById("updatePatientButton");
    const editPatientId         = document.getElementById("edit_patient_id");
    const editPatientIdField    = document.getElementById("edit_patient_id_field");
    const editLastName          = document.getElementById("edit_last_name");
    const editFirstName         = document.getElementById("edit_first_name");
    const editMiddleInitial     = document.getElementById("edit_middle_initial");
    const editGender            = document.getElementById("edit_gender");
    const editCourse            = document.getElementById("edit_course");
    const editModalStatus       = document.getElementById("edit_modalStatus");
    const editEmail             = document.getElementById("edit_email");
    const editPhone             = document.getElementById("edit_phone");
    const editPhoto             = document.getElementById("edit_photo");

    // Delete Modal
    const deletePatientModal         = document.getElementById("deletePatientModal");
    const closeDeletePatientModal    = document.getElementById("closeDeletePatientModal");
    const cancelDeletePatient        = document.getElementById("cancelDeletePatient");
    const confirmDeletePatientButton = document.getElementById("confirmDeletePatientButton");
    const deletePatientId            = document.getElementById("delete_patient_id");
    const deletePatientName          = document.getElementById("deletePatientName");
    const deletePatientIdDisplay     = document.getElementById("deletePatientIdDisplay");
    const deletePatientMessage       = document.getElementById("deletePatientMessage");

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
        addPatientModal.classList.remove("hidden");
        addPatientModal.classList.add("flex");
        document.body.classList.add("overflow-hidden");
        clearFormMessage(addPatientMessage);
    }

    function closeModal() {
        addPatientModal.classList.add("hidden");
        addPatientModal.classList.remove("flex");
        document.body.classList.remove("overflow-hidden");
        addPatientForm.reset();
        clearFormMessage(addPatientMessage);
        resetStatusDropdown();
    }

    // ─── View Modal ───────────────────────────────────────────────────────────

    function openViewModal() {
        viewPatientModal.classList.remove("hidden");
        viewPatientModal.classList.add("flex");
        document.body.classList.add("overflow-hidden");
    }

    function closeViewModal() {
        viewPatientModal.classList.add("hidden");
        viewPatientModal.classList.remove("flex");
        document.body.classList.remove("overflow-hidden");
    }

    // ─── Edit Modal ───────────────────────────────────────────────────────────

    function openEditModal() {
        editPatientModal.classList.remove("hidden");
        editPatientModal.classList.add("flex");
        document.body.classList.add("overflow-hidden");
        clearFormMessage(editPatientMessage);
    }

    function closeEditModal() {
        editPatientModal.classList.add("hidden");
        editPatientModal.classList.remove("flex");
        document.body.classList.remove("overflow-hidden");
        editPatientForm.reset();
        clearFormMessage(editPatientMessage);
    }

    // ─── Delete Modal ─────────────────────────────────────────────────────────

    function openDeleteModal() {
        deletePatientModal.classList.remove("hidden");
        deletePatientModal.classList.add("flex");
        document.body.classList.add("overflow-hidden");
        clearFormMessage(deletePatientMessage);
    }

    function closeDeleteModal() {
        deletePatientModal.classList.add("hidden");
        deletePatientModal.classList.remove("flex");
        document.body.classList.remove("overflow-hidden");
        deletePatientId.value            = "";
        deletePatientName.textContent    = "-";
        deletePatientIdDisplay.textContent = "-";
        clearFormMessage(deletePatientMessage);
    }

    // ─── Filters ──────────────────────────────────────────────────────────────

    function populateFilters(_patients) {
        // Filters are plain text inputs — no dropdown population needed.
    }

    function populateModalStatuses() {
        modalStatus.innerHTML    = `<option value="">Select status</option>`;
        editModalStatus.innerHTML = `<option value="">Select status</option>`;
        allStatuses.forEach(status => {
            modalStatus.innerHTML     += `<option value="${status.id}">${status.status_name}</option>`;
            editModalStatus.innerHTML += `<option value="${status.id}">${status.status_name}</option>`;
        });
    }

    function resetStatusDropdown() {
        modalStatus.value = "";
    }

    function applyFilters() {
        const searchValue       = patientSearch.value.trim().toLowerCase();
        const courseFilterValue = courseFilter.value.trim().toLowerCase();
        const statusFilterValue = statusFilter.value.trim().toLowerCase();
        const genderFilterValue = genderFilter.value.trim().toLowerCase();

        const filtered = allPatients.filter(p => {
            const fullName  = `${p.last_name} ${p.first_name} ${p.middle_initial ?? ""}`.toLowerCase();
            const patientId = (p.patient_id ?? "").toLowerCase();
            const courseStr = (p.course      ?? "").toLowerCase();
            const statusStr = (p.status_name ?? "").toLowerCase();
            const genderStr = (p.gender      ?? "").toLowerCase();

            const matchesSearch = fullName.includes(searchValue) || patientId.includes(searchValue);
            const matchesCourse = !courseFilterValue || courseStr.includes(courseFilterValue);
            const matchesStatus = !statusFilterValue || statusStr.includes(statusFilterValue);
            const matchesGender = !genderFilterValue || genderStr.includes(genderFilterValue);

            return matchesSearch && matchesCourse && matchesStatus && matchesGender;
        });

        renderPatients(filtered);
    }

    // ─── Render ───────────────────────────────────────────────────────────────

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
                ? `<img src="${p.photo}" alt="${p.first_name} ${p.last_name}" class="size-10 rounded-full bg-slate-100 object-cover" />`
                : `<div class="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">${getInitials(p.first_name, p.last_name)}</div>`;

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
                            <p class="font-semibold text-slate-700 dark:text-slate-200">${p.course ?? "-"}</p>
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
                    <td class="px-6 py-4">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                            ${p.status_name ?? "-"}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-right">
                        <div class="flex justify-end gap-2">
                            <button class="view-patient-btn p-2 text-slate-400 hover:text-primary transition-colors" title="View" data-patient-id="${p.id}">
                                <span class="material-symbols-outlined">visibility</span>
                            </button>
                            <button class="edit-patient-btn p-2 text-slate-400 hover:text-blue-500 transition-colors" title="Edit" data-patient-id="${p.id}">
                                <span class="material-symbols-outlined">edit</span>
                            </button>
                            <button class="delete-patient-btn p-2 text-slate-400 hover:text-red-500 transition-colors" title="Delete" data-patient-id="${p.id}">
                                <span class="material-symbols-outlined">delete</span>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join("");

        patientSummary.innerHTML = `Showing <span class="font-semibold">${patients.length}</span> patient${patients.length > 1 ? "s" : ""}`;
        bindViewButtons();
        bindEditButtons();
        bindDeleteButtons();
    }

    // ─── Fill View Modal ──────────────────────────────────────────────────────

    function fillViewModal(p) {
        const fullName = `${p.last_name}, ${p.first_name}${p.middle_initial ? ` ${p.middle_initial}.` : ""}`;

        viewFullName.textContent      = fullName;
        viewPatientId.textContent     = `Patient ID: ${p.patient_id ?? "-"}`;
        viewFirstName.textContent     = p.first_name     ?? "-";
        viewLastName.textContent      = p.last_name      ?? "-";
        viewMiddleInitial.textContent = p.middle_initial ?? "-";
        viewGenderText.textContent    = p.gender         ?? "-";
        viewCourse.textContent        = p.course         ?? "-";
        viewStatusText.textContent    = p.status_name    ?? "-";
        viewEmail.textContent         = p.email          ?? "-";
        viewPhone.textContent         = p.phone          ?? "-";

        viewGenderBadge.className   = `inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getGenderBadge(p.gender)}`;
        viewGenderBadge.textContent = p.gender ?? "-";

        viewStatusBadge.className   = "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700";
        viewStatusBadge.textContent = p.status_name ?? "-";

        if (p.photo) {
            viewPatientPhotoWrapper.innerHTML = `<img src="${p.photo}" alt="${p.first_name} ${p.last_name}" class="h-full w-full object-cover" />`;
        } else {
            viewPatientPhotoWrapper.innerHTML = getInitials(p.first_name, p.last_name);
        }
    }

    function bindViewButtons() {
        document.querySelectorAll(".view-patient-btn").forEach(button => {
            button.addEventListener("click", () => {
                const patientId      = Number(button.getAttribute("data-patient-id"));
                const selectedPatient = allPatients.find(p => p.id === patientId);
                if (!selectedPatient) return;
                fillViewModal(selectedPatient);
                openViewModal();
            });
        });
    }

    // ─── Fill Edit Modal ──────────────────────────────────────────────────────

    function fillEditModal(p) {
        editPatientId.value       = p.id;
        editPatientIdField.value  = p.patient_id      ?? "";
        editLastName.value        = p.last_name       ?? "";
        editFirstName.value       = p.first_name      ?? "";
        editMiddleInitial.value   = p.middle_initial  ?? "";
        editGender.value          = p.gender          ?? "";
        editCourse.value          = p.course          ?? "";
        editEmail.value           = p.email           ?? "";
        editPhone.value           = p.phone           ?? "";
        editModalStatus.value     = p.status != null ? String(p.status) : "";
    }

    function bindEditButtons() {
        document.querySelectorAll(".edit-patient-btn").forEach(button => {
            button.addEventListener("click", () => {
                const patientId       = Number(button.getAttribute("data-patient-id"));
                const selectedPatient = allPatients.find(p => p.id === patientId);
                if (!selectedPatient) return;
                fillEditModal(selectedPatient);
                openEditModal();
            });
        });
    }

    // ─── Fill Delete Modal ────────────────────────────────────────────────────

    function fillDeleteModal(p) {
        deletePatientId.value              = p.id;
        deletePatientName.textContent      = `${p.last_name}, ${p.first_name}${p.middle_initial ? ` ${p.middle_initial}.` : ""}`;
        deletePatientIdDisplay.textContent = `Patient ID: ${p.patient_id ?? "-"}`;
    }

    function bindDeleteButtons() {
        document.querySelectorAll(".delete-patient-btn").forEach(button => {
            button.addEventListener("click", () => {
                const patientId       = Number(button.getAttribute("data-patient-id"));
                const selectedPatient = allPatients.find(p => p.id === patientId);
                if (!selectedPatient) return;
                fillDeleteModal(selectedPatient);
                openDeleteModal();
            });
        });
    }

    // ─── Data Fetching ────────────────────────────────────────────────────────

    async function loadPatients() {
        patientTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-10 text-center text-sm text-slate-500">Loading patients...</td>
            </tr>
        `;

        const controller = new AbortController();
        const timeoutId  = setTimeout(() => controller.abort(), 8000);

        try {
            const response = await fetch(`${API_BASE_URL}/patients/`, { signal: controller.signal });
            clearTimeout(timeoutId);
            if (!response.ok) {
                throw new Error(`Server returned ${response.status}: ${response.statusText}`);
            }
            allPatients = await response.json();
            populateFilters(allPatients);
            renderPatients(allPatients);
        } catch (error) {
            clearTimeout(timeoutId);
            console.error("Patient error:", error);
            const isTimeout = error.name === "AbortError";
            patientTableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="px-6 py-10 text-center text-sm text-red-500">
                        ${isTimeout
                            ? "Request timed out. Could not reach the server."
                            : `Failed to load patients: ${error.message}`}
                    </td>
                </tr>
            `;
            patientSummary.innerHTML = `Showing <span class="font-semibold">0</span> patients`;
        }
    }

    async function loadStatusData() {
        try {
            const response = await fetch(`${API_BASE_URL}/statuses/`);
            if (!response.ok) {
                throw new Error("Failed to load status dropdown data.");
            }
            allStatuses = await response.json();
            populateModalStatuses();
        } catch (error) {
            console.error("Status dropdown error:", error);
            modalStatus.innerHTML     = `<option value="">Failed to load statuses</option>`;
            editModalStatus.innerHTML = `<option value="">Failed to load statuses</option>`;
        }
    }

    // ─── Form Submissions ─────────────────────────────────────────────────────

    async function submitPatientForm(event) {
        event.preventDefault();
        clearFormMessage(addPatientMessage);
        savePatientButton.disabled    = true;
        savePatientButton.textContent = "Saving...";

        try {
            const formData = new FormData(addPatientForm);
            const response = await fetch(`${API_BASE_URL}/patients/`, {
                method: "POST",
                headers: { "X-CSRFToken": getCookie("csrftoken") },
                body:   formData
            });

            if (!response.ok) {
                let errorMessage = "Failed to save patient.";
                try {
                    const errorData = await response.json();
                    errorMessage = JSON.stringify(errorData);
                } catch {
                    errorMessage = `Failed to save patient. Status: ${response.status}`;
                }
                throw new Error(errorMessage);
            }

            showFormMessage(addPatientMessage, "Patient added successfully.", "success");
            await loadPatients();
            setTimeout(() => { closeModal(); }, 800);

        } catch (error) {
            console.error("Add patient error:", error);
            showFormMessage(addPatientMessage, error.message, "error");
        } finally {
            savePatientButton.disabled    = false;
            savePatientButton.textContent = "Save Patient";
        }
    }

    async function submitEditPatientForm(event) {
        event.preventDefault();
        clearFormMessage(editPatientMessage);
        updatePatientButton.disabled    = true;
        updatePatientButton.textContent = "Updating...";

        try {
            const patientId = editPatientId.value;
            const formData  = new FormData(editPatientForm);

            if (!editPhoto.files.length) {
                formData.delete("photo");
            }

            const response = await fetch(`${API_BASE_URL}/patients/${patientId}/`, {
                method: "PATCH",
                headers: { "X-CSRFToken": getCookie("csrftoken") },
                body:   formData
            });

            if (!response.ok) {
                let errorMessage = "Failed to update patient.";
                try {
                    const errorData = await response.json();
                    errorMessage = JSON.stringify(errorData);
                } catch {
                    errorMessage = `Failed to update patient. Status: ${response.status}`;
                }
                throw new Error(errorMessage);
            }

            showFormMessage(editPatientMessage, "Patient updated successfully.", "success");
            await loadPatients();
            setTimeout(() => { closeEditModal(); }, 800);

        } catch (error) {
            console.error("Edit patient error:", error);
            showFormMessage(editPatientMessage, error.message, "error");
        } finally {
            updatePatientButton.disabled    = false;
            updatePatientButton.textContent = "Update Patient";
        }
    }

    async function confirmDeletePatient() {
        clearFormMessage(deletePatientMessage);
        confirmDeletePatientButton.disabled    = true;
        confirmDeletePatientButton.textContent = "Deleting...";

        try {
            const patientId = deletePatientId.value;
            const response  = await fetch(`${API_BASE_URL}/patients/${patientId}/delete/`, {
                method: "DELETE",
                headers: { "X-CSRFToken": getCookie("csrftoken") }
            });

            if (!response.ok) {
                let errorMessage = "Failed to delete patient.";
                try {
                    const errorData = await response.json();
                    errorMessage = JSON.stringify(errorData);
                } catch {
                    errorMessage = `Failed to delete patient. Status: ${response.status}`;
                }
                throw new Error(errorMessage);
            }

            showFormMessage(deletePatientMessage, "Patient deleted successfully.", "success");
            await loadPatients();
            setTimeout(() => { closeDeleteModal(); }, 800);

        } catch (error) {
            console.error("Delete patient error:", error);
            showFormMessage(deletePatientMessage, error.message, "error");
        } finally {
            confirmDeletePatientButton.disabled    = false;
            confirmDeletePatientButton.textContent = "Delete Patient";
        }
    }

    // ─── Event Listeners ──────────────────────────────────────────────────────

    patientSearch.addEventListener("input", applyFilters);
    courseFilter.addEventListener("input",  applyFilters);
    statusFilter.addEventListener("input",  applyFilters);
    genderFilter.addEventListener("input",  applyFilters);

    resetFilters.addEventListener("click", () => {
        patientSearch.value = "";
        courseFilter.value  = "";
        statusFilter.value  = "";
        genderFilter.value  = "";
        renderPatients(allPatients);
    });

    openAddPatientModal.addEventListener("click", openModal);
    closeAddPatientModal.addEventListener("click", closeModal);
    cancelAddPatient.addEventListener("click", closeModal);
    addPatientModal.addEventListener("click", (event) => {
        if (event.target === addPatientModal) closeModal();
    });

    closeViewPatientModal.addEventListener("click", closeViewModal);
    viewPatientDoneButton.addEventListener("click", closeViewModal);
    viewPatientModal.addEventListener("click", (event) => {
        if (event.target === viewPatientModal) closeViewModal();
    });

    closeEditPatientModal.addEventListener("click", closeEditModal);
    cancelEditPatient.addEventListener("click", closeEditModal);
    editPatientModal.addEventListener("click", (event) => {
        if (event.target === editPatientModal) closeEditModal();
    });

    closeDeletePatientModal.addEventListener("click", closeDeleteModal);
    cancelDeletePatient.addEventListener("click", closeDeleteModal);
    confirmDeletePatientButton.addEventListener("click", confirmDeletePatient);
    deletePatientModal.addEventListener("click", (event) => {
        if (event.target === deletePatientModal) closeDeleteModal();
    });

    addPatientForm.addEventListener("submit", submitPatientForm);
    editPatientForm.addEventListener("submit", submitEditPatientForm);

    // ─── Init ─────────────────────────────────────────────────────────────────

    loadPatients();
    loadStatusData();

});