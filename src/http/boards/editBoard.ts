import getToken from "../../Helper/getToken"
import { IBoard, INewBoard } from '../../Interfaces/Kanban';
import { config } from "../config"

export default async (data:INewBoard,id:string) : Promise<IBoard> => {
    try{
        const responce = await fetch(`${config.serverURL}/boards/${id}`,{
            method:'PUT',
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${getToken()}`
            },
            body:JSON.stringify(data)
        })

        const board : IBoard = await responce.json()

        return board

    }catch(error){
        return {id:'',title:'',cards:[]}
    }
}