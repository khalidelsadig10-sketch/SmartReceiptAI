"use strict";

/* =========================================================
   SmartReceiptAI
   AI Intelligence Client Logic
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


function getDictionary() {

    const language =
        getCurrentLanguage();

    return (
        window.SmartReceiptLanguage
            ?.translations?.[language] ||
        {}
    );
}


function t(key) {

    const dictionary =
        getDictionary();

    if (
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
   DOM UTILITIES
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

    if (!token) {
        return {};
    }

    return {
        Authorization:
            `Bearer ${token}`
    };
}


function requireAuthentication() {

    if (!getAccessToken()) {

        window.location.href = "/";

        return false;
    }

    return true;
}


/* =========================================================
   API REQUEST
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

        clearAuthentication();

        window.location.href = "/";

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
   CLEAR AUTHENTICATION
   ========================================================= */

function clearAuthentication() {

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


        updateAvatar(
            "user-avatar",
            user.profile_image,
            initial
        );


        updateAvatar(
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

function updateAvatar(
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
            normalizeImageUrl(
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


/* =========================================================
   PROFILE IMAGE URL
   ========================================================= */

function normalizeImageUrl(
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
   INTELLIGENCE DATA
   ========================================================= */

let intelligenceData =
    null;


/* =========================================================
   LOAD INTELLIGENCE
   ========================================================= */

async function loadIntelligence() {

    try {

        setLoadingState();


        const response =
            await apiRequest(
                `${API_BASE}/intelligence/overview?limit=10`
            );


        if (!response) {
            return;
        }


        intelligenceData =
            response.data ||
            null;


        if (!intelligenceData) {

            throw new Error(
                t(
                    "ai_intelligence_data_unavailable"
                )
            );
        }


        renderIntelligence(
            intelligenceData
        );


    } catch (error) {

        console.error(
            "Failed to load AI intelligence:",
            error
        );


        renderError(
            error
        );
    }
}


/* =========================================================
   LOADING STATE
   ========================================================= */

function setLoadingState() {

    setText(
        "intelligence-total-analyses",
        "—"
    );


    setText(
        "intelligence-successful",
        "—"
    );


    setText(
        "intelligence-failed",
        "—"
    );


    setText(
        "intelligence-success-rate",
        "—"
    );
}


/* =========================================================
   RENDER INTELLIGENCE
   ========================================================= */

function renderIntelligence(
    data
) {

    const overview =
        data.overview ||
        {};


    const models =
        Array.isArray(
            data.vision_models
        )
            ? data.vision_models
            : [];


    const analyses =
        Array.isArray(
            data.recent_analyses
        )
            ? data.recent_analyses
            : [];


    const pipeline =
        Array.isArray(
            data.pipeline
        )
            ? data.pipeline
            : [];


    renderOverview(
        overview
    );


    renderPipeline(
        pipeline
    );


    renderVisionModels(
        models
    );


    renderRecentAnalyses(
        analyses
    );


    updateEmptyState(
        overview
    );
}


/* =========================================================
   OVERVIEW
   ========================================================= */

function renderOverview(
    overview
) {

    const total =
        Number(
            overview.total_analyses
        ) || 0;


    const successful =
        Number(
            overview.successful_analyses
        ) || 0;


    const failed =
        Number(
            overview.failed_analyses
        ) || 0;


    const successRate =
        Number(
            overview.success_rate
        ) || 0;


    setText(
        "intelligence-total-analyses",
        formatNumber(
            total
        )
    );


    setText(
        "intelligence-successful",
        formatNumber(
            successful
        )
    );


    setText(
        "intelligence-failed",
        formatNumber(
            failed
        )
    );


    setText(
        "intelligence-success-rate",
        `${formatAmount(
            successRate
        )}%`
    );
}


/* =========================================================
   PIPELINE
   ========================================================= */

function renderPipeline(pipeline) {

    const container =
        document.getElementById("pipeline-container");

    if (!container) {
        return;
    }

    const backendPipeline =
        Array.isArray(pipeline)
            ? pipeline
            : [];

    const canonicalPipeline = [
        {
            key: "vision",
            title: "OpenAI Vision",
            description:
                "Analyzes the receipt image and extracts structured receipt data.",
            status: "active"
        },
        {
            key: "currency_normalization",
            title: "Currency Normalization",
            description:
                "Normalizes and standardizes currency information.",
            status: "active"
        },
        {
            key: "product_normalization",
            title: "Product Normalization",
            description:
                "Cleans and normalizes product information.",
            status: "active"
        },
        {
            key: "financial_recovery",
            title: "Financial Recovery",
            description:
                "Recovers and normalizes financial information from the receipt.",
            status: "active"
        },
        {
            key: "validation",
            title: "Receipt Validation",
            description:
                "Checks the processed receipt data for consistency and validity.",
            status: "active"
        },
        {
            key: "storage",
            title: "Structured Storage",
            description:
                "Stores the processed receipt, items, image and vision analysis.",
            status: "active"
        }
    ];

    const backendMap =
        new Map(
            backendPipeline.map(step => [
                String(
                    step.key ||
                    step.title ||
                    ""
                )
                    .trim()
                    .toLowerCase(),
                step
            ])
        );

    const normalizedPipeline =
        canonicalPipeline.map(step => {

            const backendStep =
                backendMap.get(
                    step.key.toLowerCase()
                ) ||
                backendMap.get(
                    step.title.toLowerCase()
                );

            return {
                ...step,
                ...(backendStep || {})
            };
        });

    container.innerHTML = `
        <div class="pipeline-list">
            ${normalizedPipeline
                .map(
                    (step, index) =>
                        createPipelineStep(
                            step,
                            index
                        )
                )
                .join("")}
        </div>
    `;
}

/* =========================================================
   PIPELINE STEP
   ========================================================= */

function createPipelineStep(
    step,
    index
) {

    const title =
        escapeHtml(
            translatePipelineTitle(
                step.title ||
                step.key ||
                "Processing Step"
            )
        );


    const description =
        escapeHtml(
            translatePipelineDescription(
                step.description ||
                ""
            )
        );


    const rawStatus =
        String(
            step.status ||
            "active"
        );


    const status =
        escapeHtml(
            translateStatus(
                rawStatus
            )
        );


    return `
        <article class="pipeline-step">

            <div class="pipeline-step-number">
                ${index + 1}
            </div>


            <h3 class="pipeline-step-title">
                ${title}
            </h3>


            <p class="pipeline-step-description">
                ${description}
            </p>


            <span class="pipeline-step-status">
                ${status}
            </span>

        </article>
    `;
}


/* =========================================================
   PIPELINE STATUS TRANSLATION
   ========================================================= */

function translateStatus(
    status
) {

    const normalized =
        String(
            status
        )
            .trim()
            .toLowerCase();


    if (
        normalized === "active"
    ) {
        return t("active");
    }


    if (
        normalized === "completed" ||
        normalized === "complete" ||
        normalized === "success" ||
        normalized === "successful"
    ) {
        return t("completed");
    }


    if (
        normalized === "failed" ||
        normalized === "error"
    ) {
        return t("failed");
    }


    if (
        normalized === "pending"
    ) {
        return t("pending");
    }


    return status;
}


/* =========================================================
   PIPELINE TITLE TRANSLATION
   CURRENT SMARTRECEIPTAI PIPELINE
   ========================================================= */

function translatePipelineTitle(
    value
) {

    const normalized =
        String(
            value
        )
            .trim()
            .toLowerCase();


    const map = {

        "openai vision":
            "pipeline_vision",

        "vision":
            "pipeline_vision",

        "vision analysis":
            "pipeline_vision",


        "currency normalization":
            "pipeline_currency",

        "currency":
            "pipeline_currency",


        "product normalization":
            "pipeline_product",

        "product":
            "pipeline_product",


        "financial recovery":
            "pipeline_financial_recovery",

        "financial":
            "pipeline_financial_recovery",


        "receipt validation":
            "pipeline_validation",

        "validation":
            "pipeline_validation",


        "structured storage":
            "pipeline_storage",

        "storage":
            "pipeline_storage"

    };


    const key =
        map[normalized];


    if (
        key &&
        Object.prototype.hasOwnProperty.call(
            getDictionary(),
            key
        )
    ) {
        return t(key);
    }


    return value;
}


/* =========================================================
   PIPELINE DESCRIPTION TRANSLATION
   CURRENT SMARTRECEIPTAI PIPELINE
   ========================================================= */

function translatePipelineDescription(
    value
) {

    const normalized =
        String(
            value
        )
            .trim()
            .toLowerCase();


    const map = {

        /* OpenAI Vision */

        "analyzes the receipt image and extracts structured receipt data.":
            "pipeline_vision_description",

        "analyze the receipt image using openai vision.":
            "pipeline_vision_description",


        /* Currency Normalization */

        "normalizes and standardizes currency information.":
            "pipeline_currency_description",

        "normalize and standardize the currency information.":
            "pipeline_currency_description",


        /* Product Normalization */

        "cleans and normalizes product information.":
            "pipeline_product_description",

        "clean and normalize product information.":
            "pipeline_product_description",


        /* Financial Recovery */

        "recovers and normalizes financial information from the receipt.":
            "pipeline_financial_recovery_description",

        "recover and normalize financial information from the receipt.":
            "pipeline_financial_recovery_description",


        /* Receipt Validation */

        "checks the processed receipt data for consistency and validity.":
            "pipeline_validation_description",

        "check the processed receipt data for consistency and validity.":
            "pipeline_validation_description",


        /* Structured Storage */

        "stores the processed receipt, items, image and vision analysis.":
            "pipeline_storage_description",

        "store the processed receipt, items, image, and vision analysis.":
            "pipeline_storage_description"

    };


    const key =
        map[normalized];


    if (
        key &&
        Object.prototype.hasOwnProperty.call(
            getDictionary(),
            key
        )
    ) {
        return t(key);
    }


    return value;
}


/* =========================================================
   VISION MODELS
   ========================================================= */

function renderVisionModels(
    models
) {

    const container =
        document.getElementById(
            "vision-models-container"
        );


    if (!container) {
        return;
    }


    if (!models.length) {

        container.innerHTML = `
            <div class="intelligence-empty-inline">
                ${escapeHtml(
                    t(
                        "no_vision_model_activity"
                    )
                )}
            </div>
        `;

        return;
    }


    container.innerHTML =
        models
            .map(
                createModelCard
            )
            .join("");
}


/* =========================================================
   MODEL CARD
   ========================================================= */

function createModelCard(
    model
) {

    const modelName =
        escapeHtml(
            model.model_name ||
            t("unknown_model")
        );


    const analyses =
        Number(
            model.analyses
        ) || 0;


    const successful =
        Number(
            model.successful
        ) || 0;


    const failed =
        Number(
            model.failed
        ) || 0;


    return `
        <article class="model-card">

            <div class="model-card-header">

                <div class="model-icon">
                    ✦
                </div>


                <div class="model-card-title">

                    <span>
                        ${escapeHtml(
                            t(
                                "vision_model"
                            )
                        )}
                    </span>


                    <strong
                        title="${modelName}"
                    >
                        ${modelName}
                    </strong>

                </div>

            </div>


            <div class="model-card-divider"></div>


            <div class="model-card-metrics">

                <div class="model-metric">

                    <span>
                        ${escapeHtml(
                            t(
                                "analyses"
                            )
                        )}
                    </span>


                    <strong>
                        ${formatNumber(
                            analyses
                        )}
                    </strong>

                </div>


                <div class="model-metric success">

                    <span>
                        ${escapeHtml(
                            t(
                                "successful"
                            )
                        )}
                    </span>


                    <strong>
                        ${formatNumber(
                            successful
                        )}
                    </strong>

                </div>


                <div class="model-metric failed">

                    <span>
                        ${escapeHtml(
                            t(
                                "failed"
                            )
                        )}
                    </span>


                    <strong>
                        ${formatNumber(
                            failed
                        )}
                    </strong>

                </div>

            </div>

        </article>
    `;
}


/* =========================================================
   RECENT ANALYSES
   ========================================================= */

function renderRecentAnalyses(
    analyses
) {

    const tbody =
        document.getElementById(
            "recent-analyses-body"
        );


    if (!tbody) {
        return;
    }


    if (!analyses.length) {

        tbody.innerHTML = `
            <tr>

                <td
                    colspan="4"
                    class="table-empty"
                >

                    ${escapeHtml(
                        t(
                            "no_ai_analysis_records"
                        )
                    )}

                </td>

            </tr>
        `;

        return;
    }


    tbody.innerHTML =
        analyses
            .map(
                createAnalysisRow
            )
            .join("");
}


/* =========================================================
   ANALYSIS TABLE ROW
   ========================================================= */

function createAnalysisRow(
    analysis
) {

    const merchant =
        escapeHtml(
            analysis.merchant_name ||
            t("unknown_merchant")
        );


    const model =
        escapeHtml(
            analysis.model_name ||
            t("unknown")
        );


    const status =
        String(
            analysis.status ||
            "unknown"
        );


    const statusClass =
        getStatusClass(
            status
        );


    const statusLabel =
        formatStatusLabel(
            status
        );


    const createdAt =
        formatDateTime(
            analysis.created_at
        );


    return `
        <tr>

            <td>
                ${merchant}
            </td>


            <td>
                ${model}
            </td>


            <td>

                <span
                    class="analysis-status ${statusClass}"
                >

                    ${escapeHtml(
                        statusLabel
                    )}

                </span>

            </td>


            <td>
                ${escapeHtml(
                    createdAt
                )}
            </td>

        </tr>
    `;
}


/* =========================================================
   STATUS CLASS
   ========================================================= */

function getStatusClass(
    status
) {

    const normalized =
        String(
            status
        )
            .trim()
            .toLowerCase();


    if (
        normalized === "success" ||
        normalized === "successful" ||
        normalized === "completed"
    ) {
        return "success";
    }


    if (
        normalized === "failed" ||
        normalized === "error"
    ) {
        return "failed";
    }


    return "other";
}


/* =========================================================
   STATUS LABEL
   ========================================================= */

function formatStatusLabel(
    status
) {

    const normalized =
        String(
            status
        )
            .trim()
            .toLowerCase();


    if (
        normalized === "success" ||
        normalized === "successful" ||
        normalized === "completed"
    ) {
        return t(
            "success"
        );
    }


    if (
        normalized === "failed" ||
        normalized === "error"
    ) {
        return t(
            "failed"
        );
    }


    if (!normalized) {
        return t(
            "unknown"
        );
    }


    return normalized
        .charAt(0)
        .toUpperCase() +
        normalized.slice(1);
}


/* =========================================================
   EMPTY STATE
   ========================================================= */

function updateEmptyState(
    overview
) {

    const emptyState =
        document.getElementById(
            "intelligence-empty-state"
        );


    if (!emptyState) {
        return;
    }


    const total =
        Number(
            overview?.total_analyses
        ) || 0;


    emptyState.hidden =
        total > 0;
}


/* =========================================================
   ERROR STATE
   ========================================================= */

function renderError(
    error
) {

    const message =
        error?.message ||
        t(
            "unable_to_load_ai_intelligence"
        );


    console.error(
        "AI Intelligence error:",
        error
    );


    const containers = [
        "pipeline-container",
        "vision-models-container"
    ];


    containers.forEach(
        id => {

            const element =
                document.getElementById(
                    id
                );


            if (!element) {
                return;
            }


            element.innerHTML = `
                <div
                    class="intelligence-error"
                >

                    <div
                        class="intelligence-error-icon"
                    >
                        !
                    </div>


                    <strong>
                        ${escapeHtml(
                            t(
                                "unable_to_load_ai_intelligence"
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
    );


    const tableBody =
        document.getElementById(
            "recent-analyses-body"
        );


    if (tableBody) {

        tableBody.innerHTML = `
            <tr>

                <td
                    colspan="4"
                    class="table-error"
                >

                    ${escapeHtml(
                        t(
                            "unable_to_load_ai_analysis_records"
                        )
                    )}

                </td>

            </tr>
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
            ".intelligence .sidebar"
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

        if (
            logoutButton &&
            logoutButton.disabled
        ) {
            return;
        }


        if (logoutButton) {

            logoutButton.disabled =
                true;


            logoutButton.innerHTML = `
                <span class="nav-icon">
                    ↪
                </span>

                <span>
                    ${escapeHtml(
                        t(
                            "logging_out"
                        )
                    )}
                </span>
            `;
        }


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

            clearAuthentication();

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
   NUMBER FORMAT
   ========================================================= */

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


/* =========================================================
   AMOUNT FORMAT
   ========================================================= */

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


/* =========================================================
   DATE / TIME
   ========================================================= */

function formatDateTime(
    value
) {

    if (!value) {
        return "—";
    }


    const date =
        new Date(
            value
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return String(
            value
        );
    }


    return date.toLocaleString(
        getCurrentLanguage() === "ar"
            ? "ar"
            : "en-US",
        {
            year:
                "numeric",

            month:
                "short",

            day:
                "numeric",

            hour:
                "2-digit",

            minute:
                "2-digit"
        }
    );
}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

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
         * Re-render dynamic data
         * using the new dictionary.
         */

        if (
            intelligenceData
        ) {

            renderIntelligence(
                intelligenceData
            );

        } else {

            await loadIntelligence();
        }
    }
);


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

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
            loadIntelligence()
        ]);
    }
);