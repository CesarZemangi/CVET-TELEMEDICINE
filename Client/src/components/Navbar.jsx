import { useNavigate } from 'react-router-dom';
import { handleLogout } from '../utils/auth';

const Navbar = () => {
  const navigate = useNavigate();

  const onLogoutClick = () => {
    // We pass navigate to the helper so it can move the user to /login
    handleLogout(navigate);
  };

  return (
    <nav className="navbar">
      <div className="logo">CVET-Telemedicine</div>
      <div className="nav-links">
        {/* ... other links like Dashboard or Profile ... */}
        <button 
          onClick={onLogoutClick} 
          className="btn-logout"
          style={{ cursor: 'pointer', color: 'red', border: 'none', background: 'none' }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;