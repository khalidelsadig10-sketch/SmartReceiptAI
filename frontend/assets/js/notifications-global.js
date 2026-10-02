/* =========================================================
   SmartReceiptAI — Global Notifications
   ========================================================= */

"use strict";

const NOTIFICATIONS_API =
    "/api/v1/notifications";

async function loadGlobalNotificationCount() {

    try {

        const response = await fetch(
            `${NOTIFICATIONS_API}/unread-count`,
            {
                method: "GET",
                credentials: "include",
                headers: {
                    "Accept": "application/json",
                },
            }
        );

        if (!response.ok) {
            return;
        }

        const data =
            await response.json();

        const count =
            Number(data?.unread_count || 0);

        updateGlobalNotificationBadges(
            count
        );

    } catch (error) {

        console.warn(
            "Failed to load notification count:",
            error
        );
    }
}


function updateGlobalNotificationBadges(
    count
) {

    const badges = document.querySelectorAll(
        "[data-notification-badge]"
    );

    badges.forEach(
        badge => {

            if (count > 0) {

                badge.hidden = false;

                badge.textContent =
                    count > 99
                        ? "99+"
                        : String(count);

            } else {

                badge.hidden = true;

            }
        }
    );
}


function setupGlobalNotificationLinks() {

    const notificationLinks =
        document.querySelectorAll(
            "[data-notifications-link]"
        );

    notificationLinks.forEach(
        link => {

            link.addEventListener(
                "click",
                () => {

                    window.location.href =
                        "/notifications";
                }
            );
        }
    );
}


document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadGlobalNotificationCount();

        setupGlobalNotificationLinks();

    }
);