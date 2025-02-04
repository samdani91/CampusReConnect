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
import Feed from './Components/Post/Feed';
import ProtectedRoutes from './Components/ProtectedRoutes';
import Notification from './Components/Notification';
import { NotificationProvider } from './Components/Context/NotificationContext';
import Chat from './Components/Message/Chat';
import Setting from './Components/User/Settings/Setting';
import ViewProfile from './Components/User/ViewProfile/ViewProfile';
import Navbar from './Components/Navbar/Navbar';
import axios from 'axios';

function App() {
    const [user, setUser] = useState(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [showNavbar, setShowNavbar] = useState(false); 
    const [loggedInOnce, setLoggedInOnce] = useState(false);

    // Check if the user is authenticated on system startup
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get("http://localhost:3001/check-auth", {
                    withCredentials: true,
                });
                if (response.data.isAuthenticated) {
                    setUser(true); 
                    setShowNavbar(true); 
                } else {
                    setUser(false);
                }
            } catch (error) {
                setUser(false);
            } finally {
                setIsCheckingAuth(false);
            }
        };

        checkAuth();
    }, []);

    // Delay rendering Navbar after login
    useEffect(() => {
        if (user && !loggedInOnce) {
            const timer = setTimeout(() => {
                setShowNavbar(true);
                setLoggedInOnce(true); 
            }, 1000);
            return () => clearTimeout(timer); 
        } else if (user) {
            setShowNavbar(true);
        }else{
            setLoggedInOnce(false);
        }
    }, [user, loggedInOnce]);

    // Show a loading screen while checking authentication
    // if (isCheckingAuth) {
    //     return <div>Loading...</div>;
    // }

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
