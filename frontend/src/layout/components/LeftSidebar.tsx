import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import LibrarySection from "@/components/LibrarySection";
import ArtistRequestDialog from "@/components/ArtistRequestDialog";
import { SignedIn } from "@clerk/clerk-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { HomeIcon, MessageCircle, Music, SearchIcon, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const ArtistRequestSection = () => {
	const { isAdmin, isArtist } = useAuthStore();

	if (isAdmin) {
		return (
			<div className='rounded-lg bg-zinc-900 p-4'>
				<Link
					to='/admin'
					className={cn(
						buttonVariants({
							variant: "default",
							className: "w-full justify-start bg-blue-500 hover:bg-blue-600 text-white",
						})
					)}
				>
					<Music className='mr-2 size-4' />
					Admin Dashboard
				</Link>
			</div>
		);
	}

	if (isArtist) {
		return (
			<div className='rounded-lg bg-zinc-900 p-4'>
				<Link
					to='/artist'
					className={cn(
						buttonVariants({
							variant: "default",
							className: "w-full justify-start bg-emerald-500 hover:bg-emerald-600 text-black",
						})
					)}
				>
					<Music className='mr-2 size-4' />
					Artist Dashboard
				</Link>
			</div>
		);
	}

	return (
		<div className='rounded-lg bg-zinc-900 p-4'>
			<ArtistRequestDialog />
		</div>
	);
};

const LeftSidebar = () => {
	return (
		<div className='h-full flex flex-col gap-2'>
			{/* Navigation menu */}
			<div className='rounded-lg bg-zinc-900 p-4'>
				<div className='space-y-2'>
					<Link
						to={"/"}
						className={cn(
							buttonVariants({
								variant: "ghost",
								className: "w-full justify-start text-white hover:bg-zinc-800",
							})
						)}
					>
						<HomeIcon className='mr-2 size-5' />
						<span className='hidden md:inline'>Home</span>
					</Link>
					<Link
						to={"/search"}
						className={cn(
							buttonVariants({
								variant: "ghost",
								className: "w-full justify-start text-white hover:bg-zinc-800",
							})
						)}
					>
						<SearchIcon className='mr-2 size-5' />
						<span className='hidden md:inline'>Search</span>
					</Link>

					<Link
						to={"/charts"}
						className={cn(
							buttonVariants({
								variant: "ghost",
								className: "w-full justify-start text-white hover:bg-zinc-800",
							})
						)}
					>
						<TrendingUp className='mr-2 size-5' />
						<span className='hidden md:inline'>Charts</span>
					</Link>

					<SignedIn>
						<Link
							to={"/chat"}
							className={cn(
								buttonVariants({
									variant: "ghost",
									className: "w-full justify-start text-white hover:bg-zinc-800",
								})
							)}
						>
							<MessageCircle className='mr-2 size-5' />
							<span className='hidden md:inline'>Messages</span>
						</Link>
					</SignedIn>
				</div>
			</div>

			{/* Artist Request */}
			<SignedIn>
				<ArtistRequestSection />
			</SignedIn>

			{/* Library section */}
			<div className='flex-1 rounded-lg bg-zinc-900 overflow-hidden'>
				<SignedIn>
					<LibrarySection />
				</SignedIn>
			</div>
		</div>
	);
};
export default LeftSidebar;
