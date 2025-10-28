import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/lib/axios";
import { Music } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const ArtistRequestDialog = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		artistName: "",
		originalName: "",
		facebook: "",
		instagram: "",
		twitter: "",
		youtube: "",
	});
	const [sampleSong, setSampleSong] = useState<File | null>(null);
	const [profilePhoto, setProfilePhoto] = useState<File | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!sampleSong || !profilePhoto) {
			toast.error("Please upload both sample song and profile photo");
			return;
		}

		setIsLoading(true);
		try {
			const data = new FormData();
			data.append("artistName", formData.artistName);
			data.append("originalName", formData.originalName);
			data.append("socialMediaAccounts", JSON.stringify({
				facebook: formData.facebook,
				instagram: formData.instagram,
				twitter: formData.twitter,
				youtube: formData.youtube,
			}));
			data.append("sampleSong", sampleSong);
			data.append("profilePhoto", profilePhoto);

			await axiosInstance.post("/artist-requests", data);
			toast.success("Artist request submitted successfully!");
			setIsOpen(false);
			setFormData({
				artistName: "",
				originalName: "",
				facebook: "",
				instagram: "",
				twitter: "",
				youtube: "",
			});
			setSampleSong(null);
			setProfilePhoto(null);
		} catch (error: any) {
			toast.error(error.response?.data?.message || "Failed to submit request");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button className="bg-emerald-500 hover:bg-emerald-600 text-black">
					<Music className="mr-2 h-4 w-4" />
					Become an Artist
				</Button>
			</DialogTrigger>

			<DialogContent className="bg-zinc-900 max-w-md max-h-[80vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Artist Account Request</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
					<Input
						placeholder="Artist Name"
						value={formData.artistName}
						onChange={(e) => setFormData({ ...formData, artistName: e.target.value })}
						className="bg-zinc-800 border-zinc-700"
						required
					/>

					<Input
						placeholder="Original Name"
						value={formData.originalName}
						onChange={(e) => setFormData({ ...formData, originalName: e.target.value })}
						className="bg-zinc-800 border-zinc-700"
						required
					/>

					<div className="space-y-2">
						<label className="text-sm font-medium">Profile Photo (Required)</label>
						<Input
							type="file"
							accept="image/*"
							onChange={(e) => setProfilePhoto(e.target.files?.[0] || null)}
							className="bg-zinc-800 border-zinc-700"
							required
						/>
					</div>

					<div className="space-y-2">
						<label className="text-sm font-medium">Sample Song (Required)</label>
						<Input
							type="file"
							accept="audio/*"
							onChange={(e) => setSampleSong(e.target.files?.[0] || null)}
							className="bg-zinc-800 border-zinc-700"
							required
						/>
					</div>

					<div className="space-y-2">
						<label className="text-sm font-medium">Social Media (Optional)</label>
						<Input
							placeholder="Facebook URL"
							value={formData.facebook}
							onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
							className="bg-zinc-800 border-zinc-700"
						/>
						<Input
							placeholder="Instagram URL"
							value={formData.instagram}
							onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
							className="bg-zinc-800 border-zinc-700"
						/>
						<Input
							placeholder="Twitter URL"
							value={formData.twitter}
							onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
							className="bg-zinc-800 border-zinc-700"
						/>
						<Input
							placeholder="YouTube URL"
							value={formData.youtube}
							onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
							className="bg-zinc-800 border-zinc-700"
						/>
					</div>

					<div className="flex gap-2">
						<Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
							Cancel
						</Button>
						<Button type="submit" disabled={isLoading} className="flex-1">
							{isLoading ? "Submitting..." : "Submit Request"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default ArtistRequestDialog;