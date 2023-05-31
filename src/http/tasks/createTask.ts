import getToken from "../../Helper/getToken"
import { IBoard, ICard,INewTask ,TaskStatus } from '../../Interfaces/Kanban';
import { config } from "../config"

export default async (data:INewTask) : Promise<ICard> => {
    try{
        const responce = await fetch(`${config.serverURL}/tasks`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${getToken()}`
            },  
            body:JSON.stringify(data)
        })

        const newTask : ICard = await responce.json()

        return newTask

    }catch(error){
        return {title:'',id:'',todos:[],description:'',status:TaskStatus.ToDo}
    }
}