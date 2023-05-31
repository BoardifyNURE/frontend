import getToken from "../../Helper/getToken"
import { IBoard, IColumn } from '../../Interfaces/Kanban';
import { config } from "../config"

export default async (column:IColumn) : Promise<IColumn> => {
    try{
        const data = {
            board_id:column.boardId,
            title:column.title,
            order:column.order
        }

        const responce = await fetch(`${config.serverURL}/columns`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${getToken()}`
            },
            body:JSON.stringify(data)
        })

        const newColumn : IColumn = await responce.json()

        return newColumn

    }catch(error){
        return {id:'',title:'',cards:[],order:0}
    }
}