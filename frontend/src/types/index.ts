export interface Song {
	_id: string;
	title: string;
	artist: string;
	albumId: string | null;
	imageUrl: string;
	audioUrl: string;
	duration: number;
	createdAt: string;
	updatedAt: string;
}

export interface Album {
	_id: string;
	title: string;
	artist: string;
	imageUrl: string;
	releaseYear: number;
	songs: Song[];
}

export interface Playlist {
	_id: string;
	name: string;
	description: string;
	imageUrl: string;
	userId: string;
	songs: Song[];
	isPublic: boolean;
	isLikedSongs: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface UserLibrary {
	likedSongs: Song[];
	likedAlbums: Album[];
	followedArtists: string[];
	playlists: Playlist[];
}

export interface Stats {
	totalSongs: number;
	totalAlbums: number;
	totalUsers: number;
	totalArtists: number;
}

export interface Message {
	_id: string;
	senderId: string;
	receiverId: string;
	content: string;
	createdAt: string;
	updatedAt: string;
}

export interface User {
	_id: string;
	clerkId: string;
	fullName: string;
	imageUrl: string;
}
