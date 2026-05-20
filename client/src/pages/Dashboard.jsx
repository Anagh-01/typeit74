import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trophy, Clock, Target, Activity, Loader2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { getUserStats } from '../api/client';

const statColorClasses = {
  yellow: { bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
  green: { bg: 'bg-green-500/20', text: 'text-green-400' },
  red: { bg: 'bg-red-500/20', text: 'text-red-400' },
  purple: { bg: 'bg-purple-500/20', text: 'text-purple-400' },
};

const StatCard = ({ title, value, icon: Icon, color }) => {
  const classes = statColorClasses[color] || statColorClasses.red;
  return (
    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-400 font-medium">{title}</h3>
        <div className={`p-2 rounded-lg ${classes.bg} ${classes.text}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="text-3xl font-bold">{value}</div>
    </div>
  );
};

const formatTime = (minutes) => {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
};

const Dashboard = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    setError(null);
    getUserStats()
      .then(setStats)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user]);

  if (authLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-lg text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Your Dashboard</h1>
        <p className="text-slate-400 mb-8">Sign in to track your typing progress, WPM trends, and stats over time.</p>
        <Link
          to="/login"
          className="inline-block bg-red-500 hover:bg-red-400 text-slate-900 font-bold py-3 px-8 rounded-full transition-colors"
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
      </div>
    );
  }

  const chartData = stats?.chartData?.length ? stats.chartData : [];
  const xpForLevel = (stats?.level || 1) * 200;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Your Dashboard</h1>
          <p className="text-slate-400">Track your progress and typing stats.</p>
        </div>
        <div className="bg-slate-800 px-4 py-2 rounded-full border border-slate-700 flex items-center space-x-2">
          <span className="text-sm text-slate-400">Level {stats?.level ?? user.level ?? 1}</span>
          <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-500"
              style={{ width: `${Math.min(100, ((stats?.xp ?? 0) % xpForLevel) / xpForLevel * 100)}%` }}
            />
          </div>
          <span className="text-sm font-bold text-red-500">{stats?.xp ?? 0} XP</span>
        </div>
      </div>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Highest WPM" value={stats?.highestWpm ?? 0} icon={Trophy} color="yellow" />
        <StatCard title="Avg. Accuracy" value={`${stats?.avgAccuracy ?? 0}%`} icon={Target} color="green" />
        <StatCard title="Tests Taken" value={stats?.testsTaken ?? 0} icon={Activity} color="red" />
        <StatCard title="Time Typed" value={formatTime(stats?.timeTypedMinutes ?? 0)} icon={Clock} color="purple" />
      </div>

      <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm mb-8">
        <h3 className="text-xl font-bold mb-6">WPM & Accuracy Trend (Last 7 Days)</h3>
        <div className="h-[300px] w-full">
          {chartData.some((d) => d.wpm > 0) ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" stroke="#06b6d4" tick={{ fill: '#06b6d4' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="#22c55e" tick={{ fill: '#22c55e' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line yAxisId="left" type="monotone" dataKey="wpm" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4, fill: '#06b6d4' }} activeDot={{ r: 8 }} />
                <Line yAxisId="right" type="monotone" dataKey="accuracy" stroke="#22c55e" strokeWidth={3} dot={{ r: 4, fill: '#22c55e' }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500">
              Complete a practice test to see your trends here.
            </div>
          )}
        </div>
      </div>

      <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
        <h3 className="text-xl font-bold mb-6">Recent Tests</h3>
        {stats?.recentTests?.length > 0 ? (
          <ul className="space-y-2">
            {stats.recentTests.map((test, i) => (
              <li key={i} className="flex justify-between text-slate-300 py-2 border-b border-slate-700/50 last:border-0">
                <span className="capitalize">{test.mode}</span>
                <span className="font-mono">{test.wpm} WPM · {test.accuracy}%</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-500">No tests yet. Head to Practice to get started.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
