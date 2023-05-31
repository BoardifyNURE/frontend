import getToken from "../../Helper/getToken"
import { IBoard } from "../../Interfaces/Kanban"
import { config } from "../config"

export default async () : Promise<any> => {
    try{
        const responce = await fetch(`${config.serverURL}/boards`,{
            method:'GET',
            headers:{
                'Authorization':`Bearer ${getToken()}`
            },
        })

        const boards : Array<IBoard> = await responce.json()

        return boards.reverse()
    }catch(error){
        return []
    }
}