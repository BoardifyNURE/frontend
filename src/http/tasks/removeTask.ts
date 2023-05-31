import getToken from "../../Helper/getToken"
import { config } from "../config"

export default async (id:string) : Promise<boolean> => {
    try{
        await fetch(`${config.serverURL}/tasks/${id}`,{
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