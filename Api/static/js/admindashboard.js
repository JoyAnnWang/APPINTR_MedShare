const API_BASE_URL = "http://127.0.0.1:8000/api";

document.addEventListener("DOMContentLoaded", function () {

    // ─── DOM Elements ─────────────────────────────────────────────────────────

    const html               = document.documentElement;
    const themeToggle        = document.getElementById("themeToggle");
    const themeIcon          = document.getElementById("themeIcon");
    const totalStaffsCount   = document.getElementById("totalStaffsCount");
    const totalPatientsCount = document.getElementById("totalPatientsCount");
    const totalItemsCount    = document.getElementById("totalItemsCount");
    const totalIssuanceCount = document.getElementById("totalIssuanceCount");
    const totalReturnCount   = document.getElementById("totalReturnCount");

    // ─── Theme ────────────────────────────────────────────────────────────────

    function updateThemeIcon() {
        if (html.classList.contains("dark")) {
            themeIcon.textContent = "light_mode";
        } else {
            themeIcon.textContent = "dark_mode";
        }
    }

    updateThemeIcon();

    if (themeToggle) {
        themeToggle.addEventListener("click", function () {
            html.classList.toggle("dark");
            html.classList.toggle("light");
            localStorage.setItem("theme", html.classList.contains("dark") ? "dark" : "light");
            updateThemeIcon();
        });
    }

    // ─── Sidebar Menu Toggles ─────────────────────────────────────────────────

    const menuToggles = document.querySelectorAll(".menu-toggle");

    menuToggles.forEach(function (button) {
        button.addEventListener("click", function () {
            const targetId   = button.getAttribute("data-target");
            const targetMenu = document.getElementById(targetId);
            const arrow      = button.querySelector(".menu-arrow");

            if (!targetMenu) return;

            const isHidden = targetMenu.classList.contains("hidden");

            if (isHidden) {
                targetMenu.classList.remove("hidden");
                button.setAttribute("aria-expanded", "true");
                if (arrow) arrow.textContent = "expand_less";
            } else {
                targetMenu.classList.add("hidden");
                button.setAttribute("aria-expanded", "false");
                if (arrow) arrow.textContent = "expand_more";
            }
        });
    });

    // ─── Dashboard Totals ─────────────────────────────────────────────────────

    async function loadDashboardTotals() {
        try {
            const [staffsResponse, patientsResponse, itemsResponse, issuanceResponse, returnResponse] = await Promise.all([
                fetch(`${API_BASE_URL}/staffs/`),
                fetch(`${API_BASE_URL}/patients/`),
                fetch(`${API_BASE_URL}/items/`),
                fetch(`${API_BASE_URL}/issuance/`),
                fetch(`${API_BASE_URL}/return/`)
            ]);

            if (!staffsResponse.ok || !patientsResponse.ok || !itemsResponse.ok || !issuanceResponse.ok || !returnResponse.ok) {
                throw new Error("Failed to fetch dashboard totals.");
            }

            const staffs   = await staffsResponse.json();
            const patients = await patientsResponse.json();
            const items    = await itemsResponse.json();
            const issuance = await issuanceResponse.json();
            const returns  = await returnResponse.json();

            if (totalStaffsCount)   totalStaffsCount.textContent   = staffs.length.toLocaleString();
            if (totalPatientsCount) totalPatientsCount.textContent = patients.length.toLocaleString();
            if (totalItemsCount)    totalItemsCount.textContent    = items.length.toLocaleString();
            if (totalIssuanceCount) totalIssuanceCount.textContent = issuance.length.toLocaleString();
            if (totalReturnCount)   totalReturnCount.textContent   = returns.length.toLocaleString();

        } catch (error) {
            console.error("Dashboard totals error:", error);

            if (totalStaffsCount)   totalStaffsCount.textContent   = "Error";
            if (totalPatientsCount) totalPatientsCount.textContent = "Error";
            if (totalItemsCount)    totalItemsCount.textContent    = "Error";
            if (totalIssuanceCount) totalIssuanceCount.textContent = "Error";
            if (totalReturnCount)   totalReturnCount.textContent   = "Error";
        }
    }

    // ─── Init ─────────────────────────────────────────────────────────────────

    loadDashboardTotals();

});