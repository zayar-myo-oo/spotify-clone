import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChatStore } from "@/stores/useChatStore";

const ChatHeader = () => {
	const { selectedUser, onlineUsers } = useChatStore();

	if (!selectedUser) return null;

	return (
		<div className='p-4 border-b border-zinc-800'>
			<div className='flex items-center gap-3'>
				<div className='relative'>
					<Avatar>
						<AvatarImage src={selectedUser.imageUrl} />
						<AvatarFallback>{selectedUser.fullName[0]}</AvatarFallback>
					</Avatar>
					<div
						className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-zinc-900 ${
							onlineUsers.has(selectedUser.clerkId) ? "bg-green-500" : "bg-zinc-500"
						}`}
					/>
				</div>
				<div>
					<h2 className='font-medium'>{selectedUser.fullName}</h2>
					<p className='text-sm text-zinc-400'>
						{onlineUsers.has(selectedUser.clerkId) ? "Online" : "Offline"}
					</p>
				</div>
			</div>
		</div>
	);
};
export default ChatHeader;
