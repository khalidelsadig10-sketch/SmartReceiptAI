/* =========================================================
   SmartReceiptAI — Settings Page
   Global Language + Theme + Settings API
   ========================================================= */

"use strict";

const API_BASE = "/api/v1";

let savedSettings = null;


/* =========================================================
   DOM
   ========================================================= */

const languageInput =
    document.getElementById("settings-language");

const currencyInput =
    document.getElementById("settings-currency");

const timezoneInput =
    document.getElementById("settings-timezone");

const emailNotificationsInput =
    document.getElementById("settings-email-notifications");

const processingNotificationsInput =
    document.getElementById(
        "settings-processing-notifications"
    );

const saveButton =
    document.getElementById("settings-save-button");

const resetButton =
    document.getElementById("settings-reset-button");

const messageBox =
    document.getElementById("settings-message");

const toastContainer =
    document.getElementById(
        "settings-toast-container"
    );

const themeOptions =
    document.querySelectorAll(
        "[data-theme-option]"
    );


/* =========================================================
   LANGUAGE HELPERS
   ========================================================= */

function getCurrentLanguage() {

    return window.SmartReceiptLanguage
        ? window.SmartReceiptLanguage.getLanguage()
        : "en";
}


function translate(key) {

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
   AUTH HEADERS
   ========================================================= */

function getAuthHeaders() {

    const token =
        localStorage.getItem("access_token") ||
        localStorage.getItem("token");

    return token
        ? {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
        : {
            "Content-Type": "application/json"
        };
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


    let data = null;

    try {

        data =
            await response.json();

    } catch {

        data = null;
    }


    if (!response.ok) {

        const message =
            data?.detail ||
            data?.message ||
            "Something went wrong.";

        throw new Error(message);
    }


    return data;
}


/* =========================================================
   THEME SYSTEM
   ========================================================= */

const THEME_STORAGE_KEY =
    "smartreceiptai_theme";


function getSystemTheme() {

    return window.matchMedia &&
        window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches
        ? "dark"
        : "light";
}


function getSavedTheme() {

    const storedTheme =
        localStorage.getItem(
            THEME_STORAGE_KEY
        );

    if (
        storedTheme === "light" ||
        storedTheme === "dark" ||
        storedTheme === "system"
    ) {

        return storedTheme;
    }

    return "system";
}


function getResolvedTheme(theme) {

    if (theme === "system") {

        return getSystemTheme();
    }

    return theme;
}


function applyTheme(
    theme,
    savePreference = true
) {

    if (
        theme !== "light" &&
        theme !== "dark" &&
        theme !== "system"
    ) {

        theme = "system";
    }


    const resolvedTheme =
        getResolvedTheme(theme);


    /*
     * Store selected preference.
     */

    if (savePreference) {

        localStorage.setItem(
            THEME_STORAGE_KEY,
            theme
        );
    }


    /*
     * Apply resolved theme.
     */

    document.documentElement.dataset.theme =
        resolvedTheme;


    document.documentElement.dataset.themePreference =
        theme;


    /*
     * Update theme buttons.
     */

    updateThemeButtons(theme);


    /*
     * Notify the rest of SmartReceiptAI.
     */

    window.dispatchEvent(
        new CustomEvent(
            "themeChanged",
            {
                detail: {
                    theme: theme,
                    resolvedTheme: resolvedTheme
                }
            }
        )
    );
}


function updateThemeButtons(
    activeTheme
) {

    themeOptions.forEach(
        button => {

            const buttonTheme =
                button.dataset.themeOption;


            const isActive =
                buttonTheme === activeTheme;


            button.classList.toggle(
                "active",
                isActive
            );


            button.setAttribute(
                "aria-pressed",
                String(isActive)
            );
        }
    );
}


function initializeTheme() {

    const savedTheme =
        getSavedTheme();


    applyTheme(
        savedTheme,
        false
    );
}


function initializeThemeButtons() {

    themeOptions.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const selectedTheme =
                        button.dataset.themeOption;


                    if (!selectedTheme) {
                        return;
                    }


                    /*
                     * Apply immediately.
                     */

                    applyTheme(
                        selectedTheme,
                        true
                    );


                    /*
                     * Update the current
                     * form state.
                     */

                    if (savedSettings) {

                        savedSettings.theme =
                            selectedTheme;
                    }


                    /*
                     * Small confirmation.
                     */

                    showToast(
                        translate(
                            "theme_changed"
                        ),
                        "success"
                    );
                }
            );
        }
    );
}


/* =========================================================
   SYSTEM THEME LISTENER
   ========================================================= */

function initializeSystemThemeListener() {

    if (!window.matchMedia) {
        return;
    }


    const mediaQuery =
        window.matchMedia(
            "(prefers-color-scheme: dark)"
        );


    mediaQuery.addEventListener(
        "change",
        () => {

            const selectedTheme =
                getSavedTheme();


            if (
                selectedTheme === "system"
            ) {

                applyTheme(
                    "system",
                    false
                );
            }
        }
    );
}


/* =========================================================
   LOAD SETTINGS
   ========================================================= */

async function loadSettings() {

    setLoadingState(true);

    try {

        const data =
            await apiRequest(
                `${API_BASE}/settings`
            );


        const apiLanguage =
            data.language || "en";


        const languageManager =
            window.SmartReceiptLanguage;


        let activeLanguage =
            languageManager
                ? languageManager.getLanguage()
                : apiLanguage;


        if (
            languageManager &&
            !languageManager.hasStoredLanguage()
        ) {

            activeLanguage =
                apiLanguage;

            languageManager.setLanguage(
                activeLanguage
            );
        }


        /*
         * Theme:
         *
         * Local preference has priority.
         * API theme is used only if no local
         * theme exists.
         */

        const localTheme =
            localStorage.getItem(
                THEME_STORAGE_KEY
            );


        const activeTheme =
            localTheme ||
            data.theme ||
            "system";


        if (
            !localTheme &&
            data.theme
        ) {

            localStorage.setItem(
                THEME_STORAGE_KEY,
                data.theme
            );
        }


        savedSettings = {

            language:
                activeLanguage,

            currency:
                data.currency || "SDG",

            timezone:
                data.timezone ||
                "Africa/Khartoum",

            theme:
                activeTheme,

            email_notifications:
                Boolean(
                    data.email_notifications
                ),

            processing_notifications:
                Boolean(
                    data.processing_notifications
                )
        };


        applySettings(
            savedSettings
        );


    } catch (error) {

        console.error(
            "Failed to load settings:",
            error
        );


        /*
         * Even if API fails,
         * apply local theme.
         */

        const localTheme =
            getSavedTheme();


        applyTheme(
            localTheme,
            false
        );


        const message =
            translate(
                "settings_load_error"
            );


        showMessage(
            error.message || message,
            "error"
        );


        showToast(
            error.message || message,
            "error"
        );


    } finally {

        setLoadingState(false);
    }
}


/* =========================================================
   APPLY SETTINGS
   ========================================================= */

function applySettings(settings) {

    if (!settings) {
        return;
    }


    if (languageInput) {

        languageInput.value =
            settings.language || "en";
    }


    if (currencyInput) {

        currencyInput.value =
            settings.currency || "SDG";
    }


    if (timezoneInput) {

        timezoneInput.value =
            settings.timezone ||
            "Africa/Khartoum";
    }


    if (emailNotificationsInput) {

        emailNotificationsInput.checked =
            Boolean(
                settings.email_notifications
            );
    }


    if (processingNotificationsInput) {

        processingNotificationsInput.checked =
            Boolean(
                settings.processing_notifications
            );
    }


    /*
     * Apply theme.
     */

    applyTheme(
        settings.theme || "system",
        false
    );
}


/* =========================================================
   COLLECT SETTINGS
   ========================================================= */

function collectSettings() {

    return {

        language:
            languageInput?.value || "en",

        currency:
            currencyInput?.value || "SDG",

        timezone:
            timezoneInput?.value ||
            "Africa/Khartoum",

        theme:
            getSavedTheme(),

        email_notifications:
            Boolean(
                emailNotificationsInput?.checked
            ),

        processing_notifications:
            Boolean(
                processingNotificationsInput?.checked
            )
    };
}

/* =========================================================
   THEME SETTINGS
========================================================= */

function getCurrentTheme() {

    return window.SmartReceiptTheme
        ? window.SmartReceiptTheme.getTheme()
        : "system";
}


function initializeThemeSettings() {

    const themeOptions =
        document.querySelectorAll(
            "[data-theme-option]"
        );


    if (!themeOptions.length) {
        return;
    }


    /*
     * Apply currently saved theme
     * to the buttons.
     */

    updateThemeButtons(
        getCurrentTheme()
    );


    /*
     * User selects a theme.
     */

    themeOptions.forEach(option => {

        option.addEventListener(
            "click",
            () => {

                const theme =
                    option.dataset.themeOption;


                if (
                    !window.SmartReceiptTheme
                ) {
                    return;
                }


                window.SmartReceiptTheme.setTheme(
                    theme
                );


                updateThemeButtons(
                    theme
                );
            }
        );
    });
}


function updateThemeButtons(theme) {

    const themeOptions =
        document.querySelectorAll(
            "[data-theme-option]"
        );


    themeOptions.forEach(option => {

        const optionTheme =
            option.dataset.themeOption;


        option.classList.toggle(
            "active",
            optionTheme === theme
        );
    });
}
/* =========================================================
   SAVE SETTINGS
   ========================================================= */

async function saveSettings() {

    const settings =
        collectSettings();


    setSavingState(true);

    clearMessage();


    try {

        const data =
            await apiRequest(
                `${API_BASE}/settings`,
                {
                    method: "PUT",

                    body:
                        JSON.stringify(
                            settings
                        )
                }
            );


        savedSettings = {

            language:
                data.language ??
                settings.language,

            currency:
                data.currency ??
                settings.currency,

            timezone:
                data.timezone ??
                settings.timezone,

            theme:
                data.theme ??
                settings.theme,

            email_notifications:
                Boolean(
                    data.email_notifications ??
                    settings.email_notifications
                ),

            processing_notifications:
                Boolean(
                    data.processing_notifications ??
                    settings.processing_notifications
                )
        };


        /*
         * Save theme locally.
         */

        applyTheme(
            savedSettings.theme,
            true
        );


        /*
         * Apply language globally.
         */

        if (
            window.SmartReceiptLanguage
        ) {

            window.SmartReceiptLanguage.setLanguage(
                savedSettings.language
            );
        }


        applySettings(
            savedSettings
        );


        showMessage(
            translate(
                "settings_saved_message"
            ),
            "success"
        );


        showToast(
            translate(
                "settings_saved_toast"
            ),
            "success"
        );


    } catch (error) {

        console.error(
            "Failed to save settings:",
            error
        );


        const message =
            translate(
                "settings_save_error"
            );


        showMessage(
            error.message || message,
            "error"
        );


        showToast(
            error.message || message,
            "error"
        );


    } finally {

        setSavingState(false);
    }
}


/* =========================================================
   RESET SETTINGS
   ========================================================= */

function resetSettings() {

    if (!savedSettings) {
        return;
    }


    applySettings(
        savedSettings
    );


    if (
        window.SmartReceiptLanguage
    ) {

        window.SmartReceiptLanguage.setLanguage(
            savedSettings.language
        );
    }


    applyTheme(
        savedSettings.theme || "system",
        true
    );


    clearMessage();


    showToast(
        translate(
            "changes_reset"
        ),
        "success"
    );
}


/* =========================================================
   LOADING STATE
   ========================================================= */

function setLoadingState(
    isLoading
) {

    if (saveButton) {

        saveButton.disabled =
            isLoading;
    }


    if (resetButton) {

        resetButton.disabled =
            isLoading;
    }


    if (isLoading) {

        showMessage(
            translate(
                "loading_settings"
            ),
            "info"
        );
    }
}


/* =========================================================
   SAVING STATE
   ========================================================= */

function setSavingState(
    isSaving
) {

    if (!saveButton) {
        return;
    }


    if (isSaving) {

        saveButton.disabled =
            true;


        saveButton.dataset.originalText =
            saveButton.textContent;


        saveButton.textContent =
            translate(
                "saving"
            );


    } else {

        saveButton.disabled =
            false;


        saveButton.textContent =
            saveButton.dataset.originalText ||
            translate(
                "save_changes"
            );
    }


    if (resetButton) {

        resetButton.disabled =
            isSaving;
    }
}


/* =========================================================
   MESSAGE
   ========================================================= */

function showMessage(
    message,
    type = "info"
) {

    if (!messageBox) {
        return;
    }


    messageBox.textContent =
        message;


    messageBox.className =
        `settings-message ${type}`;
}


/* =========================================================
   CLEAR MESSAGE
   ========================================================= */

function clearMessage() {

    if (!messageBox) {
        return;
    }


    messageBox.textContent =
        "";


    messageBox.className =
        "settings-message";
}


/* =========================================================
   TOAST
   ========================================================= */

function showToast(
    message,
    type = "success"
) {

    if (!toastContainer) {
        return;
    }


    const toast =
        document.createElement(
            "div"
        );


    toast.className =
        `settings-toast ${type}`;


    const icon =
        document.createElement(
            "span"
        );


    icon.className =
        "settings-toast-icon";


    icon.textContent =
        type === "error"
            ? "!"
            : "✓";


    const text =
        document.createElement(
            "span"
        );


    text.textContent =
        message;


    toast.appendChild(
        icon
    );


    toast.appendChild(
        text
    );


    toastContainer.appendChild(
        toast
    );


    requestAnimationFrame(
        () => {

            toast.classList.add(
                "visible"
            );
        }
    );


    setTimeout(
        () => {

            toast.classList.remove(
                "visible"
            );


            setTimeout(
                () => {

                    toast.remove();

                },
                250
            );

        },
        3000
    );
}


/* =========================================================
   LANGUAGE SETTINGS
   ========================================================= */

function initializeLanguageSettings() {

    if (!languageInput) {
        return;
    }


    languageInput.value =
        getCurrentLanguage();


    languageInput.addEventListener(
        "change",
        function () {

            const selectedLanguage =
                this.value;


            if (
                !window.SmartReceiptLanguage
            ) {
                return;
            }


            window.SmartReceiptLanguage.setLanguage(
                selectedLanguage
            );
        }
    );
}


/* =========================================================
   GLOBAL LANGUAGE CHANGE
   ========================================================= */

window.addEventListener(
    "languageChanged",
    event => {

        const language =
            event.detail?.language ||
            "en";


        if (languageInput) {

            languageInput.value =
                language;
        }


        if (
            window.SmartReceiptLanguage
        ) {

            window.SmartReceiptLanguage.translatePage(
                language
            );
        }
    }
);


/* =========================================================
   GLOBAL THEME CHANGE
   ========================================================= */

window.addEventListener(
    "themeChanged",
    event => {

        const theme =
            event.detail?.theme;


        if (
            theme &&
            savedSettings
        ) {

            savedSettings.theme =
                theme;
        }
    }
);


/* =========================================================
   EVENT LISTENERS
   ========================================================= */

if (saveButton) {

    saveButton.addEventListener(
        "click",
        saveSettings
    );
}


if (resetButton) {

    resetButton.addEventListener(
        "click",
        resetSettings
    );
}


/* =========================================================
   INITIALIZE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeTheme();

        initializeThemeButtons();

        initializeSystemThemeListener();

        initializeLanguageSettings();

        loadSettings();
    }
);