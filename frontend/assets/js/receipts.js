"use strict";

/* =========================================================
   SmartReceiptAI
   Receipts Page
   Production Frontend
   Global Language Support
   ========================================================= */

const API_BASE = "/api/v1";
const PAGE_SIZE = 10;

let allReceipts = [];
let filteredReceipts = [];

let currentPage = 1;
let currentDeleteId = null;
let receiptImageObjectUrl = null;


/* =========================================================
   GLOBAL LANGUAGE
   ========================================================= */

function getCurrentLanguage() {

    return window.SmartReceiptLanguage
        ? window.SmartReceiptLanguage.getLanguage()
        : "en";
}


function t(key) {

    const language =
        getCurrentLanguage();

    const dictionary =
        window.SmartReceiptLanguage
            ?.translations?.[language];

    if (
        dictionary &&
        Object.prototype.hasOwnProperty.call(
            dictionary,
            key
        )
    ) {

        return dictionary[key];
    }

    return key;
}


/* =========================================================
   Authentication
   ========================================================= */

function getAccessToken() {

    return (
        localStorage.getItem("access_token") ||
        localStorage.getItem("accessToken") ||
        localStorage.getItem("token") ||
        null
    );
}


function authHeaders() {

    const token =
        getAccessToken();

    if (!token) {
        return {};
    }

    return {
        Authorization:
            `Bearer ${token}`,
    };
}


/* =========================================================
   DOM Helper
   ========================================================= */

function $(id) {

    return document.getElementById(id);
}


/* =========================================================
   Toast
   ========================================================= */

function showToast(
    message,
    type = "info"
) {

    const container =
        $("receipts-toast-container");


    if (!container) {
        return;
    }


    const toast =
        document.createElement(
            "div"
        );


    toast.className =
        `receipts-toast ${type}`;


    toast.innerHTML = `
        <span class="toast-message"></span>
    `;


    const messageElement =
        toast.querySelector(
            ".toast-message"
        );


    if (messageElement) {

        messageElement.textContent =
            message;
    }


    container.appendChild(
        toast
    );


    requestAnimationFrame(
        () => {

            toast.classList.add(
                "show"
            );
        }
    );


    setTimeout(
        () => {

            toast.classList.remove(
                "show"
            );


            setTimeout(
                () => {

                    toast.remove();

                },
                300
            );

        },
        3000
    );
}


/* =========================================================
   API Request
   ========================================================= */

async function apiRequest(
    url,
    options = {}
) {

    const response =
        await fetch(
            url,
            {
                ...options,

                headers: {
                    ...authHeaders(),
                    ...(options.headers || {}),
                },
            }
        );


    /* ---------------------------------------------
       Authentication Failure
    --------------------------------------------- */

    if (response.status === 401) {

        localStorage.removeItem(
            "access_token"
        );

        localStorage.removeItem(
            "accessToken"
        );

        localStorage.removeItem(
            "token"
        );

        window.location.href =
            "/login";

        return null;
    }


    /* ---------------------------------------------
       Response
    --------------------------------------------- */

    let data = null;

    try {

        data =
            await response.json();

    } catch {

        data = null;
    }


    /* ---------------------------------------------
       API Error
    --------------------------------------------- */

    if (!response.ok) {

        throw new Error(
            data?.detail ||
            data?.message ||
            t("something_went_wrong")
        );
    }


    return data;
}


/* =========================================================
   Download API File
   ========================================================= */

async function downloadApiFile(
    url,
    options = {},
    fallbackFilename = "download"
) {

    const response =
        await fetch(
            url,
            {
                ...options,

                headers: {
                    ...authHeaders(),
                    ...(options.headers || {}),
                },
            }
        );


    if (response.status === 401) {

        localStorage.removeItem(
            "access_token"
        );

        localStorage.removeItem(
            "accessToken"
        );

        localStorage.removeItem(
            "token"
        );

        window.location.href =
            "/login";

        return false;
    }


    if (!response.ok) {

        let message =
            t("download_failed");

        try {

            const data =
                await response.json();

            message =
                data?.detail ||
                data?.message ||
                message;

        } catch {
            /* Ignore JSON parsing failure */
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
        fallbackFilename;


    const filenameMatch =
        contentDisposition?.match(
            /filename="?([^"]+)"?/i
        );


    if (filenameMatch?.[1]) {

        filename =
            filenameMatch[1];
    }


    const objectUrl =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        objectUrl;


    link.download =
        filename;


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    setTimeout(
        () => {

            URL.revokeObjectURL(
                objectUrl
            );

        },
        100
    );


    return true;
}


/* =========================================================
   Current User
   ========================================================= */

async function loadCurrentUser() {

    const userEmail =
        $("user-email");


    if (!userEmail) {
        return;
    }


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
            t("account");


        const email =
            user.email ||
            "—";


        const initial =
            fullName
                .trim()
                .charAt(0)
                .toUpperCase() ||
            "U";


        /* ---------------------------------------------
           Topbar
        --------------------------------------------- */

        userEmail.textContent =
            fullName;


        /* ---------------------------------------------
           Account Menu
        --------------------------------------------- */

        setText(
            "user-menu-name",
            fullName
        );


        setText(
            "user-menu-email",
            email
        );


        /* ---------------------------------------------
           Avatars
        --------------------------------------------- */

        updateReceiptsAvatar(
            "user-avatar",
            user.profile_image,
            initial
        );


        updateReceiptsAvatar(
            "user-menu-avatar",
            user.profile_image,
            initial
        );


    } catch (error) {

        console.error(
            "Failed to load current user:",
            error
        );


        userEmail.textContent =
            t("account");
    }
}


/* =========================================================
   Avatar
   ========================================================= */

function updateReceiptsAvatar(
    elementId,
    imagePath,
    initial
) {

    const avatar =
        $(elementId);


    if (!avatar) {
        return;
    }


    avatar.innerHTML =
        "";


    if (imagePath) {

        const image =
            document.createElement(
                "img"
            );


        image.src =
            normalizeProfileImageUrl(
                imagePath
            );


        image.alt =
            t("profile_image");


        image.loading =
            "eager";


        image.onerror =
            () => {

                avatar.innerHTML =
                    "";

                const fallback =
                    document.createElement(
                        "span"
                    );

                fallback.textContent =
                    initial;

                avatar.appendChild(
                    fallback
                );
            };


        avatar.appendChild(
            image
        );

        return;
    }


    const span =
        document.createElement(
            "span"
        );


    span.textContent =
        initial;


    avatar.appendChild(
        span
    );
}


/* =========================================================
   Profile Image URL
   ========================================================= */

function normalizeProfileImageUrl(
    imagePath
) {

    if (!imagePath) {
        return "";
    }


    if (
        imagePath.startsWith("http://") ||
        imagePath.startsWith("https://")
    ) {

        return imagePath;
    }


    if (
        imagePath.startsWith("/")
    ) {

        return imagePath;
    }


    return "/" +
        imagePath.replace(
            /^\/+/,
            ""
        );
}


/* =========================================================
   Account Menu
   ========================================================= */

function initializeAccountMenu() {

    const button =
        $("user-account-button");


    const menu =
        $("user-account-menu");


    const logoutButton =
        $("account-menu-logout");


    if (
        !button ||
        !menu
    ) {
        return;
    }


    function closeMenu() {

        menu.hidden =
            true;


        button.setAttribute(
            "aria-expanded",
            "false"
        );
    }


    button.addEventListener(
        "click",
        event => {

            event.preventDefault();

            event.stopPropagation();


            const isOpen =
                button.getAttribute(
                    "aria-expanded"
                ) === "true";


            if (isOpen) {

                closeMenu();

            } else {

                menu.hidden =
                    false;


                button.setAttribute(
                    "aria-expanded",
                    "true"
                );
            }
        }
    );


    menu.addEventListener(
        "click",
        event => {

            event.stopPropagation();

        }
    );


    document.addEventListener(
        "click",
        event => {

            if (
                !button.contains(
                    event.target
                ) &&
                !menu.contains(
                    event.target
                )
            ) {

                closeMenu();
            }
        }
    );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                closeMenu();
            }
        }
    );


    logoutButton?.addEventListener(
        "click",
        () => {

            closeMenu();

            logout();
        }
    );
}


/* =========================================================
   Load Receipts
   ========================================================= */

async function loadReceipts() {

    setLoadingState(
        true
    );


    try {

        const data =
            await apiRequest(
                `${API_BASE}/receipt/?skip=0&limit=100`
            );


        if (!data) {
            return;
        }


        allReceipts =
            Array.isArray(
                data.receipts
            )
                ? data.receipts
                : [];


        filteredReceipts =
            [...allReceipts];


        currentPage =
            1;


        updateStatistics();

        applyFilters();


    } catch (error) {

        console.error(
            "Failed to load receipts:",
            error
        );


        showToast(
            error.message ||
            t("failed_to_load_receipts"),
            "error"
        );


        renderEmptyState(
            t("unable_to_load_receipts_try_again")
        );


    } finally {

        setLoadingState(
            false
        );
    }
}


/* =========================================================
   Loading State
   ========================================================= */

function setLoadingState(
    loading
) {

    const tbody =
        $("receipts-table-body");


    if (!tbody) {
        return;
    }


    if (loading) {

        tbody.innerHTML = `

            <tr class="table-loading-row">

                <td colspan="7">

                    <div class="table-loading">

                        <span class="loading-spinner"></span>

                        <span>
                            ${escapeHtml(
                                t(
                                    "loading_receipts"
                                )
                            )}
                        </span>

                    </div>

                </td>

            </tr>

        `;


        const emptyState =
            $("receipts-empty-state");


        if (emptyState) {

            emptyState.hidden =
                true;
        }
    }
}


/* =========================================================
   Statistics
   ========================================================= */

function updateStatistics() {

    const total =
        allReceipts.length;


    const processed =
        allReceipts.filter(
            receipt =>
                getReceiptStatus(
                    receipt
                ).className ===
                "processed"
        ).length;


    setText(
        "receipts-total-count",
        formatNumber(
            total
        )
    );


    setText(
        "receipts-processed-count",
        formatNumber(
            processed
        )
    );


    const currency =
        getPrimaryCurrency();


    const currencyReceipts =
        allReceipts.filter(
            receipt =>
                receipt.currency ===
                currency
        );


    const totalAmount =
        currencyReceipts.reduce(
            (
                sum,
                receipt
            ) => {

                return (
                    sum +
                    Number(
                        receipt.total ||
                        0
                    )
                );

            },
            0
        );


    const average =
        currencyReceipts.length > 0
            ? totalAmount /
              currencyReceipts.length
            : 0;


    setText(
        "receipts-total-amount",
        formatAmount(
            totalAmount,
            currency
        )
    );


    setText(
        "receipts-average-amount",
        formatAmount(
            average,
            currency
        )
    );
}


/* =========================================================
   Currency
   ========================================================= */

function getPrimaryCurrency() {

    const currencies =
        allReceipts
            .map(
                receipt =>
                    receipt.currency
            )
            .filter(Boolean);


    if (!currencies.length) {
        return "SDG";
    }


    return currencies[0];
}


function formatNumber(
    value
) {

    const numericValue =
        Number(
            value || 0
        );


    if (
        !Number.isFinite(
            numericValue
        )
    ) {
        return "0";
    }


    return numericValue.toLocaleString(
        getCurrentLanguage() === "ar"
            ? "ar"
            : "en-US"
    );
}


function formatAmount(
    amount,
    currency = "SDG"
) {

    const numericAmount =
        Number(
            amount || 0
        );


    const locale =
        getCurrentLanguage() === "ar"
            ? "ar"
            : "en-US";


    return `${numericAmount.toLocaleString(
        locale,
        {
            minimumFractionDigits:
                0,

            maximumFractionDigits:
                2,
        }
    )} ${currency}`;
}


/* =========================================================
   Filtering
   ========================================================= */

function applyFilters() {

    const searchValue =
        (
            $("receipt-search")
                ?.value ||
            ""
        )
            .trim()
            .toLowerCase();


    const dateFilter =
        $("receipt-date-filter")
            ?.value ||
        "all";


    const statusFilter =
        $("receipt-status-filter")
            ?.value ||
        "all";


    const sortValue =
        $("receipt-sort")
            ?.value ||
        "newest";


    filteredReceipts =
        allReceipts.filter(
            receipt => {

                /* -----------------------------------------
                   Search
                ----------------------------------------- */

                if (searchValue) {

                    const searchableText = [

                        receipt.id,

                        receipt.merchant_name,

                        receipt.merchant_category,

                        receipt.invoice_number,

                        receipt.receipt_date,

                        receipt.receipt_time,

                        receipt.payment_method,

                        receipt.currency,

                    ]
                        .filter(
                            value =>
                                value !== null &&
                                value !== undefined
                        )
                        .join(" ")
                        .toLowerCase();


                    if (
                        !searchableText.includes(
                            searchValue
                        )
                    ) {

                        return false;
                    }
                }


                /* -----------------------------------------
                   Date
                ----------------------------------------- */

                if (
                    dateFilter !== "all" &&
                    !matchesDateFilter(
                        receipt,
                        dateFilter
                    )
                ) {

                    return false;
                }


                /* -----------------------------------------
                   Status
                ----------------------------------------- */

                if (
                    statusFilter !== "all" &&
                    !matchesStatusFilter(
                        receipt,
                        statusFilter
                    )
                ) {

                    return false;
                }


                return true;
            }
        );


    /* ---------------------------------------------
       Sorting
    --------------------------------------------- */

    filteredReceipts.sort(
        (a, b) => {

            if (
                sortValue ===
                "amount-high"
            ) {

                return (
                    Number(
                        b.total ||
                        0
                    ) -
                    Number(
                        a.total ||
                        0
                    )
                );
            }


            if (
                sortValue ===
                "amount-low"
            ) {

                return (
                    Number(
                        a.total ||
                        0
                    ) -
                    Number(
                        b.total ||
                        0
                    )
                );
            }


            const dateA =
                getReceiptDate(
                    a
                );


            const dateB =
                getReceiptDate(
                    b
                );


            if (
                sortValue ===
                "oldest"
            ) {

                return (
                    dateA.getTime() -
                    dateB.getTime()
                );
            }


            return (
                dateB.getTime() -
                dateA.getTime()
            );
        }
    );


    currentPage =
        1;


    renderReceipts();

    updateActiveFilters();

    updateSearchClear();
}


/* =========================================================
   Date Filter
   ========================================================= */

function matchesDateFilter(
    receipt,
    filter
) {

    const receiptDate =
        getReceiptDate(
            receipt
        );


    if (
        Number.isNaN(
            receiptDate.getTime()
        )
    ) {

        return false;
    }


    const now =
        new Date();


    const startOfToday =
        new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
        );


    if (
        filter ===
        "today"
    ) {

        return (
            receiptDate >=
            startOfToday
        );
    }


    if (
        filter ===
        "week"
    ) {

        const day =
            startOfToday.getDay();


        const diff =
            day === 0
                ? 6
                : day - 1;


        const startOfWeek =
            new Date(
                startOfToday
            );


        startOfWeek.setDate(
            startOfWeek.getDate() -
            diff
        );


        return (
            receiptDate >=
            startOfWeek
        );
    }


    if (
        filter ===
        "month"
    ) {

        const startOfMonth =
            new Date(
                now.getFullYear(),
                now.getMonth(),
                1
            );


        return (
            receiptDate >=
            startOfMonth
        );
    }


    return true;
}


/* =========================================================
   Receipt Date
   ========================================================= */

function getReceiptDate(
    receipt
) {

    const raw =
        receipt.receipt_date ||
        receipt.created_at;


    if (!raw) {
        return new Date(0);
    }


    const parsed =
        new Date(raw);


    if (
        Number.isNaN(
            parsed.getTime()
        )
    ) {

        return new Date(0);
    }


    return parsed;
}


/* =========================================================
   Status
   ========================================================= */

function matchesStatusFilter(
    receipt,
    filter
) {

    if (
        filter ===
        "all"
    ) {

        return true;
    }


    const status =
        getReceiptStatus(
            receipt
        );


    return (
        status.className ===
        filter
    );
}


function getReceiptStatus(
    receipt
) {

    const rawStatus =
        String(
            receipt.vision_status ||
            ""
        )
            .trim()
            .toLowerCase();


    if (
        rawStatus ===
        "failed"
    ) {

        return {

            label:
                t("failed"),

            className:
                "failed",
        };
    }


    if (
        rawStatus === "success" ||
        rawStatus === "successful" ||
        rawStatus === "processed"
    ) {

        return {

            label:
                t("processed"),

            className:
                "processed",
        };
    }


    return {

        label:
            t("needs_review"),

        className:
            "review",
    };
}


/* =========================================================
   Render Receipts
   ========================================================= */

function renderReceipts() {

    const tbody =
        $("receipts-table-body");


    const emptyState =
        $("receipts-empty-state");


    if (!tbody) {
        return;
    }


    if (
        !filteredReceipts.length
    ) {

        tbody.innerHTML =
            "";


        if (emptyState) {

            emptyState.hidden =
                false;
        }


        updatePagination();

        updateResultCount();

        return;
    }


    if (emptyState) {

        emptyState.hidden =
            true;
    }


    const start =
        (
            currentPage -
            1
        ) *
        PAGE_SIZE;


    const end =
        start +
        PAGE_SIZE;


    const pageReceipts =
        filteredReceipts.slice(
            start,
            end
        );


    tbody.innerHTML =
        pageReceipts
            .map(
                receipt =>
                    createReceiptRow(
                        receipt
                    )
            )
            .join("");


    updatePagination();

    updateResultCount();
}


/* =========================================================
   Receipt Row
   ========================================================= */

function createReceiptRow(
    receipt
) {

    const status =
        getReceiptStatus(
            receipt
        );


    const merchant =
        escapeHtml(
            receipt.merchant_name ||
            t("unknown_merchant")
        );


    const invoice =
        escapeHtml(
            receipt.invoice_number ||
            "—"
        );


    const date =
        formatDate(
            receipt.receipt_date ||
            receipt.created_at
        );


    const items =
        Number(
            receipt.items_count ||
            0
        );


    const amount =
        formatAmount(
            receipt.total,
            receipt.currency ||
            "SDG"
        );

    const sourceBadge = receipt.source === 'digital'
        ? `<span style="display:inline-block; margin-top:4px; padding:2px 6px; border-radius:4px; background:var(--color-primary-light, rgba(33, 150, 243, 0.1)); color:var(--color-primary, #2196f3); font-size:11px; font-weight:600;">${escapeHtml(t("digital"))}</span>`
        : `<span style="display:inline-block; margin-top:4px; padding:2px 6px; border-radius:4px; background:var(--bg-secondary); color:var(--text-secondary); font-size:11px; font-weight:600;">${escapeHtml(t("scanned"))}</span>`;

    return `

        <tr
            class="receipt-row"
            data-receipt-id="${escapeHtml(
                receipt.id
            )}"
        >

            <td class="receipt-column">

                <div class="receipt-cell">

                    <div class="receipt-thumbnail">
                        <span>▣</span>
                    </div>

                    <div class="receipt-primary">

                        <strong>
                            ${escapeHtml(
                                t("receipt")
                            )} #${escapeHtml(
                                receipt.id
                            )}
                        </strong>

                        <span>
                            ${invoice}
                        </span>
                        
                        <div>
                            ${sourceBadge}
                        </div>

                    </div>

                </div>

            </td>


            <td>

                <div class="merchant-cell">

                    <strong>
                        ${merchant}
                    </strong>

                    <span>
                        ${escapeHtml(
                            receipt.merchant_category ||
                            t("receipt")
                        )}
                    </span>

                </div>

            </td>


            <td>

                <span class="date-cell">
                    ${date}
                </span>

            </td>


            <td>

                <span class="items-count">
                    ${formatNumber(items)}
                </span>

            </td>


            <td>

                <strong class="amount-cell">
                    ${amount}
                </strong>

            </td>


            <td>

                <span
                    class="receipt-status ${status.className}"
                >

                    <span class="status-dot"></span>

                    ${escapeHtml(
                        status.label
                    )}

                </span>

            </td>


            <td class="actions-column">

                <div class="receipt-actions">

                    <button
                        type="button"
                        class="receipt-action view view-receipt"
                        data-id="${escapeHtml(
                            receipt.id
                        )}"
                        data-tooltip="${escapeAttribute(
                            t("view_receipt")
                        )}"
                        title="${escapeAttribute(
                            t("view_receipt")
                        )}"
                        aria-label="${escapeAttribute(
                            t("view_receipt")
                        )}"
                    >
                        <span data-i18n="view">
                            ${escapeHtml(
                                t("view")
                            )}
                        </span>
                    </button>


                    <button
                        type="button"
                        class="receipt-action edit edit-receipt"
                        data-id="${escapeHtml(
                            receipt.id
                        )}"
                        data-tooltip="${escapeAttribute(
                            t("edit_receipt")
                        )}"
                        title="${escapeAttribute(
                            t("edit_receipt")
                        )}"
                        aria-label="${escapeAttribute(
                            t("edit_receipt")
                        )}"
                    >
                        <span data-i18n="edit">
                            ${escapeHtml(
                                t("edit")
                            )}
                        </span>
                    </button>


                    <button
                        type="button"
                        class="receipt-action delete delete-receipt"
                        data-id="${escapeHtml(
                            receipt.id
                        )}"
                        data-tooltip="${escapeAttribute(
                            t("delete_receipt")
                        )}"
                        title="${escapeAttribute(
                            t("delete_receipt")
                        )}"
                        aria-label="${escapeAttribute(
                            t("delete_receipt")
                        )}"
                    >
                        <span data-i18n="delete">
                            ${escapeHtml(
                                t("delete")
                            )}
                        </span>
                    </button>

                </div>

            </td>

        </tr>
    `;
}


/* =========================================================
   Load Receipt Image
   ========================================================= */

async function loadReceiptImage(
    imageUrl,
    imageElement
) {

    if (
        !imageUrl ||
        !imageElement
    ) {
        return;
    }


    try {

        const response =
            await fetch(
                imageUrl,
                {
                    headers: {
                        ...authHeaders(),
                    },
                }
            );


        if (!response.ok) {

            throw new Error(
                `Image request failed: ${response.status}`
            );
        }


        const blob =
            await response.blob();


        if (
            receiptImageObjectUrl
        ) {

            URL.revokeObjectURL(
                receiptImageObjectUrl
            );
        }


        receiptImageObjectUrl =
            URL.createObjectURL(
                blob
            );


        imageElement.src =
            receiptImageObjectUrl;


        imageElement.classList.add(
            "loaded"
        );


        imageElement.addEventListener(
            "click",
            () => {

                openReceiptImageZoom(
                    receiptImageObjectUrl,
                    imageElement.alt
                );

            },
            {
                once: true,
            }
        );


        const loading =
            imageElement
                .closest(
                    ".receipt-image-frame"
                )
                ?.querySelector(
                    ".receipt-image-loading"
                );


        if (loading) {
            loading.remove();
        }


    } catch (error) {

        console.error(
            "Failed to load receipt image:",
            error
        );


        const wrapper =
            imageElement.closest(
                ".receipt-image-frame"
            );


        if (wrapper) {

            wrapper.innerHTML = `

                <div
                    class="receipt-image-placeholder error"
                >

                    <span class="receipt-placeholder-icon">
                        !
                    </span>

                    <strong>
                        ${escapeHtml(
                            t(
                                "unable_to_load_image"
                            )
                        )}
                    </strong>

                    <small>
                        ${escapeHtml(
                            t(
                                "receipt_image_could_not_be_displayed"
                            )
                        )}
                    </small>

                </div>

            `;
        }
    }
}


/* =========================================================
   View Receipt
   ========================================================= */

async function openReceiptDetails(
    receiptId
) {

    const modal =
        $("receipt-details-modal");


    const content =
        $("receipt-details-content");


    const title =
        $("receipt-modal-title");


    if (
        !modal ||
        !content ||
        !title
    ) {
        return;
    }


    title.textContent =
        `${t("receipt")} #${receiptId}`;


    content.innerHTML = `

        <div class="modal-loading">

            <span class="loading-spinner"></span>

            <span>
                ${escapeHtml(
                    t("loading_receipt")
                )}
            </span>

        </div>

    `;


    modal.hidden =
        false;


    requestAnimationFrame(
        () => {

            modal.classList.add(
                "show"
            );

        }
    );


    document.body.classList.add(
        "modal-open"
    );


    try {

        const data =
            await apiRequest(
                `${API_BASE}/receipt/${receiptId}`
            );


        if (
            !data ||
            !data.receipt
        ) {

            throw new Error(
                t(
                    "receipt_details_load_failed"
                )
            );
        }


        const receipt =
            data.receipt;


        title.textContent =
            `${t(
                "receipt"
            )} #${receipt.id}`;


        content.innerHTML =
            createReceiptDetailsHtml(
                receipt
            );


        const image =
            content.querySelector(
                ".receipt-original-image"
            );


        if (
            image &&
            receipt.image_url
        ) {

            loadReceiptImage(
                receipt.image_url,
                image
            );
        }


    } catch (error) {

        console.error(
            "Failed to load receipt details:",
            error
        );


        content.innerHTML = `

            <div class="receipt-view-error">

                <div class="receipt-view-error-icon">
                    !
                </div>

                <strong>
                    ${escapeHtml(
                        t(
                            "unable_to_load_receipt"
                        )
                    )}
                </strong>

                <span>
                    ${escapeHtml(
                        error.message ||
                        t("try_again")
                    )}
                </span>

                <button
                    type="button"
                    class="secondary-button"
                    id="retry-receipt-view"
                >
                    ${escapeHtml(
                        t("try_again")
                    )}
                </button>

            </div>

        `;


        $("retry-receipt-view")
            ?.addEventListener(
                "click",
                () => {

                    openReceiptDetails(
                        receiptId
                    );

                }
            );
    }
}


/* =========================================================
   Receipt Details HTML
   ========================================================= */

function createReceiptDetailsHtml(
    receipt
) {

    const currency =
        receipt.currency ||
        "SDG";


    const items =
        Array.isArray(
            receipt.items
        )
            ? receipt.items
            : [];


    const imageSection =
        receipt.image_url
            ? `

                <section
                    class="receipt-preview-card"
                >

                    <div
                        class="receipt-preview-header"
                    >

                        <div>

                            <span>
                                ${escapeHtml(
                                    t(
                                        "original_receipt"
                                    )
                                )}
                            </span>

                            <small>
                                ${escapeHtml(
                                    t(
                                        "source_image"
                                    )
                                )}
                            </small>

                        </div>

                    </div>


                    <div
                        class="receipt-image-frame"
                    >

                        <div
                            class="receipt-image-loading"
                        >

                            <span
                                class="loading-spinner"
                            ></span>

                            <span>
                                ${escapeHtml(
                                    t(
                                        "loading_image"
                                    )
                                )}
                            </span>

                        </div>


                        <img
                            src=""
                            alt="${escapeAttribute(
                                t(
                                    "original_receipt"
                                )
                            )}"
                            class="receipt-original-image"
                            loading="eager"
                        >

                    </div>

                </section>

            `
            : `

                <section
                    class="receipt-preview-card"
                >

                    <div
                        class="receipt-preview-header"
                    >

                        <div>

                            <span>
                                ${escapeHtml(
                                    t(
                                        "original_receipt"
                                    )
                                )}
                            </span>

                            <small>
                                ${escapeHtml(
                                    t(
                                        "source_image"
                                    )
                                )}
                            </small>

                        </div>

                    </div>


                    <div
                        class="receipt-image-frame"
                    >

                        <div
                            class="receipt-image-placeholder"
                        >

                            <span
                                class="receipt-placeholder-icon"
                            >
                                ▣
                            </span>

                            <strong>
                                ${escapeHtml(
                                    t(
                                        "image_unavailable"
                                    )
                                )}
                            </strong>

                            <small>
                                ${escapeHtml(
                                    t(
                                        "no_receipt_image"
                                    )
                                )}
                            </small>

                        </div>

                    </div>

                </section>
            `;


    const itemsHtml =
        items.length
            ? `

                <div class="detail-items">

                    <div
                        class="detail-items-header"
                    >

                        <span>
                            ${escapeHtml(
                                t("item")
                            )}
                        </span>

                        <span>
                            ${escapeHtml(
                                t("quantity")
                            )}
                        </span>

                        <span>
                            ${escapeHtml(
                                t("unit_price")
                            )}
                        </span>

                        <span>
                            ${escapeHtml(
                                t("total")
                            )}
                        </span>

                    </div>


                    ${items.map(
                        item => `

                            <div
                                class="detail-item-row"
                            >

                                <span>

                                    ${escapeHtml(
                                        item.name ||
                                        t("item")
                                    )}

                                </span>


                                <span>

                                    ${escapeHtml(
                                        item.quantity ??
                                        "—"
                                    )}

                                </span>


                                <span>

                                    ${formatAmount(
                                        item.unit_price,
                                        currency
                                    )}

                                </span>


                                <strong>

                                    ${formatAmount(
                                        item.total_price,
                                        currency
                                    )}

                                </strong>

                            </div>

                        `
                    ).join("")}

                </div>

            `
            : `

                <div
                    class="detail-empty-items"
                >
                    ${escapeHtml(
                        t(
                            "no_item_details"
                        )
                    )}
                </div>

            `;


    return `

        <div class="receipt-view-layout">

            ${imageSection}


            <!-- RECEIPT INFORMATION -->

            <section
                class="receipt-information-card"
            >

                <div
                    class="receipt-card-heading"
                >

                    <div>

                        <span>
                            ${escapeHtml(
                                t(
                                    "receipt_information"
                                )
                            )}
                        </span>

                        <small>
                            ${escapeHtml(
                                t(
                                    "extracted_receipt_details"
                                )
                            )}
                        </small>

                    </div>

                </div>


                <div
                    class="receipt-detail-grid"
                >

                    <div
                        class="detail-section"
                    >

                        <p
                            class="detail-label"
                        >
                            ${escapeHtml(
                                t("merchant")
                            )}
                        </p>

                        <strong>
                            ${escapeHtml(
                                receipt.merchant_name ||
                                t("unknown")
                            )}
                        </strong>

                    </div>


                    <div
                        class="detail-section"
                    >

                        <p
                            class="detail-label"
                        >
                            ${escapeHtml(
                                t("category")
                            )}
                        </p>

                        <strong>
                            ${escapeHtml(
                                receipt.merchant_category ||
                                "—"
                            )}
                        </strong>

                    </div>


                    <div
                        class="detail-section"
                    >

                        <p
                            class="detail-label"
                        >
                            ${escapeHtml(
                                t("invoice")
                            )}
                        </p>

                        <strong>
                            ${escapeHtml(
                                receipt.invoice_number ||
                                "—"
                            )}
                        </strong>

                    </div>

                    <div
                        class="detail-section"
                    >

                        <p
                            class="detail-label"
                        >
                            Source
                        </p>

                        <strong>
                            ${receipt.source === 'digital' ? escapeHtml(t('digital')) : escapeHtml(t('scanned'))}
                        </strong>

                    </div>


                    <div
                        class="detail-section"
                    >

                        <p
                            class="detail-label"
                        >
                            ${escapeHtml(
                                t(
                                    "payment"
                                )
                            )}
                        </p>

                        <strong>
                            ${escapeHtml(
                                receipt.payment_method ||
                                "—"
                            )}
                        </strong>

                    </div>


                    <div
                        class="detail-section"
                    >

                        <p
                            class="detail-label"
                        >
                            ${escapeHtml(
                                t("date")
                            )}
                        </p>

                        <strong>
                            ${formatDate(
                                receipt.receipt_date ||
                                receipt.created_at
                            )}
                        </strong>

                    </div>


                    <div
                        class="detail-section"
                    >

                        <p
                            class="detail-label"
                        >
                            ${escapeHtml(
                                t("time")
                            )}
                        </p>

                        <strong>
                            ${escapeHtml(
                                receipt.receipt_time ||
                                "—"
                            )}
                        </strong>

                    </div>


                    <div
                        class="detail-section"
                    >

                        <p
                            class="detail-label"
                        >
                            ${escapeHtml(
                                t(
                                    "currency_label"
                                )
                            )}
                        </p>

                        <strong>
                            ${escapeHtml(
                                currency
                            )}
                        </strong>

                    </div>


                    <div
                        class="detail-section"
                    >

                        <p
                            class="detail-label"
                        >
                            ${escapeHtml(
                                t("phone")
                            )}
                        </p>

                        <strong>
                            ${escapeHtml(
                                receipt.merchant_phone ||
                                "—"
                            )}
                        </strong>

                    </div>


                    <div
                        class="detail-section detail-wide"
                    >

                        <p
                            class="detail-label"
                        >
                            ${escapeHtml(
                                t("address")
                            )}
                        </p>

                        <strong>
                            ${escapeHtml(
                                receipt.merchant_address ||
                                "—"
                            )}
                        </strong>

                    </div>

                </div>

            </section>


            <!-- ITEMS -->

            <section
                class="receipt-items-section"
            >

                <div
                    class="detail-section-title"
                >

                    <div>

                        <span>
                            ${escapeHtml(
                                t("products")
                            )}
                        </span>

                        <small>
                            ${escapeHtml(
                                t(
                                    "products_detected_from_receipt"
                                )
                            )}
                        </small>

                    </div>

                    <strong>
                        ${formatNumber(
                            items.length
                        )}
                    </strong>

                </div>


                ${itemsHtml}

            </section>


            <!-- FINANCIAL -->

            <section
                class="receipt-financial-card"
            >

                <div
                    class="detail-section-title"
                >

                    <div>

                        <span>
                            ${escapeHtml(
                                t(
                                    "financial_summary"
                                )
                            )}
                        </span>

                        <small>
                            ${escapeHtml(
                                t(
                                    "receipt_totals"
                                )
                            )}
                        </small>

                    </div>

                </div>


                <div
                    class="financial-summary"
                >

                    <div
                        class="financial-line"
                    >

                        <span>
                            ${escapeHtml(
                                t(
                                    "subtotal"
                                )
                            )}
                        </span>

                        <strong>
                            ${formatAmount(
                                receipt.subtotal,
                                currency
                            )}
                        </strong>

                    </div>


                    <div
                        class="financial-line"
                    >

                        <span>
                            ${escapeHtml(
                                t("tax")
                            )}
                        </span>

                        <strong>
                            ${formatAmount(
                                receipt.tax,
                                currency
                            )}
                        </strong>

                    </div>


                    <div
                        class="financial-line"
                    >

                        <span>
                            ${escapeHtml(
                                t(
                                    "discount"
                                )
                            )}
                        </span>

                        <strong>
                            ${formatAmount(
                                receipt.discount,
                                currency
                            )}
                        </strong>

                    </div>


                    <div
                        class="financial-total"
                    >

                        <span>
                            ${escapeHtml(
                                t("total")
                            )}
                        </span>

                        <strong>
                            ${formatAmount(
                                receipt.total,
                                currency
                            )}
                        </strong>

                    </div>

                </div>

            </section>


        </div>

    `;
}


/* =========================================================
   Close Details Modal
   ========================================================= */

function closeReceiptDetails() {

    const modal =
        $("receipt-details-modal");


    if (!modal) {
        return;
    }


    modal.classList.remove(
        "show"
    );


    setTimeout(
        () => {

            modal.hidden =
                true;

        },
        200
    );


    if (
        receiptImageObjectUrl
    ) {

        URL.revokeObjectURL(
            receiptImageObjectUrl
        );


        receiptImageObjectUrl =
            null;
    }


    closeReceiptImageZoom();


    document.body.classList.remove(
        "modal-open"
    );
}


/* =========================================================
   Edit Receipt
   ========================================================= */

function editReceipt(
    receiptId
) {

    const receipt =
        allReceipts.find(
            item =>
                Number(item.id) ===
                Number(receiptId)
        );


    if (!receipt) {

        showToast(
            t("receipt_not_found"),
            "error"
        );

        return;
    }


    openReceiptEditModal(
        receipt
    );
}


/* =========================================================
   Open Edit Modal
   ========================================================= */

function openReceiptEditModal(
    receipt
) {

    const modal =
        $("receipt-details-modal");


    const content =
        $("receipt-details-content");


    const title =
        $("receipt-modal-title");


    if (
        !modal ||
        !content ||
        !title
    ) {
        return;
    }


    title.textContent =
        `${t("edit_receipt")} #${receipt.id}`;


    content.innerHTML = `

        <form
            id="edit-receipt-form"
            class="receipt-edit-form"
        >

            <!-- MERCHANT -->

            <section class="edit-section">

                <div class="edit-section-heading">

                    <div class="edit-section-icon">
                        ◉
                    </div>

                    <div>

                        <strong>
                            ${escapeHtml(
                                t(
                                    "merchant_information"
                                )
                            )}
                        </strong>

                        <span>
                            ${escapeHtml(
                                t(
                                    "business_details_extracted"
                                )
                            )}
                        </span>

                    </div>

                </div>


                <div class="edit-form-grid">

                    <div class="edit-field">

                        <label
                            for="edit-merchant"
                        >
                            ${escapeHtml(
                                t("merchant")
                            )}
                        </label>

                        <input
                            type="text"
                            id="edit-merchant"
                            value="${escapeAttribute(
                                receipt.merchant_name
                            )}"
                            autocomplete="organization"
                        >

                    </div>


                    <div class="edit-field">

                        <label
                            for="edit-category"
                        >
                            ${escapeHtml(
                                t("category")
                            )}
                        </label>

                        <input
                            type="text"
                            id="edit-category"
                            value="${escapeAttribute(
                                receipt.merchant_category
                            )}"
                        >

                    </div>


                    <div
                        class="edit-field edit-field-full"
                    >

                        <label
                            for="edit-address"
                        >
                            ${escapeHtml(
                                t("address")
                            )}
                        </label>

                        <input
                            type="text"
                            id="edit-address"
                            value="${escapeAttribute(
                                receipt.merchant_address
                            )}"
                            autocomplete="street-address"
                        >

                    </div>


                    <div class="edit-field">

                        <label
                            for="edit-phone"
                        >
                            ${escapeHtml(
                                t("phone")
                            )}
                        </label>

                        <input
                            type="tel"
                            id="edit-phone"
                            value="${escapeAttribute(
                                receipt.merchant_phone
                            )}"
                            autocomplete="tel"
                        >

                    </div>

                </div>

            </section>


            <!-- RECEIPT INFORMATION -->

            <section class="edit-section">

                <div class="edit-section-heading">

                    <div class="edit-section-icon">
                        ▣
                    </div>

                    <div>

                        <strong>
                            ${escapeHtml(
                                t(
                                    "receipt_information"
                                )
                            )}
                        </strong>

                        <span>
                            ${escapeHtml(
                                t(
                                    "identification_payment_details"
                                )
                            )}
                        </span>

                    </div>

                </div>


                <div class="edit-form-grid">

                    <div class="edit-field">

                        <label
                            for="edit-invoice"
                        >
                            ${escapeHtml(
                                t(
                                    "invoice_number"
                                )
                            )}
                        </label>

                        <input
                            type="text"
                            id="edit-invoice"
                            value="${escapeAttribute(
                                receipt.invoice_number
                            )}"
                        >

                    </div>


                    <div class="edit-field">

                        <label
                            for="edit-date"
                        >
                            ${escapeHtml(
                                t(
                                    "receipt_date"
                                )
                            )}
                        </label>

                        <input
                            type="date"
                            id="edit-date"
                            value="${escapeAttribute(
                                normalizeDateInput(
                                    receipt.receipt_date
                                )
                            )}"
                        >

                    </div>


                    <div class="edit-field">

                        <label
                            for="edit-time"
                        >
                            ${escapeHtml(
                                t(
                                    "receipt_time"
                                )
                            )}
                        </label>

                        <input
                            type="text"
                            id="edit-time"
                            value="${escapeAttribute(
                                receipt.receipt_time
                            )}"
                            placeholder="${escapeAttribute(
                                t(
                                    "time_example"
                                )
                            )}"
                        >

                    </div>


                    <div class="edit-field">

                        <label
                            for="edit-payment"
                        >
                            ${escapeHtml(
                                t(
                                    "payment_method"
                                )
                            )}
                        </label>

                        <input
                            type="text"
                            id="edit-payment"
                            value="${escapeAttribute(
                                receipt.payment_method
                            )}"
                        >

                    </div>


                    <div class="edit-field">

                        <label
                            for="edit-currency"
                        >
                            ${escapeHtml(
                                t(
                                    "currency_label"
                                )
                            )}
                        </label>

                        <input
                            type="text"
                            id="edit-currency"
                            value="${escapeAttribute(
                                receipt.currency ||
                                "SDG"
                            )}"
                        >

                    </div>

                </div>

            </section>


            <!-- FINANCIAL INFORMATION -->

            <section class="edit-section">

                <div class="edit-section-heading">

                    <div class="edit-section-icon">
                        $
                    </div>

                    <div>

                        <strong>
                            ${escapeHtml(
                                t(
                                    "financial_information"
                                )
                            )}
                        </strong>

                        <span>
                            ${escapeHtml(
                                t(
                                    "correct_financial_values"
                                )
                            )}
                        </span>

                    </div>

                </div>


                <div class="edit-form-grid">

                    <div class="edit-field">

                        <label
                            for="edit-subtotal"
                        >
                            ${escapeHtml(
                                t("subtotal")
                            )}
                        </label>

                        <div
                            class="edit-input-with-suffix"
                        >

                            <input
                                type="number"
                                step="0.01"
                                id="edit-subtotal"
                                value="${escapeAttribute(
                                    receipt.subtotal
                                )}"
                            >

                            <span>
                                ${escapeHtml(
                                    receipt.currency ||
                                    "SDG"
                                )}
                            </span>

                        </div>

                    </div>


                    <div class="edit-field">

                        <label
                            for="edit-tax"
                        >
                            ${escapeHtml(
                                t("tax")
                            )}
                        </label>

                        <div
                            class="edit-input-with-suffix"
                        >

                            <input
                                type="number"
                                step="0.01"
                                id="edit-tax"
                                value="${escapeAttribute(
                                    receipt.tax
                                )}"
                            >

                            <span>
                                ${escapeHtml(
                                    receipt.currency ||
                                    "SDG"
                                )}
                            </span>

                        </div>

                    </div>


                    <div class="edit-field">

                        <label
                            for="edit-tax-rate"
                        >
                            ${escapeHtml(
                                t("tax_rate")
                            )}
                        </label>

                        <div
                            class="edit-input-with-suffix"
                        >

                            <input
                                type="number"
                                step="0.01"
                                id="edit-tax-rate"
                                value="${escapeAttribute(
                                    receipt.tax_rate
                                )}"
                            >

                            <span>
                                %
                            </span>

                        </div>

                    </div>


                    <div class="edit-field">

                        <label
                            for="edit-discount"
                        >
                            ${escapeHtml(
                                t("discount")
                            )}
                        </label>

                        <div
                            class="edit-input-with-suffix"
                        >

                            <input
                                type="number"
                                step="0.01"
                                id="edit-discount"
                                value="${escapeAttribute(
                                    receipt.discount
                                )}"
                            >

                            <span>
                                ${escapeHtml(
                                    receipt.currency ||
                                    "SDG"
                                )}
                            </span>

                        </div>

                    </div>


                    <div
                        class="edit-field edit-total-field"
                    >

                        <label
                            for="edit-total"
                        >
                            ${escapeHtml(
                                t("total")
                            )}
                        </label>

                        <div
                            class="edit-input-with-suffix"
                        >

                            <input
                                type="number"
                                step="0.01"
                                id="edit-total"
                                value="${escapeAttribute(
                                    receipt.total
                                )}"
                            >

                            <span>
                                ${escapeHtml(
                                    receipt.currency ||
                                    "SDG"
                                )}
                            </span>

                        </div>

                    </div>

                </div>

            </section>


            <!-- ACTIONS -->

            <div
                class="edit-form-actions"
            >

                <button
                    type="button"
                    class="secondary-button"
                    id="cancel-edit-receipt"
                >
                    ${escapeHtml(
                        t("cancel")
                    )}
                </button>


                <button
                    type="submit"
                    class="primary-button"
                    id="save-edit-receipt"
                >

                    <span class="button-icon">
                        ✓
                    </span>

                    ${escapeHtml(
                        t("save_changes")
                    )}

                </button>

            </div>

        </form>
    `;


    modal.hidden =
        false;


    requestAnimationFrame(
        () => {

            modal.classList.add(
                "show"
            );

        }
    );


    document.body.classList.add(
        "modal-open"
    );


    $("cancel-edit-receipt")
        ?.addEventListener(
            "click",
            closeReceiptDetails
        );


    $("edit-receipt-form")
        ?.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                saveReceiptChanges(
                    receipt.id
                );
            }
        );
}


/* =========================================================
   Save Receipt Changes
   ========================================================= */

async function saveReceiptChanges(
    receiptId
) {

    const saveButton =
        $("save-edit-receipt");


    const data = {

        merchant_name:
            getInputValue(
                "edit-merchant"
            ),

        merchant_category:
            getInputValue(
                "edit-category"
            ),

        merchant_address:
            getInputValue(
                "edit-address"
            ),

        merchant_phone:
            getInputValue(
                "edit-phone"
            ),

        invoice_number:
            getInputValue(
                "edit-invoice"
            ),

        receipt_date:
            getInputValue(
                "edit-date"
            ),

        receipt_time:
            getInputValue(
                "edit-time"
            ),

        payment_method:
            getInputValue(
                "edit-payment"
            ),

        currency:
            getInputValue(
                "edit-currency"
            ),

        subtotal:
            parseNullableNumber(
                $("edit-subtotal")?.value
            ),

        tax:
            parseNullableNumber(
                $("edit-tax")?.value
            ),

        tax_rate:
            parseNullableNumber(
                $("edit-tax-rate")?.value
            ),

        discount:
            parseNullableNumber(
                $("edit-discount")?.value
            ),

        total:
            parseNullableNumber(
                $("edit-total")?.value
            ),
    };


    if (saveButton) {

        saveButton.disabled =
            true;

        saveButton.classList.add(
            "is-saving"
        );

        saveButton.innerHTML = `

            <span class="loading-spinner"></span>

            ${escapeHtml(
                t("saving")
            )}

        `;
    }


    try {

        const response =
            await apiRequest(
                `${API_BASE}/receipt/${receiptId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body:
                        JSON.stringify(
                            data
                        ),
                }
            );


        if (!response) {
            return;
        }


        const updated =
            response.receipt;


        const index =
            allReceipts.findIndex(
                receipt =>
                    Number(
                        receipt.id
                    ) ===
                    Number(
                        receiptId
                    )
            );


        if (index !== -1) {

            allReceipts[index] = {
                ...allReceipts[index],
                ...updated,
            };
        }


        closeReceiptDetails();

        updateStatistics();

        applyFilters();


        showToast(
            t("receipt_updated_successfully"),
            "success"
        );


    } catch (error) {

        console.error(
            "Failed to update receipt:",
            error
        );


        showToast(
            error.message ||
            t("failed_to_update_receipt"),
            "error"
        );


    } finally {

        if (saveButton) {

            saveButton.disabled =
                false;

            saveButton.classList.remove(
                "is-saving"
            );

            saveButton.innerHTML = `

                <span class="button-icon">
                    ✓
                </span>

                ${escapeHtml(
                    t("save_changes")
                )}

            `;
        }
    }
}


/* =========================================================
   Delete Modal
   ========================================================= */

function openDeleteModal(
    receiptId
) {

    const modal =
        $("delete-receipt-modal");


    if (!modal) {
        return;
    }


    currentDeleteId =
        Number(
            receiptId
        );


    modal.hidden =
        false;


    requestAnimationFrame(
        () => {

            modal.classList.add(
                "show"
            );

        }
    );


    document.body.classList.add(
        "modal-open"
    );
}


/* =========================================================
   Confirm Delete
   ========================================================= */

async function confirmDeleteReceipt() {

    if (!currentDeleteId) {
        return;
    }


    const receiptId =
        currentDeleteId;


    const button =
        $("confirm-delete");


    if (button) {

        button.disabled =
            true;

        button.textContent =
            t("deleting");
    }


    try {

        const data =
            await apiRequest(
                `${API_BASE}/receipt/${receiptId}`,
                {
                    method: "DELETE",
                }
            );


        if (!data) {
            return;
        }


        allReceipts =
            allReceipts.filter(
                receipt =>
                    Number(
                        receipt.id
                    ) !==
                    Number(
                        receiptId
                    )
            );


        filteredReceipts =
            filteredReceipts.filter(
                receipt =>
                    Number(
                        receipt.id
                    ) !==
                    Number(
                        receiptId
                    )
            );


        const totalPages =
            Math.max(
                1,
                Math.ceil(
                    filteredReceipts.length /
                    PAGE_SIZE
                )
            );


        if (
            currentPage >
            totalPages
        ) {

            currentPage =
                totalPages;
        }


        updateStatistics();

        renderReceipts();

        closeDeleteModal();


        showToast(
            t("receipt_deleted_successfully"),
            "success"
        );


    } catch (error) {

        console.error(
            "Failed to delete receipt:",
            error
        );


        showToast(
            error.message ||
            t("failed_to_delete_receipt"),
            "error"
        );


    } finally {

        if (button) {

            button.disabled =
                false;

            button.textContent =
                t("delete_receipt");
        }
    }
}


/* =========================================================
   Close Delete Modal
   ========================================================= */

function closeDeleteModal() {

    const modal =
        $("delete-receipt-modal");


    if (!modal) {
        return;
    }


    modal.classList.remove(
        "show"
    );


    setTimeout(
        () => {

            modal.hidden =
                true;

        },
        200
    );


    currentDeleteId =
        null;


    document.body.classList.remove(
        "modal-open"
    );
}


/* =========================================================
   Pagination
   ========================================================= */

function updatePagination() {

    const total =
        filteredReceipts.length;


    const totalPages =
        Math.ceil(
            total /
            PAGE_SIZE
        );


    const previous =
        $("previous-page");


    const next =
        $("next-page");


    const pages =
        $("pagination-pages");


    if (
        !previous ||
        !next ||
        !pages
    ) {
        return;
    }


    previous.disabled =
        currentPage <= 1;


    next.disabled =
        totalPages === 0 ||
        currentPage >= totalPages;


    pages.innerHTML =
        "";


    if (
        totalPages <= 1
    ) {

        return;
    }


    const pageNumbers =
        buildPaginationPages(
            totalPages,
            currentPage
        );


    pageNumbers.forEach(
        page => {

            if (
                page === "..."
            ) {

                const span =
                    document.createElement(
                        "span"
                    );


                span.className =
                    "pagination-ellipsis";


                span.textContent =
                    "…";


                pages.appendChild(
                    span
                );


                return;
            }


            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "pagination-page";


            if (
                page ===
                currentPage
            ) {

                button.classList.add(
                    "active"
                );
            }


            button.textContent =
                page;


            button.addEventListener(
                "click",
                () => {

                    currentPage =
                        page;


                    renderReceipts();


                    window.scrollTo({
                        top: 0,
                        behavior: "smooth",
                    });
                }
            );


            pages.appendChild(
                button
            );
        }
    );
}


/* =========================================================
   Pagination Builder
   ========================================================= */

function buildPaginationPages(
    totalPages,
    activePage
) {

    if (
        totalPages <= 7
    ) {

        return Array.from(
            {
                length:
                    totalPages,
            },
            (
                _,
                index
            ) =>
                index + 1
        );
    }


    const pages = [
        1,
    ];


    if (
        activePage > 4
    ) {

        pages.push(
            "..."
        );
    }


    const start =
        Math.max(
            2,
            activePage - 1
        );


    const end =
        Math.min(
            totalPages - 1,
            activePage + 1
        );


    for (
        let page = start;
        page <= end;
        page++
    ) {

        pages.push(
            page
        );
    }


    if (
        activePage <
        totalPages - 3
    ) {

        pages.push(
            "..."
        );
    }


    pages.push(
        totalPages
    );


    return [
        ...new Set(
            pages
        ),
    ];
}


/* =========================================================
   Result Count
   ========================================================= */

function updateResultCount() {

    const total =
        filteredReceipts.length;


    const start =
        total === 0
            ? 0
            : (
                (
                    currentPage -
                    1
                ) *
                PAGE_SIZE
            ) + 1;


    const end =
        Math.min(
            currentPage *
            PAGE_SIZE,
            total
        );


    setText(
        "receipts-result-count",
        total === 1
            ? `1 ${t("receipt")}`
            : `${formatNumber(
                total
            )} ${t("receipts")}`
    );


    setText(
        "pagination-info",
        total === 0
            ? t("showing_zero_receipts")
            : `${t("showing")} ${formatNumber(
                start
            )}–${formatNumber(
                end
            )} ${t(
                "of"
            )} ${formatNumber(
                total
            )}`
    );
}


/* =========================================================
   Active Filters
   ========================================================= */

function updateActiveFilters() {

    const container =
        $("active-filters");


    const chips =
        $("filter-chips");


    if (
        !container ||
        !chips
    ) {
        return;
    }


    const search =
        (
            $("receipt-search")
                ?.value ||
            ""
        ).trim();


    const date =
        $("receipt-date-filter")
            ?.value;


    const status =
        $("receipt-status-filter")
            ?.value;


    chips.innerHTML =
        "";


    let hasFilters =
        false;


    if (search) {

        addFilterChip(
            `${t("search")}: ${search}`,
            () => {

                const input =
                    $("receipt-search");

                if (input) {
                    input.value =
                        "";
                }

                applyFilters();
            }
        );


        hasFilters =
            true;
    }


    if (
        date &&
        date !== "all"
    ) {

        addFilterChip(
            `${t(
                "date"
            )}: ${getFilterLabel(
                "receipt-date-filter"
            )}`,
            () => {

                const select =
                    $("receipt-date-filter");


                if (select) {
                    select.value =
                        "all";
                }


                applyFilters();
            }
        );


        hasFilters =
            true;
    }


    if (
        status &&
        status !== "all"
    ) {

        addFilterChip(
            `${t(
                "status"
            )}: ${getFilterLabel(
                "receipt-status-filter"
            )}`,
            () => {

                const select =
                    $("receipt-status-filter");


                if (select) {
                    select.value =
                        "all";
                }


                applyFilters();
            }
        );


        hasFilters =
            true;
    }


    container.hidden =
        !hasFilters;
}


/* =========================================================
   Filter Chip
   ========================================================= */

function addFilterChip(
    label,
    removeCallback
) {

    const chip =
        document.createElement(
            "button"
        );


    chip.type =
        "button";


    chip.className =
        "filter-chip";


    chip.innerHTML = `
        <span class="filter-chip-icon"></span>
        <strong></strong>
        <b aria-hidden="true">×</b>
    `;


    const strong =
        chip.querySelector(
            "strong"
        );


    if (strong) {

        strong.textContent =
            label;
    }


    chip.addEventListener(
        "click",
        removeCallback
    );


    $("filter-chips")
        ?.appendChild(
            chip
        );
}


/* =========================================================
   Filter Label
   ========================================================= */

function getFilterLabel(
    selectId
) {

    const select =
        $(selectId);


    if (!select) {
        return "";
    }


    return (
        select.options[
            select.selectedIndex
        ]?.text ||
        ""
    );
}


/* =========================================================
   Clear Filters
   ========================================================= */

function clearFilters() {

    if (
        $("receipt-search")
    ) {

        $("receipt-search")
            .value =
            "";
    }


    if (
        $("receipt-date-filter")
    ) {

        $("receipt-date-filter")
            .value =
            "all";
    }


    if (
        $("receipt-status-filter")
    ) {

        $("receipt-status-filter")
            .value =
            "all";
    }


    if (
        $("receipt-sort")
    ) {

        $("receipt-sort")
            .value =
            "newest";
    }


    applyFilters();
}


/* =========================================================
   Empty State
   ========================================================= */

function renderEmptyState(
    message
) {

    const tbody =
        $("receipts-table-body");


    const empty =
        $("receipts-empty-state");


    if (tbody) {

        tbody.innerHTML =
            "";
    }


    setText(
        "empty-state-message",
        message
    );


    if (empty) {

        empty.hidden =
            false;
    }


    updatePagination();

    updateResultCount();
}


/* =========================================================
   Search Clear
   ========================================================= */

function updateSearchClear() {

    const search =
        $("receipt-search");


    const clear =
        $("search-clear");


    if (
        !search ||
        !clear
    ) {
        return;
    }


    clear.hidden =
        !search.value;
}


/* =========================================================
   Export CSV
   ========================================================= */

function exportCSV() {

    if (
        !filteredReceipts.length
    ) {

        showToast(
            t("no_receipts_to_export"),
            "info"
        );

        return;
    }


    const headers = [

        t("receipt_id"),

        t("merchant"),

        t("category"),

        t("invoice_number"),

        t("date"),

        t("time"),

        t("items"),

        t("subtotal"),

        t("tax"),

        t("tax_rate"),

        t("discount"),

        t("total"),

        t("currency_label"),

        t("payment_method"),

    ];


    const rows =
        filteredReceipts.map(
            receipt => [

                receipt.id,

                receipt.merchant_name ||
                    "",

                receipt.merchant_category ||
                    "",

                receipt.invoice_number ||
                    "",

                receipt.receipt_date ||
                    "",

                receipt.receipt_time ||
                    "",

                receipt.items_count ||
                    0,

                receipt.subtotal ??
                    "",

                receipt.tax ??
                    "",

                receipt.tax_rate ??
                    "",

                receipt.discount ??
                    "",

                receipt.total ??
                    "",

                receipt.currency ||
                    "",

                receipt.payment_method ||
                    "",
            ]
        );


    const csv =
        [
            headers,
            ...rows,
        ]
            .map(
                row =>
                    row
                        .map(
                            value =>
                                `"${String(
                                    value
                                ).replace(
                                    /"/g,
                                    '""'
                                )}"`
                        )
                        .join(",")
            )
            .join("\n");


    const blob =
        new Blob(
            [
                "\ufeff" +
                csv,
            ],
            {
                type:
                    "text/csv;charset=utf-8;",
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        `smartreceiptai-receipts-${formatFileDate(
            new Date()
        )}.csv`;


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    URL.revokeObjectURL(
        url
    );


    showToast(
        t("receipts_exported_successfully"),
        "success"
    );
}


/* =========================================================
   Excel Export
   ========================================================= */

async function exportExcel() {

    if (
        !filteredReceipts.length
    ) {

        showToast(
            t("no_receipts_to_export"),
            "info"
        );

        return;
    }


    const receiptIds =
        filteredReceipts.map(
            receipt =>
                Number(
                    receipt.id
                )
        );


    try {

        const exported =
            await downloadApiFile(
                `${API_BASE}/receipt/export/excel`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body:
                        JSON.stringify({
                            receipt_ids:
                                receiptIds,
                        }),
                },
                `smartreceiptai-receipts-${formatFileDate(
                    new Date()
                )}.xlsx`
            );


        if (!exported) {
            return;
        }


        showToast(
            `${formatNumber(
                receiptIds.length
            )} ${
                receiptIds.length === 1
                    ? t("receipt")
                    : t("receipts")
            } ${t(
                "exported_to_excel"
            )}.`,
            "success"
        );


    } catch (error) {

        console.error(
            "Failed to export Excel:",
            error
        );


        showToast(
            error.message ||
            t("failed_to_export_excel"),
            "error"
        );
    }
}


/* =========================================================
   Utilities
   ========================================================= */

function parseNullableNumber(
    value
) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return null;
    }


    const number =
        Number(value);


    return Number.isFinite(
        number
    )
        ? number
        : null;
}


function getInputValue(
    id
) {

    const element =
        $(id);


    if (!element) {
        return "";
    }


    return element.value.trim();
}


function setText(
    id,
    value
) {

    const element =
        $(id);


    if (element) {

        element.textContent =
            value ?? "";
    }
}


function escapeHtml(
    value
) {

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


function escapeAttribute(
    value
) {

    return escapeHtml(
        value
    );
}


function formatDate(
    value
) {

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
            String(value)
        );
    }


    return date.toLocaleDateString(
        getCurrentLanguage() === "ar"
            ? "ar"
            : "en-US",
        {
            year: "numeric",
            month: "short",
            day: "numeric",
        }
    );
}


function normalizeDateInput(
    value
) {

    if (!value) {
        return "";
    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        const stringValue =
            String(value);

        return stringValue
            .slice(0, 10);
    }


    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        );


    return `${year}-${month}-${day}`;
}


function formatFileDate(
    date
) {

    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        );


    return `${year}-${month}-${day}`;
}


/* =========================================================
   Logout
   ========================================================= */

function logout() {

    localStorage.removeItem(
        "access_token"
    );

    localStorage.removeItem(
        "accessToken"
    );

    localStorage.removeItem(
        "token"
    );


    window.location.href =
        "/login";
}


/* =========================================================
   Mobile Sidebar
   ========================================================= */

function initializeMobileSidebar() {

    const button =
        $("mobile-menu-button");


    const sidebar =
        document.querySelector(
            ".sidebar"
        );


    if (
        !button ||
        !sidebar
    ) {
        return;
    }


    button.addEventListener(
        "click",
        event => {

            event.preventDefault();

            event.stopPropagation();


            sidebar.classList.toggle(
                "mobile-open"
            );
        }
    );
}


/* =========================================================
   Export Menu
   ========================================================= */

function initializeExportMenu() {

    const button =
        $("export-button");


    const menu =
        $("export-menu");


    if (
        !button ||
        !menu
    ) {
        return;
    }


    button.addEventListener(
        "click",
        event => {

            event.preventDefault();

            event.stopPropagation();


            menu.hidden =
                !menu.hidden;
        }
    );


    $("export-csv")
        ?.addEventListener(
            "click",
            event => {

                event.preventDefault();

                menu.hidden =
                    true;

                exportCSV();
            }
        );


    $("export-excel")
        ?.addEventListener(
            "click",
            event => {

                event.preventDefault();

                menu.hidden =
                    true;

                exportExcel();
            }
        );


    document.addEventListener(
        "click",
        event => {

            if (
                !button.contains(
                    event.target
                ) &&
                !menu.contains(
                    event.target
                )
            ) {

                menu.hidden =
                    true;
            }
        }
    );
}


/* =========================================================
   Language Changed
   ========================================================= */

window.addEventListener(
    "languageChanged",
    async event => {

        const language =
            event.detail?.language ||
            getCurrentLanguage();


        /*
         * Static HTML.
         */

        window.SmartReceiptLanguage
            ?.translatePage(
                language
            );


        /*
         * Re-render current data
         * using the new language.
         */

        updateStatistics();

        applyFilters();

        updateActiveFilters();

        updateSearchClear();


        /*
         * Refresh visible pagination
         * and result labels.
         */

        updatePagination();

        updateResultCount();


        /*
         * Keep user language in sync.
         */

        if (
            $("settings-language")
        ) {
            /* Nothing */
        }


        /*
         * If edit modal is open,
         * rebuild its content using
         * the current receipt data.
         */

        const modal =
            $("receipt-details-modal");


        const form =
            $("edit-receipt-form");


        if (
            modal &&
            !modal.hidden &&
            form
        ) {

            const receiptId =
                form.dataset.receiptId;


            if (receiptId) {

                const receipt =
                    allReceipts.find(
                        item =>
                            Number(
                                item.id
                            ) ===
                            Number(
                                receiptId
                            )
                    );


                if (receipt) {

                    openReceiptEditModal(
                        receipt
                    );
                }
            }
        }
    }
);


/* =========================================================
   Event Listeners
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /* ---------------------------------------------
           Current User
        --------------------------------------------- */

        loadCurrentUser();


        /* ---------------------------------------------
           Account Menu
        --------------------------------------------- */

        initializeAccountMenu();


        /* ---------------------------------------------
           Mobile Sidebar
        --------------------------------------------- */

        initializeMobileSidebar();


        /* ---------------------------------------------
           Export Menu
        --------------------------------------------- */

        initializeExportMenu();


        /* ---------------------------------------------
           Load Receipts
        --------------------------------------------- */

        loadReceipts();


        /* ---------------------------------------------
           Refresh
        --------------------------------------------- */

        $("refresh-receipts-button")
            ?.addEventListener(
                "click",
                loadReceipts
            );


        /* ---------------------------------------------
           Search
        --------------------------------------------- */

        $("receipt-search")
            ?.addEventListener(
                "input",
                () => {

                    updateSearchClear();

                    applyFilters();
                }
            );


        $("search-clear")
            ?.addEventListener(
                "click",
                () => {

                    if (
                        $("receipt-search")
                    ) {

                        $("receipt-search")
                            .value =
                            "";
                    }


                    updateSearchClear();

                    applyFilters();
                }
            );


        /* ---------------------------------------------
           Filters
        --------------------------------------------- */

        $("receipt-date-filter")
            ?.addEventListener(
                "change",
                applyFilters
            );


        $("receipt-status-filter")
            ?.addEventListener(
                "change",
                applyFilters
            );


        $("receipt-sort")
            ?.addEventListener(
                "change",
                applyFilters
            );


        /* ---------------------------------------------
           Clear Filters
        --------------------------------------------- */

        $("clear-filters")
            ?.addEventListener(
                "click",
                clearFilters
            );


        $("empty-clear-filters")
            ?.addEventListener(
                "click",
                clearFilters
            );


        /* ---------------------------------------------
           Pagination Previous
        --------------------------------------------- */

        $("previous-page")
            ?.addEventListener(
                "click",
                () => {

                    if (
                        currentPage >
                        1
                    ) {

                        currentPage--;

                        renderReceipts();
                    }
                }
            );


        /* ---------------------------------------------
           Pagination Next
        --------------------------------------------- */

        $("next-page")
            ?.addEventListener(
                "click",
                () => {

                    const totalPages =
                        Math.ceil(
                            filteredReceipts.length /
                            PAGE_SIZE
                        );


                    if (
                        currentPage <
                        totalPages
                    ) {

                        currentPage++;

                        renderReceipts();
                    }
                }
            );


        /* ---------------------------------------------
           Table Actions
        --------------------------------------------- */

        $("receipts-table-body")
            ?.addEventListener(
                "click",
                event => {

                    const button =
                        event.target.closest(
                            ".receipt-action"
                        );


                    if (!button) {
                        return;
                    }


                    const receiptId =
                        button.dataset.id;


                    if (!receiptId) {
                        return;
                    }


                    if (
                        button.classList.contains(
                            "view-receipt"
                        )
                    ) {

                        openReceiptDetails(
                            receiptId
                        );

                        return;
                    }


                    if (
                        button.classList.contains(
                            "edit-receipt"
                        )
                    ) {

                        editReceipt(
                            receiptId
                        );

                        return;
                    }


                    if (
                        button.classList.contains(
                            "delete-receipt"
                        )
                    ) {

                        openDeleteModal(
                            receiptId
                        );

                        return;
                    }
                }
            );


        /* ---------------------------------------------
           Receipt Details Modal
        --------------------------------------------- */

        $("receipt-modal-close")
            ?.addEventListener(
                "click",
                closeReceiptDetails
            );


        $("receipt-modal-backdrop")
            ?.addEventListener(
                "click",
                closeReceiptDetails
            );


        /* ---------------------------------------------
           Delete Modal
        --------------------------------------------- */

        $("cancel-delete")
            ?.addEventListener(
                "click",
                closeDeleteModal
            );


        $("delete-modal-backdrop")
            ?.addEventListener(
                "click",
                closeDeleteModal
            );


        $("confirm-delete")
            ?.addEventListener(
                "click",
                confirmDeleteReceipt
            );


        /* ---------------------------------------------
           Sidebar Logout
        --------------------------------------------- */

        $("logout-button")
            ?.addEventListener(
                "click",
                logout
            );


        /* ---------------------------------------------
           Keyboard
        --------------------------------------------- */

        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key !== "Escape"
                ) {

                    return;
                }


                const imageLightbox =
                    document.querySelector(
                        ".receipt-image-lightbox"
                    );


                if (imageLightbox) {

                    closeReceiptImageZoom();

                    return;
                }


                closeReceiptDetails();

                closeDeleteModal();
            }
        );


        /* ---------------------------------------------
           Initial Search State
        --------------------------------------------- */

        updateSearchClear();

    }
);


/* =========================================================
   Receipt Image Zoom
   ========================================================= */

function openReceiptImageZoom(
    imageSrc,
    altText = ""
) {

    if (!imageSrc) {
        return;
    }


    closeReceiptImageZoom();


    const overlay =
        document.createElement(
            "div"
        );


    overlay.className =
        "receipt-image-lightbox";


    overlay.innerHTML = `

        <button
            type="button"
            class="receipt-image-lightbox-close"
            aria-label="${escapeAttribute(
                t("close")
            )}"
        >
            ×
        </button>


        <div
            class="receipt-image-lightbox-backdrop"
        ></div>


        <div
            class="receipt-image-lightbox-content"
        >

            <img
                src="${escapeAttribute(
                    imageSrc
                )}"
                alt="${escapeAttribute(
                    altText ||
                    t("receipt")
                )}"
                class="receipt-lightbox-image"
            >

        </div>

    `;


    document.body.appendChild(
        overlay
    );


    requestAnimationFrame(
        () => {

            overlay.classList.add(
                "show"
            );

        }
    );


    const closeButton =
        overlay.querySelector(
            ".receipt-image-lightbox-close"
        );


    const backdrop =
        overlay.querySelector(
            ".receipt-image-lightbox-backdrop"
        );


    closeButton?.addEventListener(
        "click",
        closeReceiptImageZoom
    );


    backdrop?.addEventListener(
        "click",
        closeReceiptImageZoom
    );


    document.body.classList.add(
        "image-lightbox-open"
    );
}


function closeReceiptImageZoom() {

    const overlay =
        document.querySelector(
            ".receipt-image-lightbox"
        );


    if (!overlay) {
        return;
    }


    overlay.classList.remove(
        "show"
    );


    setTimeout(
        () => {

            overlay.remove();

        },
        180
    );


    document.body.classList.remove(
        "image-lightbox-open"
    );
}