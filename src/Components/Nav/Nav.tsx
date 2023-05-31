import { useNavigate,Link } from 'react-router-dom'
import { LogOut , Table} from 'react-feather';
import './nav.css'

export default function Nav() {
  
  const navigate = useNavigate()

  const logout = () : void => {
    localStorage.removeItem('accessToken')
    navigate('/login')
  }


  return (
    <div className='nav'>
        <div className="nav__row">
            <h1>Boardify</h1>
            <Link 
            className='nav__link'
            to={'/boards'}>
                Dashboard
                <Table/>
            </Link>
            <button onClick={logout} className='nav__logout'>
                <span>Log out</span>
                <LogOut/>
            </button>
        </div>
    </div>
  )
}
