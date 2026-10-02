"use strict";

/* =========================================================
   SmartReceiptAI
   Analytics Client Logic
   Global Language Support
   ========================================================= */

const API_BASE = "/api/v1";


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
   AUTHENTICATION
   ========================================================= */

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

    const token =
        getAccessToken();

    return token
        ? {
            Authorization:
                `Bearer ${token}`
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


/* =========================================================
   API
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
                    ...getAuthHeaders(),
                    ...(options.headers || {})
                }
            }
        );


    if (
        response.status === 401
    ) {

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

        window.location.href =
            "/";

        return null;
    }


    let data = null;


    try {

        data =
            await response.json();

    } catch {

        data =
            null;
    }


    if (!response.ok) {

        throw new Error(
            data?.detail ||
            data?.message ||
            t("request_failed")
        );
    }


    return data;
}


/* =========================================================
   CURRENT USER
   ========================================================= */

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


        setText(
            "user-email",
            fullName
        );


        setText(
            "user-menu-name",
            fullName
        );


        setText(
            "user-menu-email",
            email
        );


        updateAnalyticsAvatar(
            "user-avatar",
            user.profile_image,
            initial
        );


        updateAnalyticsAvatar(
            "user-menu-avatar",
            user.profile_image,
            initial
        );


    } catch (error) {

        console.error(
            "Failed to load current user:",
            error
        );
    }
}


/* =========================================================
   AVATAR
   ========================================================= */

function updateAnalyticsAvatar(
    elementId,
    imagePath,
    initial
) {

    const avatar =
        document.getElementById(
            elementId
        );


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


    } else {

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
}


function normalizeProfileImageUrl(
    imagePath
) {

    if (!imagePath) {
        return "";
    }


    if (
        imagePath.startsWith(
            "http://"
        ) ||
        imagePath.startsWith(
            "https://"
        )
    ) {

        return imagePath;
    }


    if (
        imagePath.startsWith(
            "/"
        )
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
   LOAD ANALYTICS
   ========================================================= */

let analyticsData =
    null;


async function loadAnalytics() {

    console.log(
        "SmartReceiptAI Analytics: loading..."
    );


    try {

        const response =
            await apiRequest(
                `${API_BASE}/analytics/overview`
            );


        if (!response) {
            return;
        }


        console.log(
            "Analytics response:",
            response
        );


        const data =
            response.data || {};


        analyticsData =
            data;


        renderAllAnalytics(
            data
        );


    } catch (error) {

        console.error(
            "Failed to load analytics:",
            error
        );


        renderAnalyticsError(
            error
        );
    }
}


/* =========================================================
   RENDER ALL ANALYTICS
   ========================================================= */

function renderAllAnalytics(
    data
) {

    renderOverview(
        data
    );


    renderFinancialCards(
        Array.isArray(
            data.currencies
        )
            ? data.currencies
            : []
    );


    renderProcessingTrend(
        Array.isArray(
            data.processing_trend
        )
            ? data.processing_trend
            : []
    );


    renderInsightList(
        "payment-methods-list",
        Array.isArray(
            data.payment_methods
        )
            ? data.payment_methods
            : [],
        "method"
    );


    renderInsightList(
        "merchant-categories-list",
        Array.isArray(
            data.merchant_categories
        )
            ? data.merchant_categories
            : [],
        "category"
    );


    renderVision(
        data.vision || {}
    );


    updateEmptyState(
        data
    );
}


/* =========================================================
   OVERVIEW
   ========================================================= */

function renderOverview(
    data
) {

    const overview =
        data.overview || {};


    const currencies =
        Array.isArray(
            data.currencies
        )
            ? data.currencies
            : [];


    setText(
        "analytics-total-receipts",
        formatNumber(
            overview.total_receipts
        )
    );


    setText(
        "analytics-total-items",
        formatNumber(
            overview.total_items
        )
    );


    if (
        currencies.length === 1
    ) {

        const currency =
            currencies[0];


        const code =
            currency.currency ||
            "SDG";


        setText(
            "analytics-total-spending",
            `${formatAmount(
                currency.total_amount
            )} ${code}`
        );


        setText(
            "analytics-average-receipt",
            `${formatAmount(
                currency.average_receipt
            )} ${code}`
        );


        updateStatFooter(
            3,
            `${code} ${t(
                "total"
            ).toLowerCase()}`
        );


        updateStatFooter(
            4,
            t(
                "average_receipt_value"
            )
        );


    } else if (
        currencies.length > 1
    ) {

        setText(
            "analytics-total-spending",
            t("multiple")
        );


        setText(
            "analytics-average-receipt",
            t("multiple")
        );


        updateStatFooter(
            3,
            t(
                "multiple_currencies"
            )
        );


        updateStatFooter(
            4,
            t(
                "average_receipt_value"
            )
        );


    } else {

        setText(
            "analytics-total-spending",
            "0.00"
        );


        setText(
            "analytics-average-receipt",
            "0.00"
        );


        updateStatFooter(
            3,
            t(
                "no_financial_data"
            )
        );


        updateStatFooter(
            4,
            t(
                "average_receipt_value"
            )
        );
    }
}


/* =========================================================
   STAT FOOTER
   ========================================================= */

function updateStatFooter(
    cardNumber,
    text
) {

    const cards =
        document.querySelectorAll(
            ".analytics-stat-card"
        );


    const card =
        cards[
            cardNumber - 1
        ];


    if (!card) {
        return;
    }


    const footer =
        card.querySelector(
            ".analytics-stat-footer span:last-child"
        );


    if (footer) {

        footer.textContent =
            text;
    }
}


/* =========================================================
   FINANCIAL CARDS
   ========================================================= */

function renderFinancialCards(
    currencies
) {

    const container =
        document.getElementById(
            "financial-container"
        );


    if (!container) {
        return;
    }


    if (
        !currencies.length
    ) {

        container.innerHTML = `

            <div class="financial-empty">

                ${escapeHtml(
                    t(
                        "no_financial_data_available"
                    )
                )}

            </div>

        `;

        return;
    }


    container.innerHTML =
        currencies
            .map(
                createFinancialCard
            )
            .join("");
}


function createFinancialCard(
    currency
) {

    const code =
        escapeHtml(
            currency.currency ||
            "Unknown"
        );


    const receiptCount =
        Number(
            currency.receipt_count
        ) ||
        0;


    return `

        <article
            class="financial-card"
        >

            <div
                class="financial-card-header"
            >

                <span
                    class="financial-card-currency"
                >
                    ${code}
                </span>


                <span
                    class="financial-card-receipts"
                >

                    ${formatNumber(
                        receiptCount
                    )}

                    ${
                        receiptCount === 1
                            ? escapeHtml(
                                t("receipt")
                            )
                            : escapeHtml(
                                t("receipts")
                            )
                    }

                </span>

            </div>


            <span
                class="financial-card-total-label"
            >
                ${escapeHtml(
                    t("total_spending")
                )}
            </span>


            <strong
                class="financial-card-total"
            >

                ${formatAmount(
                    currency.total_amount
                )}

                ${code}

            </strong>


            <div
                class="financial-card-divider"
            ></div>


            <div
                class="financial-metrics"
            >

                <div
                    class="financial-metric"
                >

                    <span>
                        ${escapeHtml(
                            t("average")
                        )}
                    </span>

                    <strong>
                        ${formatAmount(
                            currency.average_receipt
                        )}
                    </strong>

                </div>


                <div
                    class="financial-metric"
                >

                    <span>
                        ${escapeHtml(
                            t("tax")
                        )}
                    </span>

                    <strong>
                        ${formatAmount(
                            currency.total_tax
                        )}
                    </strong>

                </div>


                <div
                    class="financial-metric"
                >

                    <span>
                        ${escapeHtml(
                            t("discount")
                        )}
                    </span>

                    <strong>
                        ${formatAmount(
                            currency.total_discount
                        )}
                    </strong>

                </div>

            </div>

        </article>

    `;
}


/* =========================================================
   PROCESSING TREND
   ========================================================= */

function renderProcessingTrend(
    trend
) {

    const container =
        document.getElementById(
            "processing-chart"
        );


    if (!container) {
        return;
    }


    if (
        !trend.length
    ) {

        container.innerHTML = `

            <div
                class="chart-empty"
            >

                <div
                    class="chart-empty-icon"
                >
                    ◫
                </div>


                <strong>
                    ${escapeHtml(
                        t(
                            "no_processing_activity"
                        )
                    )}
                </strong>


                <span>
                    ${escapeHtml(
                        t(
                            "processing_activity_empty_description"
                        )
                    )}
                </span>

            </div>

        `;

        return;
    }


    const maxReceipts =
        Math.max(
            ...trend.map(
                item =>
                    Number(
                        item.receipts
                    ) ||
                    0
            ),
            1
        );


    container.innerHTML = `

        <div
            class="simple-trend-list"
        >

            ${
                trend
                    .map(
                        item => {

                            const receipts =
                                Number(
                                    item.receipts
                                ) ||
                                0;


                            const percentage =
                                Math.max(
                                    (
                                        receipts /
                                        maxReceipts
                                    ) *
                                    100,
                                    6
                                );


                            return `

                                <div
                                    class="trend-row"
                                >

                                    <div
                                        class="trend-row-header"
                                    >

                                        <span>
                                            ${escapeHtml(
                                                formatDate(
                                                    item.date
                                                )
                                            )}
                                        </span>


                                        <strong>

                                            ${formatNumber(
                                                receipts
                                            )}

                                            ${
                                                receipts === 1
                                                    ? ` ${escapeHtml(
                                                        t("receipt")
                                                    )}`
                                                    : ` ${escapeHtml(
                                                        t("receipts")
                                                    )}`
                                            }

                                        </strong>

                                    </div>


                                    <div
                                        class="trend-track"
                                    >

                                        <div
                                            class="trend-bar"
                                            style="width:${percentage}%"
                                        ></div>

                                    </div>

                                </div>

                            `;
                        }
                    )
                    .join("")
            }

        </div>

    `;
}


/* =========================================================
   INSIGHT LISTS
   ========================================================= */

function renderInsightList(
    containerId,
    items,
    labelKey
) {

    const container =
        document.getElementById(
            containerId
        );


    if (!container) {
        return;
    }


    if (
        !items.length
    ) {

        container.innerHTML = `

            <div
                class="insight-empty"
            >

                ${escapeHtml(
                    t(
                        "no_data_available_yet"
                    )
                )}

            </div>

        `;

        return;
    }


    container.innerHTML =
        items
            .map(
                item => {

                    const label =
                        escapeHtml(
                            item[labelKey] ||
                            t("unknown")
                        );


                    const count =
                        Number(
                            item.count
                        ) ||
                        0;


                    return `

                        <div
                            class="insight-row"
                        >

                            <div
                                class="insight-label"
                            >

                                <span
                                    class="insight-dot"
                                ></span>


                                <strong>
                                    ${label}
                                </strong>

                            </div>


                            <span
                                class="insight-count"
                            >
                                ${formatNumber(
                                    count
                                )}
                            </span>

                        </div>

                    `;
                }
            )
            .join("");
}


/* =========================================================
   VISION
   ========================================================= */

function renderVision(
    vision
) {

    const successful =
        Number(
            vision.successful
        ) ||
        0;


    const failed =
        Number(
            vision.failed
        ) ||
        0;


    const rate =
        Number(
            vision.success_rate
        ) ||
        0;


    setText(
        "vision-successful",
        formatNumber(
            successful
        )
    );


    setText(
        "vision-failed",
        formatNumber(
            failed
        )
    );


    setText(
        "vision-success-rate",
        `${formatAmount(
            rate
        )}%`
    );
}


/* =========================================================
   EMPTY STATE
   ========================================================= */

function updateEmptyState(
    data
) {

    const element =
        document.getElementById(
            "analytics-empty-state"
        );


    if (!element) {
        return;
    }


    const total =
        Number(
            data?.overview?.total_receipts
        ) ||
        0;


    element.hidden =
        total > 0;
}


/* =========================================================
   ERROR
   ========================================================= */

function renderAnalyticsError(
    error
) {

    console.error(
        "Analytics render error:",
        error
    );


    const message =
        error?.message ||
        t(
            "unable_to_load_analytics"
        );


    const financial =
        document.getElementById(
            "financial-container"
        );


    if (financial) {

        financial.innerHTML = `

            <div
                class="analytics-error"
            >

                <div
                    class="analytics-error-icon"
                >
                    !
                </div>


                <strong>
                    ${escapeHtml(
                        t(
                            "unable_to_load_analytics"
                        )
                    )}
                </strong>


                <span>
                    ${escapeHtml(
                        message
                    )}
                </span>

            </div>

        `;
    }


    const chart =
        document.getElementById(
            "processing-chart"
        );


    if (chart) {

        chart.innerHTML = `

            <div
                class="analytics-error"
            >

                <div
                    class="analytics-error-icon"
                >
                    !
                </div>


                <strong>
                    ${escapeHtml(
                        t(
                            "unable_to_load_processing_activity"
                        )
                    )}
                </strong>


                <span>
                    ${escapeHtml(
                        message
                    )}
                </span>

            </div>

        `;
    }
}


/* =========================================================
   ACCOUNT MENU
   ========================================================= */

function initializeAccountMenu() {

    const button =
        document.getElementById(
            "user-account-button"
        );


    const menu =
        document.getElementById(
            "user-account-menu"
        );


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

            event.stopPropagation();


            const isOpen =
                !menu.hidden;


            menu.hidden =
                isOpen;


            button.setAttribute(
                "aria-expanded",
                String(!isOpen)
            );
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
        closeMenu
    );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Escape"
            ) {

                closeMenu();
            }
        }
    );
}


/* =========================================================
   MOBILE MENU
   ========================================================= */

function initializeMobileMenu() {

    const button =
        document.getElementById(
            "mobile-menu-button"
        );


    const sidebar =
        document.querySelector(
            ".analytics .sidebar"
        );


    if (
        !button ||
        !sidebar
    ) {
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


    sidebar
        .querySelectorAll(
            ".nav-item"
        )
        .forEach(
            item => {

                item.addEventListener(
                    "click",
                    () => {

                        sidebar.classList.remove(
                            "mobile-open"
                        );
                    }
                );
            }
        );
}


/* =========================================================
   LOGOUT
   ========================================================= */

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
                    method:
                        "POST",

                    credentials:
                        "include",

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

            window.location.href =
                "/";
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


/* =========================================================
   UTILITIES
   ========================================================= */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.textContent =
            value ?? "";
    }
}


function formatNumber(
    value
) {

    const number =
        Number(value);


    if (
        !Number.isFinite(
            number
        )
    ) {

        return "0";
    }


    return number.toLocaleString(
        getCurrentLanguage() === "ar"
            ? "ar"
            : "en-US"
    );
}


function formatAmount(
    value
) {

    const number =
        Number(value);


    if (
        !Number.isFinite(
            number
        )
    ) {

        return "0.00";
    }


    return number.toLocaleString(
        getCurrentLanguage() === "ar"
            ? "ar"
            : "en-US",
        {
            minimumFractionDigits:
                2,

            maximumFractionDigits:
                2
        }
    );
}


function formatDate(
    value
) {

    if (!value) {
        return "—";
    }


    const date =
        new Date(
            `${value}T00:00:00`
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return String(value);
    }


    return date.toLocaleDateString(
        getCurrentLanguage() === "ar"
            ? "ar"
            : "en-US",
        {
            year: "numeric",
            month: "short",
            day: "numeric"
        }
    );
}


function escapeHtml(
    value
) {

    return String(
        value ?? ""
    )
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );
}


/* =========================================================
   GLOBAL LANGUAGE CHANGE
   ========================================================= */

window.addEventListener(
    "languageChanged",
    async event => {

        const language =
            event.detail?.language ||
            getCurrentLanguage();


        /*
         * Translate static HTML.
         */

        window.SmartReceiptLanguage
            ?.translatePage(
                language
            );


        /*
         * Re-render dynamic analytics
         * with the selected language.
         */

        if (
            analyticsData
        ) {

            renderAllAnalytics(
                analyticsData
            );

        } else {

            await loadAnalytics();
        }
    }
);


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        console.log(
            "SmartReceiptAI Analytics initialized."
        );


        if (
            !requireAuthentication()
        ) {
            return;
        }


        initializeAccountMenu();

        initializeMobileMenu();

        initializeLogout();


        await Promise.all([
            loadCurrentUser(),
            loadAnalytics()
        ]);
    }
);