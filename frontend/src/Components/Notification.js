import React, { useContext, useState, useEffect } from "react";
import { NotificationContext } from "./Context/NotificationContext";
import axios from "axios";

const Notification = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userNotifications, setUserNotifications] = useState([]); // State for notifications

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await axios.get("http://localhost:3001/get-userId", {
                    withCredentials: true,
                });
                setCurrentUser(response.data);
            } catch (error) {
                console.error("Error fetching current user data:", error);
            }
        };

        fetchCurrentUser();
    }, []);

    useEffect(() => {
        if (currentUser) {
            const fetchNotifications = async () => {
                try {
                    const response = await axios.get(`http://localhost:3001/notifications/${currentUser.user_id}`,{withCredentials:true});
                    setUserNotifications(response.data);
                } catch (error) {
                    console.error("Error fetching notifications:", error);
                }
            };
            fetchNotifications();
        }
    }, [currentUser,userNotifications]);

    return (
        <>
            <div className="container mt-4">
                <h1 className="mb-4">Notifications</h1>

                {userNotifications.length > 0 ? (
                    <ul className="list-group">
                        {userNotifications.map((notification) => (
                            <li key={notification.notification_id} className="list-group-item">
                                <div dangerouslySetInnerHTML={{ __html: notification.notification_content }} />
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