import { useState, useEffect, useContext } from 'react';
import { Trophy, Medal, Star, Loader2 } from 'lucide-react';
import { getLeaderboard } from '../api/client';
import { AuthContext } from '../context/auth-context';

const Leaderboard = () => {
  const { user } = useContext(AuthContext);
  const [filter, setFilter] = useState('all-time');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getLeaderboard(filter)
      .then((data) => {
        const withCurrentUser = data.map((entry) => ({
          ...entry,
          isCurrentUser: user && entry.username === user.username,
        }));
        setLeaderboardData(withCurrentUser);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [filter, user]);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 2: return <Medal className="w-5 h-5 text-slate-300" />;
      case 3: return <Medal className="w-5 h-5 text-amber-600" />;
      default: return <span className="font-bold text-slate-400">#{rank}</span>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
            <Trophy className="w-8 h-8 text-yellow-400 mr-3" />
            Global Leaderboard
          </h1>
          <p className="text-slate-400">Top typists by best WPM (logged-in users).</p>
        </div>

        <div className="flex space-x-2 bg-slate-800 p-1 rounded-lg mt-4 md:mt-0">
          {['all-time', 'this-week', 'today'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === f ? 'bg-red-500 text-slate-900' : 'text-slate-400 hover:text-slate-200'}`}
            >
              {f.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden backdrop-blur-sm">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-red-500" />
          </div>
        ) : leaderboardData.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            No leaderboard entries yet. Sign in and complete a test to appear here.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/80 text-slate-400 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold text-center w-24">Rank</th>
                <th className="p-4 font-semibold">Username</th>
                <th className="p-4 font-semibold text-right">WPM</th>
                <th className="p-4 font-semibold text-right">Accuracy</th>
                <th className="p-4 font-semibold text-right">Tests Played</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {leaderboardData.map((entry) => (
                <tr
                  key={entry.rank}
                  className={`transition-colors hover:bg-slate-700/30 ${entry.isCurrentUser ? 'bg-red-900/20 border-l-4 border-l-red-500' : ''}`}
                >
                  <td className="p-4 text-center">
                    <div className="flex justify-center items-center">
                      {getRankIcon(entry.rank)}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <span className={`font-bold ${entry.isCurrentUser ? 'text-red-500' : 'text-slate-200'}`}>
                        {entry.username}
                      </span>
                      {entry.rank <= 3 && <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />}
                    </div>
                  </td>
                  <td className="p-4 text-right font-mono font-bold text-lg text-slate-100">{entry.wpm}</td>
                  <td className="p-4 text-right font-mono text-slate-300">{entry.accuracy}%</td>
                  <td className="p-4 text-right font-mono text-slate-400">{entry.tests.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
