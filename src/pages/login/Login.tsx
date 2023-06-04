import { useMemo } from "react"
import { Link } from "react-router-dom"
import useLogin from "../../hooks/useLogin"
import LoaderCustom from "../../Components/loader/Loader"
import './login.css'

export default function Login() {
    const {
        data,
        loading,
        inputsHandler,
        confirmLogin
    }  = useLogin()

    const isValid : boolean = useMemo(() : boolean => {
        return data.email.length > 4 && data.password.length > 2
    },[data])

    if(loading) return <LoaderCustom/>

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
                    autoFocus={true}
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
            <input
            type="submit"
            value={'Login'}
            className="modal-auth-btn"
            disabled={!isValid}
            />                
        </form>
    </div>
  )
}
