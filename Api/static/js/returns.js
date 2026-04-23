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

let allReturns  = [];
let allItems    = [];
let allPatients = [];

document.addEventListener("DOMContentLoaded", () => {

    // ─── DOM Elements ─────────────────────────────────────────────────────────

    const returnTableBody = document.getElementById("returnTableBody");
    const returnSummary   = document.getElementById("returnSummary");
    const returnSearch    = document.getElementById("returnSearch");
    const itemFilter      = document.getElementById("itemFilter");
    const patientFilter   = document.getElementById("patientFilter");
    const resetFilters    = document.getElementById("resetFilters");

    // Add Modal
    const openAddReturnModal  = document.getElementById("openAddReturnModal");
    const addReturnModal      = document.getElementById("addReturnModal");
    const closeAddReturnModal = document.getElementById("closeAddReturnModal");
    const cancelAddReturn     = document.getElementById("cancelAddReturn");
    const addReturnForm       = document.getElementById("addReturnForm");
    const addReturnMessage    = document.getElementById("addReturnMessage");
    const saveReturnButton    = document.getElementById("saveReturnButton");
    const addItemSelect       = document.getElementById("add_item");
    const addPatientSelect    = document.getElementById("add_patient");

    // View Modal
    const viewReturnModal         = document.getElementById("viewReturnModal");
    const closeViewReturnModal    = document.getElementById("closeViewReturnModal");
    const viewReturnDoneButton    = document.getElementById("viewReturnDoneButton");
    const viewReturnIdHeader      = document.getElementById("viewReturnIdHeader");
    const viewCreatedAtHeader     = document.getElementById("viewCreatedAtHeader");
    const viewLinkedItemId        = document.getElementById("viewLinkedItemId");
    const viewLinkedItemName      = document.getElementById("viewLinkedItemName");
    const viewLinkedPatientId     = document.getElementById("viewLinkedPatientId");
    const viewLinkedPatientName   = document.getElementById("viewLinkedPatientName");
    const viewCreatedAt           = document.getElementById("viewCreatedAt");

    // Edit Modal
    const editReturnModal      = document.getElementById("editReturnModal");
    const closeEditReturnModal = document.getElementById("closeEditReturnModal");
    const cancelEditReturn     = document.getElementById("cancelEditReturn");
    const editReturnForm       = document.getElementById("editReturnForm");
    const editReturnMessage    = document.getElementById("editReturnMessage");
    const updateReturnButton   = document.getElementById("updateReturnButton");
    const editReturnPk         = document.getElementById("edit_return_pk");
    const editReturnId         = document.getElementById("edit_return_id");
    const editItemSelect       = document.getElementById("edit_item");
    const editPatientSelect    = document.getElementById("edit_patient");

    // Delete Modal
    const deleteReturnModal         = document.getElementById("deleteReturnModal");
    const closeDeleteReturnModal    = document.getElementById("closeDeleteReturnModal");
    const cancelDeleteReturn        = document.getElementById("cancelDeleteReturn");
    const confirmDeleteReturnButton = document.getElementById("confirmDeleteReturnButton");
    const deleteReturnPk            = document.getElementById("delete_return_pk");
    const deleteReturnName          = document.getElementById("deleteReturnName");
    const deleteReturnIdDisplay     = document.getElementById("deleteReturnIdDisplay");
    const deleteReturnMessage       = document.getElementById("deleteReturnMessage");

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
        addReturnModal.classList.remove("hidden");
        addReturnModal.classList.add("flex");
        document.body.classList.add("overflow-hidden");
        clearFormMessage(addReturnMessage);
    }

    function closeModal() {
        addReturnModal.classList.add("hidden");
        addReturnModal.classList.remove("flex");
        document.body.classList.remove("overflow-hidden");
        addReturnForm.reset();
        clearFormMessage(addReturnMessage);
    }

    // ─── View Modal ───────────────────────────────────────────────────────────

    function openViewModal() {
        viewReturnModal.classList.remove("hidden");
        viewReturnModal.classList.add("flex");
        document.body.classList.add("overflow-hidden");
    }

    function closeViewModal() {
        viewReturnModal.classList.add("hidden");
        viewReturnModal.classList.remove("flex");
        document.body.classList.remove("overflow-hidden");
    }

    // ─── Edit Modal ───────────────────────────────────────────────────────────

    function openEditModal() {
        editReturnModal.classList.remove("hidden");
        editReturnModal.classList.add("flex");
        document.body.classList.add("overflow-hidden");
        clearFormMessage(editReturnMessage);
    }

    function closeEditModal() {
        editReturnModal.classList.add("hidden");
        editReturnModal.classList.remove("flex");
        document.body.classList.remove("overflow-hidden");
        editReturnForm.reset();
        clearFormMessage(editReturnMessage);
    }

    // ─── Delete Modal ─────────────────────────────────────────────────────────

    function openDeleteModal() {
        deleteReturnModal.classList.remove("hidden");
        deleteReturnModal.classList.add("flex");
        document.body.classList.add("overflow-hidden");
        clearFormMessage(deleteReturnMessage);
    }

    function closeDeleteModal() {
        deleteReturnModal.classList.add("hidden");
        deleteReturnModal.classList.remove("flex");
        document.body.classList.remove("overflow-hidden");
        deleteReturnPk.value              = "";
        deleteReturnName.textContent      = "-";
        deleteReturnIdDisplay.textContent = "-";
        clearFormMessage(deleteReturnMessage);
    }

    // ─── Filters ──────────────────────────────────────────────────────────────

    function populateFilters(returns) {
        const items    = [...new Set(returns.map(r => r.item_name).filter(Boolean))].sort();
        const patients = [...new Set(returns.map(r => r.patient_name).filter(Boolean))].sort();

        itemFilter.innerHTML    = `<option value="">All Items</option>`;
        patientFilter.innerHTML = `<option value="">All Patients</option>`;

        items.forEach(name => {
            itemFilter.innerHTML += `<option value="${name}">${name}</option>`;
        });

        patients.forEach(name => {
            patientFilter.innerHTML += `<option value="${name}">${name}</option>`;
        });
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
        const searchValue     = returnSearch.value.trim().toLowerCase();
        const selectedItem    = itemFilter.value;
        const selectedPatient = patientFilter.value;

        const filtered = allReturns.filter(r => {
            const returnIdStr    = (r.return_id    ?? "").toLowerCase();
            const itemNameStr    = (r.item_name    ?? "").toLowerCase();
            const patientNameStr = (r.patient_name ?? "").toLowerCase();

            const matchesSearch  = returnIdStr.includes(searchValue)
                                || itemNameStr.includes(searchValue)
                                || patientNameStr.includes(searchValue);
            const matchesItem    = !selectedItem    || r.item_name    === selectedItem;
            const matchesPatient = !selectedPatient || r.patient_name === selectedPatient;

            return matchesSearch && matchesItem && matchesPatient;
        });

        renderReturns(filtered);
    }

    // ─── Render ───────────────────────────────────────────────────────────────

    function renderReturns(returns) {
        if (!returns.length) {
            returnTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="px-6 py-10 text-center text-sm text-slate-500">
                        No return records found.
                    </td>
                </tr>
            `;
            returnSummary.innerHTML = `Showing <span class="font-semibold">0</span> returns`;
            return;
        }

        returnTableBody.innerHTML = returns.map(r => `
            <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                        <div class="size-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                            <span class="material-symbols-outlined text-lg">assignment_return</span>
                        </div>
                        <p class="font-bold text-slate-900 dark:text-slate-100">${r.return_id}</p>
                    </div>
                </td>
                <td class="px-6 py-4">
                    <p class="text-sm font-semibold text-slate-700 dark:text-slate-200">${r.item_name ?? "-"}</p>
                    <p class="text-xs text-slate-500">${r.item_id_code ?? "-"}</p>
                </td>
                <td class="px-6 py-4">
                    <p class="text-sm font-semibold text-slate-700 dark:text-slate-200">${r.patient_name ?? "-"}</p>
                    <p class="text-xs text-slate-500">${r.patient_id_code ?? "-"}</p>
                </td>
                <td class="px-6 py-4">
                    <p class="text-sm text-slate-600 dark:text-slate-300">${formatDateTime(r.created_at)}</p>
                </td>
                <td class="px-6 py-4 text-right">
                    <div class="flex justify-end gap-2">
                        <button class="view-return-btn p-2 text-slate-400 hover:text-primary transition-colors" title="View" data-return-id="${r.id}">
                            <span class="material-symbols-outlined">visibility</span>
                        </button>
                        <button class="edit-return-btn p-2 text-slate-400 hover:text-blue-500 transition-colors" title="Edit" data-return-id="${r.id}">
                            <span class="material-symbols-outlined">edit</span>
                        </button>
                        <button class="delete-return-btn p-2 text-slate-400 hover:text-red-500 transition-colors" title="Delete" data-return-id="${r.id}">
                            <span class="material-symbols-outlined">delete</span>
                        </button>
                    </div>
                </td>
            </tr>
        `).join("");

        returnSummary.innerHTML = `Showing <span class="font-semibold">${returns.length}</span> return${returns.length > 1 ? "s" : ""}`;
        bindViewButtons();
        bindEditButtons();
        bindDeleteButtons();
    }

    // ─── Fill View Modal ──────────────────────────────────────────────────────

    function fillViewModal(r) {
        viewReturnIdHeader.textContent    = r.return_id      ?? "-";
        viewCreatedAtHeader.textContent   = formatDateTime(r.created_at);
        viewLinkedItemId.textContent      = r.item_id_code   ?? "-";
        viewLinkedItemName.textContent    = r.item_name      ?? "-";
        viewLinkedPatientId.textContent   = r.patient_id_code ?? "-";
        viewLinkedPatientName.textContent = r.patient_name   ?? "-";
        viewCreatedAt.textContent         = formatDateTime(r.created_at);
    }

    function bindViewButtons() {
        document.querySelectorAll(".view-return-btn").forEach(button => {
            button.addEventListener("click", () => {
                const pk       = Number(button.getAttribute("data-return-id"));
                const selected = allReturns.find(r => r.id === pk);
                if (!selected) return;
                fillViewModal(selected);
                openViewModal();
            });
        });
    }

    // ─── Fill Edit Modal ──────────────────────────────────────────────────────

    function fillEditModal(r) {
        editReturnPk.value       = r.id;
        editReturnId.value       = r.return_id ?? "";
        editItemSelect.value     = r.item    != null ? String(r.item)    : "";
        editPatientSelect.value  = r.patient != null ? String(r.patient) : "";
    }

    function bindEditButtons() {
        document.querySelectorAll(".edit-return-btn").forEach(button => {
            button.addEventListener("click", () => {
                const pk       = Number(button.getAttribute("data-return-id"));
                const selected = allReturns.find(r => r.id === pk);
                if (!selected) return;
                fillEditModal(selected);
                openEditModal();
            });
        });
    }

    // ─── Fill Delete Modal ────────────────────────────────────────────────────

    function fillDeleteModal(r) {
        deleteReturnPk.value              = r.id;
        deleteReturnName.textContent      = r.return_id ?? "-";
        deleteReturnIdDisplay.textContent = `Item: ${r.item_name ?? "-"} · Patient: ${r.patient_name ?? "-"}`;
    }

    function bindDeleteButtons() {
        document.querySelectorAll(".delete-return-btn").forEach(button => {
            button.addEventListener("click", () => {
                const pk       = Number(button.getAttribute("data-return-id"));
                const selected = allReturns.find(r => r.id === pk);
                if (!selected) return;
                fillDeleteModal(selected);
                openDeleteModal();
            });
        });
    }

    // ─── Data Fetching ────────────────────────────────────────────────────────

    async function loadReturns() {
        try {
            const response = await fetch(`${API_BASE_URL}/return/`);
            if (!response.ok) throw new Error(`Failed to fetch returns: ${response.status}`);
            allReturns = await response.json();
            populateFilters(allReturns);
            renderReturns(allReturns);
        } catch (error) {
            console.error("Return error:", error);
            returnTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="px-6 py-10 text-center text-sm text-red-500">
                        Failed to load returns.
                    </td>
                </tr>
            `;
            returnSummary.innerHTML = `Showing <span class="font-semibold">0</span> returns`;
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

    async function submitReturnForm(event) {
        event.preventDefault();
        clearFormMessage(addReturnMessage);
        saveReturnButton.disabled    = true;
        saveReturnButton.textContent = "Saving...";

        try {
            const formData = new FormData(addReturnForm);
            const payload  = Object.fromEntries(formData.entries());

            const response = await fetch(`${API_BASE_URL}/return/`, {
                method:  "POST",
                headers: { "Content-Type": "application/json", "X-CSRFToken": getCookie("csrftoken") },
                body:    JSON.stringify(payload)
            });

            if (!response.ok) {
                let errorMessage = "Failed to save return.";
                try {
                    const errorData = await response.json();
                    errorMessage = JSON.stringify(errorData);
                } catch {
                    errorMessage = `Failed to save return. Status: ${response.status}`;
                }
                throw new Error(errorMessage);
            }

            showFormMessage(addReturnMessage, "Return added successfully.", "success");
            await loadReturns();
            setTimeout(() => { closeModal(); }, 800);

        } catch (error) {
            console.error("Add return error:", error);
            showFormMessage(addReturnMessage, error.message, "error");
        } finally {
            saveReturnButton.disabled    = false;
            saveReturnButton.textContent = "Save Return";
        }
    }

    async function submitEditReturnForm(event) {
        event.preventDefault();
        clearFormMessage(editReturnMessage);
        updateReturnButton.disabled    = true;
        updateReturnButton.textContent = "Updating...";

        try {
            const pk       = editReturnPk.value;
            const formData = new FormData(editReturnForm);
            const payload  = Object.fromEntries(formData.entries());

            const response = await fetch(`${API_BASE_URL}/return/${pk}/`, {
                method:  "PATCH",
                headers: { "Content-Type": "application/json", "X-CSRFToken": getCookie("csrftoken") },
                body:    JSON.stringify(payload)
            });

            if (!response.ok) {
                let errorMessage = "Failed to update return.";
                try {
                    const errorData = await response.json();
                    errorMessage = JSON.stringify(errorData);
                } catch {
                    errorMessage = `Failed to update return. Status: ${response.status}`;
                }
                throw new Error(errorMessage);
            }

            showFormMessage(editReturnMessage, "Return updated successfully.", "success");
            await loadReturns();
            setTimeout(() => { closeEditModal(); }, 800);

        } catch (error) {
            console.error("Edit return error:", error);
            showFormMessage(editReturnMessage, error.message, "error");
        } finally {
            updateReturnButton.disabled    = false;
            updateReturnButton.textContent = "Update Return";
        }
    }

    async function confirmDeleteReturn() {
        clearFormMessage(deleteReturnMessage);
        confirmDeleteReturnButton.disabled    = true;
        confirmDeleteReturnButton.textContent = "Deleting...";

        try {
            const pk       = deleteReturnPk.value;
            const response = await fetch(`${API_BASE_URL}/return/${pk}/delete/`, {
                method: "DELETE",
                headers: { "X-CSRFToken": getCookie("csrftoken") }
            });

            if (!response.ok) {
                let errorMessage = "Failed to delete return.";
                try {
                    const errorData = await response.json();
                    errorMessage = JSON.stringify(errorData);
                } catch {
                    errorMessage = `Failed to delete return. Status: ${response.status}`;
                }
                throw new Error(errorMessage);
            }

            showFormMessage(deleteReturnMessage, "Return deleted successfully.", "success");
            await loadReturns();
            setTimeout(() => { closeDeleteModal(); }, 800);

        } catch (error) {
            console.error("Delete return error:", error);
            showFormMessage(deleteReturnMessage, error.message, "error");
        } finally {
            confirmDeleteReturnButton.disabled    = false;
            confirmDeleteReturnButton.textContent = "Delete Return";
        }
    }

    // ─── Event Listeners ──────────────────────────────────────────────────────

    returnSearch.addEventListener("input",   applyFilters);
    itemFilter.addEventListener("change",    applyFilters);
    patientFilter.addEventListener("change", applyFilters);

    resetFilters.addEventListener("click", () => {
        returnSearch.value  = "";
        itemFilter.value    = "";
        patientFilter.value = "";
        renderReturns(allReturns);
    });

    openAddReturnModal.addEventListener("click", openModal);
    closeAddReturnModal.addEventListener("click", closeModal);
    cancelAddReturn.addEventListener("click", closeModal);
    addReturnModal.addEventListener("click", (event) => {
        if (event.target === addReturnModal) closeModal();
    });

    closeViewReturnModal.addEventListener("click", closeViewModal);
    viewReturnDoneButton.addEventListener("click", closeViewModal);
    viewReturnModal.addEventListener("click", (event) => {
        if (event.target === viewReturnModal) closeViewModal();
    });

    closeEditReturnModal.addEventListener("click", closeEditModal);
    cancelEditReturn.addEventListener("click", closeEditModal);
    editReturnModal.addEventListener("click", (event) => {
        if (event.target === editReturnModal) closeEditModal();
    });

    closeDeleteReturnModal.addEventListener("click", closeDeleteModal);
    cancelDeleteReturn.addEventListener("click", closeDeleteModal);
    confirmDeleteReturnButton.addEventListener("click", confirmDeleteReturn);
    deleteReturnModal.addEventListener("click", (event) => {
        if (event.target === deleteReturnModal) closeDeleteModal();
    });

    addReturnForm.addEventListener("submit", submitReturnForm);
    editReturnForm.addEventListener("submit", submitEditReturnForm);

    // ─── Init ─────────────────────────────────────────────────────────────────

    loadReturns();
    loadDropdownData();

});