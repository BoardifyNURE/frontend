import getToken from "../../Helper/getToken"
import { ITodos,INewTodos } from '../../Interfaces/Kanban';
import { config } from "../config"

export default async (data:INewTodos) : Promise<ITodos> => {
    try{
        const responce = await fetch(`${config.serverURL}/todos`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${getToken()}`
            },  
            body:JSON.stringify(data)
        })

        const newTodo : ITodos = await responce.json()

        return newTodo

    }catch(error){
        return {id:'',content:'',is_done:false}
    }
}