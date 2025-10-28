import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMusicStore } from "@/stores/useMusicStore";
import { Calendar, ChevronDown, ChevronRight, Music, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";

const AlbumsTable = () => {
	const { albums, deleteAlbum, fetchAlbums } = useMusicStore();
	const [expandedAlbums, setExpandedAlbums] = useState<Set<string>>(new Set());

	useEffect(() => {
		fetchAlbums();
	}, [fetchAlbums]);

	const toggleAlbum = (albumId: string) => {
		setExpandedAlbums(prev => {
			const newSet = new Set(prev);
			if (newSet.has(albumId)) {
				newSet.delete(albumId);
			} else {
				newSet.add(albumId);
			}
			return newSet;
		});
	};

	return (
		<Table>
			<TableHeader>
				<TableRow className='hover:bg-zinc-800/50'>
					<TableHead className='w-[50px]'></TableHead>
					<TableHead>Title</TableHead>
					<TableHead>Artist</TableHead>
					<TableHead>Release Year</TableHead>
					<TableHead>Songs</TableHead>
					<TableHead className='text-right'>Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{albums.map((album) => (
					<React.Fragment key={album._id}>
						<TableRow key={`album-${album._id}`} className='hover:bg-zinc-800/50'>
							<TableCell>
								<img src={album.imageUrl} alt={album.title} className='w-10 h-10 rounded object-cover' />
							</TableCell>
							<TableCell className='font-medium'>{album.title}</TableCell>
							<TableCell>{album.artist}</TableCell>
							<TableCell>
								<span className='inline-flex items-center gap-1 text-zinc-400'>
									<Calendar className='h-4 w-4' />
									{album.releaseYear}
								</span>
							</TableCell>
							<TableCell>
								<Button
									variant='ghost'
									size='sm'
									onClick={() => toggleAlbum(album._id)}
									className='flex items-center gap-1 text-zinc-400 hover:text-zinc-300'
								>
									{expandedAlbums.has(album._id) ? <ChevronDown className='h-4 w-4' /> : <ChevronRight className='h-4 w-4' />}
									<Music className='h-4 w-4' />
									{album.songs.length} songs
								</Button>
							</TableCell>
							<TableCell className='text-right'>
								<div className='flex gap-2 justify-end'>
									<Button
										variant='ghost'
										size='sm'
										onClick={() => deleteAlbum(album._id)}
										className='text-red-400 hover:text-red-300 hover:bg-red-400/10'
									>
										<Trash2 className='h-4 w-4' />
									</Button>
								</div>
							</TableCell>
						</TableRow>
						{expandedAlbums.has(album._id) && (
							<TableRow key={`expanded-${album._id}`}>
								<TableCell colSpan={6} className='bg-zinc-800/30 p-4'>
									{album.songs.length > 0 ? (
										<div className='space-y-2'>
											<h4 className='font-medium text-zinc-300 mb-3'>Songs in this album:</h4>
											{album.songs.map((song, index) => (
												<div key={`${album._id}-song-${song._id || index}`} className='flex items-center gap-3 p-2 rounded bg-zinc-700/50'>
													<span className='text-zinc-400 text-sm w-6'>{index + 1}</span>
													<img src={song.imageUrl || '/placeholder.png'} alt={song.title || 'Unknown'} className='w-8 h-8 rounded object-cover' />
													<div className='flex-1'>
														<div className='font-medium text-zinc-200'>{song.title || 'Unknown Title'}</div>
														<div className='text-sm text-zinc-400'>{song.artist || 'Unknown Artist'}</div>
													</div>
													<span className='text-zinc-400 text-sm'>
														{song.duration && !isNaN(song.duration) 
															? `${Math.floor(song.duration / 60)}:${(song.duration % 60).toString().padStart(2, '0')}`
															: '0:00'
														}
													</span>
												</div>
											))}
										</div>
									) : (
										<div className='text-center py-4 text-zinc-400'>
											ဒီ Album မှာ သီချင်းမရှိပါ
										</div>
									)}
								</TableCell>
							</TableRow>
						)}
					</React.Fragment>
				))}
			</TableBody>
		</Table>
	);
};
export default AlbumsTable;
