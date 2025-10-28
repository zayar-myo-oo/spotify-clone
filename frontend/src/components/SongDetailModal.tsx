import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Song } from "@/types";
import { Heart, Play, Plus, Share } from "lucide-react";
import { usePlayerStore } from "@/stores/usePlayerStore";

interface SongDetailModalProps {
	song: Song | null;
	isOpen: boolean;
	onClose: () => void;
}

const SongDetailModal = ({ song, isOpen, onClose }: SongDetailModalProps) => {
	const { setCurrentSong } = usePlayerStore();

	if (!song) return null;

	const handlePlay = () => {
		setCurrentSong(song);
		onClose();
	};

	const formatDuration = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="bg-gradient-to-b from-zinc-800 to-zinc-900 border-zinc-700 max-w-md p-0 overflow-hidden">
				{/* Cover Image */}
				<div className="relative">
					<img 
						src={song.imageUrl} 
						alt={song.title}
						className="w-full h-64 object-cover"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
					<Button
						onClick={onClose}
						variant="ghost"
						size="sm"
						className="absolute top-4 right-4 text-white hover:bg-white/20"
					>
						×
					</Button>
				</div>

				{/* Song Info */}
				<div className="p-6 space-y-4">
					<div>
						<h2 className="text-2xl font-bold text-white mb-1">{song.title}</h2>
						<p className="text-zinc-400 text-lg">{song.artist}</p>
					</div>

					{/* Action Buttons */}
					<div className="flex items-center gap-3">
						<Button
							onClick={handlePlay}
							size="lg"
							className="bg-emerald-500 hover:bg-emerald-600 text-black rounded-full h-12 w-12 p-0"
						>
							<Play className="h-5 w-5 fill-current" />
						</Button>
						<Button
							variant="ghost"
							size="lg"
							className="text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full h-12 w-12 p-0"
						>
							<Heart className="h-5 w-5" />
						</Button>
						<Button
							variant="ghost"
							size="lg"
							className="text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full h-12 w-12 p-0"
						>
							<Plus className="h-5 w-5" />
						</Button>
						<Button
							variant="ghost"
							size="lg"
							className="text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full h-12 w-12 p-0"
						>
							<Share className="h-5 w-5" />
						</Button>
					</div>

					{/* Song Details */}
					<div className="space-y-3 pt-4 border-t border-zinc-700">
						<div className="flex justify-between text-sm">
							<span className="text-zinc-400">Duration</span>
							<span className="text-white">{formatDuration(song.duration)}</span>
						</div>
						<div className="flex justify-between text-sm">
							<span className="text-zinc-400">Release Date</span>
							<span className="text-white">{new Date(song.createdAt).toLocaleDateString()}</span>
						</div>
						{song.albumId && (
							<div className="flex justify-between text-sm">
								<span className="text-zinc-400">Album</span>
								<span className="text-white">Album Name</span>
							</div>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default SongDetailModal;