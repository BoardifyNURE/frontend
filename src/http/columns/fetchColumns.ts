import getToken from "../../Helper/getToken"
import { IBoard } from "../../Interfaces/Kanban"
import { config } from "../config"

export default async (boardId:string) : Promise<any> => {
    try{
        const responce = await fetch(`${config.serverURL}/columns/${boardId}`,{
            method:'GET',
            headers:{
                'Authorization':`Bearer ${getToken()}`
            },
        })

        const columns : Array<IBoard> = await responce.json()

        return columns
    }catch(error){
        return []
    }
}