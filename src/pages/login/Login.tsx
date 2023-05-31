import useLogin from "../../hooks/useLogin"
import { Link } from "react-router-dom"
import './login.css'

export default function Login() {
    const {
        data,
        loading,
        inputsHandler,
        confirmLogin
    }  = useLogin()

  return (
    <div onSubmit={(e) => {
        e.preventDefault()
        confirmLogin()
    }} className="modal-auth">
        <form className="modal-auth__body">
            <div className="modal-auth__title">
                <span>Sign in or </span>
                <Link to={'/registration'}>Sign up</Link>
            </div>
            <div className="modal-auth__inputs">
                <div className="modal-auth__input-wrapper">
                    <label 
                    htmlFor="login-email">
                        Email:
                    </label>
                    <input
                    placeholder="example@gmail.com"
                    id="login-email"
                    value={data.email}
                    onChange={(e) => inputsHandler('email',e.target.value)} 
                    type="email" 
                    />
                </div>
                <div className="modal-auth__input-wrapper">
                    <label 
                    htmlFor="login-password">
                        Password:
                    </label>
                    <input
                    placeholder="*******"
                    id="login-password"
                    value={data.password}
                    onChange={(e) => inputsHandler('password',e.target.value)} 
                    type="password" 
                    />
                </div>
            </div>
            <button
            className="modal-auth-btn"
            disabled={loading}
            >
                Login
            </button>
        </form>
    </div>
  )
}
