import getToken from "../../Helper/getToken"
import { config } from "../config"
import { IUser } from "../../Interfaces/Kanban"

export default async (id:string) : Promise<any> => {
    try{
        const responce = await fetch(`${config.serverURL}/boards/${id}/users`,{
            method:'GET',
            headers:{
                'Authorization':`Bearer ${getToken()}`
            },
        })

        const users : Array<IUser> = await responce.json()

        return users
    }catch(error){
        return []
    }
}