const API_BASE_URL = "http://127.0.0.1:8000/api";

document.addEventListener("DOMContentLoaded", function () {

    // ─── DOM Elements ─────────────────────────────────────────────────────────

    const html                  = document.documentElement;
    const themeToggle           = document.getElementById("themeToggle");
    const themeIcon             = document.getElementById("themeIcon");
    const totalStaffsCount      = document.getElementById("totalStaffsCount");
    const totalPatientsCount    = document.getElementById("totalPatientsCount");
    const totalItemsCount       = document.getElementById("totalItemsCount");
    const totalAvailableCount   = document.getElementById("totalAvailableCount");
    const totalIssuanceCount    = document.getElementById("totalIssuanceCount");
    const totalReturnCount      = document.getElementById("totalReturnCount");
    const recentIssuancesBody   = document.getElementById("recentIssuancesBody");
    const recentReturnsBody     = document.getElementById("recentReturnsBody");
    const itemCategoriesList    = document.getElementById("itemCategoriesList");
    const issuanceRangeSelect   = document.getElementById("issuanceRangeSelect");

    let issuanceChartInstance   = null;
    let allIssuances            = [];

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

    // ─── Helpers ──────────────────────────────────────────────────────────────

    function formatDateTime(isoString) {
        if (!isoString) return "-";
        return new Date(isoString).toLocaleString("en-PH", {
            month: "short", day: "numeric",
            hour: "numeric", minute: "2-digit", hour12: true
        });
    }

    function getInitials(name) {
        if (!name) return "?";
        return name.split(/[\s,]+/).filter(Boolean).map(p => p[0]).slice(0, 2).join("").toUpperCase();
    }

    // ─── Stat Cards ───────────────────────────────────────────────────────────

    function loadDashboardTotals(staffs, patients, items, issuances, returns) {
        if (totalStaffsCount)    totalStaffsCount.textContent    = staffs.length.toLocaleString();
        if (totalPatientsCount)  totalPatientsCount.textContent  = patients.length.toLocaleString();
        if (totalItemsCount)     totalItemsCount.textContent     = items.length.toLocaleString();
        if (totalIssuanceCount)  totalIssuanceCount.textContent  = issuances.length.toLocaleString();
        if (totalReturnCount)    totalReturnCount.textContent    = returns.length.toLocaleString();

        // Available = items whose status_name is "Available" (case-insensitive)
        const availableCount = items.filter(i =>
            (i.status_name ?? "").toLowerCase() === "available"
        ).length;
        if (totalAvailableCount) totalAvailableCount.textContent = availableCount.toLocaleString();
    }

    // ─── Recent Issuances Table ───────────────────────────────────────────────

    function renderRecentIssuances(issuances) {
        const recent = [...issuances].slice(0, 5);
        if (!recent.length) {
            recentIssuancesBody.innerHTML = `<tr><td colspan="3" class="px-6 py-6 text-center text-xs text-slate-400">No recent issuances.</td></tr>`;
            return;
        }
        recentIssuancesBody.innerHTML = recent.map(i => {
            const initials    = getInitials(i.patient_name);
            const patientName = i.patient_name ?? "-";
            const itemName    = i.item_name    ?? "-";
            const date        = formatDateTime(i.created_at);
            return `
            <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                        <div class="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">${initials}</div>
                        <div>
                            <p class="font-semibold text-sm">${patientName}</p>
                            <p class="text-[10px] text-slate-500">ID: ${i.patient_id_code ?? "-"}</p>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 font-medium text-sm">${itemName}</td>
                <td class="px-6 py-4 text-slate-500 text-xs">${date}</td>
            </tr>`;
        }).join("");
    }

    // ─── Recent Returns Table ─────────────────────────────────────────────────

    function renderRecentReturns(returns) {
        const recent = [...returns].slice(0, 5);
        if (!recent.length) {
            recentReturnsBody.innerHTML = `<tr><td colspan="3" class="px-6 py-6 text-center text-xs text-slate-400">No recent returns.</td></tr>`;
            return;
        }
        recentReturnsBody.innerHTML = recent.map(r => {
            const patientName = r.patient_name ?? "-";
            const itemName    = r.item_name    ?? "-";
            const date        = formatDateTime(r.created_at);
            return `
            <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td class="px-6 py-4 font-semibold text-sm">${patientName}</td>
                <td class="px-6 py-4 text-sm">${itemName}</td>
                <td class="px-6 py-4 text-slate-500 text-xs">${date}</td>
            </tr>`;
        }).join("");
    }

    // ─── Item Categories ──────────────────────────────────────────────────────

    function renderItemCategories(items) {
        const typeCounts = {};
        items.forEach(item => {
            const type = item.item_type_name || "Unknown";
            typeCounts[type] = (typeCounts[type] || 0) + 1;
        });

        const total    = items.length || 1;
        const sorted   = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
        const opacities = ["bg-primary", "bg-primary/80", "bg-primary/60", "bg-primary/40", "bg-primary/20"];

        if (!sorted.length) {
            itemCategoriesList.innerHTML = `<p class="text-xs text-slate-400">No items found.</p>`;
            return;
        }

        itemCategoriesList.innerHTML = sorted.map(([name, count], idx) => {
            const pct = Math.round((count / total) * 100);
            return `
            <div class="space-y-1">
                <div class="flex justify-between text-xs font-medium">
                    <span>${name}</span><span>${pct}%</span>
                </div>
                <div class="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div class="h-full ${opacities[idx] || "bg-primary/20"} rounded-full transition-all duration-500" style="width:${pct}%"></div>
                </div>
            </div>`;
        }).join("");
    }

    // ─── Issuance Activity Chart ──────────────────────────────────────────────

    function buildChartData(issuances, days) {
        const labels = [];
        const counts = [];
        const now    = new Date();

        for (let i = days - 1; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(now.getDate() - i);
            const label = days <= 7
                ? d.toLocaleDateString("en-PH", { weekday: "short" })
                : d.toLocaleDateString("en-PH", { month: "short", day: "numeric" });
            labels.push(label);

            const dayStr = d.toDateString();
            const count  = issuances.filter(iss =>
                iss.created_at && new Date(iss.created_at).toDateString() === dayStr
            ).length;
            counts.push(count);
        }
        return { labels, counts };
    }

    function renderIssuanceChart(issuances, days) {
        const canvas = document.getElementById("issuanceChart");
        if (!canvas) return;

        const { labels, counts } = buildChartData(issuances, days);

        if (issuanceChartInstance) {
            issuanceChartInstance.destroy();
        }

        issuanceChartInstance = new Chart(canvas, {
            type: "line",
            data: {
                labels,
                datasets: [{
                    label: "Issuances",
                    data: counts,
                    borderColor: "#3211d4",
                    backgroundColor: "rgba(50,17,212,0.1)",
                    borderWidth: 2.5,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: "#3211d4",
                    pointRadius: 3,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { font: { size: 10 }, color: "#94a3b8" }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1, precision: 0, font: { size: 10 }, color: "#94a3b8" },
                        grid: { color: "rgba(148,163,184,0.1)" }
                    }
                }
            }
        });
    }

    // ─── Main Load ────────────────────────────────────────────────────────────

    async function loadAll() {
        try {
            const [staffsRes, patientsRes, itemsRes, issuanceRes, returnRes] = await Promise.all([
                fetch(`${API_BASE_URL}/staffs/`),
                fetch(`${API_BASE_URL}/patients/`),
                fetch(`${API_BASE_URL}/items/`),
                fetch(`${API_BASE_URL}/issuance/`),
                fetch(`${API_BASE_URL}/return/`)
            ]);

            if (!staffsRes.ok || !patientsRes.ok || !itemsRes.ok || !issuanceRes.ok || !returnRes.ok) {
                throw new Error("One or more API requests failed.");
            }

            const staffs    = await staffsRes.json();
            const patients  = await patientsRes.json();
            const items     = await itemsRes.json();
            const issuances = await issuanceRes.json();
            const returns   = await returnRes.json();

            allIssuances = issuances;

            loadDashboardTotals(staffs, patients, items, issuances, returns);
            renderRecentIssuances(issuances);
            renderRecentReturns(returns);
            renderItemCategories(items);
            renderIssuanceChart(issuances, parseInt(issuanceRangeSelect?.value || "7"));

        } catch (error) {
            console.error("Dashboard load error:", error);
            [totalStaffsCount, totalPatientsCount, totalItemsCount,
             totalAvailableCount, totalIssuanceCount, totalReturnCount]
                .forEach(el => { if (el) el.textContent = "Error"; });
        }
    }

    // ─── Chart Range Toggle ───────────────────────────────────────────────────

    if (issuanceRangeSelect) {
        issuanceRangeSelect.addEventListener("change", function () {
            renderIssuanceChart(allIssuances, parseInt(this.value));
        });
    }

    // ─── Init ─────────────────────────────────────────────────────────────────

    loadAll();

    // Auto-refresh every 30 seconds
    setInterval(loadAll, 30000);

});