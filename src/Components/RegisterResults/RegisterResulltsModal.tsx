import {FC} from 'react'
import { Check , X} from 'react-feather'
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
      <div className="reg-modal__body">
        <X id='close-modal' tabIndex={1} className='reg-modal__body-close'/>
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
          {
            isSuccess
            ?
            <Link to={'Login'}>Login</Link>
            :
            <input 
            
            id='close-modal'
            value={'Back to registration'}
            type='button'/>
          }
        </div>
      </div>
    </div>
  )
}

export default RegisterResulltsModal