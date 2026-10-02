/* =========================================================
   SmartReceiptAI — Notifications Page
   ========================================================= */

"use strict";


/* =========================================================
   CONFIG
========================================================= */

const API_BASE = "/api/v1";

let allNotifications = [];
let activeFilter = "all";
let selectedNotification = null;


/* =========================================================
   DOM
========================================================= */

const $ = (selector) =>
    document.querySelector(selector);

const $$ = (selector) =>
    Array.from(document.querySelectorAll(selector));


/* =========================================================
   API
========================================================= */

async function apiRequest(url, options = {}) {

    const config = {
        credentials: "include",
        ...options,
        headers: {
            ...(options.body instanceof FormData
                ? {}
                : {
                    "Content-Type": "application/json",
                }),
            ...(options.headers || {}),
        },
    };

    const response = await fetch(
        url,
        config
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
            data?.message ||
            "Request failed."
        );
    }

    return data;
}


/* =========================================================
   CURRENT USER
========================================================= */

async function loadCurrentUser() {

    try {

        const data = await apiRequest(
            `${API_BASE}/auth/me`
        );

        const user = data?.user || data;

        if (!user) {
            return;
        }

        const name =
            user.full_name ||
            user.email ||
            "User";

        const email =
            user.email ||
            "Account";

        const initial =
            name.trim().charAt(0).toUpperCase() ||
            "U";

        const userEmail =
            $("#user-email");

        const menuName =
            $("#user-menu-name");

        const menuEmail =
            $("#user-menu-email");

        const userInitial =
            $("#user-initial");

        const menuInitial =
            $("#user-menu-initial");

        if (userEmail) {
            userEmail.textContent = email;
        }

        if (menuName) {
            menuName.textContent = name;
        }

        if (menuEmail) {
            menuEmail.textContent = email;
        }

        if (userInitial) {
            userInitial.textContent = initial;
        }

        if (menuInitial) {
            menuInitial.textContent = initial;
        }

    } catch (error) {

        console.warn(
            "Failed to load current user:",
            error
        );
    }
}


/* =========================================================
   LOAD NOTIFICATIONS
========================================================= */

async function loadNotifications() {

    showLoading();
    hideError();

    try {

        const data = await apiRequest(
            `${API_BASE}/notifications/`
        );

        allNotifications =
            Array.isArray(data?.notifications)
                ? data.notifications
                : [];

        updateSummary();
        updateBadges();
        renderNotifications();

    } catch (error) {

        console.error(
            "Failed to load notifications:",
            error
        );

        showError(
            error.message ||
            "Unable to load notifications."
        );

    } finally {

        hideLoading();
    }
}


/* =========================================================
   SUMMARY
========================================================= */

function updateSummary() {

    const total =
        allNotifications.length;

    const unread =
        allNotifications.filter(
            notification =>
                !notification.is_read
        ).length;

    const read =
        total - unread;

    const totalElement =
        $("#total-notifications");

    const unreadElement =
        $("#unread-notifications");

    const readElement =
        $("#read-notifications");

    if (totalElement) {
        totalElement.textContent = total;
    }

    if (unreadElement) {
        unreadElement.textContent = unread;
    }

    if (readElement) {
        readElement.textContent = read;
    }
}


/* =========================================================
   BADGES
========================================================= */

function updateBadges() {

    const unreadCount =
        allNotifications.filter(
            notification =>
                !notification.is_read
        ).length;

    const badge =
        $("#notification-sidebar-badge");

    if (!badge) {
        return;
    }

    if (unreadCount > 0) {

        badge.hidden = false;

        badge.textContent =
            unreadCount > 99
                ? "99+"
                : unreadCount;

    } else {

        badge.hidden = true;
    }
}


/* =========================================================
   FILTER
========================================================= */

function getFilteredNotifications() {

    if (activeFilter === "unread") {

        return allNotifications.filter(
            notification =>
                !notification.is_read
        );
    }

    if (activeFilter === "read") {

        return allNotifications.filter(
            notification =>
                notification.is_read
        );
    }

    return allNotifications;
}


/* =========================================================
   RENDER
========================================================= */

function renderNotifications() {

    const list =
        $("#notifications-list");

    const empty =
        $("#notifications-empty");

    if (!list) {
        return;
    }

    list.innerHTML = "";

    const notifications =
        getFilteredNotifications();

    if (!notifications.length) {

        if (empty) {
            empty.hidden = false;
        }

        return;
    }

    if (empty) {
        empty.hidden = true;
    }

    notifications.forEach(
        notification => {

            list.appendChild(
                createNotificationElement(
                    notification
                )
            );
        }
    );
}


/* =========================================================
   CREATE NOTIFICATION
========================================================= */

function createNotificationElement(
    notification
) {

    const item =
        document.createElement("article");

    item.className =
        "notification-item";

    item.dataset.id =
        notification.id;

    item.dataset.type =
        notification.type || "system";

    item.classList.toggle(
        "unread",
        !notification.is_read
    );

    item.classList.toggle(
        "read",
        notification.is_read
    );


    const icon =
        document.createElement("div");

    icon.className =
        "notification-icon";

    icon.textContent =
        getNotificationIcon(
            notification.type
        );


    const body =
        document.createElement("div");

    body.className =
        "notification-body";


    const titleRow =
        document.createElement("div");

    titleRow.className =
        "notification-title-row";


    const title =
        document.createElement("h3");

    title.className =
        "notification-title";

    title.textContent =
        notification.title ||
        "Notification";


    const time =
        document.createElement("span");

    time.className =
        "notification-time";

    time.textContent =
        formatNotificationDate(
            notification.created_at
        );


    titleRow.appendChild(title);
    titleRow.appendChild(time);


    const message =
        document.createElement("p");

    message.className =
        "notification-message";

    message.textContent =
        notification.message || "";


    const meta =
        document.createElement("div");

    meta.className =
        "notification-meta";


    const type =
        document.createElement("span");

    type.className =
        "notification-type";

    type.textContent =
        formatNotificationType(
            notification.type
        );

    meta.appendChild(type);


    if (!notification.is_read) {

        const unread =
            document.createElement("span");

        unread.className =
            "notification-unread-label";

        unread.textContent =
            "Unread";

        meta.appendChild(unread);
    }


    body.appendChild(titleRow);
    body.appendChild(message);
    body.appendChild(meta);


    const actions =
        document.createElement("div");

    actions.className =
        "notification-actions-menu";


    if (!notification.is_read) {

        const readButton =
            document.createElement("button");

        readButton.type = "button";
        readButton.className =
            "notification-item-action";
        readButton.title =
            "Mark as read";
        readButton.textContent = "✓";

        readButton.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                markAsRead(
                    notification.id
                );
            }
        );

        actions.appendChild(
            readButton
        );
    }


    const deleteButton =
        document.createElement("button");

    deleteButton.type = "button";
    deleteButton.className =
        "notification-item-action delete";
    deleteButton.title =
        "Delete notification";
    deleteButton.textContent = "×";

    deleteButton.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            deleteNotification(
                notification.id
            );
        }
    );

    actions.appendChild(
        deleteButton
    );


    item.appendChild(icon);
    item.appendChild(body);
    item.appendChild(actions);


    item.addEventListener(
        "click",
        () => openNotification(
            notification
        )
    );

    return item;
}


/* =========================================================
   ICONS
========================================================= */

function getNotificationIcon(type) {

    switch (type) {

        case "receipt_processed":
            return "✓";

        case "security":
            return "◆";

        case "processing_failed":
            return "!";

        case "system":
            return "●";

        default:
            return "•";
    }
}


/* =========================================================
   TYPE LABEL
========================================================= */

function formatNotificationType(type) {

    if (!type) {
        return "SYSTEM";
    }

    return type
        .replaceAll("_", " ")
        .toUpperCase();
}


/* =========================================================
   DATE
========================================================= */

function formatNotificationDate(value) {

    if (!value) {
        return "Just now";
    }

    const date =
        new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Just now";
    }

    const now =
        new Date();

    const seconds =
        Math.floor(
            (now - date) / 1000
        );

    if (seconds < 60) {
        return "Just now";
    }

    if (seconds < 3600) {

        return `${Math.floor(
            seconds / 60
        )}m ago`;
    }

    if (seconds < 86400) {

        return `${Math.floor(
            seconds / 3600
        )}h ago`;
    }

    if (seconds < 604800) {

        return `${Math.floor(
            seconds / 86400
        )}d ago`;
    }

    return date.toLocaleDateString(
        undefined,
        {
            year: "numeric",
            month: "short",
            day: "numeric",
        }
    );
}


/* =========================================================
   OPEN NOTIFICATION
========================================================= */

async function openNotification(
    notification
) {

    selectedNotification =
        notification;

    if (!notification.is_read) {

        await markAsRead(
            notification.id,
            false
        );

        notification.is_read = true;

        updateSummary();
        updateBadges();
        renderNotifications();
    }

    openModal(
        notification
    );
}


/* =========================================================
   MARK AS READ
========================================================= */

async function markAsRead(
    notificationId,
    rerender = true
) {

    try {

        await apiRequest(
            `${API_BASE}/notifications/${notificationId}/read`,
            {
                method: "PUT",
            }
        );

        const notification =
            allNotifications.find(
                item =>
                    item.id === notificationId
            );

        if (notification) {
            notification.is_read = true;
        }

        if (rerender) {

            updateSummary();
            updateBadges();
            renderNotifications();
        }

    } catch (error) {

        console.error(
            "Failed to mark notification as read:",
            error
        );

        alert(
            error.message ||
            "Unable to mark notification as read."
        );
    }
}


/* =========================================================
   MARK ALL AS READ
========================================================= */

async function markAllAsRead() {

    const unreadCount =
        allNotifications.filter(
            notification =>
                !notification.is_read
        ).length;

    if (unreadCount === 0) {
        return;
    }

    const button =
        $("#mark-all-read");

    const originalHTML =
        button?.innerHTML || "";

    if (button) {

        button.disabled = true;
        button.textContent = "Marking...";
    }

    try {

        await apiRequest(
            `${API_BASE}/notifications/read-all`,
            {
                method: "PUT",
            }
        );

        allNotifications =
            allNotifications.map(
                notification => ({
                    ...notification,
                    is_read: true,
                })
            );

        updateSummary();
        updateBadges();
        renderNotifications();

    } catch (error) {

        console.error(
            "Failed to mark all notifications as read:",
            error
        );

        alert(
            error.message ||
            "Unable to mark all notifications as read."
        );

    } finally {

        if (button) {

            button.disabled = false;

            button.innerHTML =
                originalHTML ||
                "✓ Mark All as Read";
        }
    }
}


/* =========================================================
   DELETE
========================================================= */

async function deleteNotification(
    notificationId
) {

    const confirmed =
        window.confirm(
            "Delete this notification?"
        );

    if (!confirmed) {
        return;
    }

    try {

        await apiRequest(
            `${API_BASE}/notifications/${notificationId}`,
            {
                method: "DELETE",
            }
        );

        allNotifications =
            allNotifications.filter(
                notification =>
                    notification.id !== notificationId
            );

        if (
            selectedNotification?.id ===
            notificationId
        ) {

            selectedNotification = null;

            closeModal();
        }

        updateSummary();
        updateBadges();
        renderNotifications();

    } catch (error) {

        console.error(
            "Failed to delete notification:",
            error
        );

        alert(
            error.message ||
            "Unable to delete notification."
        );
    }
}


/* =========================================================
   MODAL
========================================================= */

function openModal(notification) {

    const modal =
        $("#notification-modal");

    if (!modal) {
        return;
    }

    const title =
        $("#notification-modal-title");

    const type =
        $("#notification-modal-type");

    const message =
        $("#notification-modal-message");

    const date =
        $("#notification-modal-date");

    const readButton =
        $("#notification-modal-read");

    if (title) {
        title.textContent =
            notification.title ||
            "Notification";
    }

    if (type) {
        type.textContent =
            formatNotificationType(
                notification.type
            );
    }

    if (message) {
        message.textContent =
            notification.message || "";
    }

    if (date) {
        date.textContent =
            notification.created_at
                ? new Date(
                    notification.created_at
                ).toLocaleString()
                : "—";
    }

    if (readButton) {
        readButton.hidden =
            Boolean(notification.is_read);
    }

    modal.hidden = false;

    document.body.style.overflow =
        "hidden";
}


function closeModal() {

    const modal =
        $("#notification-modal");

    if (modal) {
        modal.hidden = true;
    }

    selectedNotification = null;

    document.body.style.overflow =
        "";
}


/* =========================================================
   LOADING / ERROR
========================================================= */

function showLoading() {

    const loading =
        $("#notifications-loading");

    const list =
        $("#notifications-list");

    const empty =
        $("#notifications-empty");

    const error =
        $("#notifications-error");

    if (loading) {
        loading.hidden = false;
    }

    if (list) {
        list.innerHTML = "";
    }

    if (empty) {
        empty.hidden = true;
    }

    if (error) {
        error.hidden = true;
    }
}


function hideLoading() {

    const loading =
        $("#notifications-loading");

    if (loading) {
        loading.hidden = true;
    }
}


function showError(message) {

    const error =
        $("#notifications-error");

    const messageElement =
        $("#notifications-error-message");

    if (messageElement) {
        messageElement.textContent =
            message;
    }

    if (error) {
        error.hidden = false;
    }
}


function hideError() {

    const error =
        $("#notifications-error");

    if (error) {
        error.hidden = true;
    }
}


/* =========================================================
   FILTERS
========================================================= */

function setupFilters() {

    const buttons =
        $$(".notification-filter");

    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    buttons.forEach(
                        item =>
                            item.classList.remove(
                                "active"
                            )
                    );

                    button.classList.add(
                        "active"
                    );

                    activeFilter =
                        button.dataset.filter ||
                        "all";

                    renderNotifications();
                }
            );
        }
    );
}


/* =========================================================
   PAGE ACTIONS
========================================================= */

function setupActions() {

    const refreshButton =
        $("#refresh-notifications");

    if (refreshButton) {

        refreshButton.addEventListener(
            "click",
            loadNotifications
        );
    }


    const markAllButton =
        $("#mark-all-read");

    if (markAllButton) {

        markAllButton.addEventListener(
            "click",
            markAllAsRead
        );
    }


    const retryButton =
        $("#retry-notifications");

    if (retryButton) {

        retryButton.addEventListener(
            "click",
            loadNotifications
        );
    }


    const closeButton =
        $("#notification-modal-close");

    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeModal
        );
    }


    const backdrop =
        $("#notification-modal-backdrop");

    if (backdrop) {

        backdrop.addEventListener(
            "click",
            closeModal
        );
    }


    const modalReadButton =
        $("#notification-modal-read");

    if (modalReadButton) {

        modalReadButton.addEventListener(
            "click",
            async () => {

                if (!selectedNotification) {
                    return;
                }

                await markAsRead(
                    selectedNotification.id
                );

                selectedNotification.is_read =
                    true;

                openModal(
                    selectedNotification
                );
            }
        );
    }


    const modalDeleteButton =
        $("#notification-modal-delete");

    if (modalDeleteButton) {

        modalDeleteButton.addEventListener(
            "click",
            async () => {

                if (!selectedNotification) {
                    return;
                }

                await deleteNotification(
                    selectedNotification.id
                );
            }
        );
    }
}


/* =========================================================
   MOBILE MENU
========================================================= */

function setupMobileMenu() {

    const button =
        $("#mobile-menu-button");

    const sidebar =
        document.querySelector(
            ".notifications-app .sidebar"
        );

    if (!button || !sidebar) {
        return;
    }

    button.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            sidebar.classList.toggle(
                "mobile-open"
            );
        }
    );


    document.addEventListener(
        "click",
        (event) => {

            if (window.innerWidth > 820) {
                return;
            }

            if (
                !sidebar.contains(
                    event.target
                ) &&
                !button.contains(
                    event.target
                )
            ) {

                sidebar.classList.remove(
                    "mobile-open"
                );
            }
        }
    );
}


/* =========================================================
   ACCOUNT MENU
========================================================= */

function setupAccountMenu() {

    const button =
        $("#user-account-button");

    const menu =
        $("#user-account-menu");

    if (!button || !menu) {
        return;
    }

    button.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            const open =
                button.getAttribute(
                    "aria-expanded"
                ) === "true";

            button.setAttribute(
                "aria-expanded",
                String(!open)
            );

            menu.hidden = open;
        }
    );


    document.addEventListener(
        "click",
        (event) => {

            if (
                !menu.contains(
                    event.target
                ) &&
                !button.contains(
                    event.target
                )
            ) {

                menu.hidden = true;

                button.setAttribute(
                    "aria-expanded",
                    "false"
                );
            }
        }
    );
}


/* =========================================================
   LOGOUT
========================================================= */

async function logout() {

    try {

        await apiRequest(
            `${API_BASE}/auth/logout`,
            {
                method: "POST",
            }
        );

    } catch (error) {

        console.warn(
            "Logout request failed:",
            error
        );

    } finally {

        window.location.href =
            "/login";
    }
}


function setupLogout() {

    const logoutButton =
        $("#logout-button");

    const accountLogout =
        $("#account-menu-logout");

    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            logout
        );
    }

    if (accountLogout) {

        accountLogout.addEventListener(
            "click",
            logout
        );
    }
}


/* =========================================================
   INITIALIZE
========================================================= */

async function initializeNotificationsPage() {

    setupFilters();
    setupActions();
    setupMobileMenu();
    setupAccountMenu();
    setupLogout();

    await loadCurrentUser();
    await loadNotifications();
}


/* =========================================================
   START
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeNotificationsPage
);