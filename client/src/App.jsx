import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import Practice from './pages/Practice';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import Settings from './pages/Settings';
import Lessons from './pages/Lessons';
import Login from './pages/Login';

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <Router>
          <div className="min-h-screen flex flex-col font-sans">
            <Navbar />
            <main className="flex-1 overflow-auto">
              <Routes>
                <Route path="/" element={<Practice />} />
                <Route path="/practice" element={<Practice />} />
                <Route path="/lessons" element={<Lessons />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/stats" element={<Dashboard />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/login" element={<Login />} />
              </Routes>
            </main>
          </div>
        </Router>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
