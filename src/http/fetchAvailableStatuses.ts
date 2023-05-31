import {config} from './config'
import getToken from '../Helper/getToken'


export default async (id:string) : Promise<Array<string>> => {
    try{
        const responce = await fetch(`${config.serverURL}/tasks/${id}/available-statuses`,{
            method:'GET',
            headers:{
                'Authorization':`Bearer ${getToken()}`
            },
        })

        const statuses : Array<string>  = await responce.json()
        
        return statuses

    }catch(error){
        return []
    }
}