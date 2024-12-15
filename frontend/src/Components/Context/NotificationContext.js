import React, { createContext, useState } from "react";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([
        { id: 1, message: "New journal uploaded to your course.", seen: false },
        { id: 2, message: "Your profile was viewed by John Doe.", seen: false },
    ]);

    // Mark all notifications as seen
    const markNotificationsAsSeen = () => {
        setNotifications((prevNotifications) =>
            prevNotifications.map((notification) => ({ ...notification, seen: true }))
        );
    };

    // Determine if there are any unseen notifications
    const hasUnseenNotifications = notifications.some((notification) => !notification.seen);

    return (
        <NotificationContext.Provider
            value={{ notifications, setNotifications, markNotificationsAsSeen, hasUnseenNotifications }}
        >
            {children}
        </NotificationContext.Provider>
    );
};
