import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { login, register } from '../api/client';
import { Keyboard, Loader2 } from 'lucide-react';

const Login = () => {
  const { login: setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tab, setTab] = useState('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = tab === 'login'
        ? await login(email, password)
        : await register(username, email, password);
      setAuth(data);
      navigate('/stats');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <div className="text-center mb-8">
        <Keyboard className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white">Welcome to Typeit74</h1>
        <p className="text-slate-400 mt-2">Sign in to save your progress and climb the leaderboard.</p>
      </div>

      <div className="flex bg-slate-900 p-1 rounded-lg mb-6">
        {['login', 'register'].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => { setTab(t); setError(''); }}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${tab === t ? 'bg-red-500 text-slate-900' : 'text-slate-400 hover:text-slate-200'}`}
          >
            {t === 'login' ? 'Login' : 'Register'}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6 space-y-4">
        {tab === 'register' && (
          <div>
            <label className="block text-sm text-slate-400 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-red-500 outline-none"
            />
          </div>
        )}
        <div>
          <label className="block text-sm text-slate-400 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-red-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-red-500 outline-none"
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-500 hover:bg-red-400 text-slate-900 font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {tab === 'login' ? 'Sign In' : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-slate-500 text-sm mt-6">
        <Link to="/" className="text-red-400 hover:text-red-300">Continue as guest</Link>
      </p>
    </div>
  );
};

export default Login;
