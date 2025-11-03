import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useMusicStore } from '@/stores/useMusicStore';
import { Crown, TrendingUp } from 'lucide-react';

const TopArtistsChart = () => {
  const { adminAnalytics } = useMusicStore();
  const { artistStats, monthlyTrends } = adminAnalytics;
  
  const topArtists = artistStats.slice(0, 8);

  // Colors for pie chart
  const COLORS = ['#EAB308', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EF4444', '#F97316', '#06B6D4'];

  const trendData = monthlyTrends;

  return (
    <div className="space-y-6">
      {/* Artist Distribution Pie Chart */}
      <div className="bg-zinc-800/50 rounded-lg p-6 w-full">
        <div className="flex items-center gap-2 mb-6">
          <Crown className="h-5 w-5 text-yellow-500" />
          <h2 className="text-xl font-semibold text-white">Top Artists Distribution</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topArtists}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={40}
                  paddingAngle={2}
                  dataKey="totalListens"
                >
                  {topArtists.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F3F4F6'
                  }}
                  formatter={(value: number) => [`${value.toLocaleString()} listens`, 'Total Listens']}
                />
                <Legend 
                  wrapperStyle={{ color: '#9CA3AF' }}
                  formatter={(value) => value.length > 15 ? value.substring(0, 15) + '...' : value}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Artist Rankings */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white mb-4">Artist Rankings</h3>
            {topArtists.map((artist, index) => (
              <div key={artist.name} className="flex items-center gap-3 p-3 bg-zinc-700/30 rounded-lg">
                <div className="flex items-center justify-center w-8 h-8 rounded-full" 
                     style={{ backgroundColor: COLORS[index % COLORS.length] }}>
                  <span className="font-bold text-sm text-white">#{index + 1}</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white truncate">{artist.name}</p>
                  <p className="text-sm text-zinc-400">{artist.totalListens.toLocaleString()} listens</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-zinc-400">{artist.songCount} songs</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Listening Trends Area Chart */}
      <div className="bg-zinc-800/50 rounded-lg p-6 w-full">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="h-5 w-5 text-emerald-500" />
          <h2 className="text-xl font-semibold text-white">Platform Listening Trends</h2>
        </div>
        
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorListens" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="month"
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF' }}
              />
              <YAxis 
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }}
                formatter={(value: number) => [`${value.toLocaleString()}`, 'Total Listens']}
              />
              <Area 
                type="monotone" 
                dataKey="listens" 
                stroke="#10B981" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorListens)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {topArtists.length === 0 && (
        <div className="text-center py-8 text-zinc-400">
          No artist data available
        </div>
      )}
    </div>
  );
};

export default TopArtistsChart;