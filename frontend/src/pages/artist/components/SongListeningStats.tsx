import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useArtistStore } from "@/stores/useArtistStore";
import { BarChart3, Calendar, Clock, TrendingUp } from "lucide-react";

const SongListeningStats = () => {
  const { songs, isLoading } = useArtistStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-zinc-400">Loading stats...</div>
      </div>
    );
  }

  const totalListens = songs.reduce((sum, song) => sum + (song.playCount || 0), 0);

  return (
    <div className="bg-zinc-800/50 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="h-5 w-5 text-emerald-500" />
        <h2 className="text-xl font-semibold text-white">Song Listening Statistics</h2>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-zinc-700/50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            <span className="text-sm text-zinc-400">Total Listens</span>
          </div>
          <p className="text-2xl font-bold text-white">{totalListens.toLocaleString()}</p>
        </div>
        <div className="bg-zinc-700/50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-zinc-400">Daily Average</span>
          </div>
          <p className="text-2xl font-bold text-white">{Math.floor(totalListens / 30).toLocaleString()}</p>
        </div>
        <div className="bg-zinc-700/50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-purple-500" />
            <span className="text-sm text-zinc-400">Weekly Average</span>
          </div>
          <p className="text-2xl font-bold text-white">{Math.floor(totalListens / 4).toLocaleString()}</p>
        </div>
        <div className="bg-zinc-700/50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-orange-500" />
            <span className="text-sm text-zinc-400">Top Song</span>
          </div>
          <p className="text-lg font-bold text-white truncate">
            {songs.sort((a, b) => (b.playCount || 0) - (a.playCount || 0))[0]?.title || "N/A"}
          </p>
        </div>
      </div>

      {/* Detailed Table */}
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-zinc-800/50">
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Song</TableHead>
            <TableHead className="text-center">Daily</TableHead>
            <TableHead className="text-center">Weekly</TableHead>
            <TableHead className="text-center">Monthly</TableHead>
            <TableHead className="text-center">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {songs
            .sort((a, b) => (b.playCount || 0) - (a.playCount || 0))
            .map((song) => (
              <TableRow key={song._id} className="hover:bg-zinc-800/50">
                <TableCell>
                  <img src={song.imageUrl} alt={song.title} className="size-10 rounded object-cover" />
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-white">{song.title}</p>
                    <p className="text-sm text-zinc-400">{song.artist}</p>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <span className="text-emerald-400 font-medium">{Math.floor((song.playCount || 0) / 30).toLocaleString()}</span>
                </TableCell>
                <TableCell className="text-center">
                  <span className="text-blue-400 font-medium">{(song.weeklyPlays || 0).toLocaleString()}</span>
                </TableCell>
                <TableCell className="text-center">
                  <span className="text-purple-400 font-medium">{(song.monthlyPlays || 0).toLocaleString()}</span>
                </TableCell>
                <TableCell className="text-center">
                  <span className="text-orange-400 font-bold">{(song.playCount || 0).toLocaleString()}</span>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      {songs.length === 0 && (
        <div className="text-center py-8 text-zinc-400">
          No songs found
        </div>
      )}
    </div>
  );
};

export default SongListeningStats;