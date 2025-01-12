import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useState, useEffect } from 'react';
import Signup from './Components/Authentication/Signup';
import Login from './Components/Authentication/Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './Components/Home/Landing';
import ForgotPassword from './Components/Authentication/ForgotPassword';
import EnterVerificationCode from './Components/Authentication/EnterVerificationCode';
import ResetPassword from './Components/Authentication/ResetPassword';
import Feed from './Components/ContentFeed/Feed';
import ProtectedRoutes from './Components/ProtectedRoutes';
import Notification from './Components/Notification';
import { NotificationProvider } from './Components/Context/NotificationContext';
import Chat from './Components/Chat/Chat';
import Setting from './Components/Profile/Settings/Setting';
import ViewProfile from './Components/Profile/ViewProfile/ViewProfile';
import Navbar from './Components/Navbar/Navbar'; // Import Navbar
import axios from 'axios';

function App() {
    const [user, setUser] = useState(null); // User state to track login
    const [isCheckingAuth, setIsCheckingAuth] = useState(true); // Track if auth check is in progress
    const [showNavbar, setShowNavbar] = useState(false); // State to control navbar rendering
    const [loggedInOnce, setLoggedInOnce] = useState(false); // Track if user has logged in at least once

    // Check if the user is authenticated on system startup
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get("http://localhost:3001/check-auth", {
                    withCredentials: true, // Include cookies
                });
                if (response.data.isAuthenticated) {
                    setUser(true); // User is logged in
                    setShowNavbar(true); // Immediately show Navbar if already logged in
                } else {
                    setUser(false); // User is not logged in
                }
            } catch (error) {
                setUser(false); // In case of error, consider the user not logged in
            } finally {
                setIsCheckingAuth(false); // Mark the auth check as complete
            }
        };

        checkAuth();
    }, []);

    // Delay rendering Navbar after login
    useEffect(() => {
        if (user && !loggedInOnce) {
            // First-time login, add delay
            const timer = setTimeout(() => {
                setShowNavbar(true);
                setLoggedInOnce(true); // Mark as logged in
            }, 1000);
            return () => clearTimeout(timer); // Cleanup the timer on unmount
        } else if (user) {
            // If user is already logged in, show Navbar immediately
            setShowNavbar(true);
        }
    }, [user, loggedInOnce]);

    // Show a loading screen while checking authentication
    if (isCheckingAuth) {
        return <div>Loading...</div>;
    }

    return (
        <NotificationProvider>
            <BrowserRouter>
                {showNavbar && <Navbar setUser={setUser} setShowNavbar={setShowNavbar}/>}
                <Routes>
                    {/* Redirect to feed if user is logged in */}
                    <Route path="/" element={user ? <Feed /> : <Landing />} />
                    <Route path="/register" element={<Signup />} />
                    <Route path="/login" element={<Login onLogin={() => setUser(true)} />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/verify-code" element={<EnterVerificationCode />} />
                    <Route path="/reset-password" element={<ResetPassword />} />

                    {/* Protected routes */}
                    <Route element={<ProtectedRoutes />}>
                        <Route path="/feed" element={<Feed />} />
                        <Route path="/notifications" element={<Notification />} />
                        <Route path="/message" element={<Chat />} />
                        <Route path="/settings" element={<Setting />} />
                        <Route path="/view-profile" element={<ViewProfile />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </NotificationProvider>
    );
}

export default App;
