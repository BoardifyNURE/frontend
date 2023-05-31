import { IUser } from "../Interfaces/Kanban"

export default () : string => {
    const user : IUser | null = JSON.parse(localStorage.getItem('user') || '')

    
    return user?.id || ''
}