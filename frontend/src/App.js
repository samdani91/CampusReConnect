import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Signup from './Components/Authentication/Signup';
import Login from './Components/Authentication/Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './Components/Home/Landing';
import ForgotPassword from './Components/Authentication/ForgotPassword'
import EnterVerificationCode from './Components/Authentication/EnterVerificationCode';
import ResetPassword from './Components/Authentication/ResetPassword';


function App() {
	return (
		<BrowserRouter>
			<Routes>
			<Route path='/' element={<Landing/>}></Route>
				<Route path='/register' element={<Signup/>}></Route>
				<Route path='/login' element={<Login/>}></Route>
				<Route path="/forgot-password" element={<ForgotPassword />} />
				<Route path="/verify-code" element={<EnterVerificationCode />} />
				<Route path="/reset-password" element={<ResetPassword />}/>
			</Routes>

		</BrowserRouter>
	);
}

export default App;
