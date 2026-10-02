"use strict";

const API_BASE = "/api/v1";

let reportData = null;


function getAccessToken() {
    return (
        localStorage.getItem("access_token") ||
        sessionStorage.getItem("access_token") ||
        localStorage.getItem("token") ||
        sessionStorage.getItem("token") ||
        null
    );
}


function getAuthHeaders() {
    const token = getAccessToken();

    return token
        ? {
            Authorization: `Bearer ${token}`
        }
        : {};
}


function requireAuthentication() {
    if (!getAccessToken()) {
        window.location.href = "/";
        return false;
    }

    return true;
}


async function apiRequest(url, options = {}) {
    const response = await fetch(
        url,
        {
            ...options,
            headers: {
                ...getAuthHeaders(),
                ...(options.headers || {})
            }
        }
    );

    if (response.status === 401) {
        localStorage.removeItem("access_token");
        sessionStorage.removeItem("access_token");
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");

        window.location.href = "/";
        return null;
    }

    let data = null;

    try {
        data = await response.json();
    } catch {
        data = null;
    }

    if (!response.ok) {
        throw new Error(
            data?.detail ||
            data?.message ||
            "Request failed."
        );
    }

    return data;
}


function padNumber(value) {
    return String(value).padStart(2, "0");
}


function formatDateForInput(date) {
    return (
        `${date.getFullYear()}-` +
        `${padNumber(date.getMonth() + 1)}-` +
        `${padNumber(date.getDate())}`
    );
}


function formatNumber(value, maximumFractionDigits = 2) {
    return new Intl.NumberFormat(
        undefined,
        {
            maximumFractionDigits
        }
    ).format(
        Number(value || 0)
    );
}


function formatMoney(value, currency = "") {
    const amount = formatNumber(value);

    return currency
        ? `${amount} ${currency}`
        : amount;
}


function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


function showStatus(message, type = "") {
    const status =
        document.getElementById(
            "report-status"
        );

    if (!status) {
        return;
    }

    status.textContent = message;
    status.className = "report-status";

    if (type) {
        status.classList.add(type);
    }

    status.hidden = false;
}


function hideStatus() {
    const status =
        document.getElementById(
            "report-status"
        );

    if (status) {
        status.hidden = true;
        status.textContent = "";
        status.className = "report-status";
    }
}


function setDefaultDates() {
    const startInput =
        document.getElementById(
            "report-start-date"
        );

    const endInput =
        document.getElementById(
            "report-end-date"
        );

    if (!startInput || !endInput) {
        return;
    }

    const today = new Date();

    const firstDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
    );

    startInput.value =
        formatDateForInput(firstDay);

    endInput.value =
        formatDateForInput(today);

    endInput.max =
        formatDateForInput(today);
}


function clearReportResults() {
    const sections = [
        "report-results",
        "report-financial-section",
        "report-processing-section",
        "report-insights-section",
        "report-quality-section",
        "report-receipts-section"
    ];

    sections.forEach((id) => {
        const element =
            document.getElementById(id);

        if (element) {
            element.hidden = true;
        }
    });

    const emptyState =
        document.getElementById(
            "reports-empty-state"
        );

    if (emptyState) {
        emptyState.hidden = false;
    }

    reportData = null;
}


function showReportSections() {
    const sections = [
        "report-results",
        "report-financial-section",
        "report-processing-section",
        "report-insights-section",
        "report-quality-section",
        "report-receipts-section"
    ];

    sections.forEach((id) => {
        const element =
            document.getElementById(id);

        if (element) {
            element.hidden = false;
        }
    });

    const emptyState =
        document.getElementById(
            "reports-empty-state"
        );

    if (emptyState) {
        emptyState.hidden = true;
    }
}


function renderOverview(data) {
    const overview =
        data.overview || {};

    const totalReceipts =
        document.getElementById(
            "report-total-receipts"
        );

    const totalItems =
        document.getElementById(
            "report-total-items"
        );

    const totalAmount =
        document.getElementById(
            "report-total-amount"
        );

    const averageReceipt =
        document.getElementById(
            "report-average-receipt"
        );

    if (totalReceipts) {
        totalReceipts.textContent =
            formatNumber(
                overview.total_receipts
            );
    }

    if (totalItems) {
        totalItems.textContent =
            formatNumber(
                overview.total_items
            );
    }

    if (data.currencies?.length === 1) {
        const currency =
            data.currencies[0];

        if (totalAmount) {
            totalAmount.textContent =
                formatMoney(
                    currency.total_amount,
                    currency.currency
                );
        }

        if (averageReceipt) {
            averageReceipt.textContent =
                formatMoney(
                    currency.average_receipt,
                    currency.currency
                );
        }
    } else {
        if (totalAmount) {
            totalAmount.textContent = "—";
        }

        if (averageReceipt) {
            averageReceipt.textContent = "—";
        }
    }

    const period =
        document.getElementById(
            "report-period"
        );

    if (period) {
        period.innerHTML =
            `<span class="report-period-badge">` +
            `${escapeHtml(data.start_date)}` +
            ` → ` +
            `${escapeHtml(data.end_date)}` +
            `</span>`;
    }
}


function renderFinancial(data) {
    const container =
        document.getElementById(
            "report-financial-container"
        );

    if (!container) {
        return;
    }

    const currencies =
        data.currencies || [];

    if (!currencies.length) {
        container.innerHTML =
            `<div class="report-empty">` +
            `No financial data available for this period.` +
            `</div>`;

        return;
    }

    container.innerHTML =
        currencies
            .map((currency) => {
                return `
                    <article class="report-currency-card">

                        <div class="report-currency-card-header">
                            <span class="report-currency-name">
                                ${escapeHtml(currency.currency)}
                            </span>

                            <span class="report-currency-count">
                                ${formatNumber(currency.receipt_count)} receipts
                            </span>
                        </div>

                        <div class="report-currency-main">
                            ${formatMoney(
                                currency.total_amount,
                                currency.currency
                            )}
                        </div>

                        <div class="report-currency-details">

                            <div class="report-currency-detail">
                                <span>Subtotal</span>
                                <strong>
                                    ${formatMoney(
                                        currency.subtotal,
                                        currency.currency
                                    )}
                                </strong>
                            </div>

                            <div class="report-currency-detail">
                                <span>Tax</span>
                                <strong>
                                    ${formatMoney(
                                        currency.total_tax,
                                        currency.currency
                                    )}
                                </strong>
                            </div>

                            <div class="report-currency-detail">
                                <span>Discount</span>
                                <strong>
                                    ${formatMoney(
                                        currency.total_discount,
                                        currency.currency
                                    )}
                                </strong>
                            </div>

                        </div>

                    </article>
                `;
            })
            .join("");
}


function renderProcessing(data) {
    const container =
        document.getElementById(
            "report-processing-container"
        );

    if (!container) {
        return;
    }

    const trend =
        data.processing_trend || [];

    if (!trend.length) {
        container.innerHTML =
            `<div class="report-empty">` +
            `No processing activity for this period.` +
            `</div>`;

        return;
    }

    container.innerHTML = `
        <table class="report-table">

            <thead>
                <tr>
                    <th>Date</th>
                    <th>Receipts</th>
                    <th>Items</th>
                </tr>
            </thead>

            <tbody>

                ${trend.map((item) => `
                    <tr>
                        <td>
                            ${escapeHtml(item.date)}
                        </td>

                        <td>
                            ${formatNumber(item.receipts)}
                        </td>

                        <td>
                            ${formatNumber(item.items)}
                        </td>
                    </tr>
                `).join("")}

            </tbody>

        </table>
    `;
}


function renderInsightList(
    containerId,
    items,
    labelKey,
    countKey
) {
    const container =
        document.getElementById(
            containerId
        );

    if (!container) {
        return;
    }

    if (!items?.length) {
        container.innerHTML =
            `<div class="report-empty">` +
            `No data available.` +
            `</div>`;

        return;
    }

    container.innerHTML =
        items
            .map((item) => {
                return `
                    <div class="report-list-row">

                        <span class="report-list-label">
                            ${escapeHtml(
                                item[labelKey]
                            )}
                        </span>

                        <strong class="report-list-value">
                            ${formatNumber(
                                item[countKey]
                            )}
                        </strong>

                    </div>
                `;
            })
            .join("");
}


function renderInsights(data) {
    renderInsightList(
        "report-payment-methods",
        data.payment_methods || [],
        "method",
        "count"
    );

    renderInsightList(
        "report-merchant-categories",
        data.merchant_categories || [],
        "category",
        "count"
    );
}


function renderQuality(data) {
    const vision =
        data.vision || {};

    const qr =
        data.qr || {};

    const successful =
        document.getElementById(
            "report-successful"
        );

    const failed =
        document.getElementById(
            "report-failed"
        );

    const successRate =
        document.getElementById(
            "report-success-rate"
        );

    const qrDetected =
        document.getElementById(
            "report-qr-detected"
        );

    if (successful) {
        successful.textContent =
            formatNumber(
                vision.successful
            );
    }

    if (failed) {
        failed.textContent =
            formatNumber(
                vision.failed
            );
    }

    if (successRate) {
        successRate.textContent =
            `${formatNumber(
                vision.success_rate
            )}%`;
    }

    if (qrDetected) {
        qrDetected.textContent =
            formatNumber(
                qr.detected_receipts
            );
    }
}


function renderReceipts(data) {
    const container =
        document.getElementById(
            "report-receipts-container"
        );

    if (!container) {
        return;
    }

    const receipts =
        data.receipts || [];

    if (!receipts.length) {
        container.innerHTML =
            `<div class="report-empty">` +
            `No receipts found for this period.` +
            `</div>`;

        return;
    }

    container.innerHTML = `
        <table class="report-table">

            <thead>
                <tr>
                    <th>ID</th>
                    <th>Merchant</th>
                    <th>Date</th>
                    <th>Currency</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>QR</th>
                </tr>
            </thead>

            <tbody>

                ${receipts.map((receipt) => {

                    const qrText =
                        receipt.qr_detected
                            ? "Detected"
                            : "No QR";

                    const qrClass =
                        receipt.qr_detected
                            ? "report-qr-yes"
                            : "report-qr-no";

                    return `
                        <tr>

                            <td>
                                ${formatNumber(
                                    receipt.id,
                                    0
                                )}
                            </td>

                            <td>
                                ${escapeHtml(
                                    receipt.merchant_name ||
                                    "Unknown"
                                )}
                            </td>

                            <td>
                                ${escapeHtml(
                                    receipt.receipt_date ||
                                    receipt.created_at ||
                                    "—"
                                )}
                            </td>

                            <td>
                                ${escapeHtml(
                                    receipt.currency ||
                                    "Unknown"
                                )}
                            </td>

                            <td>
                                ${
                                    receipt.total != null
                                        ? formatMoney(
                                            receipt.total,
                                            receipt.currency
                                        )
                                        : "—"
                                }
                            </td>

                            <td>
                                ${escapeHtml(
                                    receipt.payment_method ||
                                    "Unknown"
                                )}
                            </td>

                            <td>
                                <span class="${qrClass}">
                                    ${qrText}
                                </span>
                            </td>

                        </tr>
                    `;
                }).join("")}

            </tbody>

        </table>
    `;
}


function renderReport(data) {
    reportData = data;

    showReportSections();

    renderOverview(data);
    renderFinancial(data);
    renderProcessing(data);
    renderInsights(data);
    renderQuality(data);
    renderReceipts(data);
}


function getSelectedReportDates() {
    const startInput =
        document.getElementById(
            "report-start-date"
        );

    const endInput =
        document.getElementById(
            "report-end-date"
        );

    if (!startInput || !endInput) {
        return null;
    }

    const startDate =
        startInput.value;

    const endDate =
        endInput.value;

    if (!startDate || !endDate) {
        showStatus(
            "Please select both dates.",
            "error"
        );

        return null;
    }

    if (endDate < startDate) {
        showStatus(
            "End date cannot be earlier than start date.",
            "error"
        );

        return null;
    }

    return {
        startDate,
        endDate
    };
}


async function generateReport() {
    const button =
        document.getElementById(
            "generate-report-button"
        );

    const dates =
        getSelectedReportDates();

    if (!dates || !button) {
        return;
    }

    button.disabled = true;

    hideStatus();

    try {
        const response =
            await apiRequest(
                `${API_BASE}/reports/?start_date=${encodeURIComponent(dates.startDate)}&end_date=${encodeURIComponent(dates.endDate)}`
            );

        if (!response) {
            return;
        }

        renderReport(
            response.data || {}
        );

        showStatus(
            "Report generated successfully.",
            "success"
        );

    } catch (error) {
        console.error(
            "Failed to generate report:",
            error
        );

        showStatus(
            error.message ||
            "Failed to generate report.",
            "error"
        );

    } finally {
        button.disabled = false;
    }
}


async function downloadReportFile(
    format
) {
    const dates =
        getSelectedReportDates();

    if (!dates) {
        return;
    }

    const endpoint =
        format === "pdf"
            ? "export/pdf"
            : "export/excel";

    const buttonId =
        format === "pdf"
            ? "download-report-pdf"
            : "export-report-excel";

    const button =
        document.getElementById(
            buttonId
        );

    if (button) {
        button.disabled = true;
    }

    hideStatus();

    try {
        const response =
            await fetch(
                `${API_BASE}/reports/${endpoint}?start_date=${encodeURIComponent(dates.startDate)}&end_date=${encodeURIComponent(dates.endDate)}`,
                {
                    method: "GET",
                    headers: {
                        ...getAuthHeaders()
                    }
                }
            );

        if (response.status === 401) {
            localStorage.removeItem(
                "access_token"
            );

            sessionStorage.removeItem(
                "access_token"
            );

            localStorage.removeItem(
                "token"
            );

            sessionStorage.removeItem(
                "token"
            );

            window.location.href = "/";
            return;
        }

        if (!response.ok) {
            let message =
                "Failed to export report.";

            try {
                const errorData =
                    await response.json();

                message =
                    errorData?.detail ||
                    errorData?.message ||
                    message;

            } catch {
            }

            throw new Error(
                message
            );
        }

        const blob =
            await response.blob();

        const contentDisposition =
            response.headers.get(
                "Content-Disposition"
            );

        let filename =
            format === "pdf"
                ? `smartreceiptai-report-${dates.startDate}-${dates.endDate}.pdf`
                : `smartreceiptai-report-${dates.startDate}-${dates.endDate}.xlsx`;

        if (contentDisposition) {
            const match =
                contentDisposition.match(
                    /filename="?([^"]+)"?/i
                );

            if (match?.[1]) {
                filename = match[1];
            }
        }

        const url =
            window.URL.createObjectURL(
                blob
            );

        const link =
            document.createElement(
                "a"
            );

        link.href = url;
        link.download = filename;

        document.body.appendChild(
            link
        );

        link.click();

        link.remove();

        window.URL.revokeObjectURL(
            url
        );

        showStatus(
            format === "pdf"
                ? "PDF downloaded successfully."
                : "Excel report downloaded successfully.",
            "success"
        );

    } catch (error) {
        console.error(
            `Failed to download ${format} report:`,
            error
        );

        showStatus(
            error.message ||
            "Failed to export report.",
            "error"
        );

    } finally {
        if (button) {
            button.disabled = false;
        }
    }
}


async function loadCurrentUser() {
    try {
        const user =
            await apiRequest(
                `${API_BASE}/auth/me`
            );

        if (!user) {
            return;
        }

        const fullName =
            user.full_name ||
            user.email ||
            "Account";

        const email =
            user.email ||
            "—";

        const initial =
            fullName
                .trim()
                .charAt(0)
                .toUpperCase() ||
            "U";

        const elements = {
            "user-email": fullName,
            "user-menu-name": fullName,
            "user-menu-email": email,
            "user-initial": initial,
            "user-menu-initial": initial
        };

        Object.entries(elements)
            .forEach(([id, value]) => {
                const element =
                    document.getElementById(id);

                if (element) {
                    element.textContent =
                        value;
                }
            });

        const avatar =
            document.getElementById(
                "user-avatar"
            );

        const menuAvatar =
            document.getElementById(
                "user-menu-avatar"
            );

        if (user.profile_image) {
            if (avatar) {
                avatar.innerHTML =
                    `<img src="${escapeHtml(
                        user.profile_image
                    )}" alt="">`;
            }

            if (menuAvatar) {
                menuAvatar.innerHTML =
                    `<img src="${escapeHtml(
                        user.profile_image
                    )}" alt="">`;
            }
        }

    } catch (error) {
        console.error(
            "Failed to load current user:",
            error
        );
    }
}


function initializeAccountMenu() {
    const button =
        document.getElementById(
            "user-account-button"
        );

    const menu =
        document.getElementById(
            "user-account-menu"
        );

    if (!button || !menu) {
        return;
    }

    button.addEventListener(
        "click",
        (event) => {
            event.stopPropagation();

            const isHidden =
                menu.hidden;

            menu.hidden = !isHidden;

            button.setAttribute(
                "aria-expanded",
                String(isHidden)
            );
        }
    );

    document.addEventListener(
        "click",
        () => {
            menu.hidden = true;

            button.setAttribute(
                "aria-expanded",
                "false"
            );
        }
    );

    menu.addEventListener(
        "click",
        (event) => {
            event.stopPropagation();
        }
    );
}


function initializeMobileMenu() {
    const button =
        document.getElementById(
            "mobile-menu-button"
        );

    const sidebar =
        document.querySelector(
            ".sidebar"
        );

    if (!button || !sidebar) {
        return;
    }

    button.addEventListener(
        "click",
        () => {
            sidebar.classList.toggle(
                "mobile-open"
            );
        }
    );
}


function initializeLogout() {
    const logoutButton =
        document.getElementById(
            "logout-button"
        );

    const menuLogout =
        document.getElementById(
            "account-menu-logout"
        );

    async function logout() {
        try {
            await fetch(
                `${API_BASE}/auth/logout`,
                {
                    method: "POST",
                    headers: {
                        ...getAuthHeaders()
                    }
                }
            );
        } catch (error) {
            console.error(
                "Logout request failed:",
                error
            );
        } finally {
            localStorage.removeItem(
                "access_token"
            );

            sessionStorage.removeItem(
                "access_token"
            );

            localStorage.removeItem(
                "token"
            );

            sessionStorage.removeItem(
                "token"
            );

            window.location.href = "/";
        }
    }

    logoutButton?.addEventListener(
        "click",
        logout
    );

    menuLogout?.addEventListener(
        "click",
        logout
    );
}


function initializeReports() {
    if (!requireAuthentication()) {
        return;
    }

    setDefaultDates();

    clearReportResults();

    document
        .getElementById(
            "generate-report-button"
        )
        ?.addEventListener(
            "click",
            generateReport
        );

    document
        .getElementById(
            "download-report-pdf"
        )
        ?.addEventListener(
            "click",
            () => downloadReportFile("pdf")
        );

    document
        .getElementById(
            "export-report-excel"
        )
        ?.addEventListener(
            "click",
            () => downloadReportFile("excel")
        );

    loadCurrentUser();
    initializeAccountMenu();
    initializeMobileMenu();
    initializeLogout();
}


document.addEventListener(
    "DOMContentLoaded",
    initializeReports
);