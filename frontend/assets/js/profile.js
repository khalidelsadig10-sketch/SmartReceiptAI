"use strict";

/* =========================================================
   SmartReceiptAI
   Profile Page
   Profile-only logic
   ========================================================= */

const API_BASE = "/api/v1";
const AUTH_API = `${API_BASE}/auth`;


/* =========================================================
   PROFILE IMAGE
========================================================== */

const MAX_PROFILE_IMAGE_SIZE =
    50 * 1024 * 1024;

const ALLOWED_PROFILE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp"
];


/* =========================================================
   DOM
========================================================== */

function $(id) {
    return document.getElementById(id);
}


/* =========================================================
   AUTH
========================================================== */

function getAccessToken() {

    return (
        localStorage.getItem("access_token") ||
        localStorage.getItem("accessToken") ||
        localStorage.getItem("token") ||
        null
    );
}


function clearAuthentication() {

    localStorage.removeItem("access_token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("token");
}


function authHeaders() {

    const token =
        getAccessToken();

    return token
        ? {
            Authorization: `Bearer ${token}`
        }
        : {};
}


/* =========================================================
   API
========================================================== */

async function apiRequest(
    url,
    options = {}
) {

    const response =
        await fetch(
            url,
            {
                ...options,

                credentials: "include",

                headers: {
                    ...authHeaders(),
                    ...(options.headers || {})
                }
            }
        );


    if (response.status === 401) {

        clearAuthentication();

        window.location.href =
            "/login";

        return null;
    }


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
            data?.message ||
            "Request failed."
        );
    }


    return data;
}


/* =========================================================
   TOAST
========================================================== */

function showProfileToast(
    message,
    type = "success"
) {

    let container =
        $("profile-toast-container");


    if (!container) {

        container =
            document.createElement(
                "div"
            );

        container.id =
            "profile-toast-container";

        container.className =
            "profile-toast-container";

        document.body.appendChild(
            container
        );
    }


    const toast =
        document.createElement(
            "div"
        );

    toast.className =
        `profile-toast ${type}`;

    toast.textContent =
        message;


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
        3000
    );
}


/* =========================================================
   LOAD PROFILE
========================================================== */

async function loadProfile() {

    try {

        const user =
            await apiRequest(
                `${AUTH_API}/me`
            );


        if (!user) {
            return;
        }


        const fullName =
            user.full_name ||
            user.email ||
            "Account";


        const fullNameInput =
            $("profile-full-name");


        if (fullNameInput) {

            fullNameInput.value =
                user.full_name || "";
        }


        const emailInput =
            $("profile-email");


        if (emailInput) {

            emailInput.value =
                user.email || "";
        }


        const status =
            $("profile-status");


        if (status) {

            status.textContent =
                user.is_active === false
                    ? "Inactive"
                    : "Active";
        }


        updateProfileAvatar(
            user.profile_image,
            fullName
        );


        updateTopbarUser(
            user.profile_image,
            fullName
        );


    } catch (error) {

        console.error(
            "Failed to load profile:",
            error
        );


        showProfileToast(
            error.message ||
            "Failed to load profile.",
            "error"
        );
    }
}


/* =========================================================
   PROFILE AVATAR
========================================================== */

function updateProfileAvatar(
    imagePath,
    fullName
) {

    const image =
        $("profile-image");

    const initial =
        $("profile-initial");

    const removeButton =
        $("remove-profile-image");


    if (!image || !initial) {
        return;
    }


    const letter =
        String(fullName || "")
            .trim()
            .charAt(0)
            .toUpperCase() ||
        "U";


    initial.textContent =
        letter;


    if (imagePath) {

        image.src =
            normalizeImageUrl(
                imagePath
            );

        image.hidden =
            false;

        initial.hidden =
            true;


        if (removeButton) {
            removeButton.hidden =
                false;
        }

    } else {

        image.hidden =
            true;

        image.removeAttribute(
            "src"
        );

        initial.hidden =
            false;


        if (removeButton) {
            removeButton.hidden =
                true;
        }
    }
}


/* =========================================================
   TOPBAR USER
========================================================== */

function updateTopbarUser(
    imagePath,
    fullName
) {

    const avatar =
        $("topbar-avatar");

    const name =
        $("topbar-name");


    if (name) {
        name.textContent =
            fullName;
    }


    if (!avatar) {
        return;
    }


    avatar.innerHTML =
        "";


    const letter =
        String(fullName || "")
            .trim()
            .charAt(0)
            .toUpperCase() ||
        "U";


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
            "Profile image";

        avatar.appendChild(
            image
        );

    } else {

        const span =
            document.createElement(
                "span"
            );

        span.textContent =
            letter;

        avatar.appendChild(
            span
        );
    }
}


/* =========================================================
   IMAGE URL
========================================================== */

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
   PROFILE IMAGE VALIDATION
========================================================== */

function validateProfileImage(
    file
) {

    if (!file) {

        return {
            valid: false,
            message:
                "Please select an image."
        };
    }


    if (
        !ALLOWED_PROFILE_TYPES.includes(
            file.type
        )
    ) {

        return {
            valid: false,
            message:
                "Use JPG, PNG or WEBP."
        };
    }


    if (
        file.size >
        MAX_PROFILE_IMAGE_SIZE
    ) {

        return {
            valid: false,
            message:
                "Image must be 50 MB or smaller."
        };
    }


    return {
        valid: true,
        message: ""
    };
}


/* =========================================================
   PROFILE IMAGE PREVIEW
========================================================== */

function previewProfileImage(
    file
) {

    const image =
        $("profile-image");

    const initial =
        $("profile-initial");


    if (!image || !initial) {
        return;
    }


    const url =
        URL.createObjectURL(
            file
        );


    image.src =
        url;

    image.hidden =
        false;

    initial.hidden =
        true;


    const removeButton =
        $("remove-profile-image");


    if (removeButton) {
        removeButton.hidden =
            false;
    }


    image.onload =
        () => {
            URL.revokeObjectURL(
                url
            );
        };
}


/* =========================================================
   UPLOAD PROFILE IMAGE
========================================================== */

async function uploadProfileImage(
    file
) {

    const formData =
        new FormData();


    formData.append(
        "file",
        file
    );


    return apiRequest(
        `${AUTH_API}/profile-image`,
        {
            method: "POST",
            body: formData
        }
    );
}


/* =========================================================
   INITIALIZE IMAGE
========================================================== */

function initializeProfileImage() {

    const input =
        $("profile-image-input");

    const removeButton =
        $("remove-profile-image");


    if (!input) {
        return;
    }


    input.addEventListener(
        "change",
        async () => {

            const file =
                input.files?.[0];


            if (!file) {
                return;
            }


            const validation =
                validateProfileImage(
                    file
                );


            if (!validation.valid) {

                showProfileToast(
                    validation.message,
                    "error"
                );

                input.value =
                    "";

                return;
            }


            previewProfileImage(
                file
            );


            try {

                const status =
                    $("profile-image-status");


                if (status) {
                    status.textContent =
                        "Uploading image...";
                }


                const response =
                    await uploadProfileImage(
                        file
                    );


                if (!response) {
                    return;
                }


                const name =
                    response.full_name ||
                    response.email ||
                    "Account";


                updateProfileAvatar(
                    response.profile_image,
                    name
                );


                updateTopbarUser(
                    response.profile_image,
                    name
                );


                if (status) {
                    status.textContent =
                        "Profile image saved.";
                }


                showProfileToast(
                    "Profile image updated successfully.",
                    "success"
                );


            } catch (error) {

                console.error(
                    "Profile image upload failed:",
                    error
                );


                showProfileToast(
                    error.message ||
                    "Failed to upload profile image.",
                    "error"
                );


                await loadProfile();

            } finally {

                input.value =
                    "";
            }
        }
    );


    removeButton?.addEventListener(
        "click",
        removeProfileImage
    );
}


/* =========================================================
   REMOVE IMAGE
========================================================== */

async function removeProfileImage() {

    const button =
        $("remove-profile-image");


    try {

        if (button) {

            button.disabled =
                true;

            button.textContent =
                "Removing...";
        }


        const response =
            await apiRequest(
                `${AUTH_API}/profile-image`,
                {
                    method: "DELETE"
                }
            );


        if (!response) {
            return;
        }


        const name =
            response.full_name ||
            response.email ||
            "Account";


        updateProfileAvatar(
            null,
            name
        );


        updateTopbarUser(
            null,
            name
        );


        const status =
            $("profile-image-status");


        if (status) {
            status.textContent =
                "No profile image.";
        }


        showProfileToast(
            "Profile image removed successfully.",
            "success"
        );


    } catch (error) {

        console.error(
            "Failed to remove profile image:",
            error
        );


        showProfileToast(
            error.message ||
            "Failed to remove profile image.",
            "error"
        );


    } finally {

        if (button) {

            button.disabled =
                false;

            button.textContent =
                "Remove Photo";
        }
    }
}


/* =========================================================
   SAVE PROFILE
========================================================== */

async function saveProfile() {

    const input =
        $("profile-full-name");

    const button =
        $("save-profile");


    if (!input) {
        return;
    }


    const fullName =
        input.value.trim();


    if (!fullName) {

        showProfileToast(
            "Please enter your full name.",
            "error"
        );

        input.focus();

        return;
    }


    try {

        if (button) {

            button.disabled =
                true;

            button.textContent =
                "Saving...";
        }


        const response =
            await apiRequest(
                `${AUTH_API}/profile`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        full_name:
                            fullName
                    })
                }
            );


        if (!response) {
            return;
        }


        const updatedName =
            response.full_name ||
            response.email ||
            "Account";


        input.value =
            response.full_name ||
            "";


        updateProfileAvatar(
            response.profile_image,
            updatedName
        );


        updateTopbarUser(
            response.profile_image,
            updatedName
        );


        showProfileToast(
            "Profile updated successfully.",
            "success"
        );


    } catch (error) {

        console.error(
            "Failed to update profile:",
            error
        );


        showProfileToast(
            error.message ||
            "Failed to update profile.",
            "error"
        );


    } finally {

        if (button) {

            button.disabled =
                false;

            button.textContent =
                "Save Changes";
        }
    }
}


/* =========================================================
   MOBILE MENU
========================================================== */

function initializeMobileMenu() {

    const button =
        $("mobile-menu-button");

    const sidebar =
        document.querySelector(
            ".sidebar"
        );


    if (!button || !sidebar) {
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
}


/* =========================================================
   LOGOUT
========================================================== */

function logout() {

    clearAuthentication();

    window.location.href =
        "/login";
}


/* =========================================================
   INITIALIZATION
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        initializeMobileMenu();


        $("logout-button")
            ?.addEventListener(
                "click",
                logout
            );


        $("save-profile")
            ?.addEventListener(
                "click",
                saveProfile
            );


        initializeProfileImage();


        await loadProfile();
    }
);