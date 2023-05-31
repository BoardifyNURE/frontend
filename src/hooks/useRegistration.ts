import {useCallback, useState} from 'react';
import { IRegistration } from '../Interfaces/Kanban';
import registration from '../http/registration';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/slices/auth';

interface IReturnLogin {
    data:IRegistration
    loading:boolean
    inputsHandler : (name:string,value:string) => void
    confirmRegistration : () => Promise<void>
}

const useRegistration = () : IReturnLogin  => {
    const [data,setData] = useState<IRegistration>({email:'',password:'',username:'',firstName:'',lastName:''})
    const [loading,setLoading] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const inputsHandler = useCallback((name:string,value:string) : void => {
        setData({...data,[name]:value})
    },[data])

    const confirmRegistration = async () : Promise<void> => {
        setLoading(true)

        const isSuccess = await registration(data)

        setLoading(false)

        if(isSuccess){
            dispatch(setUser({user:data,isAuth:true}))
            navigate('/boards')
        }
    }

    return {data,loading,inputsHandler,confirmRegistration}
}

export default useRegistration
