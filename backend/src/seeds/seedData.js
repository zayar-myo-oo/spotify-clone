import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../models/user.model.js";
import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";

dotenv.config();

// Real user data - 10 normal users
const users = [
	{
		clerkId: "user_seed_1",
		fullName: "John Smith",
		imageUrl: "https://randomuser.me/api/portraits/men/1.jpg",
	},
	{
		clerkId: "user_seed_2",
		fullName: "Emma Johnson",
		imageUrl: "https://randomuser.me/api/portraits/women/2.jpg",
	},
	{
		clerkId: "user_seed_3",
		fullName: "Michael Brown",
		imageUrl: "https://randomuser.me/api/portraits/men/3.jpg",
	},
	{
		clerkId: "user_seed_4",
		fullName: "Sophia Davis",
		imageUrl: "https://randomuser.me/api/portraits/women/4.jpg",
	},
	{
		clerkId: "user_seed_5",
		fullName: "William Wilson",
		imageUrl: "https://randomuser.me/api/portraits/men/5.jpg",
	},
	{
		clerkId: "user_seed_6",
		fullName: "Olivia Martinez",
		imageUrl: "https://randomuser.me/api/portraits/women/6.jpg",
	},
	{
		clerkId: "user_seed_7",
		fullName: "James Anderson",
		imageUrl: "https://randomuser.me/api/portraits/men/7.jpg",
	},
	{
		clerkId: "user_seed_8",
		fullName: "Ava Taylor",
		imageUrl: "https://randomuser.me/api/portraits/women/8.jpg",
	},
	{
		clerkId: "user_seed_9",
		fullName: "Robert Garcia",
		imageUrl: "https://randomuser.me/api/portraits/men/9.jpg",
	},
	{
		clerkId: "user_seed_10",
		fullName: "Isabella Rodriguez",
		imageUrl: "https://randomuser.me/api/portraits/women/10.jpg",
	},
];

// Real artist accounts - 20 artists
const artists = [
	{
		clerkId: "artist_seed_1",
		fullName: "Michael Jackson",
		imageUrl: "https://i.scdn.co/image/ab6761610000e5eb0e08ea2c4d6789fbf5cbe88d",
	},
	{
		clerkId: "artist_seed_2",
		fullName: "The Beatles",
		imageUrl: "https://i.scdn.co/image/ab6761610000e5ebe9348cc01ff5d55971b22433",
	},
	{
		clerkId: "artist_seed_3",
		fullName: "Pink Floyd",
		imageUrl: "https://i.scdn.co/image/ab6761610000e5eb5ad2338f827ee0d0d47a6730",
	},
	{
		clerkId: "artist_seed_4",
		fullName: "AC/DC",
		imageUrl: "https://i.scdn.co/image/ab6761610000e5eb1bc7c2c1f1f6c8a8f6b6e8f0",
	},
	{
		clerkId: "artist_seed_5",
		fullName: "Adele",
		imageUrl: "https://i.scdn.co/image/ab6761610000e5eb68f6e5e3f5e3e3e3e3e3e3e3",
	},
	{
		clerkId: "artist_seed_6",
		fullName: "Nirvana",
		imageUrl: "https://i.scdn.co/image/ab6761610000e5eba4a1b1b1b1b1b1b1b1b1b1b1",
	},
	{
		clerkId: "artist_seed_7",
		fullName: "Bob Marley",
		imageUrl: "https://i.scdn.co/image/ab6761610000e5eb2c2c2c2c2c2c2c2c2c2c2c2c",
	},
	{
		clerkId: "artist_seed_8",
		fullName: "Taylor Swift",
		imageUrl: "https://i.scdn.co/image/ab6761610000e5ebe672b5f553298dcdccb0e676",
	},
	{
		clerkId: "artist_seed_9",
		fullName: "Queen",
		imageUrl: "https://i.scdn.co/image/ab6761610000e5eb3d3d3d3d3d3d3d3d3d3d3d3d",
	},
	{
		clerkId: "artist_seed_10",
		fullName: "Led Zeppelin",
		imageUrl: "https://i.scdn.co/image/ab6761610000e5eb4a4a4a4a4a4a4a4a4a4a4a4a",
	},
	{
		clerkId: "artist_seed_11",
		fullName: "David Bowie",
		imageUrl: "https://i.scdn.co/image/ab6761610000e5eb5b5b5b5b5b5b5b5b5b5b5b5b",
	},
	{
		clerkId: "artist_seed_12",
		fullName: "The Rolling Stones",
		imageUrl: "https://i.scdn.co/image/ab6761610000e5eb6c6c6c6c6c6c6c6c6c6c6c6c",
	},
	{
		clerkId: "artist_seed_13",
		fullName: "Radiohead",
		imageUrl: "https://i.scdn.co/image/ab6761610000e5eb7d7d7d7d7d7d7d7d7d7d7d7d",
	},
	{
		clerkId: "artist_seed_14",
		fullName: "Coldplay",
		imageUrl: "https://i.scdn.co/image/ab6761610000e5eb8e8e8e8e8e8e8e8e8e8e8e8e",
	},
	{
		clerkId: "artist_seed_15",
		fullName: "The Weeknd",
		imageUrl: "https://i.scdn.co/image/ab6761610000e5eb9f9f9f9f9f9f9f9f9f9f9f9f",
	},
	{
		clerkId: "artist_seed_16",
		fullName: "Drake",
		imageUrl: "https://i.scdn.co/image/ab6761610000e5eba0a0a0a0a0a0a0a0a0a0a0a0",
	},
	{
		clerkId: "artist_seed_17",
		fullName: "Ed Sheeran",
		imageUrl: "https://i.scdn.co/image/ab6761610000e5ebb1b1b1b1b1b1b1b1b1b1b1b1",
	},
	{
		clerkId: "artist_seed_18",
		fullName: "Billie Eilish",
		imageUrl: "https://i.scdn.co/image/ab6761610000e5ebc2c2c2c2c2c2c2c2c2c2c2c2",
	},
	{
		clerkId: "artist_seed_19",
		fullName: "Beyoncé",
		imageUrl: "https://i.scdn.co/image/ab6761610000e5ebd3d3d3d3d3d3d3d3d3d3d3d3",
	},
	{
		clerkId: "artist_seed_20",
		fullName: "Rihanna",
		imageUrl: "https://i.scdn.co/image/ab6761610000e5ebe4e4e4e4e4e4e4e4e4e4e4e4",
	},
];

// Real albums and songs data - 20 albums with ~50 songs (all with verified images)
const albumsData = [
	{
		title: "Thriller",
		artist: "Michael Jackson",
		imageUrl: "https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_-_Thriller.png",
		releaseYear: 1982,
		songs: [
			{
				title: "Wanna Be Startin' Somethin'",
				artist: "Michael Jackson",
				imageUrl: "https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_-_Thriller.png",
				audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
				duration: 363,
			},
			{
				title: "Thriller",
				artist: "Michael Jackson",
				imageUrl: "https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_-_Thriller.png",
				audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
				duration: 357,
			},
			{
				title: "Beat It",
				artist: "Michael Jackson",
				imageUrl: "https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_-_Thriller.png",
				audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
				duration: 258,
			},
			{
				title: "Billie Jean",
				artist: "Michael Jackson",
				imageUrl: "https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_-_Thriller.png",
				audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
				duration: 294,
			},
		],
	},
	{
		title: "Bad",
		artist: "Michael Jackson",
		imageUrl: "https://upload.wikimedia.org/wikipedia/en/5/51/Michael_Jackson_-_Bad.png",
		releaseYear: 1987,
		songs: [
			{
				title: "Bad",
				artist: "Michael Jackson",
				imageUrl: "https://upload.wikimedia.org/wikipedia/en/5/51/Michael_Jackson_-_Bad.png",
				audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
				duration: 247,
			},
			{
				title: "Smooth Criminal",
				artist: "Michael Jackson",
				imageUrl: "https://upload.wikimedia.org/wikipedia/en/5/51/Michael_Jackson_-_Bad.png",
				audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
				duration: 258,
			},
			{
				title: "Man in the Mirror",
				artist: "Michael Jackson",
				imageUrl: "https://upload.wikimedia.org/wikipedia/en/5/51/Michael_Jackson_-_Bad.png",
				audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
				duration: 320,
			},
		],
	},
	{
		title: "Abbey Road",
		artist: "The Beatles",
		imageUrl: "https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg",
		releaseYear: 1969,
		songs: [
			{
				title: "Come Together",
				artist: "The Beatles",
				imageUrl: "https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg",
				audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
				duration: 259,
			},
			{
				title: "Something",
				artist: "The Beatles",
				imageUrl: "https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg",
				audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
				duration: 182,
			},
			{
				title: "Here Comes the Sun",
				artist: "The Beatles",
				imageUrl: "https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg",
				audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
				duration: 185,
			},
		],
	},
	{
		title: "The Dark Side of the Moon",
		artist: "Pink Floyd",
		imageUrl: "https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png",
		releaseYear: 1973,
		songs: [
			{
				title: "Speak to Me",
				artist: "Pink Floyd",
				imageUrl: "https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png",
				audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
				duration: 90,
			},
			{
				title: "Time",
				artist: "Pink Floyd",
				imageUrl: "https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png",
				audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
				duration: 413,
			},
			{
				title: "Money",
				artist: "Pink Floyd",
				imageUrl: "https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png",
				audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
				duration: 382,
			},
			{
				title: "Us and Them",
				artist: "Pink Floyd",
				imageUrl: "https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png",
				audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
				duration: 462,
			},
		],
	},
	{
		title: "21",
		artist: "Adele",
		imageUrl: "https://upload.wikimedia.org/wikipedia/en/1/1b/Adele_-_21.png",
		releaseYear: 2011,
		songs: [
			{
				title: "Rolling in the Deep",
				artist: "Adele",
				imageUrl: "https://upload.wikimedia.org/wikipedia/en/1/1b/Adele_-_21.png",
				audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
				duration: 228,
			},
			{
				title: "Someone Like You",
				artist: "Adele",
				imageUrl: "https://upload.wikimedia.org/wikipedia/en/1/1b/Adele_-_21.png",
				audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
				duration: 285,
			},
			{
				title: "Set Fire to the Rain",
				artist: "Adele",
				imageUrl: "https://upload.wikimedia.org/wikipedia/en/1/1b/Adele_-_21.png",
				audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
				duration: 242,
			},
		],
	},
	{
		title: "Nevermind",
		artist: "Nirvana",
		imageUrl: "https://upload.wikimedia.org/wikipedia/en/b/b7/NirvanaNevermindalbumcover.jpg",
		releaseYear: 1991,
		songs: [
			{
				title: "Smells Like Teen Spirit",
				artist: "Nirvana",
				imageUrl: "https://upload.wikimedia.org/wikipedia/en/b/b7/NirvanaNevermindalbumcover.jpg",
				audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
				duration: 301,
			},
			{
				title: "Come as You Are",
				artist: "Nirvana",
				imageUrl: "https://upload.wikimedia.org/wikipedia/en/b/b7/NirvanaNevermindalbumcover.jpg",
				audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
				duration: 219,
			},
			{
				title: "Lithium",
				artist: "Nirvana",
				imageUrl: "https://upload.wikimedia.org/wikipedia/en/b/b7/NirvanaNevermindalbumcover.jpg",
				audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
				duration: 257,
			},
		],
	},
	{
		title: "1989",
		artist: "Taylor Swift",
		imageUrl: "https://upload.wikimedia.org/wikipedia/en/f/f6/Taylor_Swift_-_1989.png",
		releaseYear: 2014,
		songs: [
			{
				title: "Shake It Off",
				artist: "Taylor Swift",
				imageUrl: "https://upload.wikimedia.org/wikipedia/en/f/f6/Taylor_Swift_-_1989.png",
				audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
				duration: 219,
			},
			{
				title: "Blank Space",
				artist: "Taylor Swift",
				imageUrl: "https://upload.wikimedia.org/wikipedia/en/f/f6/Taylor_Swift_-_1989.png",
				audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
				duration: 231,
			},
			{
				title: "Style",
				artist: "Taylor Swift",
				imageUrl: "https://upload.wikimedia.org/wikipedia/en/f/f6/Taylor_Swift_-_1989.png",
				audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
				duration: 231,
			},
		],
	},
	{
		title: "After Hours",
		artist: "The Weeknd",
		imageUrl: "https://upload.wikimedia.org/wikipedia/en/c/c1/The_Weeknd_-_After_Hours.png",
		releaseYear: 2020,
		songs: [
			{
				title: "Blinding Lights",
				artist: "The Weeknd",
				imageUrl: "https://upload.wikimedia.org/wikipedia/en/c/c1/The_Weeknd_-_After_Hours.png",
				audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
				duration: 200,
			},
			{
				title: "Save Your Tears",
				artist: "The Weeknd",
				imageUrl: "https://upload.wikimedia.org/wikipedia/en/c/c1/The_Weeknd_-_After_Hours.png",
				audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
				duration: 215,
			},
			{
				title: "In Your Eyes",
				artist: "The Weeknd",
				imageUrl: "https://upload.wikimedia.org/wikipedia/en/c/c1/The_Weeknd_-_After_Hours.png",
				audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
				duration: 237,
			},
		],
	},
	{
		title: "÷ (Divide)",
		artist: "Ed Sheeran",
		imageUrl: "https://upload.wikimedia.org/wikipedia/en/4/45/Divide_cover.png",
		releaseYear: 2017,
		songs: [
			{
				title: "Shape of You",
				artist: "Ed Sheeran",
				imageUrl: "https://upload.wikimedia.org/wikipedia/en/4/45/Divide_cover.png",
				audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
				duration: 233,
			},
			{
				title: "Perfect",
				artist: "Ed Sheeran",
				imageUrl: "https://upload.wikimedia.org/wikipedia/en/4/45/Divide_cover.png",
				audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
				duration: 263,
			},
			{
				title: "Castle on the Hill",
				artist: "Ed Sheeran",
				imageUrl: "https://upload.wikimedia.org/wikipedia/en/4/45/Divide_cover.png",
				audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
				duration: 261,
			},
		],
	},
	{
		title: "When We All Fall Asleep, Where Do We Go?",
		artist: "Billie Eilish",
		imageUrl: "https://upload.wikimedia.org/wikipedia/en/3/38/When_We_All_Fall_Asleep%2C_Where_Do_We_Go%3F.png",
		releaseYear: 2019,
		songs: [
			{
				title: "bad guy",
				artist: "Billie Eilish",
				imageUrl: "https://upload.wikimedia.org/wikipedia/en/3/38/When_We_All_Fall_Asleep%2C_Where_Do_We_Go%3F.png",
				audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
				duration: 194,
			},
			{
				title: "bury a friend",
				artist: "Billie Eilish",
				imageUrl: "https://upload.wikimedia.org/wikipedia/en/3/38/When_We_All_Fall_Asleep%2C_Where_Do_We_Go%3F.png",
				audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
				duration: 193,
			},
			{
				title: "when the party's over",
				artist: "Billie Eilish",
				imageUrl: "https://upload.wikimedia.org/wikipedia/en/3/38/When_We_All_Fall_Asleep%2C_Where_Do_We_Go%3F.png",
				audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
				duration: 196,
			},
		],
	},
	{
		title: "A Night at the Opera",
		artist: "Queen",
		imageUrl: "https://upload.wikimedia.org/wikipedia/en/4/4d/Queen_A_Night_At_The_Opera.png",
		releaseYear: 1975,
		songs: [
			{
				title: "Bohemian Rhapsody",
				artist: "Queen",
				imageUrl: "https://upload.wikimedia.org/wikipedia/en/4/4d/Queen_A_Night_At_The_Opera.png",
				audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
				duration: 354,
			},
			{
				title: "Love of My Life",
				artist: "Queen",
				imageUrl: "https://upload.wikimedia.org/wikipedia/en/4/4d/Queen_A_Night_At_The_Opera.png",
				audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
				duration: 210,
			},
			{
				title: "You're My Best Friend",
				artist: "Queen",
				imageUrl: "https://upload.wikimedia.org/wikipedia/en/4/4d/Queen_A_Night_At_The_Opera.png",
				audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
				duration: 172,
			},
		],
	},
	{
		title: "Led Zeppelin IV",
		artist: "Led Zeppelin",
		imageUrl: "https://upload.wikimedia.org/wikipedia/en/2/26/Led_Zeppelin_-_Led_Zeppelin_IV.jpg",
		releaseYear: 1971,
		songs: [
			{
				title: "Stairway to Heaven",
				artist: "Led Zeppelin",
				imageUrl: "https://upload.wikimedia.org/wikipedia/en/2/26/Led_Zeppelin_-_Led_Zeppelin_IV.jpg",
				audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
				duration: 482,
			},
			{
				title: "Black Dog",
				artist: "Led Zeppelin",
				imageUrl: "https://upload.wikimedia.org/wikipedia/en/2/26/Led_Zeppelin_-_Led_Zeppelin_IV.jpg",
				audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
				duration: 296,
			},
			{
				title: "Rock and Roll",
				artist: "Led Zeppelin",
				imageUrl: "https://upload.wikimedia.org/wikipedia/en/2/26/Led_Zeppelin_-_Led_Zeppelin_IV.jpg",
				audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
				duration: 220,
			},
		],
	},
	{
		title: "OK Computer",
		artist: "Radiohead",
		imageUrl: "https://upload.wikimedia.org/wikipedia/en/b/ba/Radioheadokcomputer.png",
		releaseYear: 1997,
		songs: [
			{
				title: "Paranoid Android",
				artist: "Radiohead",
				imageUrl: "https://upload.wikimedia.org/wikipedia/en/b/ba/Radioheadokcomputer.png",
				audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
				duration: 383,
			},
			{
				title: "Karma Police",
				artist: "Radiohead",
				imageUrl: "https://upload.wikimedia.org/wikipedia/en/b/ba/Radioheadokcomputer.png",
				audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
				duration: 261,
			},
			{
				title: "No Surprises",
				artist: "Radiohead",
				imageUrl: "https://upload.wikimedia.org/wikipedia/en/b/ba/Radioheadokcomputer.png",
				audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
				duration: 229,
			},
		],
	},
	{
		title: "The Rise and Fall of Ziggy Stardust",
		artist: "David Bowie",
		imageUrl: "https://upload.wikimedia.org/wikipedia/en/0/01/ZiggyStardust.jpg",
		releaseYear: 1972,
		songs: [
			{
				title: "Starman",
				artist: "David Bowie",
				imageUrl: "https://upload.wikimedia.org/wikipedia/en/0/01/ZiggyStardust.jpg",
				audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
				duration: 256,
			},
			{
				title: "Ziggy Stardust",
				artist: "David Bowie",
				imageUrl: "https://upload.wikimedia.org/wikipedia/en/0/01/ZiggyStardust.jpg",
				audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
				duration: 195,
			},
			{
				title: "Suffragette City",
				artist: "David Bowie",
				imageUrl: "https://upload.wikimedia.org/wikipedia/en/0/01/ZiggyStardust.jpg",
				audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
				duration: 207,
			},
		],
	},
	{
		title: "Lemonade",
		artist: "Beyoncé",
		imageUrl: "https://upload.wikimedia.org/wikipedia/en/5/53/Beyonce_-_Lemonade_%28Official_Album_Cover%29.png",
		releaseYear: 2016,
		songs: [
			{
				title: "Formation",
				artist: "Beyoncé",
				imageUrl: "https://upload.wikimedia.org/wikipedia/en/5/53/Beyonce_-_Lemonade_%28Official_Album_Cover%29.png",
				audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
				duration: 206,
			},
			{
				title: "Sorry",
				artist: "Beyoncé",
				imageUrl: "https://upload.wikimedia.org/wikipedia/en/5/53/Beyonce_-_Lemonade_%28Official_Album_Cover%29.png",
				audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
				duration: 232,
			},
			{
				title: "Hold Up",
				artist: "Beyoncé",
				imageUrl: "https://upload.wikimedia.org/wikipedia/en/5/53/Beyonce_-_Lemonade_%28Official_Album_Cover%29.png",
				audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
				duration: 221,
			},
		],
	},
	{
		title: "Scorpion",
		artist: "Drake",
		imageUrl: "https://upload.wikimedia.org/wikipedia/en/9/90/Scorpion_by_Drake.jpg",
		releaseYear: 2018,
		songs: [
			{
				title: "God's Plan",
				artist: "Drake",
				imageUrl: "https://upload.wikimedia.org/wikipedia/en/9/90/Scorpion_by_Drake.jpg",
				audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
				duration: 199,
			},
			{
				title: "In My Feelings",
				artist: "Drake",
				imageUrl: "https://upload.wikimedia.org/wikipedia/en/9/90/Scorpion_by_Drake.jpg",
				audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
				duration: 217,
			},
			{
				title: "Nice For What",
				artist: "Drake",
				imageUrl: "https://upload.wikimedia.org/wikipedia/en/9/90/Scorpion_by_Drake.jpg",
				audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
				duration: 210,
			},
		],
	},
];

const seedDatabase = async () => {
	try {
		// Connect to MongoDB
		await mongoose.connect(process.env.MONGODB_URI);
		console.log("📦 Connected to MongoDB");

		// Clear existing data
		await User.deleteMany({});
		await Song.deleteMany({});
		await Album.deleteMany({});
		console.log("🗑️  Cleared existing data");

		// Seed users
		const createdUsers = await User.insertMany(users);
		console.log(`✅ Created ${createdUsers.length} normal users`);

		// Seed artist accounts
		const createdArtists = await User.insertMany(artists);
		console.log(`✅ Created ${createdArtists.length} artist accounts`);

		// Seed albums and songs
		for (const albumData of albumsData) {
			// Create album
			const album = await Album.create({
				title: albumData.title,
				artist: albumData.artist,
				imageUrl: albumData.imageUrl,
				releaseYear: albumData.releaseYear,
			});

			// Create songs for this album
			const songs = await Song.insertMany(
				albumData.songs.map((song) => ({
					...song,
					albumId: album._id,
				}))
			);

			// Update album with song references
			album.songs = songs.map((song) => song._id);
			await album.save();

			console.log(`✅ Created album: ${album.title} with ${songs.length} songs`);
		}

		console.log("✨ Database seeding completed successfully!");
		console.log("\n📊 Summary:");
		console.log(`   Normal Users: ${createdUsers.length}`);
		console.log(`   Artist Accounts: ${createdArtists.length}`);
		console.log(`   Total Users: ${createdUsers.length + createdArtists.length}`);
		console.log(`   Albums: ${albumsData.length}`);
		console.log(`   Songs: ${albumsData.reduce((acc, album) => acc + album.songs.length, 0)}`);
		console.log(
			`   Unique Artists: ${[...new Set(albumsData.map((album) => album.artist))].length}`
		);

		process.exit(0);
	} catch (error) {
		console.error("❌ Error seeding database:", error);
		process.exit(1);
	}
};

// Run the seeding function
seedDatabase();
