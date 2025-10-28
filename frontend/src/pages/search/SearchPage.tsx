import Topbar from "@/components/Topbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useCallback } from "react";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useLibraryStore } from "@/stores/useLibraryStore";
import { Button } from "@/components/ui/button";
import { Heart, MoreHorizontal, Pause, Play, Plus, Search } from "lucide-react";
import { Song } from "@/types";
import AddToPlaylistDialog from "@/components/AddToPlaylistDialog";

const SearchPage = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedSongForPlaylist, setSelectedSongForPlaylist] = useState<Song | null>(null);
  
  const { searchSongs, searchResults, isLoading, clearSearchResults } = useMusicStore();
  const {
    currentSong,
    isPlaying,
    setCurrentSong,
    togglePlay,
    initializeQueue,
  } = usePlayerStore();
  const { toggleLikeSong, userLibrary } = useLibraryStore();

  // Debounce search to avoid too many API calls
  const debounceSearch = useCallback(
    (query: string) => {
      const timer = setTimeout(() => {
        if (query.trim()) {
          searchSongs(query);
        } else {
          clearSearchResults();
        }
      }, 300);

      return () => clearTimeout(timer);
    },
    [searchSongs, clearSearchResults]
  );

  useEffect(() => {
    const cleanup = debounceSearch(searchKeyword);
    return cleanup;
  }, [searchKeyword, debounceSearch]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  const handlePlaySong = (song: Song) => {
    const isCurrentSong = currentSong?._id === song._id;

    if (isCurrentSong) {
      togglePlay();
    } else {
      // Initialize queue with search results and play the selected song
      initializeQueue(searchResults);
      setCurrentSong(song);
    }
  };

  const isLiked = (songId: string) => {
    return userLibrary?.likedSongs.some(song => song._id === songId) || false;
  };

  const PlayButton = ({ song }: { song: Song }) => {
    const isCurrentSong = currentSong?._id === song._id;

    return (
      <Button
        size="icon"
        onClick={() => handlePlaySong(song)}
        className={`absolute bottom-3 right-2 bg-green-500 hover:bg-green-400 hover:scale-105 transition-all 
          opacity-0 translate-y-2 group-hover:translate-y-0 ${
            isCurrentSong ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
      >
        {isCurrentSong && isPlaying ? (
          <Pause className="size-5 text-black" />
        ) : (
          <Play className="size-5 text-black" />
        )}
      </Button>
    );
  };

  return (
    <main className="rounded-md overflow-hidden h-full bg-gradient-to-b from-zinc-800 to-zinc-900">
      <Topbar />
      <ScrollArea className="h-[calc(100vh-180px)]">
        <div className="p-4 sm:p-6">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
              <Input
                value={searchKeyword}
                onChange={handleSearch}
                className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400 h-12 text-base"
                placeholder="What do you want to listen to?"
              />
            </div>
          </div>

          <div className="space-y-8">
            {!searchKeyword.trim() && (
              <div className="text-center text-zinc-400 mt-16">
                <Search className="mx-auto h-16 w-16 mb-4 text-zinc-600" />
                <h2 className="text-2xl font-bold mb-2">
                  Search for songs and artists
                </h2>
                <p>
                  Find your favorite music by typing in the search box above.
                </p>
              </div>
            )}

            {searchKeyword.trim() && isLoading && (
              <div className="text-center text-zinc-400 mt-16">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
                <p>Searching for "{searchKeyword}"...</p>
              </div>
            )}

            {searchKeyword.trim() &&
              !isLoading &&
              searchResults.length === 0 && (
                <div className="text-center text-zinc-400 mt-16">
                  <Search className="mx-auto h-16 w-16 mb-4 text-zinc-600" />
                  <h2 className="text-xl font-bold mb-2">No results found</h2>
                  <p>Try searching for something else.</p>
                </div>
              )}

            {searchResults.length > 0 && (
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-4">
                  Search Results ({searchResults.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {searchResults.map((song) => {
                    const songIsLiked = isLiked(song._id);
                    
                    return (
                      <div
                        key={song._id}
                        className="bg-zinc-800/40 p-4 rounded-md hover:bg-zinc-700/40 transition-all group cursor-pointer"
                      >
                        <div className="relative mb-4">
                          <div className="aspect-square rounded-md shadow-lg overflow-hidden">
                            <img
                              src={song.imageUrl}
                              alt={song.title}
                              className="w-full h-full object-cover transition-transform duration-300 
                              group-hover:scale-105"
                            />
                          </div>
                          <PlayButton song={song} />
                        </div>
                        
                        <h3 className="font-medium mb-2 truncate">
                          {song.title}
                        </h3>
                        <p className="text-sm text-zinc-400 truncate mb-3">
                          {song.artist}
                        </p>

                        {/* Action buttons */}
                        <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-zinc-400 hover:text-white"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleLikeSong(song._id);
                              }}
                            >
                              <Heart 
                                className={`h-4 w-4 ${songIsLiked ? 'fill-green-500 text-green-500' : ''}`} 
                              />
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-zinc-400 hover:text-white"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedSongForPlaylist(song);
                              }}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-zinc-400 hover:text-white"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>

      {/* Add to Playlist Dialog */}
      {selectedSongForPlaylist && (
        <AddToPlaylistDialog
          song={selectedSongForPlaylist}
          isOpen={!!selectedSongForPlaylist}
          onClose={() => setSelectedSongForPlaylist(null)}
        />
      )}
    </main>
  );
};

export default SearchPage;
