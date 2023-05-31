import getToken from "../../Helper/getToken"
import { IBoard, ICard, INewBoard, INewTask } from '../../Interfaces/Kanban';
import { config } from "../config"
import { TaskStatus } from "../../Interfaces/Kanban";

export default async (data:INewTask,id:string) : Promise<ICard> => {
    try{
        const responce = await fetch(`${config.serverURL}/tasks/${id}`,{
            method:'PUT',
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${getToken()}`
            },
            body:JSON.stringify(data)
        })

        const task : ICard = await responce.json()

        return task

    }catch(error){
        return {title:'',id:'',todos:[],description:'',status:TaskStatus.ToDo}
    }
}