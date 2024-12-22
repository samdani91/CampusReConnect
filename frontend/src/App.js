import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useState } from 'react'
import Signup from './Components/Authentication/Signup';
import Login from './Components/Authentication/Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './Components/Home/Landing';
import ForgotPassword from './Components/Authentication/ForgotPassword'
import EnterVerificationCode from './Components/Authentication/EnterVerificationCode';
import ResetPassword from './Components/Authentication/ResetPassword';
import Feed from './Components/ContentFeed/Feed'
import ProtectedRoutes from './Components/ProtectedRoutes';
import Notification from "./Components/Notification";
import { NotificationProvider } from "./Components/Context/NotificationContext";
import Chat from './Components/Chat/Chat';
import Setting from './Components/Profile/Settings/Setting';

function App() {
	const [user, setUser] = useState(null); // User state

	// Handle login state
	const handleLogin = (isLoggedIn) => {
		setUser(isLoggedIn); // Set user to true when logged in
	};
	return (
		<NotificationProvider>
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Landing />}></Route>
				<Route path='/register' element={<Signup />}></Route>
				<Route path='/login' element={<Login onLogin={handleLogin} />}></Route>
				<Route path="/forgot-password" element={<ForgotPassword />} />
				<Route path="/verify-code" element={<EnterVerificationCode />} />
				<Route path="/reset-password" element={<ResetPassword />} />

				{/* <Route element={<ProtectedRoutes user={user}/>}>
					<Route path="/feed" element={<Feed />}/>
				</Route> */}

				<Route path="/feed" element={<Feed />} />
				
				<Route path="/notifications" element={<Notification />} />

				<Route path="/message" element={<Chat />} />

				<Route path="/settings" element={<Setting/>} />
				

			</Routes>

		</BrowserRouter>
		</NotificationProvider>
	);
}

export default App;
