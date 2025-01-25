import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";

const ProtectedRoutes = () => {
    const [isAuthenticated, setIsAuthenticated] = React.useState(null);


    React.useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get("http://localhost:3001/check-auth", {
                    withCredentials: true, 
                });
                setIsAuthenticated(response.data.isAuthenticated); 
            } catch (error) {
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, []);


    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    }


    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
