import getToken from "../../Helper/getToken"
import { ITodos } from '../../Interfaces/Kanban';
import { config } from "../config"

export default async (data:ITodos,id:string) : Promise<ITodos> => {
    try{
        const responce = await fetch(`${config.serverURL}/todos/${id}`,{
            method:'PUT',
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${getToken()}`
            },
            body:JSON.stringify(data)
        })

        const todo : ITodos = await responce.json()

        return todo

    }catch(error){
        return {id:'',content:'',is_done:false}
    }
}