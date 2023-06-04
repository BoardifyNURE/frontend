import {FC} from 'react'
import { Check } from 'react-feather'
import { Link } from 'react-router-dom'
import './result-modal.css'

interface IProps {
    isSuccess:boolean
    message:string
    modalHandler:(event:any) => void
}

const RegisterResulltsModal  : FC<IProps> = ({modalHandler,message,isSuccess})  => {

  return (
    <div onClick={modalHandler} id='close-modal' className='modal'>
      <div id='close-modal2' className="reg-modal__body">
        <div className="reg-modal__success">
            <div>
                {message}
            </div>
            {
                isSuccess
                ?
                <Check color='green'/>
                :
                <></>
            }
        </div>
        <div className='reg-modal__btn'>
        <Link to={'Login'}>Login</Link>
        </div>
      </div>
    </div>
  )
}

export default RegisterResulltsModal