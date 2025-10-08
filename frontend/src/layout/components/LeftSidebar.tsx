import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import LibrarySection from "@/components/LibrarySection";
import { SignedIn } from "@clerk/clerk-react";
import { HomeIcon, MessageCircle, SearchIcon } from "lucide-react";
import { Link } from "react-router-dom";

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
