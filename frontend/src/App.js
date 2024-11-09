import 'bootstrap/dist/css/bootstrap.min.css'
import Signup from './Components/Authentication/Signup';
import Login from './Components/Authentication/Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './Components/Landing';


function App() {
	return (
		<BrowserRouter>
			<Routes>
			<Route path='/' element={<Landing/>}></Route>
				<Route path='/register' element={<Signup/>}></Route>
				<Route path='/login' element={<Login/>}>
				</Route>
			</Routes>

		</BrowserRouter>
	);
}

export default App;
