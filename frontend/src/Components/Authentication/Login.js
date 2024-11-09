import {React,useState} from 'react'
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export default function Login() {
    const [email,setEmail] = useState();
    const [password,setPassword] = useState();
    const navigate = useNavigate();


    const handleRegister = (e) => {
        e.preventDefault();

        axios.post('http://localhost:3001/login',{email,password})
        .then(result => {console.log(result)
            if(result.data === 'Success') navigate('/home')
        })
        .catch(err => console.log(err))
        
    };
    return (
        <>
            <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
                <div className="bg-white p-3 rounded w-25">
                    <h2>Login</h2>
                    <form onSubmit={handleRegister}>
                        <div className="mb-3">
                            <label htmlFor="email">
                                <strong>Email</strong>
                            </label>
                            <input type="text" placeholder="Enter instituional email" autoComplete="off" name="email" className="form-control rounded-0" onChange={(e)=> setEmail(e.target.value)} />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="email">
                                <strong>Password</strong>
                            </label>
                            <input type="password" placeholder="Enter password" autoComplete="off" name="password" className="form-control rounded-0" onChange={(e)=> setPassword(e.target.value)}/>
                        </div>

                        <button type="submit" className="btn btn-success w-100 rounded-0">Login</button>

                    </form>
                </div>
            </div>
        </>
    )
}
