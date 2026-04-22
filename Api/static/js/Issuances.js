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

let allIssuances = [];
let allItems     = [];
let allPatients  = [];

document.addEventListener("DOMContentLoaded", () => {

    // ─── DOM Elements ─────────────────────────────────────────────────────────

    const issuanceTableBody = document.getElementById("issuanceTableBody");
    const issuanceSummary   = document.getElementById("issuanceSummary");
    const issuanceSearch    = document.getElementById("issuanceSearch");
    const itemFilter        = document.getElementById("itemFilter");
    const patientFilter     = document.getElementById("patientFilter");
    const resetFilters      = document.getElementById("resetFilters");

    // Add Modal
    const openAddIssuanceModal  = document.getElementById("openAddIssuanceModal");
    const addIssuanceModal      = document.getElementById("addIssuanceModal");
    const closeAddIssuanceModal = document.getElementById("closeAddIssuanceModal");
    const cancelAddIssuance     = document.getElementById("cancelAddIssuance");
    const addIssuanceForm       = document.getElementById("addIssuanceForm");
    const addIssuanceMessage    = document.getElementById("addIssuanceMessage");
    const saveIssuanceButton    = document.getElementById("saveIssuanceButton");
    const addItemSelect         = document.getElementById("add_item");
    const addPatientSelect      = document.getElementById("add_patient");

    // View Modal
    const viewIssuanceModal       = document.getElementById("viewIssuanceModal");
    const closeViewIssuanceModal  = document.getElementById("closeViewIssuanceModal");
    const viewIssuanceDoneButton  = document.getElementById("viewIssuanceDoneButton");
    const viewIssuanceIdHeader    = document.getElementById("viewIssuanceIdHeader");
    const viewCreatedAtHeader     = document.getElementById("viewCreatedAtHeader");
    const viewLinkedItemId        = document.getElementById("viewLinkedItemId");
    const viewLinkedItemName      = document.getElementById("viewLinkedItemName");
    const viewLinkedPatientId     = document.getElementById("viewLinkedPatientId");
    const viewLinkedPatientName   = document.getElementById("viewLinkedPatientName");
    const viewCreatedAt           = document.getElementById("viewCreatedAt");

    // Edit Modal
    const editIssuanceModal      = document.getElementById("editIssuanceModal");
    const closeEditIssuanceModal = document.getElementById("closeEditIssuanceModal");
    const cancelEditIssuance     = document.getElementById("cancelEditIssuance");
    const editIssuanceForm       = document.getElementById("editIssuanceForm");
    const editIssuanceMessage    = document.getElementById("editIssuanceMessage");
    const updateIssuanceButton   = document.getElementById("updateIssuanceButton");
    const editIssuancePk         = document.getElementById("edit_issuance_pk");
    const editIssuanceId         = document.getElementById("edit_issuance_id");
    const editItemSelect         = document.getElementById("edit_item");
    const editPatientSelect      = document.getElementById("edit_patient");

    // Delete Modal
    const deleteIssuanceModal         = document.getElementById("deleteIssuanceModal");
    const closeDeleteIssuanceModal    = document.getElementById("closeDeleteIssuanceModal");
    const cancelDeleteIssuance        = document.getElementById("cancelDeleteIssuance");
    const confirmDeleteIssuanceButton = document.getElementById("confirmDeleteIssuanceButton");
    const deleteIssuancePk            = document.getElementById("delete_issuance_pk");
    const deleteIssuanceName          = document.getElementById("deleteIssuanceName");
    const deleteIssuanceIdDisplay     = document.getElementById("deleteIssuanceIdDisplay");
    const deleteIssuanceMessage       = document.getElementById("deleteIssuanceMessage");

    // ─── Helpers ─────────────────────────────────────────────────────────────

    function formatDateTime(isoString) {
        if (!isoString) return "-";
        return new Date(isoString).toLocaleString();
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
        addIssuanceModal.classList.remove("hidden");
        addIssuanceModal.classList.add("flex");
        document.body.classList.add("overflow-hidden");
        clearFormMessage(addIssuanceMessage);
    }

    function closeModal() {
        addIssuanceModal.classList.add("hidden");
        addIssuanceModal.classList.remove("flex");
        document.body.classList.remove("overflow-hidden");
        addIssuanceForm.reset();
        clearFormMessage(addIssuanceMessage);
    }

    // ─── View Modal ───────────────────────────────────────────────────────────

    function openViewModal() {
        viewIssuanceModal.classList.remove("hidden");
        viewIssuanceModal.classList.add("flex");
        document.body.classList.add("overflow-hidden");
    }

    function closeViewModal() {
        viewIssuanceModal.classList.add("hidden");
        viewIssuanceModal.classList.remove("flex");
        document.body.classList.remove("overflow-hidden");
    }

    // ─── Edit Modal ───────────────────────────────────────────────────────────

    function openEditModal() {
        editIssuanceModal.classList.remove("hidden");
        editIssuanceModal.classList.add("flex");
        document.body.classList.add("overflow-hidden");
        clearFormMessage(editIssuanceMessage);
    }

    function closeEditModal() {
        editIssuanceModal.classList.add("hidden");
        editIssuanceModal.classList.remove("flex");
        document.body.classList.remove("overflow-hidden");
        editIssuanceForm.reset();
        clearFormMessage(editIssuanceMessage);
    }

    // ─── Delete Modal ─────────────────────────────────────────────────────────

    function openDeleteModal() {
        deleteIssuanceModal.classList.remove("hidden");
        deleteIssuanceModal.classList.add("flex");
        document.body.classList.add("overflow-hidden");
        clearFormMessage(deleteIssuanceMessage);
    }

    function closeDeleteModal() {
        deleteIssuanceModal.classList.add("hidden");
        deleteIssuanceModal.classList.remove("flex");
        document.body.classList.remove("overflow-hidden");
        deleteIssuancePk.value                = "";
        deleteIssuanceName.textContent        = "-";
        deleteIssuanceIdDisplay.textContent   = "-";
        clearFormMessage(deleteIssuanceMessage);
    }

    // ─── Filters ──────────────────────────────────────────────────────────────

    function populateFilters(_issuances) {
        // Filters are plain text inputs — no dropdown population needed.
    }

    function populateModalDropdowns() {
        // Items
        const itemOptions = allItems.map(i =>
            `<option value="${i.id}">${i.item_id} – ${i.item_name}</option>`
        ).join("");
        addItemSelect.innerHTML  = `<option value="">Select item</option>` + itemOptions;
        editItemSelect.innerHTML = `<option value="">Select item</option>` + itemOptions;

        // Patients
        const patientOptions = allPatients.map(p => {
            const name = `${p.last_name}, ${p.first_name}${p.middle_initial ? ` ${p.middle_initial}.` : ""}`;
            return `<option value="${p.id}">${p.patient_id} – ${name}</option>`;
        }).join("");
        addPatientSelect.innerHTML  = `<option value="">Select patient</option>` + patientOptions;
        editPatientSelect.innerHTML = `<option value="">Select patient</option>` + patientOptions;
    }

    function applyFilters() {
        const searchValue      = issuanceSearch.value.trim().toLowerCase();
        const itemFilterValue  = itemFilter.value.trim().toLowerCase();
        const patientFilterValue = patientFilter.value.trim().toLowerCase();

        const filtered = allIssuances.filter(i => {
            const issuanceIdStr  = (i.issuance_id   ?? "").toLowerCase();
            const itemNameStr    = (i.item_name      ?? "").toLowerCase();
            const patientNameStr = (i.patient_name   ?? "").toLowerCase();

            const matchesSearch  = issuanceIdStr.includes(searchValue)
                                || itemNameStr.includes(searchValue)
                                || patientNameStr.includes(searchValue);
            const matchesItem    = !itemFilterValue    || itemNameStr.includes(itemFilterValue);
            const matchesPatient = !patientFilterValue || patientNameStr.includes(patientFilterValue);

            return matchesSearch && matchesItem && matchesPatient;
        });

        renderIssuances(filtered);
    }

    // ─── Render ───────────────────────────────────────────────────────────────

    function renderIssuances(issuances) {
        if (!issuances.length) {
            issuanceTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="px-6 py-10 text-center text-sm text-slate-500">
                        No issuance records found.
                    </td>
                </tr>
            `;
            issuanceSummary.innerHTML = `Showing <span class="font-semibold">0</span> issuances`;
            return;
        }

        issuanceTableBody.innerHTML = issuances.map(i => `
            <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                        <div class="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                            <span class="material-symbols-outlined text-lg">handshake</span>
                        </div>
                        <p class="font-bold text-slate-900 dark:text-slate-100">${i.issuance_id}</p>
                    </div>
                </td>
                <td class="px-6 py-4">
                    <p class="text-sm font-semibold text-slate-700 dark:text-slate-200">${i.item_name ?? "-"}</p>
                    <p class="text-xs text-slate-500">${i.item_id_code ?? "-"}</p>
                </td>
                <td class="px-6 py-4">
                    <p class="text-sm font-semibold text-slate-700 dark:text-slate-200">${i.patient_name ?? "-"}</p>
                    <p class="text-xs text-slate-500">${i.patient_id_code ?? "-"}</p>
                </td>
                <td class="px-6 py-4">
                    <p class="text-sm text-slate-600 dark:text-slate-300">${formatDateTime(i.created_at)}</p>
                </td>
                <td class="px-6 py-4 text-right">
                    <div class="flex justify-end gap-2">
                        <button class="view-issuance-btn p-2 text-slate-400 hover:text-primary transition-colors" title="View" data-issuance-id="${i.id}">
                            <span class="material-symbols-outlined">visibility</span>
                        </button>
                        <button class="edit-issuance-btn p-2 text-slate-400 hover:text-blue-500 transition-colors" title="Edit" data-issuance-id="${i.id}">
                            <span class="material-symbols-outlined">edit</span>
                        </button>
                        <button class="delete-issuance-btn p-2 text-slate-400 hover:text-red-500 transition-colors" title="Delete" data-issuance-id="${i.id}">
                            <span class="material-symbols-outlined">delete</span>
                        </button>
                    </div>
                </td>
            </tr>
        `).join("");

        issuanceSummary.innerHTML = `Showing <span class="font-semibold">${issuances.length}</span> issuance${issuances.length > 1 ? "s" : ""}`;
        bindViewButtons();
        bindEditButtons();
        bindDeleteButtons();
    }

    // ─── Fill View Modal ──────────────────────────────────────────────────────

    function fillViewModal(i) {
        viewIssuanceIdHeader.textContent  = i.issuance_id ?? "-";
        viewCreatedAtHeader.textContent   = formatDateTime(i.created_at);
        viewLinkedItemId.textContent      = i.item_id_code   ?? "-";
        viewLinkedItemName.textContent    = i.item_name      ?? "-";
        viewLinkedPatientId.textContent   = i.patient_id_code ?? "-";
        viewLinkedPatientName.textContent = i.patient_name   ?? "-";
        viewCreatedAt.textContent         = formatDateTime(i.created_at);
    }

    function bindViewButtons() {
        document.querySelectorAll(".view-issuance-btn").forEach(button => {
            button.addEventListener("click", () => {
                const pk       = Number(button.getAttribute("data-issuance-id"));
                const selected = allIssuances.find(i => i.id === pk);
                if (!selected) return;
                fillViewModal(selected);
                openViewModal();
            });
        });
    }

    // ─── Fill Edit Modal ──────────────────────────────────────────────────────

    function fillEditModal(i) {
        editIssuancePk.value      = i.id;
        editIssuanceId.value      = i.issuance_id ?? "";
        editItemSelect.value      = i.item    != null ? String(i.item)    : "";
        editPatientSelect.value   = i.patient != null ? String(i.patient) : "";
    }

    function bindEditButtons() {
        document.querySelectorAll(".edit-issuance-btn").forEach(button => {
            button.addEventListener("click", () => {
                const pk       = Number(button.getAttribute("data-issuance-id"));
                const selected = allIssuances.find(i => i.id === pk);
                if (!selected) return;
                fillEditModal(selected);
                openEditModal();
            });
        });
    }

    // ─── Fill Delete Modal ────────────────────────────────────────────────────

    function fillDeleteModal(i) {
        deleteIssuancePk.value              = i.id;
        deleteIssuanceName.textContent      = i.issuance_id ?? "-";
        deleteIssuanceIdDisplay.textContent = `Item: ${i.item_name ?? "-"} · Patient: ${i.patient_name ?? "-"}`;
    }

    function bindDeleteButtons() {
        document.querySelectorAll(".delete-issuance-btn").forEach(button => {
            button.addEventListener("click", () => {
                const pk       = Number(button.getAttribute("data-issuance-id"));
                const selected = allIssuances.find(i => i.id === pk);
                if (!selected) return;
                fillDeleteModal(selected);
                openDeleteModal();
            });
        });
    }

    // ─── Data Fetching ────────────────────────────────────────────────────────

    async function loadIssuances() {
        try {
            const response = await fetch(`${API_BASE_URL}/issuances/`);
            if (!response.ok) throw new Error(`Failed to fetch issuances: ${response.status}`);
            allIssuances = await response.json();
            populateFilters(allIssuances);
            renderIssuances(allIssuances);
        } catch (error) {
            console.error("Issuance error:", error);
            issuanceTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="px-6 py-10 text-center text-sm text-red-500">
                        Failed to load issuances.
                    </td>
                </tr>
            `;
            issuanceSummary.innerHTML = `Showing <span class="font-semibold">0</span> issuances`;
        }
    }

    async function loadDropdownData() {
        try {
            const [itemsRes, patientsRes] = await Promise.all([
                fetch(`${API_BASE_URL}/items/`),
                fetch(`${API_BASE_URL}/patients/`)
            ]);

            if (!itemsRes.ok)    throw new Error("Failed to load items.");
            if (!patientsRes.ok) throw new Error("Failed to load patients.");

            allItems    = await itemsRes.json();
            allPatients = await patientsRes.json();
            populateModalDropdowns();
        } catch (error) {
            console.error("Dropdown error:", error);
            addItemSelect.innerHTML     = `<option value="">Failed to load items</option>`;
            editItemSelect.innerHTML    = `<option value="">Failed to load items</option>`;
            addPatientSelect.innerHTML  = `<option value="">Failed to load patients</option>`;
            editPatientSelect.innerHTML = `<option value="">Failed to load patients</option>`;
        }
    }

    // ─── Form Submissions ─────────────────────────────────────────────────────

    async function submitIssuanceForm(event) {
        event.preventDefault();
        clearFormMessage(addIssuanceMessage);
        saveIssuanceButton.disabled    = true;
        saveIssuanceButton.textContent = "Saving...";

        try {
            const formData = new FormData(addIssuanceForm);
            const payload  = Object.fromEntries(formData.entries());

            const response = await fetch(`${API_BASE_URL}/issuances/`, {
                method:  "POST",
                headers: { "Content-Type": "application/json", "X-CSRFToken": getCookie("csrftoken") },
                body:    JSON.stringify(payload)
            });

            if (!response.ok) {
                let errorMessage = "Failed to save issuance.";
                try {
                    const errorData = await response.json();
                    errorMessage = JSON.stringify(errorData);
                } catch {
                    errorMessage = `Failed to save issuance. Status: ${response.status}`;
                }
                throw new Error(errorMessage);
            }

            showFormMessage(addIssuanceMessage, "Issuance added successfully.", "success");
            await loadIssuances();
            setTimeout(() => { closeModal(); }, 800);

        } catch (error) {
            console.error("Add issuance error:", error);
            showFormMessage(addIssuanceMessage, error.message, "error");
        } finally {
            saveIssuanceButton.disabled    = false;
            saveIssuanceButton.textContent = "Save Issuance";
        }
    }

    async function submitEditIssuanceForm(event) {
        event.preventDefault();
        clearFormMessage(editIssuanceMessage);
        updateIssuanceButton.disabled    = true;
        updateIssuanceButton.textContent = "Updating...";

        try {
            const pk       = editIssuancePk.value;
            const formData = new FormData(editIssuanceForm);
            const payload  = Object.fromEntries(formData.entries());

            const response = await fetch(`${API_BASE_URL}/issuances/${pk}/`, {
                method:  "PATCH",
                headers: { "Content-Type": "application/json", "X-CSRFToken": getCookie("csrftoken") },
                body:    JSON.stringify(payload)
            });

            if (!response.ok) {
                let errorMessage = "Failed to update issuance.";
                try {
                    const errorData = await response.json();
                    errorMessage = JSON.stringify(errorData);
                } catch {
                    errorMessage = `Failed to update issuance. Status: ${response.status}`;
                }
                throw new Error(errorMessage);
            }

            showFormMessage(editIssuanceMessage, "Issuance updated successfully.", "success");
            await loadIssuances();
            setTimeout(() => { closeEditModal(); }, 800);

        } catch (error) {
            console.error("Edit issuance error:", error);
            showFormMessage(editIssuanceMessage, error.message, "error");
        } finally {
            updateIssuanceButton.disabled    = false;
            updateIssuanceButton.textContent = "Update Issuance";
        }
    }

    async function confirmDeleteIssuance() {
        clearFormMessage(deleteIssuanceMessage);
        confirmDeleteIssuanceButton.disabled    = true;
        confirmDeleteIssuanceButton.textContent = "Deleting...";

        try {
            const pk       = deleteIssuancePk.value;
            const response = await fetch(`${API_BASE_URL}/issuances/${pk}/delete/`, {
                method: "DELETE",
                headers: { "X-CSRFToken": getCookie("csrftoken") }
            });

            if (!response.ok) {
                let errorMessage = "Failed to delete issuance.";
                try {
                    const errorData = await response.json();
                    errorMessage = JSON.stringify(errorData);
                } catch {
                    errorMessage = `Failed to delete issuance. Status: ${response.status}`;
                }
                throw new Error(errorMessage);
            }

            showFormMessage(deleteIssuanceMessage, "Issuance deleted successfully.", "success");
            await loadIssuances();
            setTimeout(() => { closeDeleteModal(); }, 800);

        } catch (error) {
            console.error("Delete issuance error:", error);
            showFormMessage(deleteIssuanceMessage, error.message, "error");
        } finally {
            confirmDeleteIssuanceButton.disabled    = false;
            confirmDeleteIssuanceButton.textContent = "Delete Issuance";
        }
    }

    // ─── Event Listeners ──────────────────────────────────────────────────────

    issuanceSearch.addEventListener("input",  applyFilters);
    itemFilter.addEventListener("input",      applyFilters);
    patientFilter.addEventListener("input",   applyFilters);

    resetFilters.addEventListener("click", () => {
        issuanceSearch.value = "";
        itemFilter.value     = "";
        patientFilter.value  = "";
        renderIssuances(allIssuances);
    });

    openAddIssuanceModal.addEventListener("click", openModal);
    closeAddIssuanceModal.addEventListener("click", closeModal);
    cancelAddIssuance.addEventListener("click", closeModal);
    addIssuanceModal.addEventListener("click", (event) => {
        if (event.target === addIssuanceModal) closeModal();
    });

    closeViewIssuanceModal.addEventListener("click", closeViewModal);
    viewIssuanceDoneButton.addEventListener("click", closeViewModal);
    viewIssuanceModal.addEventListener("click", (event) => {
        if (event.target === viewIssuanceModal) closeViewModal();
    });

    closeEditIssuanceModal.addEventListener("click", closeEditModal);
    cancelEditIssuance.addEventListener("click", closeEditModal);
    editIssuanceModal.addEventListener("click", (event) => {
        if (event.target === editIssuanceModal) closeEditModal();
    });

    closeDeleteIssuanceModal.addEventListener("click", closeDeleteModal);
    cancelDeleteIssuance.addEventListener("click", closeDeleteModal);
    confirmDeleteIssuanceButton.addEventListener("click", confirmDeleteIssuance);
    deleteIssuanceModal.addEventListener("click", (event) => {
        if (event.target === deleteIssuanceModal) closeDeleteModal();
    });

    addIssuanceForm.addEventListener("submit", submitIssuanceForm);
    editIssuanceForm.addEventListener("submit", submitEditIssuanceForm);

    // ─── Init ─────────────────────────────────────────────────────────────────

    loadIssuances();
    loadDropdownData();

});