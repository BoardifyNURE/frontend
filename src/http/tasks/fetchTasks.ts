import getToken from "../../Helper/getToken"
import { IBoard, ICard } from "../../Interfaces/Kanban"
import { config } from "../config"

export default async (columnId:string) : Promise<any> => {
    try{
        const responce = await fetch(`${config.serverURL}/tasks/column/${columnId}`,{
            method:'GET',
            headers:{
                'Authorization':`Bearer ${getToken()}`
            },
        })

        const tasks : Array<ICard> = await responce.json()

        return tasks
    }catch(error){
        return []
    }
}