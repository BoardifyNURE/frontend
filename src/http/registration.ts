import axios from 'axios'
import {config} from './config'
import { IRegistration } from '../Interfaces/Kanban'

export default async (data:IRegistration) : Promise<boolean> => {
    try{

        const responce = await fetch(`${config.serverURL}/auth/signup`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(data)
        })

        return true
    }catch(error){
        return false
    }
}