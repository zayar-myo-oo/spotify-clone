import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useLibraryStore } from "@/stores/useLibraryStore";
import { Plus } from "lucide-react";
import { useState } from "react";

const CreatePlaylistDialog = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const { createPlaylist, isLoading } = useLibraryStore();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (name.trim()) {
			await createPlaylist(name.trim(), description.trim());
			setName("");
			setDescription("");
			setIsOpen(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					size="sm"
					className="h-8 w-8 p-0 text-zinc-400 hover:text-white hover:bg-zinc-800"
				>
					<Plus className="h-4 w-4" />
				</Button>
			</DialogTrigger>
			<DialogContent className="bg-zinc-900 border-zinc-800">
				<DialogHeader>
					<DialogTitle className="text-white">Create Playlist</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<Input
							placeholder="Playlist name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400"
							required
						/>
					</div>
					<div>
						<Input
							placeholder="Description (optional)"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400"
						/>
					</div>
					<div className="flex justify-end gap-2">
						<Button
							type="button"
							variant="ghost"
							onClick={() => setIsOpen(false)}
							className="text-white hover:bg-zinc-800"
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={isLoading || !name.trim()}
							className="bg-green-600 hover:bg-green-700 text-white"
						>
							{isLoading ? "Creating..." : "Create"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default CreatePlaylistDialog;