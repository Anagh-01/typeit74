import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Keyboard, User, Trophy, BookOpen, Settings, LogOut, LogIn } from 'lucide-react';
import { AuthContext } from '../context/auth-context';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-slate-900 border-b border-slate-800">
      <Link to="/" className="flex items-center space-x-2 text-red-500 font-bold text-xl hover:text-red-400 transition-colors">
        <Keyboard className="w-6 h-6" />
        <span>Typeit74</span>
      </Link>

      <div className="flex items-center space-x-6 text-slate-300 font-medium">
        <Link to="/practice" className="hover:text-white flex items-center space-x-1">
          <Keyboard className="w-4 h-4" />
          <span>Practice</span>
        </Link>
        <Link to="/lessons" className="hover:text-white flex items-center space-x-1">
          <BookOpen className="w-4 h-4" />
          <span>Lessons</span>
        </Link>
        <Link to="/leaderboard" className="hover:text-white flex items-center space-x-1">
          <Trophy className="w-4 h-4" />
          <span>Leaderboard</span>
        </Link>
        <Link to="/stats" className="hover:text-white flex items-center space-x-1">
          <User className="w-4 h-4" />
          <span>Profile</span>
        </Link>
        <Link to="/settings" className="hover:text-white flex items-center space-x-1">
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </Link>

        {user ? (
          <div className="flex items-center space-x-3 pl-4 border-l border-slate-700">
            <span className="text-red-400 text-sm font-semibold">{user.username}</span>
            <button
              onClick={logout}
              className="hover:text-white flex items-center space-x-1 text-slate-400"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Link to="/login" className="hover:text-white flex items-center space-x-1 text-red-400">
            <LogIn className="w-4 h-4" />
            <span>Login</span>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
