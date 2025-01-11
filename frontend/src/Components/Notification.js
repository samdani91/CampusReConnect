import React, { useContext } from "react";
import { NotificationContext } from "./Context/NotificationContext";

const Notification = () => {
    const { notifications } = useContext(NotificationContext);

    return (
        <>
            <div className="container mt-4">
                <h1 className="mb-4">Notifications</h1>

                {notifications.length > 0 ? (
                    <ul className="list-group">
                        {notifications.map((notification) => (
                            <li key={notification.id} className="list-group-item">
                                {notification.message}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>You have no new notifications.</p>
                )}
            </div>
        </>
    );
};

export default Notification;
