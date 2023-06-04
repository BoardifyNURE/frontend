import axios from 'axios'
import {config} from './config'
import { IRegistration } from '../Interfaces/Kanban'

export interface IReturnRegister {
    success:boolean
    message:string
}

export default async (data:IRegistration) : Promise<IReturnRegister> => {
    try{

        const responce = await fetch(`${config.serverURL}/auth/signup`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(data)
        })

        const result = await responce.json()

        if(result.statusCode === 400){
            return {success:false,message:result.message}
        }

        return {success:true,message:'Registration successful'}

    }catch(error){
        return {success:false,message:'Register error'}
    }
}