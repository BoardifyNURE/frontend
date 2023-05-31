import {useCallback, useState} from 'react';
import login from '../http/login';
import { ILogin } from '../Interfaces/Kanban';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/slices/auth';

interface IReturnLogin {
    data:ILogin
    loading:boolean
    inputsHandler : (name:string,value:string) => void
    confirmLogin : () => Promise<boolean>
}

const useLogin = () : IReturnLogin  => {
    const [data,setData] = useState<ILogin>({email:'',password:''})
    const [loading,setLoading] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const inputsHandler = useCallback((name:string,value:string) : void => {
        setData({...data,[name]:value})
    },[data])

    const confirmLogin = async () : Promise<boolean> => {
        setLoading(true)

        const isSuccess = await login(data)

        setLoading(false)

        if(isSuccess){
            dispatch(setUser({user:data,isAuth:true}))
            navigate('/boards')
        }else{
            alert('username or password incorrect')
        }
        
        return isSuccess
    }

    return {data,loading,inputsHandler,confirmLogin}
}

export default useLogin
