"use strict";


/* =========================================================
   SmartReceiptAI
   Forgot Password
========================================================= */

const API_BASE = "/api/v1";


/* =========================================================
   DOM
========================================================= */

const form =
    document.getElementById(
        "forgot-password-form"
    );

const emailInput =
    document.getElementById(
        "email"
    );

const button =
    document.getElementById(
        "forgot-button"
    );

const message =
    document.getElementById(
        "form-message"
    );

const successState =
    document.getElementById(
        "success-state"
    );

const sendAgainButton =
    document.getElementById(
        "send-again-button"
    );


/* =========================================================
   API
========================================================= */

async function requestPasswordReset(
    email
) {

    const response =
        await fetch(
            `${API_BASE}/auth/forgot-password`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    email: email
                })
            }
        );


    let data = null;


    try {
        data = await response.json();
    } catch {
        data = null;
    }


    if (!response.ok) {

        throw new Error(
            data?.detail ||
            "Unable to process your request."
        );
    }


    return data;
}


/* =========================================================
   UI
========================================================= */

function setLoading(
    loading
) {

    if (!button) {
        return;
    }


    button.disabled = loading;

    button.classList.toggle(
        "loading",
        loading
    );
}


function showMessage(
    text
) {

    if (!message) {
        return;
    }


    message.textContent =
        text || "";
}


function showSuccess() {

    if (form) {
        form.hidden = true;
    }


    if (successState) {
        successState.hidden = false;
    }
}


/* =========================================================
   Submit
========================================================= */

async function handleSubmit(
    event
) {

    event.preventDefault();


    showMessage("");


    const email =
        emailInput?.value
            .trim()
            .toLowerCase();


    if (!email) {

        showMessage(
            "Please enter your email address."
        );

        return;
    }


    setLoading(true);


    try {

        await requestPasswordReset(
            email
        );


        /*
         * The backend intentionally returns
         * a generic message so we do not reveal
         * whether the account exists.
         */

        showSuccess();


    } catch (error) {

        console.error(
            "Password reset request failed:",
            error
        );


        showMessage(
            error.message ||
            "Unable to process your request."
        );

    } finally {

        setLoading(false);
    }
}


/* =========================================================
   Send Again
========================================================= */

function handleSendAgain() {

    if (!emailInput) {
        return;
    }


    if (successState) {
        successState.hidden = true;
    }


    if (form) {
        form.hidden = false;
    }


    emailInput.focus();
}


/* =========================================================
   Events
========================================================= */

form?.addEventListener(
    "submit",
    handleSubmit
);


sendAgainButton?.addEventListener(
    "click",
    handleSendAgain
);