import axios from 'axios'
import {config} from './config'
import { ILogin } from '../Interfaces/Kanban'

interface IResponce {
    accessToken:string
}

export default async (data:ILogin) : Promise<boolean> => {
    try{

        const responce = await fetch(`${config.serverURL}/auth/login`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(data)
        })

        const {accessToken} : IResponce = await responce.json()
        
        if(accessToken){
            localStorage.setItem('accessToken',accessToken)
            return true
        }else{
            throw new Error('Auth error')
        }

    }catch(error){
        return false
    }
}