"use strict";


/* =========================================================
   SmartReceiptAI
   Reset Password
========================================================= */

const API_BASE = "/api/v1";


/* =========================================================
   DOM
========================================================= */

const resetForm =
    document.getElementById(
        "reset-password-form"
    );

const newPasswordInput =
    document.getElementById(
        "new-password"
    );

const confirmPasswordInput =
    document.getElementById(
        "confirm-password"
    );

const resetButton =
    document.getElementById(
        "reset-button"
    );

const formMessage =
    document.getElementById(
        "form-message"
    );

const passwordMatch =
    document.getElementById(
        "password-match"
    );

const strengthContainer =
    document.querySelector(
        ".password-strength"
    );

const strengthText =
    document.getElementById(
        "strength-text"
    );

const resetFormState =
    document.getElementById(
        "reset-form-state"
    );

const successState =
    document.getElementById(
        "success-state"
    );

const invalidState =
    document.getElementById(
        "invalid-state"
    );


/* =========================================================
   TOKEN
========================================================= */

const queryParams =
    new URLSearchParams(
        window.location.search
    );


const resetToken =
    queryParams.get("token");


/* =========================================================
   TOKEN VALIDATION
========================================================= */

function hasResetToken() {

    return (
        typeof resetToken === "string" &&
        resetToken.length >= 32
    );
}


/* =========================================================
   UI STATES
========================================================= */

function showInvalidState() {

    if (resetFormState) {
        resetFormState.hidden = true;
    }

    if (successState) {
        successState.hidden = true;
    }

    if (invalidState) {
        invalidState.hidden = false;
    }
}


function showSuccessState() {

    if (resetFormState) {
        resetFormState.hidden = true;
    }

    if (invalidState) {
        invalidState.hidden = true;
    }

    if (successState) {
        successState.hidden = false;
    }
}


function showFormState() {

    if (resetFormState) {
        resetFormState.hidden = false;
    }

    if (successState) {
        successState.hidden = true;
    }

    if (invalidState) {
        invalidState.hidden = true;
    }
}


function setLoading(
    loading
) {

    if (!resetButton) {
        return;
    }

    resetButton.disabled =
        loading;

    resetButton.classList.toggle(
        "loading",
        loading
    );
}


function showError(
    text
) {

    if (!formMessage) {
        return;
    }

    formMessage.textContent =
        text || "";
}


/* =========================================================
   PASSWORD STRENGTH
========================================================= */

function getPasswordStrength(
    password
) {

    let score = 0;


    if (password.length >= 8) {
        score++;
    }

    if (password.length >= 12) {
        score++;
    }

    if (/[a-z]/.test(password)) {
        score++;
    }

    if (/[A-Z]/.test(password)) {
        score++;
    }

    if (/[0-9]/.test(password)) {
        score++;
    }

    if (/[^A-Za-z0-9]/.test(password)) {
        score++;
    }


    if (password.length === 0) {

        return {
            level: "",
            text: "Enter a password"
        };
    }


    if (score <= 2) {

        return {
            level: "weak",
            text: "Weak password"
        };
    }


    if (score <= 3) {

        return {
            level: "fair",
            text: "Fair password"
        };
    }


    if (score <= 4) {

        return {
            level: "good",
            text: "Good password"
        };
    }


    return {
        level: "strong",
        text: "Strong password"
    };
}


function updatePasswordStrength() {

    if (
        !strengthContainer ||
        !strengthText ||
        !newPasswordInput
    ) {
        return;
    }


    const result =
        getPasswordStrength(
            newPasswordInput.value
        );


    strengthContainer.classList.remove(
        "weak",
        "fair",
        "good",
        "strong"
    );


    if (result.level) {

        strengthContainer.classList.add(
            result.level
        );
    }


    strengthText.textContent =
        result.text;
}


/* =========================================================
   PASSWORD MATCH
========================================================= */

function updatePasswordMatch() {

    if (
        !passwordMatch ||
        !newPasswordInput ||
        !confirmPasswordInput
    ) {
        return;
    }


    const password =
        newPasswordInput.value;

    const confirmation =
        confirmPasswordInput.value;


    passwordMatch.classList.remove(
        "match",
        "mismatch"
    );


    if (!confirmation) {

        passwordMatch.textContent =
            "";

        return;
    }


    if (password === confirmation) {

        passwordMatch.textContent =
            "Passwords match.";

        passwordMatch.classList.add(
            "match"
        );

        return;
    }


    passwordMatch.textContent =
        "Passwords do not match.";

    passwordMatch.classList.add(
        "mismatch"
    );
}


/* =========================================================
   PASSWORD TOGGLE
========================================================= */

function initializePasswordToggles() {

    const toggles =
        document.querySelectorAll(
            ".password-toggle"
        );


    toggles.forEach(
        toggle => {

            toggle.addEventListener(
                "click",
                () => {

                    const targetId =
                        toggle.dataset.target;

                    const input =
                        document.getElementById(
                            targetId
                        );


                    if (!input) {
                        return;
                    }


                    input.type =
                        input.type === "password"
                            ? "text"
                            : "password";

                    toggle.setAttribute(
                        "aria-label",
                        input.type === "password"
                            ? "Show password"
                            : "Hide password"
                    );
                }
            );
        }
    );
}


/* =========================================================
   RESET API
========================================================= */

async function resetPassword(
    token,
    newPassword
) {

    const response =
        await fetch(
            `${API_BASE}/auth/reset-password`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    token: token,
                    new_password: newPassword
                })
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

        throw new Error(
            data?.detail ||
            "Unable to reset your password."
        );
    }


    return data;
}


/* =========================================================
   SUBMIT
========================================================= */

async function handleSubmit(
    event
) {

    event.preventDefault();


    showError("");


    const password =
        newPasswordInput?.value || "";

    const confirmation =
        confirmPasswordInput?.value || "";


    /* -----------------------------------------------------
       Token
       ----------------------------------------------------- */

    if (!hasResetToken()) {

        showInvalidState();

        return;
    }


    /* -----------------------------------------------------
       Password length
       ----------------------------------------------------- */

    if (password.length < 8) {

        showError(
            "Password must be at least 8 characters."
        );

        return;
    }


    /* -----------------------------------------------------
       Password match
       ----------------------------------------------------- */

    if (password !== confirmation) {

        showError(
            "Passwords do not match."
        );

        return;
    }


    setLoading(true);


    try {

        await resetPassword(
            resetToken,
            password
        );


        showSuccessState();


    } catch (error) {

        console.error(
            "Password reset failed:",
            error
        );


        const text =
            error.message ||
            "Unable to reset your password.";


        if (
            text.toLowerCase().includes(
                "invalid"
            ) ||
            text.toLowerCase().includes(
                "expired"
            )
        ) {

            showInvalidState();

            return;
        }


        showError(text);

    } finally {

        setLoading(false);
    }
}


/* =========================================================
   EVENTS
========================================================= */

newPasswordInput?.addEventListener(
    "input",
    updatePasswordStrength
);


confirmPasswordInput?.addEventListener(
    "input",
    updatePasswordMatch
);


resetForm?.addEventListener(
    "submit",
    handleSubmit
);


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializePasswordToggles();


        if (!hasResetToken()) {

            showInvalidState();

            return;
        }


        showFormState();

    }
);