/* =========================================================
   SmartReceiptAI — Global Theme Manager
   Light / Dark / System
   Global Application Theme
   ========================================================= */

"use strict";

(function () {

    /* =====================================================
       CONFIG
    ===================================================== */

    const STORAGE_KEY =
        "smartreceiptai_theme";

    const DEFAULT_THEME =
        "system";

    const VALID_THEMES = [
        "light",
        "dark",
        "system"
    ];


    /* =====================================================
       GET SAVED THEME
    ===================================================== */

    function getStoredTheme() {

        const saved =
            localStorage.getItem(
                STORAGE_KEY
            );

        if (
            VALID_THEMES.includes(saved)
        ) {
            return saved;
        }

        return DEFAULT_THEME;
    }


    /* =====================================================
       GET SYSTEM THEME
    ===================================================== */

    function getSystemTheme() {

        if (!window.matchMedia) {
            return "light";
        }

        return window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches
            ? "dark"
            : "light";
    }


    /* =====================================================
       RESOLVE THEME
    ===================================================== */

    function resolveTheme(theme) {

        if (theme === "system") {
            return getSystemTheme();
        }

        return theme;
    }


    /* =====================================================
       APPLY THEME
    ===================================================== */

    function applyTheme(
        theme,
        save = true
    ) {

        if (
            !VALID_THEMES.includes(theme)
        ) {
            theme =
                DEFAULT_THEME;
        }


        const html =
            document.documentElement;


        /*
         * Resolved theme:
         *
         * system → light/dark
         */

        const resolvedTheme =
            resolveTheme(theme);


        /*
         * Save user's preference.
         */

        if (save) {

            localStorage.setItem(
                STORAGE_KEY,
                theme
            );
        }


        /*
         * Apply actual theme
         * globally.
         *
         * Every page that loads
         * base.css will react to this.
         */

        html.setAttribute(
            "data-theme",
            resolvedTheme
        );


        /*
         * Keep user's original
         * preference separately.
         */

        html.setAttribute(
            "data-theme-preference",
            theme
        );


        /*
         * Browser native UI.
         */

        html.style.colorScheme =
            resolvedTheme;


        /*
         * Update theme controls
         * if current page has them.
         */

        updateThemeOptions(
            theme
        );


        /*
         * Notify every component
         * in the current page.
         */

        window.dispatchEvent(
            new CustomEvent(
                "themeChanged",
                {
                    detail: {

                        theme:
                            theme,

                        resolvedTheme:
                            resolvedTheme
                    }
                }
            )
        );
    }


    /* =====================================================
       UPDATE THEME OPTIONS
    ===================================================== */

    function updateThemeOptions(
        activeTheme
    ) {

        const options =
            document.querySelectorAll(
                "[data-theme-option]"
            );


        options.forEach(
            option => {

                const optionTheme =
                    option.dataset.themeOption;


                const isActive =
                    optionTheme ===
                    activeTheme;


                option.classList.toggle(
                    "active",
                    isActive
                );


                option.setAttribute(
                    "aria-selected",
                    String(isActive)
                );


                option.setAttribute(
                    "aria-pressed",
                    String(isActive)
                );
            }
        );
    }


    /* =====================================================
       INITIALIZE
    ===================================================== */

    function initialize() {

        /*
         * Get user's saved preference.
         */

        const theme =
            getStoredTheme();


        /*
         * Apply it globally.
         */

        applyTheme(
            theme,
            false
        );


        /* =================================================
           SYSTEM THEME LISTENER
        ================================================= */

        if (window.matchMedia) {

            const mediaQuery =
                window.matchMedia(
                    "(prefers-color-scheme: dark)"
                );


            const handleSystemThemeChange =
                () => {

                    const currentTheme =
                        getStoredTheme();


                    /*
                     * Only react to system
                     * when user selected System.
                     */

                    if (
                        currentTheme !==
                        "system"
                    ) {
                        return;
                    }


                    applyTheme(
                        "system",
                        false
                    );
                };


            if (
                mediaQuery.addEventListener
            ) {

                mediaQuery.addEventListener(
                    "change",
                    handleSystemThemeChange
                );

            } else {

                /*
                 * Compatibility with
                 * older browsers.
                 */

                mediaQuery.addListener(
                    handleSystemThemeChange
                );
            }
        }


        /* =================================================
           GLOBAL THEME BUTTONS
        ================================================= */

        document.addEventListener(
            "click",
            event => {

                const option =
                    event.target.closest(
                        "[data-theme-option]"
                    );


                if (!option) {
                    return;
                }


                const selectedTheme =
                    option.dataset.themeOption;


                if (
                    !VALID_THEMES.includes(
                        selectedTheme
                    )
                ) {
                    return;
                }


                /*
                 * Apply globally.
                 */

                applyTheme(
                    selectedTheme,
                    true
                );
            }
        );
    }


    /* =====================================================
       PUBLIC API
    ===================================================== */

    window.SmartReceiptTheme = {

        /*
         * Returns:
         * light / dark / system
         */

        getTheme() {

            return getStoredTheme();
        },


        /*
         * Returns actual theme:
         * light / dark
         */

        getResolvedTheme() {

            return resolveTheme(
                getStoredTheme()
            );
        },


        /*
         * Set global theme.
         */

        setTheme(theme) {

            applyTheme(
                theme,
                true
            );
        },


        /*
         * Reset to System.
         */

        reset() {

            applyTheme(
                DEFAULT_THEME,
                true
            );
        }
    };


    /* =====================================================
       EARLY THEME APPLICATION
    ===================================================== */

    /*
     * Apply the theme BEFORE the page
     * finishes loading.
     *
     * This prevents the flash of
     * the wrong theme.
     */

    const initialTheme =
        getStoredTheme();


    const initialResolvedTheme =
        resolveTheme(
            initialTheme
        );


    document.documentElement.setAttribute(
        "data-theme",
        initialResolvedTheme
    );


    document.documentElement.setAttribute(
        "data-theme-preference",
        initialTheme
    );


    document.documentElement.style.colorScheme =
        initialResolvedTheme;


    /* =====================================================
       START
    ===================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initialize,
            {
                once: true
            }
        );

    } else {

        initialize();
    }

})();