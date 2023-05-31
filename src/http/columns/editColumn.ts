import getToken from "../../Helper/getToken"
import { IColumn } from '../../Interfaces/Kanban';
import { config } from "../config"

export default async (column:IColumn,id:string) : Promise<IColumn> => {
    try{
        const data = {
            title:column.title,
            order:column.order
        }

        const responce = await fetch(`${config.serverURL}/columns/${id}`,{
            method:'PUT',
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${getToken()}`
            },
            body:JSON.stringify(data)
        })

        const editedColumn : IColumn = await responce.json()

        return editedColumn

    }catch(error){
        return {id:'',title:'',cards:[],order:0}
    }
}