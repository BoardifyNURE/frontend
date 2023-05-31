import getToken from "../../Helper/getToken"
import { ITodos,INewTodos } from '../../Interfaces/Kanban';
import { config } from "../config"

export default async (id:string) : Promise<boolean> => {
    try{
        await fetch(`${config.serverURL}/todos/${id}`,{
            method:'DELETE',
            headers:{
                'Authorization':`Bearer ${getToken()}`
            },
        })

        return true
        
    }catch(error){
        return false
    }
}