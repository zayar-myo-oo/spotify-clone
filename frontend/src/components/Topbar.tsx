import {SignedOut, UserButton, useUser} from "@clerk/clerk-react";
import { LayoutDashboardIcon } from "lucide-react";
import { Link } from "react-router-dom";
import SignInOAuthButtons from "./SignInOAuthButtons";
import { useAuthStore } from "@/stores/useAuthStore";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import {useUserStore} from "@/stores/useUserStore.ts";

const Topbar = () => {
	const { isAdmin } = useAuthStore();
	const { user } = useUser();
	const {requestArtist} =useUserStore();
	console.log({ isAdmin });

	const requestArtistProfile = () => {
		if (!user) return;
		requestArtist(user?.id)
	}

	return (
		<div
			className='flex items-center justify-between p-4 sticky top-0 bg-zinc-900/75
      backdrop-blur-md z-10
    '
		>
			<div className='flex gap-2 items-center'>
				<img src='/spotify.png' className='size-8' alt='Spotify logo' />
				Spotify
			</div>
			<div className='flex items-center gap-4'>
				{isAdmin ? (
					<Link to={"/admin"} className={cn(buttonVariants({ variant: "outline" }))}>
						<LayoutDashboardIcon className='size-4  mr-2' />
						Admin Dashboard
					</Link>
				) : <button
								type="button"
								className="bg-green-500 text-white px-4 text-sm py-2 rounded-md"
								onClick={requestArtistProfile}
							>
								Request Artist Profile
							</button>
				}
				<SignedOut>
					<SignInOAuthButtons />
				</SignedOut>
				<UserButton  />
			</div>
		</div>
	);
};
export default Topbar;
