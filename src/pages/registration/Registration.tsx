import { useMemo, useState } from 'react';
import { Link } from "react-router-dom"
import { IReturnRegister } from '../../http/registration';
import useRegistation from '../../hooks/useRegistration'
import RegisterResulltsModal from '../../Components/RegisterResults/RegisterResulltsModal';
import LoaderCustom from "../../Components/loader/Loader"
import './registration.css'

interface IRegisterResults {
    success:boolean
    modalState:boolean
}

export default function Registration() {
    const {
        data,
        loading,
        inputsHandler,
        confirmRegistration
    }  = useRegistation()

    const [isSuccessRegister,setIsSuccessRegister] = useState<IRegisterResults>({success:false,modalState:false})
    const [message,setMessage] = useState<string>('')
    const isValid : boolean = useMemo(() : boolean => {
        return (
            data.email.length > 4 
            && 
            data.password.length > 2
            &&
            data.username.length > 2
            &&
            data.firstName.length > 2
            &&
            data.lastName.length > 2
        )
    },[data])

    const confirmRegister = async (e:any) : Promise<void> => {
        e.preventDefault()

        const {success,message} : IReturnRegister = await confirmRegistration()

        setMessage(message)

        setIsSuccessRegister({success,modalState:true})

    } 

    const modalHandler = (event:any) : void => {
        const targetId = event.target.id
        
        if(targetId === 'close-modal'){
            setIsSuccessRegister({...isSuccessRegister,modalState:false})
        }
        
    }

    if(loading) return <LoaderCustom/>

  return (
    <>
    <div onSubmit={confirmRegister} className="modal-auth">
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
            <input
            type="submit"
            value={'Confirm register'}
            className="modal-auth-btn"
            disabled={!isValid}
            />   
        </form>
    </div>
    {
        isSuccessRegister.modalState
        ?
        <RegisterResulltsModal
        isSuccess={isSuccessRegister.success}
        message={message}
        modalHandler={modalHandler}
        />
        :
        <></>
    }
    </>
  )
}