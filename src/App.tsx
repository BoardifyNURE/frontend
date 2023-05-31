import { Routes,Route  } from "react-router-dom";
import BoardPage from "./pages/board/BoardPage";
import Login from './pages/login/Login'
import Registration from "./pages/registration/Registration";
import BoardsPage from "./pages/boards/BoardsPage";

function App() {
  return (
    <Routes >
      <Route path="/boards" element={<BoardsPage />}/>
      <Route path="/boards/:id" element={<BoardPage />}/>
      <Route path="/login" element={<Login />}/>
      <Route path="/registration" element={<Registration />}/>
      <Route path="/*" element={<BoardsPage />}/>
    </Routes>
  )
  
  ;
}

export default App;
