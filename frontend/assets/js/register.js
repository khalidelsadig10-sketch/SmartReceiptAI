function togglePassword(inputId, icon) {

    const input = document.getElementById(inputId);

    if (!input) {
        return;
    }

    if (input.type === "password") {

        input.type = "text";
        icon.textContent = "🙈";

    } else {

        input.type = "password";
        icon.textContent = "👁";

    }
}


document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const registerForm =
        document.querySelector(".register-form");

    const registerButton =
        document.getElementById("register-button");

    const password =
        document.getElementById("password");

    const confirmPassword =
        document.getElementById("confirm-password");

    const email =
        document.getElementById("email");

    const strengthBars =
        document.querySelectorAll(".strength-bar span");

    const strengthText =
        document.querySelector(".strength-text");

    const passwordMatch =
        document.querySelector(".password-match");

    const fullName =
        document.getElementById("full-name");
    /* =====================================================
       PASSWORD STRENGTH
    ===================================================== */

    function updatePasswordStrength() {

        if (!password || !strengthText) {
            return;
        }

        const value = password.value;

        let strength = 0;


        strengthBars.forEach(function (bar) {

            bar.style.background = "#e2e8f0";

        });


        if (value.length === 0) {

            strengthText.textContent =
                "Enter a password";

            strengthText.style.color =
                "#94a3b8";

            return;
        }


        if (value.length >= 8) {
            strength++;
        }

        if (/[A-Z]/.test(value)) {
            strength++;
        }

        if (/[0-9]/.test(value)) {
            strength++;
        }

        if (/[^A-Za-z0-9]/.test(value)) {
            strength++;
        }


        if (strength === 1) {

            strengthBars[0].style.background =
                "#ef4444";

            strengthText.textContent =
                "Weak password";

            strengthText.style.color =
                "#ef4444";

        }

        else if (strength === 2) {

            strengthBars[0].style.background =
                "#f59e0b";

            strengthBars[1].style.background =
                "#f59e0b";

            strengthText.textContent =
                "Fair password";

            strengthText.style.color =
                "#f59e0b";

        }

        else if (strength === 3) {

            strengthBars[0].style.background =
                "#3b82f6";

            strengthBars[1].style.background =
                "#3b82f6";

            strengthBars[2].style.background =
                "#3b82f6";

            strengthText.textContent =
                "Good password";

            strengthText.style.color =
                "#3b82f6";

        }

        else {

            strengthBars.forEach(function (bar) {

                bar.style.background =
                    "#22c55e";

            });

            strengthText.textContent =
                "Strong password";

            strengthText.style.color =
                "#22c55e";
        }

    }


    /* =====================================================
       PASSWORD MATCH
    ===================================================== */

    function checkPasswords() {

        if (
            !password ||
            !confirmPassword ||
            !passwordMatch
        ) {
            return false;
        }


        const pass =
            password.value;

        const confirm =
            confirmPassword.value;


        if (confirm.length === 0) {

            confirmPassword.style.borderColor =
                "#dbeafe";

            passwordMatch.textContent =
                "";

            return false;
        }


        if (pass === confirm) {

            confirmPassword.style.borderColor =
                "#22c55e";

            passwordMatch.textContent =
                "✓ Passwords match";

            passwordMatch.style.color =
                "#22c55e";

            return true;
        }


        confirmPassword.style.borderColor =
            "#ef4444";

        passwordMatch.textContent =
            "✕ Passwords do not match";

        passwordMatch.style.color =
            "#ef4444";

        return false;

    }


    /* =====================================================
       PASSWORD EVENTS
    ===================================================== */

    if (password) {

        password.addEventListener(
            "input",
            function () {

                updatePasswordStrength();

                checkPasswords();

            }
        );

    }


    if (confirmPassword) {

        confirmPassword.addEventListener(
            "input",
            checkPasswords
        );

    }


    /* =====================================================
       REGISTER API
    ===================================================== */

    async function registerUser() {

        if (
            !fullName ||
            !email ||
            !password
        ) {
            throw new Error(
                "Required registration fields are missing."
            );
        }


        const payload = {
            full_name:
                fullName.value.trim(),

            email:
                email.value.trim(),

            password:
                password.value
        };


        console.log(
            "Sending registration request:",
            {
                full_name: payload.full_name,
                email: payload.email
            }
        );


        const response = await fetch(
            "/api/v1/auth/register",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                credentials: "include",

                body:
                    JSON.stringify(
                        payload
                    )
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

            let message =
                "Registration failed.";

            if (data) {

                if (
                    typeof data.detail ===
                    "string"
                ) {

                    message =
                        data.detail;

                } else if (
                    Array.isArray(
                        data.detail
                    )
                ) {

                    message =
                        data.detail
                            .map(
                                item =>
                                    item.msg ||
                                    "Invalid value."
                            )
                            .join(", ");

                } else if (
                    data.message
                ) {

                    message =
                        data.message;
                }
            }


            const error =
                new Error(
                    message
                );

            error.status =
                response.status;

            throw error;
        }


        return data;
    }

    /* =====================================================
       REGISTER SUBMIT
    ===================================================== */

    if (registerForm && registerButton) {

        registerForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                /* Browser validation */

                if (!registerForm.checkValidity()) {

                    registerForm.reportValidity();

                    return;
                }


                /* Password values */

                const passwordValue =
                    password ?
                    password.value :
                    "";

                const confirmValue =
                    confirmPassword ?
                    confirmPassword.value :
                    "";


                /* Password match */

                if (
                    passwordValue !==
                    confirmValue
                ) {

                    checkPasswords();

                    if (confirmPassword) {
                        confirmPassword.focus();
                    }

                    return;
                }


                /* Password length */

                if (
                    passwordValue.length < 8
                ) {

                    if (password) {
                        password.focus();
                    }

                    if (strengthText) {

                        strengthText.textContent =
                            "Password must be at least 8 characters";

                        strengthText.style.color =
                            "#ef4444";

                    }

                    return;
                }


                /* Loading */

                registerButton.classList.add(
                    "loading"
                );

                registerButton.disabled = true;


                try {

                    /* =====================================
                       SEND TO FASTAPI
                    ===================================== */

                    const result =
                        await registerUser();


                    console.log(
                        "REGISTER SUCCESS:",
                        result
                    );


                    /* =====================================
                       SUCCESS
                    ===================================== */

                    alert(
                        result.message ||
                        "Account created successfully."
                    );


                    /*
                     * For now we stay on the register page.
                     *
                     * After we verify the complete auth flow,
                     * we will connect this to the Login/Dashboard
                     * navigation.
                     */


                }

                catch (error) {

                    console.error(
                        "REGISTER ERROR:",
                        error
                    );


                    /* =====================================
                       ERROR HANDLING
                    ===================================== */

                    if (error.status === 409) {

                        alert(
                            "An account with this email already exists."
                        );

                    }

                    else if (error.status === 422) {

                        alert(
                            error.message ||
                            "Registration data is invalid."
                        );

                    }

                    else {

                        alert(
                            error.message ||
                            "Unable to create your account. Please try again."
                        );

                    }

                }

                finally {

                    registerButton.classList.remove(
                        "loading"
                    );

                    registerButton.disabled = false;

                }

            }
        );

    }


    /* =====================================================
       INITIAL STATE
    ===================================================== */

    updatePasswordStrength();

});