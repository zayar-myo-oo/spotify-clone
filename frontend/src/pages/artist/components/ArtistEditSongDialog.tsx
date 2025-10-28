import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useArtistStore } from "@/stores/useArtistStore";
import { Song } from "@/types";
import { useState, useEffect } from "react";

interface ArtistEditSongDialogProps {
	song: Song | null;
	isOpen: boolean;
	onClose: () => void;
}

const ArtistEditSongDialog = ({ song, isOpen, onClose }: ArtistEditSongDialogProps) => {
	const { updateSong, albums, isLoading } = useArtistStore();
	const [formData, setFormData] = useState({
		title: song?.title || "",
		albumId: song?.albumId || "none",
	});
	const [files, setFiles] = useState<{
		audio: File | null;
		image: File | null;
	}>({
		audio: null,
		image: null,
	});

	useEffect(() => {
		if (song) {
			setFormData({
				title: song.title,
				albumId: song.albumId || "none",
			});
			setFiles({ audio: null, image: null });
		}
	}, [song]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!song) return;

		const data = new FormData();
		data.append("title", formData.title);
		data.append("albumId", formData.albumId === "none" ? "" : formData.albumId);

		if (files.audio) {
			data.append("audioFile", files.audio);
		}
		if (files.image) {
			data.append("imageFile", files.image);
		}

		await updateSong(song._id, data);
		onClose();
	};

	if (!song) return null;

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="bg-zinc-900 max-w-md">
				<DialogHeader>
					<DialogTitle>Edit Song</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
					<Input
						placeholder="Song title"
						value={formData.title}
						onChange={(e) => setFormData({ ...formData, title: e.target.value })}
						className="bg-zinc-800 border-zinc-700"
						required
					/>

					<Select value={formData.albumId} onValueChange={(value) => setFormData({ ...formData, albumId: value })}>
						<SelectTrigger className="bg-zinc-800 border-zinc-700">
							<SelectValue placeholder="Select album (optional)" />
						</SelectTrigger>
						<SelectContent className="bg-zinc-800 border-zinc-700">
							<SelectItem value="none">No Album</SelectItem>
							{albums.map((album) => (
								<SelectItem key={album._id} value={album._id}>
									{album.title}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<div className="space-y-2">
						<label className="text-sm font-medium">Audio File (optional)</label>
						<Input
							type="file"
							accept="audio/*"
							onChange={(e) => setFiles({ ...files, audio: e.target.files?.[0] || null })}
							className="bg-zinc-800 border-zinc-700"
						/>
					</div>

					<div className="space-y-2">
						<label className="text-sm font-medium">Image File (optional)</label>
						<Input
							type="file"
							accept="image/*"
							onChange={(e) => setFiles({ ...files, image: e.target.files?.[0] || null })}
							className="bg-zinc-800 border-zinc-700"
						/>
					</div>

					<div className="flex gap-2">
						<Button type="button" variant="outline" onClick={onClose} className="flex-1">
							Cancel
						</Button>
						<Button type="submit" disabled={isLoading} className="flex-1">
							{isLoading ? "Updating..." : "Update Song"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default ArtistEditSongDialog;