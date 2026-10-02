"use strict";

/* =========================================================
   SmartReceiptAI
   Admin Dashboard JavaScript
   ========================================================= */


/* =========================================================
   GLOBAL CONFIG / STATE
========================================================= */

const API_BASE = "/api/v1";


let adminCurrentUserId = null;

let allAdminUsers = [];
let filteredAdminUsers = [];

let allAdminReceipts = [];
let filteredAdminReceipts = [];

let currentOverview = {
    total_users: 0,
    active_users: 0,
    admin_users: 0,
    total_receipts: 0,
};


/* =========================================================
   DOM - GENERAL
========================================================= */

const adminMessage =
    document.getElementById(
        "admin-message"
    );


/* =========================================================
   DOM - USERS
========================================================= */

const searchInput =
    document.getElementById(
        "user-search"
    );

const searchClear =
    document.getElementById(
        "user-search-clear"
    );

const roleFilter =
    document.getElementById(
        "user-role-filter"
    );

const statusFilter =
    document.getElementById(
        "user-status-filter"
    );

const sortFilter =
    document.getElementById(
        "user-sort"
    );

const clearFiltersButton =
    document.getElementById(
        "clear-user-filters"
    );

const refreshUsersButton =
    document.getElementById(
        "refresh-users"
    );


/* =========================================================
   DOM - RECEIPTS
========================================================= */

const receiptSearchInput =
    document.getElementById(
        "admin-receipt-search"
    );

const receiptCurrencyFilter =
    document.getElementById(
        "admin-receipt-currency"
    );

const receiptUserFilter =
    document.getElementById(
        "admin-receipt-user"
    );

const receiptSortFilter =
    document.getElementById(
        "admin-receipt-sort"
    );

const clearReceiptFiltersButton =
    document.getElementById(
        "clear-admin-receipt-filters"
    );

const refreshReceiptsButton =
    document.getElementById(
        "refresh-receipts"
    );


/* =========================================================
   MESSAGE
========================================================= */

function clearMessage() {

    if (!adminMessage) {
        return;
    }

    adminMessage.textContent = "";

    adminMessage.className =
        "admin-message";
}


function showError(message) {

    if (!adminMessage) {
        return;
    }

    adminMessage.textContent =
        message ||
        "An error occurred.";

    adminMessage.className =
        "admin-message error";
}


function showSuccess(message) {

    if (!adminMessage) {
        return;
    }

    adminMessage.textContent =
        message ||
        "Operation completed.";

    adminMessage.className =
        "admin-message success";
}


/* =========================================================
   API
========================================================= */

async function apiRequest(
    url,
    options = {}
) {

    const requestOptions = {
        credentials:
            "same-origin",

        ...options,

        headers: {
            ...(options.body
                ? {
                    "Content-Type":
                        "application/json",
                }
                : {}),

            ...(options.headers || {}),
        },
    };


    const response =
        await fetch(
            url,
            requestOptions
        );


    let data = null;


    try {

        data =
            await response.json();

    } catch (_) {

        data = null;

    }


    if (
        response.status ===
        401
    ) {

        window.location.href =
            "/login";

        return null;

    }


    if (
        response.status ===
        403
    ) {

        throw new Error(
            data?.detail ||
            "Administrator access required."
        );

    }


    if (!response.ok) {

        const errorMessage =
            data?.detail ||
            data?.message ||
            `Request failed (${response.status})`;

        throw new Error(
            errorMessage
        );

    }


    return data;
}


/* =========================================================
   HELPERS
========================================================= */

function getInitials(name) {

    const value =
        String(
            name || ""
        ).trim();


    if (!value) {
        return "U";
    }


    const parts =
        value
            .split(/\s+/)
            .filter(Boolean);


    if (
        parts.length ===
        1
    ) {

        return parts[0]
            .slice(0, 2)
            .toUpperCase();

    }


    return (
        parts[0][0] +
        parts[
            parts.length - 1
        ][0]
    ).toUpperCase();

}


function escapeHtml(value) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


function formatDate(value) {

    if (!value) {
        return "—";
    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return escapeHtml(
            value
        );

    }


    return date.toLocaleDateString(
        undefined,
        {
            year: "numeric",
            month: "short",
            day: "2-digit",
        }
    );

}


function formatDateTime(value) {

    if (!value) {
        return "—";
    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return escapeHtml(
            value
        );

    }


    return date.toLocaleString(
        undefined,
        {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        }
    );

}


function formatMoney(
    amount,
    currency = ""
) {

    if (
        amount === null ||
        amount === undefined ||
        amount === ""
    ) {

        return "—";

    }


    const numericAmount =
        Number(amount);


    if (
        Number.isNaN(
            numericAmount
        )
    ) {

        return escapeHtml(
            amount
        );

    }


    const formatted =
        numericAmount.toLocaleString(
            undefined,
            {
                minimumFractionDigits:
                    2,

                maximumFractionDigits:
                    2,
            }
        );


    const safeCurrency =
        String(
            currency || ""
        ).trim();


    return safeCurrency
        ? `${escapeHtml(
            safeCurrency
        )} ${formatted}`
        : formatted;

}


function normalizeUser(user) {

    return {

        id:
            Number(
                user?.id
            ),

        full_name:
            String(
                user?.full_name ||
                user?.name ||
                "Unnamed User"
            ),

        email:
            String(
                user?.email ||
                "—"
            ),

        role:
            String(
                user?.role ||
                "user"
            ).toLowerCase(),

        is_active:
            Boolean(
                user?.is_active
            ),

        created_at:
            user?.created_at ||
            null,

        updated_at:
            user?.updated_at ||
            null,

        profile_image:
            user?.profile_image ||
            null,

    };

}


function normalizeReceipt(receipt) {

    return {

        id:
            Number(
                receipt?.id
            ),

        user_id:
            receipt?.user_id !== null &&
            receipt?.user_id !== undefined
                ? Number(
                    receipt.user_id
                )
                : null,

        user_name:
            String(
                receipt?.user_name ||
                receipt?.user_full_name ||
                receipt?.full_name ||
                "Unknown User"
            ),

        user_email:
            String(
                receipt?.user_email ||
                receipt?.email ||
                "—"
            ),

        merchant_name:
            String(
                receipt?.merchant_name ||
                "Unknown Merchant"
            ),

        merchant_category:
            receipt?.merchant_category ||
            null,

        merchant_address:
            receipt?.merchant_address ||
            null,

        merchant_phone:
            receipt?.merchant_phone ||
            null,

        invoice_number:
            receipt?.invoice_number ||
            null,

        receipt_date:
            receipt?.receipt_date ||
            null,

        receipt_time:
            receipt?.receipt_time ||
            null,

        currency:
            receipt?.currency ||
            null,

        subtotal:
            receipt?.subtotal ??
            null,

        tax:
            receipt?.tax ??
            null,

        tax_rate:
            receipt?.tax_rate ??
            null,

        discount:
            receipt?.discount ??
            null,

        total:
            receipt?.total ??
            null,

        payment_method:
            receipt?.payment_method ||
            null,

        created_at:
            receipt?.created_at ||
            null,

        updated_at:
            receipt?.updated_at ||
            null,

        items:
            Array.isArray(
                receipt?.items
            )
                ? receipt.items
                : [],

        images:
            Array.isArray(
                receipt?.images
            )
                ? receipt.images
                : [],

        vision_analyses:
            Array.isArray(
                receipt?.vision_analyses
            )
                ? receipt.vision_analyses
                : [],

    };

}


/* =========================================================
   ICONS
========================================================= */

function icon(name) {

    const icons = {

        userCheck: `
            <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <circle
                    cx="9"
                    cy="8"
                    r="3"
                />

                <path
                    d="M3.5 19.5v-1.2A4.8 4.8 0 0 1 8.3 13.5h1.4a4.8 4.8 0 0 1 4.8 4.8v1.2"
                />

                <path
                    d="m16 17 1.8 1.8 3.2-3.4"
                />
            </svg>
        `,


        userOff: `
            <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <circle
                    cx="9"
                    cy="8"
                    r="3"
                />

                <path
                    d="M3.5 19.5v-1.2A4.8 4.8 0 0 1 8.3 13.5h1.4a4.8 4.8 0 0 1 4.8 4.8v1.2"
                />

                <path
                    d="m15 15 5 5"
                />

                <path
                    d="m20 15-5 5"
                />
            </svg>
        `,


        shield: `
            <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path
                    d="M12 3 20 6v5c0 5-3.1 8.7-8 10-4.9-1.3-8-5-8-10V6l8-3Z"
                />

                <path
                    d="m8.5 12 2.2 2.2 4.8-5"
                />
            </svg>
        `,


        user: `
            <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <circle
                    cx="12"
                    cy="8"
                    r="3.2"
                />

                <path
                    d="M5 20a7 7 0 0 1 14 0"
                />
            </svg>
        `,


        eye: `
            <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path
                    d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
                />

                <circle
                    cx="12"
                    cy="12"
                    r="2.5"
                />
            </svg>
        `,


        edit: `
            <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path
                    d="m4 20 4.2-.9L19 8.3a2.3 2.3 0 0 0-3.3-3.3L4.9 15.8 4 20Z"
                />

                <path
                    d="m13.8 6.2 4 4"
                />
            </svg>
        `,


        trash: `
            <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path
                    d="M4 7h16"
                />

                <path
                    d="M9 7V4h6v3"
                />

                <path
                    d="M7 7l1 13h8l1-13"
                />

                <path
                    d="M10 11v5"
                />

                <path
                    d="M14 11v5"
                />
            </svg>
        `,


        refresh: `
            <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path
                    d="M20 11a8 8 0 0 0-14.9-4"
                />

                <path
                    d="M5 3v4h4"
                />

                <path
                    d="M4 13a8 8 0 0 0 14.9 4"
                />

                <path
                    d="M19 21v-4h-4"
                />
            </svg>
        `,


        plus: `
            <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path
                    d="M12 5v14"
                />

                <path
                    d="M5 12h14"
                />
            </svg>
        `,


        receipt: `
            <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path
                    d="M6 3.5h10A2.5 2.5 0 0 1 18.5 6v14.5H8A2.5 2.5 0 0 0 5.5 23V6A2.5 2.5 0 0 1 6 3.5Z"
                />

                <path
                    d="M8.5 9.5h7"
                />

                <path
                    d="M8.5 13.5h7"
                />

                <path
                    d="M8.5 17.5h4.5"
                />
            </svg>
        `,


        close: `
            <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path
                    d="m7 7 10 10"
                />

                <path
                    d="m17 7-10 10"
                />
            </svg>
        `,


        calendar: `
            <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <rect
                    x="4"
                    y="5"
                    width="16"
                    height="15"
                    rx="2"
                />

                <path
                    d="M8 3v4"
                />

                <path
                    d="M16 3v4"
                />

                <path
                    d="M4 10h16"
                />
            </svg>
        `,


        mail: `
            <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <rect
                    x="4"
                    y="5"
                    width="16"
                    height="14"
                    rx="2"
                />

                <path
                    d="m5 7 7 5 7-5"
                />
            </svg>
        `,


        lock: `
            <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <rect
                    x="5"
                    y="10"
                    width="14"
                    height="10"
                    rx="2"
                />

                <path
                    d="M8 10V7a4 4 0 0 1 8 0v3"
                />
            </svg>
        `,

    };


    return (
        icons[name] ||
        icons.user
    );

}


/* =========================================================
   MODAL STYLES
   Injected here so admin.js remains self-contained.
========================================================= */

function injectModalStyles() {

    if (
        document.getElementById(
            "smartreceipt-admin-modal-styles"
        )
    ) {

        return;

    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "smartreceipt-admin-modal-styles";


    style.textContent = `
        .admin-js-modal {
            position: fixed;
            inset: 0;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
            background: rgba(10, 14, 22, 0.62);
            backdrop-filter: blur(5px);
        }

        .admin-js-modal[hidden] {
            display: none;
        }

        .admin-js-modal-dialog {
            width: min(760px, 100%);
            max-height: min(88vh, 900px);
            overflow: auto;
            background: var(--card-bg, #ffffff);
            color: var(--text-primary, #1f2937);
            border: 1px solid var(--border-color, #e5e7eb);
            border-radius: 18px;
            box-shadow: 0 24px 70px rgba(0, 0, 0, 0.24);
        }

        .admin-js-modal-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            padding: 20px 22px;
            border-bottom: 1px solid var(--border-color, #e5e7eb);
        }

        .admin-js-modal-title {
            margin: 0;
            font-size: 20px;
            font-weight: 700;
        }

        .admin-js-modal-subtitle {
            margin: 5px 0 0;
            font-size: 13px;
            opacity: 0.68;
        }

        .admin-js-modal-close {
            width: 38px;
            height: 38px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border: 0;
            border-radius: 10px;
            background: transparent;
            cursor: pointer;
            color: inherit;
        }

        .admin-js-modal-close:hover {
            background: rgba(127, 127, 127, 0.12);
        }

        .admin-js-modal-close svg {
            width: 18px;
            height: 18px;
            fill: none;
            stroke: currentColor;
            stroke-width: 1.8;
            stroke-linecap: round;
        }

        .admin-js-modal-body {
            padding: 22px;
        }

        .admin-js-form-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 16px;
        }

        .admin-js-form-group {
            display: flex;
            flex-direction: column;
            gap: 7px;
        }

        .admin-js-form-group.full {
            grid-column: 1 / -1;
        }

        .admin-js-form-group label {
            font-size: 13px;
            font-weight: 600;
        }

        .admin-js-form-group input,
        .admin-js-form-group select {
            width: 100%;
            min-height: 44px;
            padding: 0 13px;
            border: 1px solid var(--border-color, #dfe3e8);
            border-radius: 10px;
            background: transparent;
            color: inherit;
            outline: none;
            font: inherit;
        }

        .admin-js-form-group input:focus,
        .admin-js-form-group select:focus {
            border-color: #d89b2b;
            box-shadow: 0 0 0 3px rgba(216, 155, 43, 0.13);
        }

        .admin-js-modal-footer {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            padding: 16px 22px 22px;
        }

        .admin-js-modal-button {
            min-height: 42px;
            padding: 0 16px;
            border: 0;
            border-radius: 10px;
            cursor: pointer;
            font: inherit;
            font-weight: 600;
        }

        .admin-js-modal-button.secondary {
            background: rgba(127, 127, 127, 0.12);
            color: inherit;
        }

        .admin-js-modal-button.primary {
            background: #d89b2b;
            color: #ffffff;
        }

        .admin-js-modal-button.danger {
            background: #b42318;
            color: #ffffff;
        }

        .admin-js-modal-button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        .admin-js-detail-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
        }

        .admin-js-detail-item {
            padding: 13px 14px;
            border: 1px solid var(--border-color, #e5e7eb);
            border-radius: 12px;
        }

        .admin-js-detail-label {
            display: block;
            margin-bottom: 4px;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: .06em;
            opacity: 0.58;
        }

        .admin-js-detail-value {
            display: block;
            font-weight: 600;
            word-break: break-word;
        }

        .admin-js-section-title {
            margin: 22px 0 12px;
            font-size: 15px;
            font-weight: 700;
        }

        .admin-js-items-table {
            width: 100%;
            border-collapse: collapse;
            overflow: hidden;
            border: 1px solid var(--border-color, #e5e7eb);
            border-radius: 12px;
        }

        .admin-js-items-table th,
        .admin-js-items-table td {
            padding: 10px 12px;
            text-align: start;
            border-bottom: 1px solid var(--border-color, #e5e7eb);
            font-size: 13px;
        }

        .admin-js-items-table th {
            font-weight: 700;
            background: rgba(127, 127, 127, 0.06);
        }

        .admin-js-items-table tr:last-child td {
            border-bottom: 0;
        }

        .admin-js-empty {
            padding: 18px;
            text-align: center;
            border: 1px dashed var(--border-color, #dfe3e8);
            border-radius: 12px;
            opacity: 0.7;
        }

        .admin-js-modal-error {
            margin-top: 14px;
            padding: 11px 13px;
            border-radius: 10px;
            background: rgba(180, 35, 24, 0.08);
            color: #b42318;
            font-size: 13px;
        }

        @media (max-width: 700px) {
            .admin-js-modal {
                padding: 12px;
            }

            .admin-js-form-grid,
            .admin-js-detail-grid {
                grid-template-columns: 1fr;
            }

            .admin-js-form-group.full {
                grid-column: auto;
            }

            .admin-js-modal-header,
            .admin-js-modal-body,
            .admin-js-modal-footer {
                padding-left: 16px;
                padding-right: 16px;
            }
        }
    `;


    document.head.appendChild(
        style
    );

}


/* =========================================================
   MODAL ENGINE
========================================================= */

function createModal(
    {
        title = "",
        subtitle = "",
        body = "",
        footer = "",
        id = "",
    }
) {

    injectModalStyles();


    const existing =
        id
            ? document.getElementById(id)
            : null;


    if (existing) {

        existing.remove();

    }


    const modal =
        document.createElement(
            "div"
        );


    modal.className =
        "admin-js-modal";


    if (id) {
        modal.id = id;
    }


    modal.setAttribute(
        "role",
        "dialog"
    );


    modal.setAttribute(
        "aria-modal",
        "true"
    );


    modal.innerHTML = `
        <div class="admin-js-modal-dialog">

            <div class="admin-js-modal-header">

                <div>

                    <h3 class="admin-js-modal-title">
                        ${escapeHtml(
                            title
                        )}
                    </h3>

                    ${
                        subtitle
                            ? `
                                <p class="admin-js-modal-subtitle">
                                    ${escapeHtml(
                                        subtitle
                                    )}
                                </p>
                              `
                            : ""
                    }

                </div>

                <button
                    type="button"
                    class="admin-js-modal-close"
                    data-modal-close
                    aria-label="Close"
                >
                    ${icon("close")}
                </button>

            </div>

            <div class="admin-js-modal-body">
                ${body}
            </div>

            ${
                footer
                    ? `
                        <div class="admin-js-modal-footer">
                            ${footer}
                        </div>
                      `
                    : ""
            }

        </div>
    `;


    document.body.appendChild(
        modal
    );


    const close =
        () =>
            modal.remove();


    modal
        .querySelector(
            "[data-modal-close]"
        )
        ?.addEventListener(
            "click",
            close
        );


    modal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                modal
            ) {

                close();

            }

        }
    );


    document.addEventListener(
        "keydown",
        function escapeHandler(event) {

            if (
                event.key ===
                "Escape"
            ) {

                if (
                    document.body.contains(
                        modal
                    )
                ) {

                    close();

                }

                document.removeEventListener(
                    "keydown",
                    escapeHandler
                );

            }

        }
    );


    return {
        modal,
        close,
    };

}


/* =========================================================
   ADMIN ACCESS
========================================================= */

async function checkAdminAccess() {

    try {

        const data =
            await apiRequest(
                `${API_BASE}/auth/me`
            );


        const user =
            data?.user ||
            data?.data ||
            data;


        if (
            !user ||
            user.role !== "admin"
        ) {

            window.location.href =
                "/dashboard";

            return null;

        }


        adminCurrentUserId =
            Number(
                user.id
            );


        const sidebarName =
            document.getElementById(
                "admin-sidebar-name"
            );


        if (sidebarName) {

            sidebarName.textContent =
                user.full_name ||
                user.email ||
                "Administrator";

        }


        return user;

    } catch (error) {

        console.error(
            "Admin access check failed:",
            error
        );


        window.location.href =
            "/login";

        return null;

    }

}


/* =========================================================
   OVERVIEW
========================================================= */

async function loadOverview() {

    const data =
        await apiRequest(
            `${API_BASE}/admin/overview`
        );


    const overview =
        data?.overview ||
        data?.data?.overview ||
        data?.data ||
        data;


    currentOverview = {

        total_users:
            Number(
                overview?.total_users ||
                0
            ),

        active_users:
            Number(
                overview?.active_users ||
                0
            ),

        admin_users:
            Number(
                overview?.admin_users ||
                0
            ),

        total_receipts:
            Number(
                overview?.total_receipts ||
                0
            ),

    };


    const totalUsers =
        document.getElementById(
            "total-users"
        );

    const activeUsers =
        document.getElementById(
            "active-users"
        );

    const adminUsers =
        document.getElementById(
            "admin-users"
        );

    const totalReceipts =
        document.getElementById(
            "total-receipts"
        );


    if (totalUsers) {

        totalUsers.textContent =
            currentOverview
                .total_users
                .toLocaleString();

    }


    if (activeUsers) {

        activeUsers.textContent =
            currentOverview
                .active_users
                .toLocaleString();

    }


    if (adminUsers) {

        adminUsers.textContent =
            currentOverview
                .admin_users
                .toLocaleString();

    }


    if (totalReceipts) {

        totalReceipts.textContent =
            currentOverview
                .total_receipts
                .toLocaleString();

    }


    updateDistributionCharts(
        currentOverview
    );


    updateAnalyticsSnapshot();

}


/* =========================================================
   USER DISTRIBUTION
========================================================= */

function setProgress(
    barId,
    labelId,
    percentage
) {

    const bar =
        document.getElementById(
            barId
        );


    const label =
        document.getElementById(
            labelId
        );


    const value =
        Math.max(
            0,
            Math.min(
                100,
                Number(
                    percentage || 0
                )
            )
        );


    if (bar) {

        bar.style.width =
            `${value}%`;

    }


    if (label) {

        label.textContent =
            `${Math.round(value)}%`;

    }

}


function updateDistributionCharts(
    overview
) {

    const total =
        Number(
            overview?.total_users ||
            0
        );


    const active =
        Number(
            overview?.active_users ||
            0
        );


    const admins =
        Number(
            overview?.admin_users ||
            0
        );


    const disabled =
        Math.max(
            0,
            total - active
        );


    const regularUsers =
        Math.max(
            0,
            total - admins
        );


    const activePercentage =
        total > 0
            ? (
                active /
                total
            ) * 100
            : 0;


    const disabledPercentage =
        total > 0
            ? (
                disabled /
                total
            ) * 100
            : 0;


    const adminPercentage =
        total > 0
            ? (
                admins /
                total
            ) * 100
            : 0;


    const regularPercentage =
        total > 0
            ? (
                regularUsers /
                total
            ) * 100
            : 0;


    setProgress(
        "active-users-bar",
        "active-users-percent",
        activePercentage
    );


    setProgress(
        "disabled-users-bar",
        "disabled-users-percent",
        disabledPercentage
    );


    setProgress(
        "regular-users-bar",
        "regular-users-percent",
        regularPercentage
    );


    setProgress(
        "admin-users-bar",
        "admin-users-percent",
        adminPercentage
    );

}


/* =========================================================
   USER FILTER / SORT
========================================================= */

function applyUserFilters() {

    const search =
        (
            searchInput?.value ||
            ""
        )
            .trim()
            .toLowerCase();


    const role =
        roleFilter?.value ||
        "all";


    const status =
        statusFilter?.value ||
        "all";


    const sort =
        sortFilter?.value ||
        "newest";


    filteredAdminUsers =
        allAdminUsers.filter(
            user => {

                const matchesSearch =
                    !search ||
                    String(
                        user.full_name
                    )
                        .toLowerCase()
                        .includes(search) ||

                    String(
                        user.email
                    )
                        .toLowerCase()
                        .includes(search) ||

                    String(
                        user.id
                    )
                        .includes(search);


                const matchesRole =
                    role === "all" ||
                    user.role === role;


                const matchesStatus =
                    status === "all" ||

                    (
                        status === "active" &&
                        user.is_active
                    ) ||

                    (
                        status === "disabled" &&
                        !user.is_active
                    );


                return (
                    matchesSearch &&
                    matchesRole &&
                    matchesStatus
                );

            }
        );


    filteredAdminUsers.sort(
        (
            a,
            b
        ) => {

            switch (sort) {

                case "oldest":

                    return (
                        new Date(
                            a.created_at || 0
                        ) -
                        new Date(
                            b.created_at || 0
                        )
                    );


                case "name-asc":

                    return (
                        a.full_name
                            .localeCompare(
                                b.full_name
                            )
                    );


                case "name-desc":

                    return (
                        b.full_name
                            .localeCompare(
                                a.full_name
                            )
                    );


                case "id-asc":

                    return (
                        a.id -
                        b.id
                    );


                case "id-desc":

                    return (
                        b.id -
                        a.id
                    );


                case "role":

                    return (
                        a.role
                            .localeCompare(
                                b.role
                            ) ||
                        a.full_name
                            .localeCompare(
                                b.full_name
                            )
                    );


                case "status":

                    return (
                        Number(
                            b.is_active
                        ) -
                        Number(
                            a.is_active
                        )
                    );


                case "newest":

                default:

                    return (
                        new Date(
                            b.created_at || 0
                        ) -
                        new Date(
                            a.created_at || 0
                        )
                    );

            }

        }
    );


    renderAdminUsers();

    updateUserCountLabel();

    updateSearchClear();

}


/* =========================================================
   USER COUNT
========================================================= */

function updateUserCountLabel() {

    const element =
        document.getElementById(
            "user-filter-result"
        );


    if (!element) {
        return;
    }


    const visible =
        filteredAdminUsers.length;


    const total =
        allAdminUsers.length;


    element.textContent =
        `Showing ${visible} of ${total} users`;

}


/* =========================================================
   SEARCH CLEAR
========================================================= */

function updateSearchClear() {

    if (!searchClear) {
        return;
    }


    searchClear.hidden =
        !(
            searchInput?.value ||
            ""
        ).trim();

}


/* =========================================================
   RENDER USERS
========================================================= */

function renderAdminUsers() {

    const tbody =
        document.getElementById(
            "users-table-body"
        );


    if (!tbody) {
        return;
    }


    if (
        filteredAdminUsers.length ===
        0
    ) {

        tbody.innerHTML = `
            <tr>

                <td
                    colspan="6"
                    class="admin-loading"
                >

                    <div class="admin-loading-inner">

                        <span>
                            No users match the current filters.
                        </span>

                    </div>

                </td>

            </tr>
        `;

        return;
    }


    tbody.innerHTML =
        filteredAdminUsers
            .map(
                user => {

                    const isCurrentAdmin =
                        Number(
                            user.id
                        ) ===
                        Number(
                            adminCurrentUserId
                        );


                    const roleLabel =
                        user.role === "admin"
                            ? "Administrator"
                            : "User";


                    const roleClass =
                        user.role === "admin"
                            ? "admin-badge-admin"
                            : "admin-badge-user";


                    const roleIcon =
                        user.role === "admin"
                            ? icon("shield")
                            : icon("user");


                    const statusLabel =
                        user.is_active
                            ? "Active"
                            : "Disabled";


                    const statusClass =
                        user.is_active
                            ? "admin-badge-active"
                            : "admin-badge-disabled";


                    const statusIcon =
                        user.is_active
                            ? `
                                <svg
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="8"
                                    />

                                    <path
                                        d="m8.5 12 2.3 2.3 4.8-5"
                                    />
                                </svg>
                              `
                            : `
                                <svg
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="8"
                                    />

                                    <path
                                        d="m9 9 6 6"
                                    />

                                    <path
                                        d="m15 9-6 6"
                                    />
                                </svg>
                              `;


                    const statusButton =
                        isCurrentAdmin
                            ? `
                                <button
                                    type="button"
                                    class="admin-action-button current-admin"
                                    disabled
                                    title="Current administrator"
                                >
                                    ${icon("shield")}
                                    <span>
                                        Current Admin
                                    </span>
                                </button>
                              `
                            :
                                user.is_active
                                    ? `
                                        <button
                                            type="button"
                                            class="admin-action-button disable"
                                            data-action="toggle-user"
                                            data-user-id="${user.id}"
                                            data-current-active="true"
                                            data-user-name="${escapeHtml(
                                                user.full_name
                                            )}"
                                        >
                                            ${icon("userOff")}
                                            <span>
                                                Disable
                                            </span>
                                        </button>
                                      `
                                    : `
                                        <button
                                            type="button"
                                            class="admin-action-button activate"
                                            data-action="toggle-user"
                                            data-user-id="${user.id}"
                                            data-current-active="false"
                                            data-user-name="${escapeHtml(
                                                user.full_name
                                            )}"
                                        >
                                            ${icon("userCheck")}
                                            <span>
                                                Activate
                                            </span>
                                        </button>
                                      `;


                    const roleButton =
                        isCurrentAdmin
                            ? ""
                            : `
                                <button
                                    type="button"
                                    class="admin-action-button"
                                    data-action="change-role"
                                    data-user-id="${user.id}"
                                    data-user-name="${escapeHtml(
                                        user.full_name
                                    )}"
                                    data-current-role="${escapeHtml(
                                        user.role
                                    )}"
                                >
                                    ${icon("edit")}
                                    <span>
                                        ${user.role === "admin"
                                            ? "Make User"
                                            : "Make Admin"}
                                    </span>
                                </button>
                              `;


                    const deleteButton =
                        isCurrentAdmin
                            ? ""
                            : `
                                <button
                                    type="button"
                                    class="admin-action-button"
                                    data-action="delete-user"
                                    data-user-id="${user.id}"
                                    data-user-name="${escapeHtml(
                                        user.full_name
                                    )}"
                                >
                                    ${icon("trash")}
                                    <span>
                                        Delete
                                    </span>
                                </button>
                              `;


                    return `
                        <tr>

                            <td>

                                <div class="admin-user-cell">

                                    <div class="admin-avatar">
                                        ${escapeHtml(
                                            getInitials(
                                                user.full_name
                                            )
                                        )}
                                    </div>

                                    <div class="admin-user-cell-info">

                                        <strong>
                                            ${escapeHtml(
                                                user.full_name
                                            )}
                                        </strong>

                                        <span>
                                            ${escapeHtml(
                                                user.email
                                            )}
                                        </span>

                                    </div>

                                </div>

                            </td>


                            <td>

                                <span
                                    class="admin-badge ${roleClass}"
                                >

                                    ${roleIcon}

                                    <span>
                                        ${roleLabel}
                                    </span>

                                </span>

                            </td>


                            <td>

                                <span
                                    class="admin-badge ${statusClass}"
                                >

                                    ${statusIcon}

                                    <span>
                                        ${statusLabel}
                                    </span>

                                </span>

                            </td>


                            <td>
                                #${escapeHtml(
                                    user.id
                                )}
                            </td>


                            <td>
                                ${formatDate(
                                    user.created_at
                                )}
                            </td>


                            <td class="admin-action-cell">

                                <button
                                    type="button"
                                    class="admin-action-button"
                                    data-action="view-user"
                                    data-user-id="${user.id}"
                                >
                                    ${icon("eye")}
                                    <span>
                                        View
                                    </span>
                                </button>

                                ${statusButton}

                                ${roleButton}

                                ${deleteButton}

                            </td>

                        </tr>
                    `;

                }
            )
            .join("");

}


/* =========================================================
   LOAD USERS
========================================================= */

async function loadUsers() {

    const tbody =
        document.getElementById(
            "users-table-body"
        );


    if (tbody) {

        tbody.innerHTML = `
            <tr>

                <td
                    colspan="6"
                    class="admin-loading"
                >

                    <div class="admin-loading-inner">

                        <span class="admin-loading-spinner"></span>

                        <span>
                            Loading users...
                        </span>

                    </div>

                </td>

            </tr>
        `;

    }


    const data =
        await apiRequest(
            `${API_BASE}/admin/users`
        );


    const users =
        data?.users ||
        data?.data?.users ||
        data?.data ||
        data;


    allAdminUsers =
        Array.isArray(users)
            ? users.map(
                normalizeUser
            )
            : [];


    populateReceiptUserFilter();

    applyUserFilters();

}


/* =========================================================
   USER DETAILS
========================================================= */

function showUserDetails(
    userId
) {

    const user =
        allAdminUsers.find(
            item =>
                Number(
                    item.id
                ) ===
                Number(
                    userId
                )
        );


    if (!user) {

        showError(
            "User details could not be found."
        );

        return;

    }


    const receiptCount =
        allAdminReceipts.filter(
            receipt =>
                Number(
                    receipt.user_id
                ) ===
                Number(
                    user.id
                )
        ).length;


    const roleLabel =
        user.role === "admin"
            ? "Administrator"
            : "User";


    const statusLabel =
        user.is_active
            ? "Active"
            : "Disabled";


    const {
        modal,
        close,
    } =
        createModal({

            id:
                "admin-user-details-modal",

            title:
                "User Details",

            subtitle:
                `Account #${user.id}`,

            body: `
                <div class="admin-js-detail-grid">

                    <div class="admin-js-detail-item">

                        <span class="admin-js-detail-label">
                            Full Name
                        </span>

                        <span class="admin-js-detail-value">
                            ${escapeHtml(
                                user.full_name
                            )}
                        </span>

                    </div>


                    <div class="admin-js-detail-item">

                        <span class="admin-js-detail-label">
                            User ID
                        </span>

                        <span class="admin-js-detail-value">
                            #${escapeHtml(
                                user.id
                            )}
                        </span>

                    </div>


                    <div class="admin-js-detail-item">

                        <span class="admin-js-detail-label">
                            Email
                        </span>

                        <span class="admin-js-detail-value">
                            ${escapeHtml(
                                user.email
                            )}
                        </span>

                    </div>


                    <div class="admin-js-detail-item">

                        <span class="admin-js-detail-label">
                            Role
                        </span>

                        <span class="admin-js-detail-value">
                            ${roleLabel}
                        </span>

                    </div>


                    <div class="admin-js-detail-item">

                        <span class="admin-js-detail-label">
                            Status
                        </span>

                        <span class="admin-js-detail-value">
                            ${statusLabel}
                        </span>

                    </div>


                    <div class="admin-js-detail-item">

                        <span class="admin-js-detail-label">
                            Receipts
                        </span>

                        <span class="admin-js-detail-value">
                            ${receiptCount.toLocaleString()}
                        </span>

                    </div>


                    <div class="admin-js-detail-item">

                        <span class="admin-js-detail-label">
                            Created
                        </span>

                        <span class="admin-js-detail-value">
                            ${formatDateTime(
                                user.created_at
                            )}
                        </span>

                    </div>


                    <div class="admin-js-detail-item">

                        <span class="admin-js-detail-label">
                            Updated
                        </span>

                        <span class="admin-js-detail-value">
                            ${formatDateTime(
                                user.updated_at
                            )}
                        </span>

                    </div>

                </div>
            `,

            footer: `
                <button
                    type="button"
                    class="admin-js-modal-button secondary"
                    id="close-user-details"
                >
                    Close
                </button>
            `,

        });


    modal
        .querySelector(
            "#close-user-details"
        )
        ?.addEventListener(
            "click",
            close
        );

}


/* =========================================================
   TOGGLE USER STATUS
========================================================= */

async function toggleUserStatus(
    userId,
    currentIsActive,
    userName,
    button
) {

    const nextStatus =
        !currentIsActive;


    const actionText =
        nextStatus
            ? "activate"
            : "disable";


    const confirmed =
        window.confirm(
            `Are you sure you want to ${actionText} "${userName}"?`
        );


    if (!confirmed) {
        return;
    }


    button.disabled =
        true;


    const previousText =
        button.innerHTML;


    button.innerHTML = `
        <span class="admin-loading-spinner"></span>

        <span>
            Updating...
        </span>
    `;


    try {

        await apiRequest(
            `${API_BASE}/admin/users/${userId}/status`,
            {
                method:
                    "PUT",

                body:
                    JSON.stringify(
                        {
                            is_active:
                                nextStatus,
                        }
                    ),
            }
        );


        const index =
            allAdminUsers.findIndex(
                user =>
                    Number(
                        user.id
                    ) ===
                    Number(
                        userId
                    )
            );


        if (
            index !== -1
        ) {

            allAdminUsers[index] = {
                ...allAdminUsers[index],

                is_active:
                    nextStatus,
            };

        }


        await loadOverview();

        applyUserFilters();

        showSuccess(
            nextStatus
                ? "User account activated successfully."
                : "User account disabled successfully."
        );


        setTimeout(
            clearMessage,
            2500
        );

    } catch (error) {

        console.error(
            "Failed to update user status:",
            error
        );


        button.disabled =
            false;


        button.innerHTML =
            previousText;


        showError(
            error.message ||
            "Failed to update user status."
        );

    }

}


/* =========================================================
   CHANGE USER ROLE
========================================================= */

async function changeUserRole(
    userId,
    userName,
    currentRole
) {

    if (
        Number(
            userId
        ) ===
        Number(
            adminCurrentUserId
        )
    ) {

        showError(
            "You cannot change your own administrator role."
        );

        return;

    }


    const newRole =
        currentRole === "admin"
            ? "user"
            : "admin";


    const roleLabel =
        newRole === "admin"
            ? "Administrator"
            : "User";


    const confirmed =
        window.confirm(
            `Change "${userName}" role to ${roleLabel}?`
        );


    if (!confirmed) {
        return;
    }


    try {

        await apiRequest(
            `${API_BASE}/admin/users/${userId}/role`,
            {
                method:
                    "PUT",

                body:
                    JSON.stringify(
                        {
                            role:
                                newRole,
                        }
                    ),
            }
        );


        const index =
            allAdminUsers.findIndex(
                user =>
                    Number(
                        user.id
                    ) ===
                    Number(
                        userId
                    )
            );


        if (
            index !== -1
        ) {

            allAdminUsers[index] = {
                ...allAdminUsers[index],

                role:
                    newRole,
            };

        }


        await loadOverview();

        applyUserFilters();

        showSuccess(
            `User role changed to ${roleLabel}.`
        );


        setTimeout(
            clearMessage,
            2500
        );

    } catch (error) {

        console.error(
            "Failed to change user role:",
            error
        );


        showError(
            error.message ||
            "Failed to change user role."
        );

    }

}


/* =========================================================
   DELETE USER
========================================================= */

async function deleteUserAccount(
    userId,
    userName
) {

    if (
        Number(
            userId
        ) ===
        Number(
            adminCurrentUserId
        )
    ) {

        showError(
            "You cannot delete your own administrator account."
        );

        return;

    }


    const confirmed =
        window.confirm(
            `Delete "${userName}" permanently?\n\nThis action may also remove the user's receipts.`
        );


    if (!confirmed) {
        return;
    }


    try {

        await apiRequest(
            `${API_BASE}/admin/users/${userId}`,
            {
                method:
                    "DELETE",
            }
        );


        allAdminUsers =
            allAdminUsers.filter(
                user =>
                    Number(
                        user.id
                    ) !==
                    Number(
                        userId
                    )
            );


        allAdminReceipts =
            allAdminReceipts.filter(
                receipt =>
                    Number(
                        receipt.user_id
                    ) !==
                    Number(
                        userId
                    )
            );


        populateReceiptUserFilter();

        applyUserFilters();

        applyReceiptFilters();


        await Promise.all(
            [
                loadOverview(),
                loadReceiptAnalytics(),
                loadAdminReceipts(),
            ]
        );


        showSuccess(
            "User account deleted successfully."
        );


        setTimeout(
            clearMessage,
            2500
        );

    } catch (error) {

        console.error(
            "Failed to delete user:",
            error
        );


        showError(
            error.message ||
            "Failed to delete user."
        );

    }

}


/* =========================================================
   CREATE ADMIN MODAL
========================================================= */

function openCreateAdminModal() {

    const {
        modal,
        close,
    } =
        createModal({

            id:
                "create-admin-modal",

            title:
                "Create Administrator",

            subtitle:
                "Create a new account with administrator access.",

            body: `
                <form
                    id="admin-create-form"
                    autocomplete="off"
                >

                    <div class="admin-js-form-grid">

                        <div class="admin-js-form-group full">

                            <label
                                for="new-admin-full-name"
                            >
                                Full Name
                            </label>

                            <input
                                id="new-admin-full-name"
                                name="full_name"
                                type="text"
                                maxlength="120"
                                required
                                placeholder="Enter full name"
                            >

                        </div>


                        <div class="admin-js-form-group full">

                            <label
                                for="new-admin-email"
                            >
                                Email
                            </label>

                            <input
                                id="new-admin-email"
                                name="email"
                                type="email"
                                maxlength="255"
                                required
                                placeholder="Enter email address"
                            >

                        </div>


                        <div class="admin-js-form-group full">

                            <label
                                for="new-admin-password"
                            >
                                Password
                            </label>

                            <input
                                id="new-admin-password"
                                name="password"
                                type="password"
                                minlength="8"
                                required
                                placeholder="Minimum 8 characters"
                            >

                        </div>

                    </div>


                    <div
                        id="admin-create-form-error"
                        class="admin-js-modal-error"
                        hidden
                    ></div>

                </form>
            `,

            footer: `
                <button
                    type="button"
                    class="admin-js-modal-button secondary"
                    id="cancel-create-admin"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    form="admin-create-form"
                    class="admin-js-modal-button primary"
                    id="submit-create-admin"
                >
                    Create Admin
                </button>
            `,

        });


    const form =
        modal.querySelector(
            "#admin-create-form"
        );


    const submitButton =
        modal.querySelector(
            "#submit-create-admin"
        );


    const errorBox =
        modal.querySelector(
            "#admin-create-form-error"
        );


    modal
        .querySelector(
            "#cancel-create-admin"
        )
        ?.addEventListener(
            "click",
            close
        );


    modal
        .querySelector(
            "#new-admin-full-name"
        )
        ?.focus();


    form?.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            if (!form.reportValidity()) {
                return;
            }


            submitButton.disabled =
                true;


            submitButton.textContent =
                "Creating...";


            errorBox.hidden =
                true;


            const formData =
                new FormData(
                    form
                );


            const payload = {

                full_name:
                    String(
                        formData.get(
                            "full_name"
                        ) || ""
                    ).trim(),

                email:
                    String(
                        formData.get(
                            "email"
                        ) || ""
                    ).trim(),

                password:
                    String(
                        formData.get(
                            "password"
                        ) || ""
                    ),

            };


            try {

                await apiRequest(
                    `${API_BASE}/admin/users/admin`,
                    {
                        method:
                            "POST",

                        body:
                            JSON.stringify(
                                payload
                            ),
                    }
                );


                close();

                await Promise.all(
                    [
                        loadOverview(),
                        loadUsers(),
                    ]
                );


                showSuccess(
                    "Administrator account created successfully."
                );


                setTimeout(
                    clearMessage,
                    2500
                );

            } catch (error) {

                console.error(
                    "Failed to create admin:",
                    error
                );


                errorBox.textContent =
                    error.message ||
                    "Failed to create administrator.";


                errorBox.hidden =
                    false;


                submitButton.disabled =
                    false;


                submitButton.textContent =
                    "Create Admin";

            }

        }
    );

}


/* =========================================================
   USER ANALYTICS
========================================================= */

function getMonthKey(
    date
) {

    return [
        date.getFullYear(),

        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        ),
    ].join("-");

}


function getLastSixMonths() {

    const months = [];

    const now =
        new Date();


    now.setDate(1);

    now.setHours(
        0,
        0,
        0,
        0
    );


    for (
        let index = 5;
        index >= 0;
        index--
    ) {

        const date =
            new Date(
                now
            );


        date.setMonth(
            now.getMonth() -
            index
        );


        months.push({

            key:
                getMonthKey(
                    date
                ),

            label:
                date.toLocaleDateString(
                    undefined,
                    {
                        month:
                            "short",
                    }
                ),

            count:
                0,

        });

    }


    return months;

}


function renderRegistrationChart() {

    const container =
        document.getElementById(
            "registration-chart"
        );


    if (!container) {
        return;
    }


    const months =
        getLastSixMonths();


    allAdminUsers.forEach(
        user => {

            if (!user.created_at) {
                return;
            }


            const date =
                new Date(
                    user.created_at
                );


            if (
                Number.isNaN(
                    date.getTime()
                )
            ) {

                return;

            }


            const month =
                months.find(
                    item =>
                        item.key ===
                        getMonthKey(
                            date
                        )
                );


            if (month) {

                month.count +=
                    1;

            }

        }
    );


    const maxCount =
        Math.max(
            ...months.map(
                month =>
                    month.count
            ),
            1
        );


    container.innerHTML =
        months
            .map(
                month => {

                    const height =
                        month.count === 0
                            ? 4
                            : Math.max(
                                8,
                                (
                                    month.count /
                                    maxCount
                                ) * 100
                            );


                    return `
                        <div class="admin-chart-column">

                            <span class="admin-chart-value">
                                ${month.count}
                            </span>

                            <div class="admin-chart-bar-area">

                                <div
                                    class="admin-chart-bar"
                                    style="height:${height}%"
                                ></div>

                            </div>

                            <span class="admin-chart-month">
                                ${escapeHtml(
                                    month.label
                                )}
                            </span>

                        </div>
                    `;

                }
            )
            .join("");

}


function updateAnalyticsSnapshot() {

    const totalUsers =
        Number(
            currentOverview
                .total_users ||
            allAdminUsers.length ||
            0
        );


    const activeUsers =
        Number(
            currentOverview
                .active_users ||
            0
        );


    const disabledUsers =
        Math.max(
            0,
            totalUsers -
            activeUsers
        );


    const adminUsers =
        Number(
            currentOverview
                .admin_users ||
            allAdminUsers.filter(
                user =>
                    user.role ===
                    "admin"
            ).length
        );


    const activeCount =
        document.getElementById(
            "analytics-active-count"
        );


    const disabledCount =
        document.getElementById(
            "analytics-disabled-count"
        );


    const adminCount =
        document.getElementById(
            "analytics-admin-count"
        );


    const receiptsCount =
        document.getElementById(
            "analytics-receipts-count"
        );


    if (activeCount) {

        activeCount.textContent =
            activeUsers
                .toLocaleString();

    }


    if (disabledCount) {

        disabledCount.textContent =
            disabledUsers
                .toLocaleString();

    }


    if (adminCount) {

        adminCount.textContent =
            adminUsers
                .toLocaleString();

    }


    if (receiptsCount) {

        receiptsCount.textContent =
            Number(
                currentOverview
                    .total_receipts ||
                0
            ).toLocaleString();

    }

}


function renderAdminAnalytics() {

    renderRegistrationChart();

    updateAnalyticsSnapshot();

}


/* =========================================================
   RECEIPT ANALYTICS
========================================================= */

async function loadReceiptAnalytics() {

    const data =
        await apiRequest(
            `${API_BASE}/admin/receipt-analytics`
        );


    const analytics =
        data?.analytics ||
        data?.data?.analytics ||
        data?.data ||
        data;


    renderMonthlyReceiptReport(
        analytics?.monthly ||
        []
    );


    renderCurrencyReceiptReport(
        analytics?.currencies ||
        []
    );


    renderUserReceiptReport(
        analytics?.users ||
        []
    );

}


function renderMonthlyReceiptReport(
    monthly
) {

    const container =
        document.getElementById(
            "receipt-monthly-report"
        );


    if (!container) {
        return;
    }


    if (!monthly.length) {

        container.innerHTML = `
            <div class="admin-report-empty">
                No receipt activity available.
            </div>
        `;

        return;

    }


    const visibleMonths =
        monthly.slice(-8);


    const maxCount =
        Math.max(
            ...visibleMonths.map(
                item =>
                    Number(
                        item.receipt_count ||
                        0
                    )
            ),
            1
        );


    container.innerHTML =
        visibleMonths
            .map(
                item => {

                    const count =
                        Number(
                            item.receipt_count ||
                            0
                        );


                    const height =
                        Math.max(
                            5,
                            (
                                count /
                                maxCount
                            ) * 100
                        );


                    return `
                        <div class="admin-report-column">

                            <strong class="admin-report-column-value">
                                ${count}
                            </strong>

                            <div class="admin-report-column-area">

                                <div
                                    class="admin-report-column-bar"
                                    style="height:${height}%"
                                ></div>

                            </div>

                            <span class="admin-report-column-label">
                                ${escapeHtml(
                                    item.month
                                )}
                            </span>

                        </div>
                    `;

                }
            )
            .join("");

}


function renderCurrencyReceiptReport(
    currencies
) {

    const container =
        document.getElementById(
            "receipt-currency-report"
        );


    if (!container) {
        return;
    }


    if (!currencies.length) {

        container.innerHTML = `
            <div class="admin-report-empty">
                No currency data available.
            </div>
        `;

        return;

    }


    const total =
        currencies.reduce(
            (
                sum,
                item
            ) =>
                sum +
                Number(
                    item.receipt_count ||
                    0
                ),

            0
        );


    container.innerHTML =
        currencies
            .slice(
                0,
                6
            )
            .map(
                item => {

                    const count =
                        Number(
                            item.receipt_count ||
                            0
                        );


                    const percentage =
                        total > 0
                            ? (
                                count /
                                total
                            ) * 100
                            : 0;


                    return `
                        <div class="admin-report-list-row">

                            <div class="admin-report-list-top">

                                <span>
                                    ${escapeHtml(
                                        item.currency
                                    )}
                                </span>

                                <strong>
                                    ${count}
                                </strong>

                            </div>

                            <div class="admin-report-progress">

                                <div
                                    style="width:${percentage}%"
                                ></div>

                            </div>

                        </div>
                    `;

                }
            )
            .join("");

}


function renderUserReceiptReport(
    users
) {

    const container =
        document.getElementById(
            "receipt-user-report"
        );


    if (!container) {
        return;
    }


    if (!users.length) {

        container.innerHTML = `
            <div class="admin-report-empty">
                No receipt activity available.
            </div>
        `;

        return;

    }


    const maxCount =
        Math.max(
            ...users.map(
                user =>
                    Number(
                        user.receipt_count ||
                        0
                    )
            ),
            1
        );


    container.innerHTML =
        users
            .slice(
                0,
                10
            )
            .map(
                user => {

                    const count =
                        Number(
                            user.receipt_count ||
                            0
                        );


                    const percentage =
                        (
                            count /
                            maxCount
                        ) * 100;


                    return `
                        <div class="admin-report-user-row">

                            <div class="admin-report-user-info">

                                <div class="admin-report-user-avatar">

                                    ${escapeHtml(
                                        getInitials(
                                            user.full_name
                                        )
                                    )}

                                </div>

                                <div>

                                    <strong>
                                        ${escapeHtml(
                                            user.full_name
                                        )}
                                    </strong>

                                    <span>
                                        User #${escapeHtml(
                                            user.user_id
                                        )}
                                    </span>

                                </div>

                            </div>


                            <div class="admin-report-user-stat">

                                <strong>
                                    ${count}
                                </strong>

                                <div class="admin-report-user-bar">

                                    <div
                                        style="width:${percentage}%"
                                    ></div>

                                </div>

                            </div>

                        </div>
                    `;

                }
            )
            .join("");

}


/* =========================================================
   ADMIN RECEIPT MANAGEMENT
========================================================= */

async function loadAdminReceipts() {

    const tbody =
        document.getElementById(
            "admin-receipts-table-body"
        );


    if (tbody) {

        tbody.innerHTML = `
            <tr>

                <td
                    colspan="7"
                    class="admin-loading"
                >

                    <div class="admin-loading-inner">

                        <span class="admin-loading-spinner"></span>

                        <span>
                            Loading receipts...
                        </span>

                    </div>

                </td>

            </tr>
        `;

    }


    const data =
        await apiRequest(
            `${API_BASE}/admin/receipts`
        );


    const receipts =
        data?.receipts ||
        data?.data?.receipts ||
        data?.data ||
        data;


    allAdminReceipts =
        Array.isArray(
            receipts
        )
            ? receipts.map(
                normalizeReceipt
            )
            : [];


    populateReceiptFilters();

    applyReceiptFilters();

}


function populateReceiptFilters() {

    populateReceiptCurrencyFilter();

    populateReceiptUserFilter();

}


function populateReceiptCurrencyFilter() {

    if (!receiptCurrencyFilter) {
        return;
    }


    const currentValue =
        receiptCurrencyFilter.value ||
        "all";


    const currencies =
        [
            ...new Set(
                allAdminReceipts
                    .map(
                        receipt =>
                            String(
                                receipt.currency ||
                                ""
                            ).trim()
                    )
                    .filter(Boolean)
            ),
        ]
            .sort(
                (
                    a,
                    b
                ) =>
                    a.localeCompare(
                        b
                    )
            );


    receiptCurrencyFilter.innerHTML = `
        <option value="all">
            All Currencies
        </option>

        ${currencies
            .map(
                currency =>
                    `
                        <option
                            value="${escapeHtml(
                                currency
                            )}"
                        >
                            ${escapeHtml(
                                currency
                            )}
                        </option>
                    `
            )
            .join("")}
    `;


    if (
        currencies.includes(
            currentValue
        )
    ) {

        receiptCurrencyFilter.value =
            currentValue;

    } else {

        receiptCurrencyFilter.value =
            "all";

    }

}


function populateReceiptUserFilter() {

    if (!receiptUserFilter) {
        return;
    }


    const currentValue =
        receiptUserFilter.value ||
        "all";


    const users =
        allAdminUsers
            .slice()
            .sort(
                (
                    a,
                    b
                ) =>
                    a.full_name
                        .localeCompare(
                            b.full_name
                        )
            );


    receiptUserFilter.innerHTML = `
        <option value="all">
            All Users
        </option>

        ${users
            .map(
                user =>
                    `
                        <option
                            value="${escapeHtml(
                                user.id
                            )}"
                        >
                            ${escapeHtml(
                                user.full_name
                            )}
                        </option>
                    `
            )
            .join("")}
    `;


    if (
        users.some(
            user =>
                String(
                    user.id
                ) ===
                String(
                    currentValue
                )
        )
    ) {

        receiptUserFilter.value =
            currentValue;

    } else {

        receiptUserFilter.value =
            "all";

    }

}


function applyReceiptFilters() {

    const search =
        (
            receiptSearchInput?.value ||
            ""
        )
            .trim()
            .toLowerCase();


    const currency =
        receiptCurrencyFilter?.value ||
        "all";


    const userId =
        receiptUserFilter?.value ||
        "all";


    const sort =
        receiptSortFilter?.value ||
        "newest";


    filteredAdminReceipts =
        allAdminReceipts.filter(
            receipt => {

                const searchable =
                    [
                        receipt.id,
                        receipt.user_id,
                        receipt.user_name,
                        receipt.user_email,
                        receipt.merchant_name,
                        receipt.invoice_number,
                        receipt.receipt_date,
                        receipt.currency,
                        receipt.payment_method,
                        receipt.total,
                    ]
                        .map(
                            value =>
                                String(
                                    value ??
                                    ""
                                ).toLowerCase()
                        )
                        .join(" ");


                const matchesSearch =
                    !search ||
                    searchable.includes(
                        search
                    );


                const matchesCurrency =
                    currency === "all" ||
                    String(
                        receipt.currency ||
                        ""
                    ) ===
                    String(
                        currency
                    );


                const matchesUser =
                    userId === "all" ||
                    String(
                        receipt.user_id ??
                        ""
                    ) ===
                    String(
                        userId
                    );


                return (
                    matchesSearch &&
                    matchesCurrency &&
                    matchesUser
                );

            }
        );


    filteredAdminReceipts.sort(
        (
            a,
            b
        ) => {

            switch (sort) {

                case "oldest":

                    return (
                        new Date(
                            a.created_at || 0
                        ) -
                        new Date(
                            b.created_at || 0
                        )
                    );


                case "total-high":

                    return (
                        Number(
                            b.total || 0
                        ) -
                        Number(
                            a.total || 0
                        )
                    );


                case "total-low":

                    return (
                        Number(
                            a.total || 0
                        ) -
                        Number(
                            b.total || 0
                        )
                    );


                case "merchant":

                    return (
                        a.merchant_name
                            .localeCompare(
                                b.merchant_name
                            )
                    );


                case "newest":

                default:

                    return (
                        new Date(
                            b.created_at || 0
                        ) -
                        new Date(
                            a.created_at || 0
                        )
                    );

            }

        }
    );


    renderAdminReceipts();

    updateReceiptCountLabel();

}


function updateReceiptCountLabel() {

    const element =
        document.getElementById(
            "admin-receipt-filter-result"
        );


    if (!element) {
        return;
    }


    element.textContent =
        `Showing ${filteredAdminReceipts.length} of ${allAdminReceipts.length} receipts`;

}


function renderAdminReceipts() {

    const tbody =
        document.getElementById(
            "admin-receipts-table-body"
        );


    if (!tbody) {
        return;
    }


    if (
        filteredAdminReceipts.length ===
        0
    ) {

        tbody.innerHTML = `
            <tr>

                <td
                    colspan="7"
                    class="admin-loading"
                >

                    <div class="admin-loading-inner">

                        <span>
                            No receipts match the current filters.
                        </span>

                    </div>

                </td>

            </tr>
        `;

        return;
    }


    tbody.innerHTML =
        filteredAdminReceipts
            .map(
                receipt => {

                    const userName =
                        receipt.user_name ||
                        "Unknown User";


                    const merchant =
                        receipt.merchant_name ||
                        "Unknown Merchant";


                    const receiptDate =
                        receipt.receipt_date ||
                        receipt.created_at;


                    return `
                        <tr>

                            <td>

                                <div class="admin-user-cell">

                                    <div class="admin-avatar">
                                        ${icon("receipt")}
                                    </div>

                                    <div class="admin-user-cell-info">

                                        <strong>
                                            Receipt #${escapeHtml(
                                                receipt.id
                                            )}
                                        </strong>

                                        <span>
                                            ${
                                                receipt.invoice_number
                                                    ? `Invoice ${escapeHtml(
                                                        receipt.invoice_number
                                                    )}`
                                                    : "No invoice number"
                                            }
                                        </span>

                                    </div>

                                </div>

                            </td>


                            <td>

                                <div class="admin-user-cell">

                                    <div class="admin-avatar">
                                        ${escapeHtml(
                                            getInitials(
                                                userName
                                            )
                                        )}
                                    </div>

                                    <div class="admin-user-cell-info">

                                        <strong>
                                            ${escapeHtml(
                                                userName
                                            )}
                                        </strong>

                                        <span>
                                            ${escapeHtml(
                                                receipt.user_email
                                            )}
                                        </span>

                                    </div>

                                </div>

                            </td>


                            <td>
                                ${escapeHtml(
                                    merchant
                                )}
                            </td>


                            <td>
                                ${formatDate(
                                    receiptDate
                                )}
                            </td>


                            <td>
                                ${formatMoney(
                                    receipt.total,
                                    receipt.currency
                                )}
                            </td>


                            <td>
                                ${escapeHtml(
                                    receipt.currency ||
                                    "—"
                                )}
                            </td>


                            <td class="admin-action-cell">

                                <button
                                    type="button"
                                    class="admin-action-button"
                                    data-action="view-receipt"
                                    data-receipt-id="${receipt.id}"
                                >
                                    ${icon("eye")}
                                    <span>
                                        View
                                    </span>
                                </button>


                                <button
                                    type="button"
                                    class="admin-action-button"
                                    data-action="delete-receipt"
                                    data-receipt-id="${receipt.id}"
                                    data-receipt-name="${escapeHtml(
                                        merchant
                                    )}"
                                >
                                    ${icon("trash")}
                                    <span>
                                        Delete
                                    </span>
                                </button>

                            </td>

                        </tr>
                    `;

                }
            )
            .join("");

}


/* =========================================================
   RECEIPT DETAILS
========================================================= */

async function viewReceiptDetails(
    receiptId
) {

    let receipt =
        allAdminReceipts.find(
            item =>
                Number(
                    item.id
                ) ===
                Number(
                    receiptId
                )
        );


    try {

        const data =
            await apiRequest(
                `${API_BASE}/admin/receipts/${receiptId}`
            );


        const details =
            data?.receipt ||
            data?.data?.receipt ||
            data?.data ||
            data;


        if (details) {

            receipt =
                normalizeReceipt(
                    {
                        ...(receipt || {}),
                        ...details,
                    }
                );

        }

    } catch (error) {

        console.error(
            "Failed to load receipt details:",
            error
        );


        if (!receipt) {

            showError(
                error.message ||
                "Failed to load receipt details."
            );

            return;

        }

    }


    if (!receipt) {

        showError(
            "Receipt details could not be found."
        );

        return;

    }


    const items =
        Array.isArray(
            receipt.items
        )
            ? receipt.items
            : [];


    const itemRows =
        items.length
            ? items
                .map(
                    item => {

                        const quantity =
                            Number(
                                item.quantity ??
                                1
                            );


                        const unitPrice =
                            item.unit_price ??
                            null;


                        const totalPrice =
                            item.total_price ??
                            item.total ??
                            null;


                        return `
                            <tr>

                                <td>
                                    ${escapeHtml(
                                        item.name ||
                                        "Unnamed item"
                                    )}
                                </td>

                                <td>
                                    ${escapeHtml(
                                        quantity
                                    )}
                                </td>

                                <td>
                                    ${formatMoney(
                                        unitPrice,
                                        receipt.currency
                                    )}
                                </td>

                                <td>
                                    ${formatMoney(
                                        totalPrice,
                                        receipt.currency
                                    )}
                                </td>

                            </tr>
                        `;

                    }
                )
                .join("")
            : `
                <tr>
                    <td
                        colspan="4"
                        style="text-align:center;opacity:.65"
                    >
                        No items available.
                    </td>
                </tr>
            `;


    const visionCount =
        Array.isArray(
            receipt.vision_analyses
        )
            ? receipt.vision_analyses.length
            : 0;


    const imageCount =
        Array.isArray(
            receipt.images
        )
            ? receipt.images.length
            : 0;


    createModal({

        id:
            "admin-receipt-details-modal",

        title:
            `Receipt #${receipt.id}`,

        subtitle:
            receipt.merchant_name ||
            "Receipt Details",

        body: `

            <div class="admin-js-detail-grid">

                <div class="admin-js-detail-item">

                    <span class="admin-js-detail-label">
                        Merchant
                    </span>

                    <span class="admin-js-detail-value">
                        ${escapeHtml(
                            receipt.merchant_name ||
                            "—"
                        )}
                    </span>

                </div>


                <div class="admin-js-detail-item">

                    <span class="admin-js-detail-label">
                        User
                    </span>

                    <span class="admin-js-detail-value">
                        ${escapeHtml(
                            receipt.user_name
                        )}
                    </span>

                </div>


                <div class="admin-js-detail-item">

                    <span class="admin-js-detail-label">
                        Email
                    </span>

                    <span class="admin-js-detail-value">
                        ${escapeHtml(
                            receipt.user_email
                        )}
                    </span>

                </div>


                <div class="admin-js-detail-item">

                    <span class="admin-js-detail-label">
                        Invoice Number
                    </span>

                    <span class="admin-js-detail-value">
                        ${escapeHtml(
                            receipt.invoice_number ||
                            "—"
                        )}
                    </span>

                </div>


                <div class="admin-js-detail-item">

                    <span class="admin-js-detail-label">
                        Receipt Date
                    </span>

                    <span class="admin-js-detail-value">
                        ${escapeHtml(
                            receipt.receipt_date ||
                            "—"
                        )}
                    </span>

                </div>


                <div class="admin-js-detail-item">

                    <span class="admin-js-detail-label">
                        Receipt Time
                    </span>

                    <span class="admin-js-detail-value">
                        ${escapeHtml(
                            receipt.receipt_time ||
                            "—"
                        )}
                    </span>

                </div>


                <div class="admin-js-detail-item">

                    <span class="admin-js-detail-label">
                        Currency
                    </span>

                    <span class="admin-js-detail-value">
                        ${escapeHtml(
                            receipt.currency ||
                            "—"
                        )}
                    </span>

                </div>


                <div class="admin-js-detail-item">

                    <span class="admin-js-detail-label">
                        Payment Method
                    </span>

                    <span class="admin-js-detail-value">
                        ${escapeHtml(
                            receipt.payment_method ||
                            "—"
                        )}
                    </span>

                </div>


                <div class="admin-js-detail-item">

                    <span class="admin-js-detail-label">
                        Subtotal
                    </span>

                    <span class="admin-js-detail-value">
                        ${formatMoney(
                            receipt.subtotal,
                            receipt.currency
                        )}
                    </span>

                </div>


                <div class="admin-js-detail-item">

                    <span class="admin-js-detail-label">
                        Tax
                    </span>

                    <span class="admin-js-detail-value">
                        ${formatMoney(
                            receipt.tax,
                            receipt.currency
                        )}
                    </span>

                </div>


                <div class="admin-js-detail-item">

                    <span class="admin-js-detail-label">
                        Discount
                    </span>

                    <span class="admin-js-detail-value">
                        ${formatMoney(
                            receipt.discount,
                            receipt.currency
                        )}
                    </span>

                </div>


                <div class="admin-js-detail-item">

                    <span class="admin-js-detail-label">
                        Total
                    </span>

                    <span class="admin-js-detail-value">
                        ${formatMoney(
                            receipt.total,
                            receipt.currency
                        )}
                    </span>

                </div>


                <div class="admin-js-detail-item">

                    <span class="admin-js-detail-label">
                        Created
                    </span>

                    <span class="admin-js-detail-value">
                        ${formatDateTime(
                            receipt.created_at
                        )}
                    </span>

                </div>


                <div class="admin-js-detail-item">

                    <span class="admin-js-detail-label">
                        Updated
                    </span>

                    <span class="admin-js-detail-value">
                        ${formatDateTime(
                            receipt.updated_at
                        )}
                    </span>

                </div>

            </div>


            <h4 class="admin-js-section-title">
                Items
            </h4>


            <div style="overflow:auto">

                <table class="admin-js-items-table">

                    <thead>

                        <tr>

                            <th>
                                Item
                            </th>

                            <th>
                                Qty
                            </th>

                            <th>
                                Unit Price
                            </th>

                            <th>
                                Total
                            </th>

                        </tr>

                    </thead>


                    <tbody>
                        ${itemRows}
                    </tbody>

                </table>

            </div>


            <h4 class="admin-js-section-title">
                Processing Information
            </h4>


            <div class="admin-js-detail-grid">

                <div class="admin-js-detail-item">

                    <span class="admin-js-detail-label">
                        Images
                    </span>

                    <span class="admin-js-detail-value">
                        ${imageCount}
                    </span>

                </div>


                <div class="admin-js-detail-item">

                    <span class="admin-js-detail-label">
                        Vision Analyses
                    </span>

                    <span class="admin-js-detail-value">
                        ${visionCount}
                    </span>

                </div>

            </div>

        `,

        footer: `

            <button
                type="button"
                class="admin-js-modal-button secondary"
                data-modal-close
            >
                Close
            </button>

        `,

    });

}


/* =========================================================
   DELETE RECEIPT
========================================================= */

async function deleteAdminReceipt(
    receiptId,
    merchantName
) {

    const confirmed =
        window.confirm(
            `Delete receipt #${receiptId} from "${merchantName}" permanently?`
        );


    if (!confirmed) {
        return;
    }


    try {

        await apiRequest(
            `${API_BASE}/admin/receipts/${receiptId}`,
            {
                method:
                    "DELETE",
            }
        );


        allAdminReceipts =
            allAdminReceipts.filter(
                receipt =>
                    Number(
                        receipt.id
                    ) !==
                    Number(
                        receiptId
                    )
            );


        applyReceiptFilters();


        const detailModal =
            document.getElementById(
                "admin-receipt-details-modal"
            );


        detailModal?.remove();


        await Promise.all(
            [
                loadOverview(),
                loadReceiptAnalytics(),
            ]
        );


        showSuccess(
            "Receipt deleted successfully."
        );


        setTimeout(
            clearMessage,
            2500
        );

    } catch (error) {

        console.error(
            "Failed to delete receipt:",
            error
        );


        showError(
            error.message ||
            "Failed to delete receipt."
        );

    }

}


/* =========================================================
   EVENTS - CLICK
========================================================= */

document.addEventListener(
    "click",
    event => {

        const actionButton =
            event.target.closest(
                "[data-action]"
            );


        if (!actionButton) {
            return;
        }


        const action =
            actionButton.dataset.action;


        switch (action) {

            case "toggle-user":

                toggleUserStatus(

                    Number(
                        actionButton.dataset.userId
                    ),

                    actionButton.dataset.currentActive ===
                        "true",

                    actionButton.dataset.userName ||
                        "this user",

                    actionButton

                );

                break;


            case "view-user":

                showUserDetails(
                    Number(
                        actionButton.dataset.userId
                    )
                );

                break;


            case "change-role":

                changeUserRole(

                    Number(
                        actionButton.dataset.userId
                    ),

                    actionButton.dataset.userName ||
                        "this user",

                    actionButton.dataset.currentRole ||
                        "user"

                );

                break;


            case "delete-user":

                deleteUserAccount(

                    Number(
                        actionButton.dataset.userId
                    ),

                    actionButton.dataset.userName ||
                        "this user"

                );

                break;


            case "view-receipt":

                viewReceiptDetails(
                    Number(
                        actionButton.dataset.receiptId
                    )
                );

                break;


            case "delete-receipt":

                deleteAdminReceipt(

                    Number(
                        actionButton.dataset.receiptId
                    ),

                    actionButton.dataset.receiptName ||
                        "this merchant"

                );

                break;

        }

    }
);


/* =========================================================
   EVENTS - USER FILTERS
========================================================= */

searchInput?.addEventListener(
    "input",
    applyUserFilters
);


roleFilter?.addEventListener(
    "change",
    applyUserFilters
);


statusFilter?.addEventListener(
    "change",
    applyUserFilters
);


sortFilter?.addEventListener(
    "change",
    applyUserFilters
);


searchClear?.addEventListener(
    "click",
    () => {

        if (searchInput) {

            searchInput.value =
                "";

            searchInput.focus();

        }


        applyUserFilters();

    }
);


clearFiltersButton?.addEventListener(
    "click",
    () => {

        if (searchInput) {

            searchInput.value =
                "";

        }


        if (roleFilter) {

            roleFilter.value =
                "all";

        }


        if (statusFilter) {

            statusFilter.value =
                "all";

        }


        if (sortFilter) {

            sortFilter.value =
                "newest";

        }


        applyUserFilters();

    }
);


/* =========================================================
   EVENTS - RECEIPT FILTERS
========================================================= */

receiptSearchInput?.addEventListener(
    "input",
    applyReceiptFilters
);


receiptCurrencyFilter?.addEventListener(
    "change",
    applyReceiptFilters
);


receiptUserFilter?.addEventListener(
    "change",
    applyReceiptFilters
);


receiptSortFilter?.addEventListener(
    "change",
    applyReceiptFilters
);


clearReceiptFiltersButton?.addEventListener(
    "click",
    () => {

        if (receiptSearchInput) {

            receiptSearchInput.value =
                "";

        }


        if (receiptCurrencyFilter) {

            receiptCurrencyFilter.value =
                "all";

        }


        if (receiptUserFilter) {

            receiptUserFilter.value =
                "all";

        }


        if (receiptSortFilter) {

            receiptSortFilter.value =
                "newest";

        }


        applyReceiptFilters();

    }
);


/* =========================================================
   EVENTS - BUTTONS
========================================================= */

const createAdminButton =
    document.getElementById(
        "create-admin-user"
    );


createAdminButton?.addEventListener(
    "click",
    openCreateAdminModal
);


refreshUsersButton?.addEventListener(
    "click",
    async () => {

        refreshUsersButton.disabled =
            true;


        const oldContent =
            refreshUsersButton.innerHTML;


        refreshUsersButton.innerHTML = `
            ${icon("refresh")}
            <span>
                Refreshing...
            </span>
        `;


        try {

            clearMessage();


            await Promise.all(
                [
                    loadOverview(),
                    loadUsers(),
                    loadReceiptAnalytics(),
                    loadAdminReceipts(),
                ]
            );


            renderAdminAnalytics();


            showSuccess(
                "Admin data refreshed successfully."
            );


            setTimeout(
                clearMessage,
                2000
            );

        } catch (error) {

            console.error(
                "Refresh failed:",
                error
            );


            showError(
                error.message ||
                "Failed to refresh admin data."
            );

        } finally {

            refreshUsersButton.disabled =
                false;

            refreshUsersButton.innerHTML =
                oldContent;

        }

    }
);


refreshReceiptsButton?.addEventListener(
    "click",
    async () => {

        refreshReceiptsButton.disabled =
            true;


        const oldContent =
            refreshReceiptsButton.innerHTML;


        refreshReceiptsButton.innerHTML = `
            ${icon("refresh")}
            <span>
                Refreshing...
            </span>
        `;


        try {

            await Promise.all(
                [
                    loadAdminReceipts(),
                    loadOverview(),
                    loadReceiptAnalytics(),
                ]
            );


            showSuccess(
                "Receipt data refreshed successfully."
            );


            setTimeout(
                clearMessage,
                2000
            );

        } catch (error) {

            console.error(
                "Receipt refresh failed:",
                error
            );


            showError(
                error.message ||
                "Failed to refresh receipt data."
            );

        } finally {

            refreshReceiptsButton.disabled =
                false;

            refreshReceiptsButton.innerHTML =
                oldContent;

        }

    }
);


/* =========================================================
   INITIALIZE
========================================================= */

async function initializeAdmin() {

    injectModalStyles();


    const user =
        await checkAdminAccess();


    if (!user) {
        return;
    }


    try {

        /*
         * Users are loaded first because the receipt
         * user filter depends on the admin users list.
         */

        await loadUsers();


        await Promise.all(
            [
                loadOverview(),
                loadReceiptAnalytics(),
                loadAdminReceipts(),
            ]
        );


        renderAdminAnalytics();


    } catch (error) {

        console.error(
            "Admin initialization failed:",
            error
        );


        showError(
            error.message ||
            "Failed to load admin dashboard."
        );

    }

}


/* =========================================================
   START
========================================================= */

initializeAdmin();