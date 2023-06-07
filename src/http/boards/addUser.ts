import getToken from "../../Helper/getToken"
import { IBoard, IUser } from '../../Interfaces/Kanban';
import { config } from "../config"

interface IData {
    board_id:string
    users_identifications:Array<any>
}

interface IReturnData {
    message?:any
    statusCode?:number
    error?:string
}

export default async (id:string,user:IUser,type:'email' | 'username') : Promise<IReturnData> => {
    try{
        const data : IData = {
            board_id:id,
            users_identifications:[{
                [type]:user[type],
            }]
        }

        const responce = await fetch(`${config.serverURL}/boards/add-users-to-board`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${getToken()}`
            },
            body:JSON.stringify(data)
        })

        const result  = await responce.json()

        return result

    }catch(error){
        return {}
    }
}