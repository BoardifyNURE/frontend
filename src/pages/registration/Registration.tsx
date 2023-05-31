import { Link } from "react-router-dom"
import useRegistation from '../../hooks/useRegistration'
import './registration.css'

export default function Registration() {
    const {
        data,
        loading,
        inputsHandler,
        confirmRegistration
    }  = useRegistation()
    
    

  return (
    <div onSubmit={(e) => {
        e.preventDefault()
        confirmRegistration()
    }} className="modal-auth">
        <form className="modal-auth__body">
            <div className="modal-auth__title">
                <span>Sign up or </span>
                <Link to={'/login'}>Sign in</Link>
            </div>
            <div className="modal-auth__inputs">
           
                <div className="modal-auth__input-wrapper">
                    <label 
                    htmlFor="login-firstName">
                        Name:
                    </label>
                    <input
                    id="login-firstName"
                    value={data.firstName}
                    onChange={(e) => inputsHandler('firstName',e.target.value)} 
                    type="text" 
                    />
                </div>
                <div className="modal-auth__input-wrapper">
                    <label 
                    htmlFor="login-lastName">
                        Last Name:
                    </label>
                    <input
                    id="login-lastName"
                    value={data.lastName}
                    onChange={(e) => inputsHandler('lastName',e.target.value)} 
                    type="text" 
                    />
                </div>
  
                <div className="modal-auth__input-wrapper">
                    <label 
                    htmlFor="login-username">
                        Username:
                    </label>
                    <input
                    id="login-username"
                    value={data.username}
                    onChange={(e) => inputsHandler('username',e.target.value)} 
                    type="text" 
                    />
                </div>
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
                    placeholder="********"
                    htmlFor="login-password">
                        Password:
                    </label>
                    <input
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
                Confirm register
            </button>
        </form>
    </div>
  )
}
