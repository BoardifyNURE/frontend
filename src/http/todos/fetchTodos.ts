import getToken from "../../Helper/getToken"
import { ITodos,INewTodos } from '../../Interfaces/Kanban';
import { config } from "../config"

export default async (taskId:string) : Promise<any> => {
    try{
        const responce = await fetch(`${config.serverURL}/todos/${taskId}`,{
            method:'GET',
            headers:{
                'Authorization':`Bearer ${getToken()}`
            },
        })

        const todos : Array<ITodos> = await responce.json()

        return todos
    }catch(error){
        return []
    }
}