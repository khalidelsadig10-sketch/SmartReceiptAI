function togglePassword() {

    const password =
        document.getElementById("password");

    const toggle =
        document.querySelector(".password-toggle");


    if (!password) {
        return;
    }


    if (password.type === "password") {

        password.type = "text";

        if (toggle) {
            toggle.textContent = "🙈";
        }

    } else {

        password.type = "password";

        if (toggle) {
            toggle.textContent = "👁";
        }

    }

}


document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* =====================================================
           ELEMENTS
        ===================================================== */

        const loginForm =
            document.querySelector(".login-form");

        const email =
            document.getElementById("email");

        const password =
            document.getElementById("password");

        const loginButton =
            document.getElementById("login-button");


        /* =====================================================
           LOGIN API
        ===================================================== */

        async function loginUser() {

            const payload = {

                email:
                    email.value.trim(),

                password:
                    password.value

            };


            console.log(
                "Sending login request:",
                {
                    email: payload.email
                }
            );


            const response =
                await fetch(
                    "/api/v1/auth/login",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        credentials:
                            "include",

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

            } catch (error) {

                data = null;

            }


            if (!response.ok) {

                let message =
                    "Login failed.";


                if (data) {

                    if (
                        typeof data.detail ===
                        "string"
                    ) {

                        message =
                            data.detail;

                    }

                    else if (
                        Array.isArray(
                            data.detail
                        )
                    ) {

                        message =
                            data.detail
                                .map(
                                    function (item) {

                                        return (
                                            item.msg ||
                                            "Invalid value."
                                        );

                                    }
                                )
                                .join(", ");

                    }

                    else if (
                        data.message
                    ) {

                        message =
                            data.message;

                    }

                }


                const error =
                    new Error(message);


                error.status =
                    response.status;


                throw error;

            }


            return data;

        }


        /* =====================================================
           LOGIN SUBMIT
        ===================================================== */

        if (
            loginForm &&
            loginButton
        ) {

            loginForm.addEventListener(
                "submit",
                async function (event) {

                    event.preventDefault();


                    /* Browser validation */

                    if (
                        !loginForm.checkValidity()
                    ) {

                        loginForm.reportValidity();

                        return;

                    }


                    /* Loading */

                    loginButton.classList.add(
                        "loading"
                    );

                    loginButton.disabled =
                        true;


                    try {

                        /* =====================================
                           API REQUEST
                        ===================================== */

                        const result =
                            await loginUser();


                        console.log(
                            "LOGIN SUCCESS:",
                            result
                        );
                        const token =
                            result?.access_token ||
                            result?.token;

                        if (token) {
                            localStorage.setItem(
                                "access_token",
                                token
                            );
                        }


                        /* =====================================
                           SUCCESS
                        ===================================== */

                        window.location.href =
                            "/dashboard";


                    }

                    catch (error) {

                        console.error(
                            "LOGIN ERROR:",
                            error
                        );


                        /* =====================================
                           ERROR HANDLING
                        ===================================== */

                        if (
                            error.status ===
                            401
                        ) {

                            alert(
                                "Invalid email or password."
                            );

                        }

                        else if (
                            error.status ===
                            403
                        ) {

                            alert(
                                "Your account is inactive."
                            );

                        }

                        else if (
                            error.status ===
                            422
                        ) {

                            alert(
                                "Please enter a valid email and password."
                            );

                        }

                        else {

                            alert(
                                error.message ||
                                "Unable to login. Please try again."
                            );

                        }

                    }

                    finally {

                        loginButton.classList.remove(
                            "loading"
                        );

                        loginButton.disabled =
                            false;

                    }

                }
            );

        }

    }
);