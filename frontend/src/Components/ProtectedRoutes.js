import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";

const ProtectedRoutes = () => {
    const [isAuthenticated, setIsAuthenticated] = React.useState(null);

    // Check if the user is authenticated by validating the cookie
    React.useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get("http://localhost:3001/check-auth", {
                    withCredentials: true, // Include cookies in the request
                });
                setIsAuthenticated(response.data.isAuthenticated); // True if authenticated
            } catch (error) {
                setIsAuthenticated(false); // Not authenticated
            }
        };

        checkAuth();
    }, []);

    // While authentication is being checked, show a loading state
    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    }

    // If authenticated, render the requested route, otherwise redirect to login
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
