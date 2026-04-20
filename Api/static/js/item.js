const API_BASE_URL = "http://127.0.0.1:8000/api";

let allItems = [];

// DOM Elements
const itemTableBody = document.getElementById("itemTableBody");
const itemSummary   = document.getElementById("itemSummary");
const itemSearch    = document.getElementById("itemSearch");
const typeFilter    = document.getElementById("typeFilter");
const statusFilter  = document.getElementById("statusFilter");
const resetFilters  = document.getElementById("resetFilters");

// ─── Helpers ────────────────────────────────────────────────────────────────

function getInitials(itemName = "") {
    return itemName.charAt(0).toUpperCase();
}

// ─── Filters ─────────────────────────────────────────────────────────────────

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

function applyFilters() {
    const searchValue    = itemSearch.value.trim().toLowerCase();
    const selectedType   = typeFilter.value;
    const selectedStatus = statusFilter.value;

    const filtered = allItems.filter(i => {
        const itemName = (i.item_name ?? "").toLowerCase();
        const itemId   = (i.item_id   ?? "").toLowerCase();

        const matchesSearch = itemName.includes(searchValue) || itemId.includes(searchValue);
        const matchesType   = !selectedType   || i.item_type_name === selectedType;
        const matchesStatus = !selectedStatus || i.status_name    === selectedStatus;

        return matchesSearch && matchesType && matchesStatus;
    });

    renderItems(filtered);
}

// ─── Render ──────────────────────────────────────────────────────────────────

function renderItems(items) {
    if (!items.length) {
        itemTableBody.innerHTML = `
            <tr>
                <td colspan="4" class="px-6 py-10 text-center text-sm text-slate-500">
                    No item records found.
                </td>
            </tr>
        `;
        itemSummary.innerHTML = `Showing <span class="font-semibold">0</span> items`;
        return;
    }

    itemTableBody.innerHTML = items.map(i => {
        const photoHtml = i.photo
            ? `<img
                    src="${i.photo}"
                    alt="${i.item_name}"
                    class="size-10 rounded-full bg-slate-100 object-cover"
                />`
            : `<div class="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                    ${getInitials(i.item_name)}
                </div>`;

        return `
            <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">

                <!-- Name & ID -->
                <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                        ${photoHtml}
                        <div>
                            <p class="font-bold text-slate-900 dark:text-slate-100">${i.item_name}</p>
                            <p class="text-xs text-slate-500">ID: ${i.item_id}</p>
                        </div>
                    </div>
                </td>

                <!-- Type & Status -->
                <td class="px-6 py-4">
                    <div class="text-sm">
                        <p class="font-semibold text-slate-700 dark:text-slate-200">${i.item_type_name ?? "-"}</p>
                        <p class="text-xs text-slate-500">${i.status_name     ?? "-"}</p>
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

    itemSummary.innerHTML = `Showing <span class="font-semibold">${items.length}</span> item${items.length > 1 ? "s" : ""}`;
}

// ─── Data Fetching ───────────────────────────────────────────────────────────

async function loadItems() {
    try {
        const response = await fetch(`${API_BASE_URL}/items/`);

        if (!response.ok) {
            throw new Error("Failed to fetch items");
        }

        allItems = await response.json();
        populateFilters(allItems);
        renderItems(allItems);

    } catch (error) {
        itemTableBody.innerHTML = `
            <tr>
                <td colspan="4" class="px-6 py-10 text-center text-sm text-red-500">
                    Failed to load items.
                </td>
            </tr>
        `;
        itemSummary.innerHTML = `Showing <span class="font-semibold">0</span> items`;
        console.error("Items error:", error);
    }
}

// ─── Event Listeners ─────────────────────────────────────────────────────────

itemSearch.addEventListener("input", applyFilters);
typeFilter.addEventListener("change", applyFilters);
statusFilter.addEventListener("change", applyFilters);

resetFilters.addEventListener("click", () => {
    itemSearch.value   = "";
    typeFilter.value   = "";
    statusFilter.value = "";
    renderItems(allItems);
});

// ─── Init ────────────────────────────────────────────────────────────────────

loadItems();