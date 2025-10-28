import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { axiosInstance } from "@/lib/axios";
import { Check, X, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface ArtistRequest {
	_id: string;
	userId: {
		_id: string;
		fullName: string;
		imageUrl: string;
	};
	artistName: string;
	originalName: string;
	sampleSongUrl: string;
	profilePhotoUrl: string;
	socialMediaAccounts: {
		facebook?: string;
		instagram?: string;
		twitter?: string;
		youtube?: string;
	};
	status: "pending" | "approved" | "rejected";
	createdAt: string;
}

const ArtistRequestsTable = () => {
	const [requests, setRequests] = useState<ArtistRequest[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const fetchRequests = async () => {
		try {
			const response = await axiosInstance.get("/artist-requests");
			setRequests(response.data);
		} catch (error) {
			toast.error("Failed to fetch requests");
		} finally {
			setIsLoading(false);
		}
	};

	const handleApprove = async (requestId: string) => {
		try {
			await axiosInstance.put(`/artist-requests/${requestId}/approve`);
			toast.success("Artist request approved!");
			fetchRequests();
		} catch (error) {
			toast.error("Failed to approve request");
		}
	};

	const handleReject = async (requestId: string) => {
		try {
			await axiosInstance.put(`/artist-requests/${requestId}/reject`);
			toast.success("Artist request rejected!");
			fetchRequests();
		} catch (error) {
			toast.error("Failed to reject request");
		}
	};

	useEffect(() => {
		fetchRequests();
	}, []);

	if (isLoading) {
		return <div className="text-center py-8 text-zinc-400">Loading requests...</div>;
	}

	return (
		<Table>
			<TableHeader>
				<TableRow className="hover:bg-zinc-800/50">
					<TableHead>User</TableHead>
					<TableHead>Profile Photo</TableHead>
					<TableHead>Artist Name</TableHead>
					<TableHead>Original Name</TableHead>
					<TableHead>Sample Song</TableHead>
					<TableHead>Status</TableHead>
					<TableHead>Date</TableHead>
					<TableHead className="text-right">Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{requests.map((request) => (
					<TableRow key={request._id} className="hover:bg-zinc-800/50">
						<TableCell>
							<div className="flex items-center gap-2">
								<img src={request.userId.imageUrl} alt={request.userId.fullName} className="w-8 h-8 rounded-full" />
								<span>{request.userId.fullName}</span>
							</div>
						</TableCell>
						<TableCell>
							<img src={request.profilePhotoUrl} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
						</TableCell>
						<TableCell className="font-medium">{request.artistName}</TableCell>
						<TableCell>{request.originalName}</TableCell>
						<TableCell>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => window.open(request.sampleSongUrl, '_blank')}
								className="text-blue-400 hover:text-blue-300"
							>
								<ExternalLink className="h-4 w-4" />
							</Button>
						</TableCell>
						<TableCell>
							<span className={`px-2 py-1 rounded text-xs ${
								request.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
								request.status === 'approved' ? 'bg-green-500/20 text-green-400' :
								'bg-red-500/20 text-red-400'
							}`}>
								{request.status}
							</span>
						</TableCell>
						<TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
						<TableCell className="text-right">
							{request.status === 'pending' && (
								<div className="flex gap-2 justify-end">
									<Button
										variant="ghost"
										size="sm"
										onClick={() => handleApprove(request._id)}
										className="text-green-400 hover:text-green-300 hover:bg-green-400/10"
									>
										<Check className="h-4 w-4" />
									</Button>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => handleReject(request._id)}
										className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
									>
										<X className="h-4 w-4" />
									</Button>
								</div>
							)}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};

export default ArtistRequestsTable;