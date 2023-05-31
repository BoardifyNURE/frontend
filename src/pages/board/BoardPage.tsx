import Columns from "../../Components/Columns/Columns"
import { useLocation } from "react-router-dom"

export default function BoardPage() {
  
  const boardId = useLocation().pathname.split('/').pop() || ''

  return (
    <Columns boardId={boardId}/>
  )
}
