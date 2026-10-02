"use strict";

/* =========================================================
   SmartReceiptAI
   Security Page
   Global Language Support
   ========================================================= */

const SECURITY_API = "/api/v1/auth";


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
   AUTH
   ========================================================= */

function getSecurityToken() {

    return (
        localStorage.getItem("access_token") ||
        localStorage.getItem("accessToken") ||
        localStorage.getItem("token") ||
        sessionStorage.getItem("access_token") ||
        sessionStorage.getItem("token") ||
        null
    );
}


function clearSecurityAuthentication() {

    localStorage.removeItem("access_token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("token");

    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("token");
}


function securityHeaders() {

    const token =
        getSecurityToken();

    return token
        ? {
            Accept: "application/json",
            Authorization:
                `Bearer ${token}`
        }
        : {
            Accept: "application/json"
        };
}


/* =========================================================
   API REQUEST
   ========================================================= */

async function securityRequest(
    url,
    options = {}
) {

    const response =
        await fetch(
            url,
            {
                ...options,

                credentials:
                    "include",

                headers: {
                    ...securityHeaders(),
                    ...(options.headers || {})
                }
            }
        );


    if (
        response.status === 401
    ) {

        clearSecurityAuthentication();

        window.location.href =
            "/login";

        return null;
    }


    let data = {};

    try {

        data =
            await response.json();

    } catch {

        data = {};
    }


    if (!response.ok) {

        throw new Error(
            data?.detail ||
            data?.message ||
            t("security_request_failed")
        );
    }


    return data;
}


/* =========================================================
   PASSWORD VALIDATION
   ========================================================= */

function validatePassword(
    password
) {

    if (password.length < 8) {

        return {
            valid: false,
            message:
                t(
                    "password_min_length_error"
                )
        };
    }


    if (!/[A-Z]/.test(password)) {

        return {
            valid: false,
            message:
                t(
                    "password_uppercase_error"
                )
        };
    }


    if (!/[a-z]/.test(password)) {

        return {
            valid: false,
            message:
                t(
                    "password_lowercase_error"
                )
        };
    }


    if (!/[0-9]/.test(password)) {

        return {
            valid: false,
            message:
                t(
                    "password_number_error"
                )
        };
    }


    if (!/[^A-Za-z0-9]/.test(password)) {

        return {
            valid: false,
            message:
                t(
                    "password_special_error"
                )
        };
    }


    return {
        valid: true,
        message: ""
    };
}


/* =========================================================
   PASSWORD REQUIREMENTS
   ========================================================= */

function updatePasswordRequirements(
    password
) {

    const requirements = {

        "requirement-length":
            password.length >= 8,

        "requirement-uppercase":
            /[A-Z]/.test(password),

        "requirement-lowercase":
            /[a-z]/.test(password),

        "requirement-number":
            /[0-9]/.test(password),

        "requirement-special":
            /[^A-Za-z0-9]/.test(password)
    };


    Object.entries(
        requirements
    ).forEach(
        ([id, valid]) => {

            const element =
                document.getElementById(
                    id
                );


            if (!element) {
                return;
            }


            element.classList.toggle(
                "valid",
                valid
            );


            element.classList.toggle(
                "invalid",
                !valid
            );


            const icon =
                element.querySelector(
                    ".requirement-icon"
                );


            if (icon) {

                icon.textContent =
                    valid
                        ? "✓"
                        : "○";
            }
        }
    );
}


/* =========================================================
   PASSWORD STRENGTH
   ========================================================= */

function updatePasswordStrength(
    password
) {

    const bar =
        document.getElementById(
            "password-strength-bar"
        );


    const label =
        document.getElementById(
            "password-strength-label"
        );


    if (!bar || !label) {
        return;
    }


    if (!password) {

        bar.style.width =
            "0%";

        label.textContent =
            t(
                "enter_new_password"
            );

        updatePasswordRequirements(
            ""
        );

        return;
    }


    let score = 0;


    if (password.length >= 8) {
        score++;
    }


    if (/[A-Z]/.test(password)) {
        score++;
    }


    if (/[a-z]/.test(password)) {
        score++;
    }


    if (/[0-9]/.test(password)) {
        score++;
    }


    if (/[^A-Za-z0-9]/.test(password)) {
        score++;
    }


    bar.style.width =
        `${score * 20}%`;


    const labels = {

        1:
            t("password_strength_very_weak"),

        2:
            t("password_strength_weak"),

        3:
            t("password_strength_fair"),

        4:
            t("password_strength_strong"),

        5:
            t("password_strength_very_strong")
    };


    label.textContent =
        labels[score] ||
        t(
            "password_strength_very_weak"
        );


    updatePasswordRequirements(
        password
    );
}


/* =========================================================
   CHANGE PASSWORD
   ========================================================= */

async function changePassword(
    event
) {

    event?.preventDefault();


    const currentInput =
        document.getElementById(
            "current-password"
        );


    const newInput =
        document.getElementById(
            "new-password"
        );


    const confirmInput =
        document.getElementById(
            "confirm-password"
        );


    const button =
        document.getElementById(
            "change-password-button"
        );


    const message =
        document.getElementById(
            "security-password-message"
        );


    if (
        !currentInput ||
        !newInput ||
        !confirmInput
    ) {
        return;
    }


    const current =
        currentInput.value.trim();


    const next =
        newInput.value;


    const confirmation =
        confirmInput.value;


    if (!current) {

        showSecurityToast(
            t(
                "enter_current_password"
            ),
            "error"
        );

        currentInput.focus();

        return;
    }


    const validation =
        validatePassword(
            next
        );


    if (!validation.valid) {

        showSecurityToast(
            validation.message,
            "error"
        );

        newInput.focus();

        return;
    }


    if (
        next !== confirmation
    ) {

        showSecurityToast(
            t(
                "passwords_do_not_match"
            ),
            "error"
        );

        confirmInput.focus();

        return;
    }


    if (
        current === next
    ) {

        showSecurityToast(
            t(
                "password_must_be_different"
            ),
            "error"
        );

        newInput.focus();

        return;
    }


    try {

        if (button) {

            button.disabled =
                true;

            button.textContent =
                t(
                    "changing_password"
                );
        }


        const response =
            await securityRequest(
                `${SECURITY_API}/change-password`,
                {
                    method:
                        "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            current_password:
                                current,

                            new_password:
                                next
                        })
                }
            );


        if (!response) {
            return;
        }


        const successMessage =
            response.message ||
            t(
                "password_changed_successfully"
            );


        if (message) {

            message.textContent =
                successMessage;

            message.className =
                "security-password-message success";
        }


        showSecurityToast(
            successMessage,
            "success"
        );


        clearSecurityAuthentication();


        setTimeout(
            () => {

                window.location.href =
                    "/login";

            },
            1200
        );


    } catch (error) {

        console.error(
            "Password change failed:",
            error
        );


        const errorMessage =
            error.message ||
            t(
                "unable_to_change_password"
            );


        if (message) {

            message.textContent =
                errorMessage;

            message.className =
                "security-password-message error";
        }


        showSecurityToast(
            errorMessage,
            "error"
        );


    } finally {

        if (button) {

            button.disabled =
                false;

            button.textContent =
                t(
                    "change_password"
                );
        }
    }
}


/* =========================================================
   PASSWORD TOGGLES
   ========================================================= */

function initializePasswordToggles() {

    document
        .querySelectorAll(
            ".security-password-toggle"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const target =
                            button.dataset.target;


                        const input =
                            document.getElementById(
                                target
                            );


                        if (!input) {
                            return;
                        }


                        const isPassword =
                            input.type ===
                            "password";


                        input.type =
                            isPassword
                                ? "text"
                                : "password";


                        const label =
                            isPassword
                                ? t(
                                    "hide_password"
                                )
                                : t(
                                    "show_password"
                                );


                        button.setAttribute(
                            "aria-label",
                            label
                        );


                        button.setAttribute(
                            "title",
                            label
                        );
                    }
                );
            }
        );
}


/* =========================================================
   UPDATE PASSWORD TOGGLE LABELS
   ========================================================= */

function refreshPasswordToggleLabels() {

    document
        .querySelectorAll(
            ".security-password-toggle"
        )
        .forEach(
            button => {

                const target =
                    button.dataset.target;


                const input =
                    document.getElementById(
                        target
                    );


                if (!input) {
                    return;
                }


                const label =
                    input.type ===
                    "password"
                        ? t(
                            "show_password"
                        )
                        : t(
                            "hide_password"
                        );


                button.setAttribute(
                    "aria-label",
                    label
                );


                button.setAttribute(
                    "title",
                    label
                );
            }
        );
}


/* =========================================================
   SESSIONS
   ========================================================= */

async function loadSessions() {

    const container =
        document.getElementById(
            "sessions-list"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `

        <div
            class="sessions-loading"
        >

            <span>
                ${escapeHtml(
                    t(
                        "loading_active_sessions"
                    )
                )}
            </span>

        </div>
    `;


    try {

        const response =
            await securityRequest(
                `${SECURITY_API}/sessions`
            );


        if (!response) {
            return;
        }


        const sessions =
            Array.isArray(
                response.sessions
            )
                ? response.sessions
                : [];


        renderSessions(
            sessions
        );


    } catch (error) {

        console.error(
            "Failed to load sessions:",
            error
        );


        container.innerHTML = `

            <div
                class="sessions-error"
            >

                ${escapeHtml(
                    error.message ||
                    t(
                        "unable_to_load_sessions"
                    )
                )}

            </div>
        `;


        showSecurityToast(
            error.message ||
            t(
                "unable_to_load_sessions"
            ),
            "error"
        );
    }
}


/* =========================================================
   RENDER SESSIONS
   ========================================================= */

function renderSessions(
    sessions
) {

    const container =
        document.getElementById(
            "sessions-list"
        );


    if (!container) {
        return;
    }


    if (!sessions.length) {

        container.innerHTML = `

            <div
                class="sessions-empty"
            >

                ${escapeHtml(
                    t(
                        "no_active_sessions"
                    )
                )}

            </div>
        `;

        return;
    }


    container.innerHTML =
        sessions
            .map(
                renderSession
            )
            .join("");


    bindRevokeButtons();
}


/* =========================================================
   SESSION ROW
   ========================================================= */

function renderSession(
    session
) {

    const current =
        session.current === true;


    const sessionId =
        session.session_id ||
        session.id ||
        "";


    const device =
        session.device_name ||
        detectDevice(
            session.user_agent
        );


    const browser =
        getBrowserName(
            session.user_agent
        );


    const os =
        getOperatingSystem(
            session.user_agent
        );


    const ip =
        session.ip_address ||
        t(
            "unknown_ip"
        );


    const lastActive =
        formatSessionDate(
            session.last_active_at
        );


    return `

        <div
            class="security-session-row"
            data-session-id="${escapeHtml(
                sessionId
            )}"
        >

            <div
                class="security-session-device"
            >

                <div
                    class="security-session-icon"
                >
                    ${getDeviceIcon(
                        session.user_agent
                    )}
                </div>


                <div>

                    <strong>
                        ${escapeHtml(
                            device
                        )}
                    </strong>

                    <span>

                        ${escapeHtml(
                            browser
                        )}

                        ·

                        ${escapeHtml(
                            os
                        )}

                    </span>

                </div>

            </div>


            <div
                class="security-session-meta"
            >

                <span>
                    ${escapeHtml(
                        ip
                    )}
                </span>


                <span>
                    ${escapeHtml(
                        lastActive
                    )}
                </span>

            </div>


            <div
                class="security-session-action"
            >

                ${
                    current
                        ? `

                            <span
                                class="session-current"
                            >
                                ${escapeHtml(
                                    t(
                                        "current"
                                    )
                                )}
                            </span>

                          `
                        : `

                            <button
                                type="button"
                                class="session-revoke"
                                data-session-id="${escapeHtml(
                                    sessionId
                                )}"
                            >
                                ${escapeHtml(
                                    t(
                                        "revoke"
                                    )
                                )}
                            </button>

                          `
                }

            </div>

        </div>
    `;
}


/* =========================================================
   REVOKE BUTTONS
   ========================================================= */

function bindRevokeButtons() {

    document
        .querySelectorAll(
            ".session-revoke"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    async () => {

                        const sessionId =
                            button.dataset
                                .sessionId;


                        if (!sessionId) {

                            showSecurityToast(
                                t(
                                    "invalid_session"
                                ),
                                "error"
                            );

                            return;
                        }


                        button.disabled =
                            true;


                        button.textContent =
                            t(
                                "revoking"
                            );


                        try {

                            const response =
                                await securityRequest(
                                    `${SECURITY_API}/sessions/${encodeURIComponent(
                                        sessionId
                                    )}`,
                                    {
                                        method:
                                            "DELETE"
                                    }
                                );


                            if (!response) {
                                return;
                            }


                            showSecurityToast(
                                response.message ||
                                t(
                                    "session_revoked_successfully"
                                ),
                                "success"
                            );


                            await loadSessions();


                        } catch (error) {

                            console.error(
                                "Session revoke failed:",
                                error
                            );


                            showSecurityToast(
                                error.message ||
                                t(
                                    "unable_to_revoke_session"
                                ),
                                "error"
                            );


                            button.disabled =
                                false;


                            button.textContent =
                                t(
                                    "revoke"
                                );
                        }
                    }
                );
            }
        );
}


/* =========================================================
   LOGOUT OTHER SESSIONS
   ========================================================= */

async function logoutOtherSessions() {

    const button =
        document.getElementById(
            "logout-other-sessions"
        );


    if (!button) {
        return;
    }


    const originalText =
        button.textContent;


    try {

        button.disabled =
            true;


        button.textContent =
            t(
                "signing_out"
            );


        const response =
            await securityRequest(
                `${SECURITY_API}/sessions/logout-others`,
                {
                    method:
                        "POST"
                }
            );


        if (!response) {
            return;
        }


        showSecurityToast(
            response.message ||
            t(
                "other_sessions_signed_out"
            ),
            "success"
        );


        await loadSessions();


    } catch (error) {

        console.error(
            "Logout other sessions failed:",
            error
        );


        showSecurityToast(
            error.message ||
            t(
                "unable_to_sign_out_other_sessions"
            ),
            "error"
        );


    } finally {

        button.disabled =
            false;


        button.textContent =
            originalText ||
            t(
                "sign_out_other_sessions"
            );
    }
}


/* =========================================================
   DEVICE / BROWSER
   ========================================================= */

function detectDevice(
    userAgent
) {

    if (!userAgent) {
        return t(
            "unknown_device"
        );
    }


    if (
        /iPad|Tablet/i.test(
            userAgent
        )
    ) {

        return t(
            "tablet"
        );
    }


    if (
        /Mobile|Android|iPhone|iPod/i.test(
            userAgent
        )
    ) {

        return t(
            "mobile_device"
        );
    }


    return t(
        "desktop"
    );
}


function getBrowserName(
    userAgent
) {

    if (!userAgent) {
        return t(
            "unknown_browser"
        );
    }


    if (/edg/i.test(userAgent)) {
        return "Microsoft Edge";
    }


    if (
        /opr|opera/i.test(
            userAgent
        )
    ) {

        return "Opera";
    }


    if (/firefox/i.test(userAgent)) {
        return "Firefox";
    }


    if (/chrome/i.test(userAgent)) {
        return "Google Chrome";
    }


    if (/safari/i.test(userAgent)) {
        return "Safari";
    }


    return t(
        "unknown_browser"
    );
}


function getOperatingSystem(
    userAgent
) {

    if (!userAgent) {
        return t(
            "unknown_os"
        );
    }


    if (/Windows/i.test(userAgent)) {
        return "Windows";
    }


    if (
        /Mac OS X|Macintosh/i.test(
            userAgent
        )
    ) {

        return "macOS";
    }


    if (/Android/i.test(userAgent)) {
        return "Android";
    }


    if (
        /iPhone|iPad|iPod/i.test(
            userAgent
        )
    ) {

        return "iOS";
    }


    if (/Linux/i.test(userAgent)) {
        return "Linux";
    }


    return t(
        "unknown_os"
    );
}


function getDeviceIcon(
    userAgent
) {

    if (
        /Mobile|Android|iPhone|iPod/i.test(
            userAgent || ""
        )
    ) {

        return "▯";
    }


    return "▣";
}


function formatSessionDate(
    value
) {

    if (!value) {
        return t(
            "unknown"
        );
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

        return t(
            "unknown"
        );
    }


    return date.toLocaleString(
        getCurrentLanguage() === "ar"
            ? "ar"
            : "en-US",
        {
            dateStyle:
                "medium",

            timeStyle:
                "short"
        }
    );
}


/* =========================================================
   TOAST
   ========================================================= */

function showSecurityToast(
    message,
    type = "success"
) {

    const container =
        document.getElementById(
            "security-toast-container"
        );


    if (!container) {
        return;
    }


    const toast =
        document.createElement(
            "div"
        );


    toast.className =
        `security-toast ${type}`;


    toast.innerHTML = `

        <span
            class="security-toast-icon"
        >
            ${
                type === "error"
                    ? "!"
                    : "✓"
            }
        </span>

        <span>
            ${escapeHtml(
                message
            )}
        </span>
    `;


    container.appendChild(
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
        3500
    );
}


/* =========================================================
   HTML ESCAPE
   ========================================================= */

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
         * Refresh password UI.
         */

        refreshPasswordToggleLabels();


        updatePasswordStrength(
            document.getElementById(
                "new-password"
            )?.value ||
            ""
        );


        /*
         * Reload session labels dynamically.
         */

        await loadSessions();
    }
);


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        document
            .getElementById(
                "changePasswordForm"
            )
            ?.addEventListener(
                "submit",
                changePassword
            );


        document
            .getElementById(
                "new-password"
            )
            ?.addEventListener(
                "input",
                event => {

                    updatePasswordStrength(
                        event.target.value
                    );
                }
            );


        initializePasswordToggles();


        document
            .getElementById(
                "refresh-sessions"
            )
            ?.addEventListener(
                "click",
                loadSessions
            );


        document
            .getElementById(
                "logout-other-sessions"
            )
            ?.addEventListener(
                "click",
                logoutOtherSessions
            );


        updatePasswordStrength(
            ""
        );


        loadSessions();
    }
);