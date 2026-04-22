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

let allItems    = [];
let allStatuses = [];
let allTypes    = [];

document.addEventListener("DOMContentLoaded", () => {

    // ─── DOM Elements ─────────────────────────────────────────────────────────

    const itemTableBody = document.getElementById("itemTableBody");
    const itemSummary   = document.getElementById("itemSummary");
    const itemSearch    = document.getElementById("itemSearch");
    const typeFilter    = document.getElementById("typeFilter");
    const statusFilter  = document.getElementById("statusFilter");
    const resetFilters  = document.getElementById("resetFilters");

    // Add Modal
    const openAddItemModal  = document.getElementById("openAddItemModal");
    const addItemModal      = document.getElementById("addItemModal");
    const closeAddItemModal = document.getElementById("closeAddItemModal");
    const cancelAddItem     = document.getElementById("cancelAddItem");
    const addItemForm       = document.getElementById("addItemForm");
    const addItemMessage    = document.getElementById("addItemMessage");
    const saveItemButton    = document.getElementById("saveItemButton");
    const modalStatus       = document.getElementById("modalStatus");
    const modalItemType     = document.getElementById("item_type");

    // View Modal
    const viewItemModal       = document.getElementById("viewItemModal");
    const closeViewItemModal  = document.getElementById("closeViewItemModal");
    const viewItemDoneButton  = document.getElementById("viewItemDoneButton");
    const viewItemPhotoWrapper = document.getElementById("viewItemPhotoWrapper");
    const viewItemName        = document.getElementById("viewItemName");
    const viewItemId          = document.getElementById("viewItemId");
    const viewTypeBadge       = document.getElementById("viewTypeBadge");
    const viewStatusBadge     = document.getElementById("viewStatusBadge");
    const viewItemIdDetail    = document.getElementById("viewItemIdDetail");
    const viewItemNameDetail  = document.getElementById("viewItemNameDetail");
    const viewItemType        = document.getElementById("viewItemType");
    const viewStatusText      = document.getElementById("viewStatusText");
    const viewCreatedAt       = document.getElementById("viewCreatedAt");

    // Edit Modal
    const editItemModal      = document.getElementById("editItemModal");
    const closeEditItemModal = document.getElementById("closeEditItemModal");
    const cancelEditItem     = document.getElementById("cancelEditItem");
    const editItemForm       = document.getElementById("editItemForm");
    const editItemMessage    = document.getElementById("editItemMessage");
    const updateItemButton   = document.getElementById("updateItemButton");
    const editItemPk         = document.getElementById("edit_item_pk");
    const editItemId         = document.getElementById("edit_item_id");
    const editItemName       = document.getElementById("edit_item_name");
    const editItemType       = document.getElementById("edit_item_type");
    const editModalStatus    = document.getElementById("edit_modalStatus");
    const editPhoto          = document.getElementById("edit_photo");

    // Delete Modal
    const deleteItemModal         = document.getElementById("deleteItemModal");
    const closeDeleteItemModal    = document.getElementById("closeDeleteItemModal");
    const cancelDeleteItem        = document.getElementById("cancelDeleteItem");
    const confirmDeleteItemButton = document.getElementById("confirmDeleteItemButton");
    const deleteItemPk            = document.getElementById("delete_item_pk");
    const deleteItemName          = document.getElementById("deleteItemName");
    const deleteItemIdDisplay     = document.getElementById("deleteItemIdDisplay");
    const deleteItemMessage       = document.getElementById("deleteItemMessage");

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
        addItemModal.classList.remove("hidden");
        addItemModal.classList.add("flex");
        document.body.classList.add("overflow-hidden");
        clearFormMessage(addItemMessage);
    }

    function closeModal() {
        addItemModal.classList.add("hidden");
        addItemModal.classList.remove("flex");
        document.body.classList.remove("overflow-hidden");
        addItemForm.reset();
        clearFormMessage(addItemMessage);
    }

    // ─── View Modal ───────────────────────────────────────────────────────────

    function openViewModal() {
        viewItemModal.classList.remove("hidden");
        viewItemModal.classList.add("flex");
        document.body.classList.add("overflow-hidden");
    }

    function closeViewModal() {
        viewItemModal.classList.add("hidden");
        viewItemModal.classList.remove("flex");
        document.body.classList.remove("overflow-hidden");
    }

    // ─── Edit Modal ───────────────────────────────────────────────────────────

    function openEditModal() {
        editItemModal.classList.remove("hidden");
        editItemModal.classList.add("flex");
        document.body.classList.add("overflow-hidden");
        clearFormMessage(editItemMessage);
    }

    function closeEditModal() {
        editItemModal.classList.add("hidden");
        editItemModal.classList.remove("flex");
        document.body.classList.remove("overflow-hidden");
        editItemForm.reset();
        clearFormMessage(editItemMessage);
    }

    // ─── Delete Modal ─────────────────────────────────────────────────────────

    function openDeleteModal() {
        deleteItemModal.classList.remove("hidden");
        deleteItemModal.classList.add("flex");
        document.body.classList.add("overflow-hidden");
        clearFormMessage(deleteItemMessage);
    }

    function closeDeleteModal() {
        deleteItemModal.classList.add("hidden");
        deleteItemModal.classList.remove("flex");
        document.body.classList.remove("overflow-hidden");
        deleteItemPk.value               = "";
        deleteItemName.textContent       = "-";
        deleteItemIdDisplay.textContent  = "-";
        clearFormMessage(deleteItemMessage);
    }

    // ─── Filters ──────────────────────────────────────────────────────────────

    function populateFilters(items) {
        const types    = [...new Set(items.map(i => i.item_type_name).filter(Boolean))].sort();
        const statuses = [...new Set(items.map(i => i.status_name).filter(Boolean))].sort();

        typeFilter.innerHTML   = `<option value="">All Types</option>`;
        statusFilter.innerHTML = `<option value="">All Statuses</option>`;

        types.forEach(type => {
            typeFilter.innerHTML += `<option value="${type}">${type}</option>`;
        });

        statuses.forEach(status => {
            statusFilter.innerHTML += `<option value="${status}">${status}</option>`;
        });
    }

    function populateModalDropdowns() {
        // Statuses
        modalStatus.innerHTML    = `<option value="">Select status</option>`;
        editModalStatus.innerHTML = `<option value="">Select status</option>`;
        allStatuses.forEach(status => {
            modalStatus.innerHTML     += `<option value="${status.id}">${status.status_name}</option>`;
            editModalStatus.innerHTML += `<option value="${status.id}">${status.status_name}</option>`;
        });

        // Item Types
        modalItemType.innerHTML  = `<option value="">Select type</option>`;
        editItemType.innerHTML   = `<option value="">Select type</option>`;
        allTypes.forEach(type => {
            modalItemType.innerHTML += `<option value="${type.id}">${type.type_name}</option>`;
            editItemType.innerHTML  += `<option value="${type.id}">${type.type_name}</option>`;
        });
    }

    function applyFilters() {
        const searchValue    = itemSearch.value.trim().toLowerCase();
        const selectedType   = typeFilter.value;
        const selectedStatus = statusFilter.value;

        const filtered = allItems.filter(i => {
            const itemIdStr   = (i.item_id   ?? "").toLowerCase();
            const itemNameStr = (i.item_name ?? "").toLowerCase();

            const matchesSearch = itemIdStr.includes(searchValue) || itemNameStr.includes(searchValue);
            const matchesType   = !selectedType   || i.item_type_name === selectedType;
            const matchesStatus = !selectedStatus || i.status_name    === selectedStatus;

            return matchesSearch && matchesType && matchesStatus;
        });

        renderItems(filtered);
    }

    // ─── Render ───────────────────────────────────────────────────────────────

    function renderItems(items) {
        if (!items.length) {
            itemTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="px-6 py-10 text-center text-sm text-slate-500">
                        No item records found.
                    </td>
                </tr>
            `;
            itemSummary.innerHTML = `Showing <span class="font-semibold">0</span> items`;
            return;
        }

        itemTableBody.innerHTML = items.map(i => {
            const photoHtml = i.photo
                ? `<img src="${i.photo}" alt="${i.item_name}" class="size-10 rounded-lg bg-slate-100 object-cover" />`
                : `<div class="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center"><span class="material-symbols-outlined text-lg">inventory_2</span></div>`;

            return `
                <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td class="px-6 py-4">
                        <div class="flex items-center gap-3">
                            ${photoHtml}
                            <div>
                                <p class="font-bold text-slate-900 dark:text-slate-100">${i.item_name}</p>
                                <p class="text-xs text-slate-500">ID: ${i.item_id}</p>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            ${i.item_type_name ?? "-"}
                        </span>
                    </td>
                    <td class="px-6 py-4">
                        <p class="text-sm text-slate-600 dark:text-slate-300">${formatDateTime(i.created_at)}</p>
                    </td>
                    <td class="px-6 py-4">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                            ${i.status_name ?? "-"}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-right">
                        <div class="flex justify-end gap-2">
                            <button class="view-item-btn p-2 text-slate-400 hover:text-primary transition-colors" title="View" data-item-id="${i.id}">
                                <span class="material-symbols-outlined">visibility</span>
                            </button>
                            <button class="edit-item-btn p-2 text-slate-400 hover:text-blue-500 transition-colors" title="Edit" data-item-id="${i.id}">
                                <span class="material-symbols-outlined">edit</span>
                            </button>
                            <button class="delete-item-btn p-2 text-slate-400 hover:text-red-500 transition-colors" title="Delete" data-item-id="${i.id}">
                                <span class="material-symbols-outlined">delete</span>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join("");

        itemSummary.innerHTML = `Showing <span class="font-semibold">${items.length}</span> item${items.length > 1 ? "s" : ""}`;
        bindViewButtons();
        bindEditButtons();
        bindDeleteButtons();
    }

    // ─── Fill View Modal ──────────────────────────────────────────────────────

    function fillViewModal(i) {
        viewItemName.textContent       = i.item_name  ?? "-";
        viewItemId.textContent         = `Item ID: ${i.item_id ?? "-"}`;
        viewItemIdDetail.textContent   = i.item_id    ?? "-";
        viewItemNameDetail.textContent = i.item_name  ?? "-";
        viewItemType.textContent       = i.item_type_name ?? "-";
        viewStatusText.textContent     = i.status_name   ?? "-";
        viewCreatedAt.textContent      = formatDateTime(i.created_at);

        viewTypeBadge.className   = "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700";
        viewTypeBadge.textContent = i.item_type_name ?? "-";

        viewStatusBadge.className   = "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700";
        viewStatusBadge.textContent = i.status_name ?? "-";

        if (i.photo) {
            viewItemPhotoWrapper.innerHTML = `<img src="${i.photo}" alt="${i.item_name}" class="h-full w-full object-cover" />`;
        } else {
            viewItemPhotoWrapper.innerHTML = `<span class="material-symbols-outlined text-4xl">inventory_2</span>`;
        }
    }

    function bindViewButtons() {
        document.querySelectorAll(".view-item-btn").forEach(button => {
            button.addEventListener("click", () => {
                const itemId       = Number(button.getAttribute("data-item-id"));
                const selectedItem = allItems.find(i => i.id === itemId);
                if (!selectedItem) return;
                fillViewModal(selectedItem);
                openViewModal();
            });
        });
    }

    // ─── Fill Edit Modal ──────────────────────────────────────────────────────

    function fillEditModal(i) {
        editItemPk.value      = i.id;
        editItemId.value      = i.item_id    ?? "";
        editItemName.value    = i.item_name  ?? "";
        editItemType.value    = i.item_type  != null ? String(i.item_type)  : "";
        editModalStatus.value = i.status     != null ? String(i.status)     : "";
    }

    function bindEditButtons() {
        document.querySelectorAll(".edit-item-btn").forEach(button => {
            button.addEventListener("click", () => {
                const itemId       = Number(button.getAttribute("data-item-id"));
                const selectedItem = allItems.find(i => i.id === itemId);
                if (!selectedItem) return;
                fillEditModal(selectedItem);
                openEditModal();
            });
        });
    }

    // ─── Fill Delete Modal ────────────────────────────────────────────────────

    function fillDeleteModal(i) {
        deleteItemPk.value              = i.id;
        deleteItemName.textContent      = i.item_name ?? "-";
        deleteItemIdDisplay.textContent = `Item ID: ${i.item_id ?? "-"}`;
    }

    function bindDeleteButtons() {
        document.querySelectorAll(".delete-item-btn").forEach(button => {
            button.addEventListener("click", () => {
                const itemId       = Number(button.getAttribute("data-item-id"));
                const selectedItem = allItems.find(i => i.id === itemId);
                if (!selectedItem) return;
                fillDeleteModal(selectedItem);
                openDeleteModal();
            });
        });
    }

    // ─── Data Fetching ────────────────────────────────────────────────────────

    async function loadItems() {
        try {
            const response = await fetch(`${API_BASE_URL}/items/`);
            if (!response.ok) throw new Error(`Failed to fetch items: ${response.status}`);
            allItems = await response.json();
            populateFilters(allItems);
            renderItems(allItems);
        } catch (error) {
            console.error("Item error:", error);
            itemTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="px-6 py-10 text-center text-sm text-red-500">
                        Failed to load items.
                    </td>
                </tr>
            `;
            itemSummary.innerHTML = `Showing <span class="font-semibold">0</span> items`;
        }
    }

    async function loadDropdownData() {
        try {
            const [statusRes, typeRes] = await Promise.all([
                fetch(`${API_BASE_URL}/item-statuses/`),
                fetch(`${API_BASE_URL}/item-types/`)
            ]);

            if (!statusRes.ok) throw new Error("Failed to load statuses.");
            if (!typeRes.ok)   throw new Error("Failed to load item types.");

            allStatuses = await statusRes.json();
            allTypes    = await typeRes.json();
            populateModalDropdowns();
        } catch (error) {
            console.error("Dropdown error:", error);
            modalStatus.innerHTML    = `<option value="">Failed to load statuses</option>`;
            editModalStatus.innerHTML = `<option value="">Failed to load statuses</option>`;
            modalItemType.innerHTML  = `<option value="">Failed to load types</option>`;
            editItemType.innerHTML   = `<option value="">Failed to load types</option>`;
        }
    }

    // ─── Form Submissions ─────────────────────────────────────────────────────

    async function submitItemForm(event) {
        event.preventDefault();
        clearFormMessage(addItemMessage);
        saveItemButton.disabled    = true;
        saveItemButton.textContent = "Saving...";

        try {
            const formData = new FormData(addItemForm);
            const response = await fetch(`${API_BASE_URL}/items/`, {
                method: "POST",
                headers: { "X-CSRFToken": getCookie("csrftoken") },
                body:   formData
            });

            if (!response.ok) {
                let errorMessage = "Failed to save item.";
                try {
                    const errorData = await response.json();
                    errorMessage = JSON.stringify(errorData);
                } catch {
                    errorMessage = `Failed to save item. Status: ${response.status}`;
                }
                throw new Error(errorMessage);
            }

            showFormMessage(addItemMessage, "Item added successfully.", "success");
            await loadItems();
            setTimeout(() => { closeModal(); }, 800);

        } catch (error) {
            console.error("Add item error:", error);
            showFormMessage(addItemMessage, error.message, "error");
        } finally {
            saveItemButton.disabled    = false;
            saveItemButton.textContent = "Save Item";
        }
    }

    async function submitEditItemForm(event) {
        event.preventDefault();
        clearFormMessage(editItemMessage);
        updateItemButton.disabled    = true;
        updateItemButton.textContent = "Updating...";

        try {
            const itemPk   = editItemPk.value;
            const formData = new FormData(editItemForm);

            if (!editPhoto.files.length) {
                formData.delete("photo");
            }

            const response = await fetch(`${API_BASE_URL}/items/${itemPk}/`, {
                method: "PATCH",
                headers: { "X-CSRFToken": getCookie("csrftoken") },
                body:   formData
            });

            if (!response.ok) {
                let errorMessage = "Failed to update item.";
                try {
                    const errorData = await response.json();
                    errorMessage = JSON.stringify(errorData);
                } catch {
                    errorMessage = `Failed to update item. Status: ${response.status}`;
                }
                throw new Error(errorMessage);
            }

            showFormMessage(editItemMessage, "Item updated successfully.", "success");
            await loadItems();
            setTimeout(() => { closeEditModal(); }, 800);

        } catch (error) {
            console.error("Edit item error:", error);
            showFormMessage(editItemMessage, error.message, "error");
        } finally {
            updateItemButton.disabled    = false;
            updateItemButton.textContent = "Update Item";
        }
    }

    async function confirmDeleteItem() {
        clearFormMessage(deleteItemMessage);
        confirmDeleteItemButton.disabled    = true;
        confirmDeleteItemButton.textContent = "Deleting...";

        try {
            const itemPk   = deleteItemPk.value;
            const response = await fetch(`${API_BASE_URL}/items/${itemPk}/delete/`, {
                method: "DELETE",
                headers: { "X-CSRFToken": getCookie("csrftoken") }
            });

            if (!response.ok) {
                let errorMessage = "Failed to delete item.";
                try {
                    const errorData = await response.json();
                    errorMessage = JSON.stringify(errorData);
                } catch {
                    errorMessage = `Failed to delete item. Status: ${response.status}`;
                }
                throw new Error(errorMessage);
            }

            showFormMessage(deleteItemMessage, "Item deleted successfully.", "success");
            await loadItems();
            setTimeout(() => { closeDeleteModal(); }, 800);

        } catch (error) {
            console.error("Delete item error:", error);
            showFormMessage(deleteItemMessage, error.message, "error");
        } finally {
            confirmDeleteItemButton.disabled    = false;
            confirmDeleteItemButton.textContent = "Delete Item";
        }
    }

    // ─── Event Listeners ──────────────────────────────────────────────────────

    itemSearch.addEventListener("input",   applyFilters);
    typeFilter.addEventListener("change",  applyFilters);
    statusFilter.addEventListener("change", applyFilters);

    resetFilters.addEventListener("click", () => {
        itemSearch.value   = "";
        typeFilter.value   = "";
        statusFilter.value = "";
        renderItems(allItems);
    });

    openAddItemModal.addEventListener("click", openModal);
    closeAddItemModal.addEventListener("click", closeModal);
    cancelAddItem.addEventListener("click", closeModal);
    addItemModal.addEventListener("click", (event) => {
        if (event.target === addItemModal) closeModal();
    });

    closeViewItemModal.addEventListener("click", closeViewModal);
    viewItemDoneButton.addEventListener("click", closeViewModal);
    viewItemModal.addEventListener("click", (event) => {
        if (event.target === viewItemModal) closeViewModal();
    });

    closeEditItemModal.addEventListener("click", closeEditModal);
    cancelEditItem.addEventListener("click", closeEditModal);
    editItemModal.addEventListener("click", (event) => {
        if (event.target === editItemModal) closeEditModal();
    });

    closeDeleteItemModal.addEventListener("click", closeDeleteModal);
    cancelDeleteItem.addEventListener("click", closeDeleteModal);
    confirmDeleteItemButton.addEventListener("click", confirmDeleteItem);
    deleteItemModal.addEventListener("click", (event) => {
        if (event.target === deleteItemModal) closeDeleteModal();
    });

    addItemForm.addEventListener("submit", submitItemForm);
    editItemForm.addEventListener("submit", submitEditItemForm);

    // ─── Init ─────────────────────────────────────────────────────────────────

    loadItems();
    loadDropdownData();

});