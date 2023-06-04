import {useCallback, useState} from 'react';
import { IRegistration } from '../Interfaces/Kanban';
import registration from '../http/registration';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/slices/auth';
import { IReturnRegister } from '../http/registration';


interface IReturnLogin {
    data:IRegistration
    loading:boolean
    inputsHandler : (name:string,value:string) => void
    confirmRegistration : () => Promise<IReturnRegister>
}

const useRegistration = () : IReturnLogin  => {
    const [data,setData] = useState<IRegistration>({email:'',password:'',username:'',firstName:'',lastName:''})
    const [loading,setLoading] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const inputsHandler = useCallback((name:string,value:string) : void => {
        setData({...data,[name]:value})
    },[data])

    const confirmRegistration = async () : Promise<IReturnRegister> => {
        setLoading(true)

        const {success,message} : IReturnRegister = await registration(data)

        setLoading(false)

        if(success){
            dispatch(setUser({user:data,isAuth:true}))
            return {success,message} 
        }
        return {success,message} 
    }

    return {data,loading,inputsHandler,confirmRegistration}
}

export default useRegistration
