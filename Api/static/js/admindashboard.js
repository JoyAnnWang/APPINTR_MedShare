const API_BASE_URL = "http://127.0.0.1:8000/api";

document.addEventListener("DOMContentLoaded", function () {

    // ─── DOM Elements ─────────────────────────────────────────────────────────

    const html             = document.documentElement;
    const themeToggle      = document.getElementById("themeToggle");
    const themeIcon        = document.getElementById("themeIcon");
    const totalUsersCount  = document.getElementById("totalUsersCount");
    const totalUsersChange = document.getElementById("totalUsersChange");

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

            if (html.classList.contains("dark")) {
                localStorage.setItem("theme", "dark");
            } else {
                localStorage.setItem("theme", "light");
            }

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

    async function loadTotalUsers() {
        try {
            const [staffResponse, employeesResponse] = await Promise.all([
                fetch(`${API_BASE_URL}/staffs/`),
                fetch(`${API_BASE_URL}/employees/`)
            ]);

            if (!staffResponse.ok || !employeesResponse.ok) {
                throw new Error("Failed to fetch dashboard totals.");
            }

            const staff     = await staffResponse.json();
            const employees = await employeesResponse.json();

            const totalUsers = staff.length + employees.length;

            if (totalUsersCount) {
                totalUsersCount.textContent = totalUsers.toLocaleString();
            }

            if (totalUsersChange) {
                totalUsersChange.textContent = "Live";
            }

        } catch (error) {
            console.error("Dashboard total users error:", error);

            if (totalUsersCount) {
                totalUsersCount.textContent = "Error";
            }

            if (totalUsersChange) {
                totalUsersChange.textContent = "--";
            }
        }
    }

    // ─── Init ─────────────────────────────────────────────────────────────────

    loadTotalUsers();

});