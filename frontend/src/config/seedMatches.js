// Development & Demo Seed Dataset — 16 Active Matches across 7 Sports

export const SEED_MATCHES = [
  {
    id: 'seed-fb-1',
    _id: 'seed-fb-1',
    sport: 'Football',
    format: '5-a-side',
    title: '5-a-side Football',
    locationName: 'Power Play Arena, Bhopal',
    dateTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    totalPlayers: 10,
    skillLevel: 3,
    joinedPlayers: ['u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'u7'],
    participantAvatars: [
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
      'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=100'
    ],
    status: 'open',
    distanceKm: 1.8
  },
  {
    id: 'seed-fb-2',
    _id: 'seed-fb-2',
    sport: 'Football',
    format: '5-a-side',
    title: 'Night Football Showdown',
    locationName: 'Central Turf, Bhopal',
    dateTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    totalPlayers: 10,
    skillLevel: 4,
    joinedPlayers: ['u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'u7', 'u8'],
    participantAvatars: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'
    ],
    status: 'open',
    distanceKm: 3.2
  },
  {
    id: 'seed-cr-1',
    _id: 'seed-cr-1',
    sport: 'Cricket',
    format: '8-a-side',
    title: 'Box Cricket Tournament',
    locationName: 'City Cricket Ground, Bhopal',
    dateTime: new Date(Date.now() + 22 * 60 * 60 * 1000).toISOString(),
    totalPlayers: 8,
    skillLevel: 3,
    joinedPlayers: ['u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'u7'],
    participantAvatars: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100'
    ],
    status: 'open',
    distanceKm: 2.1
  },
  {
    id: 'seed-bm-1',
    _id: 'seed-bm-1',
    sport: 'Badminton',
    format: 'Doubles',
    title: 'Evening Badminton Doubles',
    locationName: 'Active Sports Club, Bhopal',
    dateTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    totalPlayers: 4,
    skillLevel: 3,
    joinedPlayers: ['u1', 'u2', 'u3'],
    participantAvatars: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100'
    ],
    status: 'open',
    distanceKm: 1.2
  },
  {
    id: 'seed-tn-1',
    _id: 'seed-tn-1',
    sport: 'Tennis',
    format: 'Singles',
    title: 'Singles Match',
    locationName: 'Elite Tennis Club, Bhopal',
    dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    totalPlayers: 2,
    skillLevel: 4,
    joinedPlayers: ['u1', 'u2'],
    participantAvatars: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=100'
    ],
    status: 'full',
    distanceKm: 4.5
  },
  {
    id: 'seed-pb-1',
    _id: 'seed-pb-1',
    sport: 'Pickleball',
    format: 'Doubles',
    title: 'Pickleball Night',
    locationName: 'Smash Arena, Bhopal',
    dateTime: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
    totalPlayers: 4,
    skillLevel: 2,
    joinedPlayers: ['u1', 'u2', 'u3'],
    participantAvatars: [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100'
    ],
    status: 'open',
    distanceKm: 2.8
  },
  {
    id: 'seed-bk-1',
    _id: 'seed-bk-1',
    sport: 'Basketball',
    format: '3v3 Half-Court',
    title: '3v3 Hoops Battle',
    locationName: 'Hoops Complex, Bhopal',
    dateTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    totalPlayers: 6,
    skillLevel: 3,
    joinedPlayers: ['u1', 'u2', 'u3', 'u4', 'u5'],
    participantAvatars: [
      'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=100'
    ],
    status: 'open',
    distanceKm: 3.8
  },
  {
    id: 'seed-vb-1',
    _id: 'seed-vb-1',
    sport: 'Volleyball',
    format: '6v6 Full-Court',
    title: 'Weekend Volleyball',
    locationName: 'Spike Arena, Bhopal',
    dateTime: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString(),
    totalPlayers: 12,
    skillLevel: 3,
    joinedPlayers: ['u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'u7', 'u8', 'u9', 'u10'],
    participantAvatars: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'
    ],
    status: 'open',
    distanceKm: 5.1
  },
  {
    id: 'seed-fb-3',
    _id: 'seed-fb-3',
    sport: 'Football',
    format: '5-a-side',
    title: 'Champions League Turf Match',
    locationName: 'Champions Turf, Bhopal',
    dateTime: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(),
    totalPlayers: 10,
    skillLevel: 3,
    joinedPlayers: ['u1', 'u2', 'u3', 'u4', 'u5', 'u6'],
    participantAvatars: [],
    status: 'open',
    distanceKm: 2.5
  },
  {
    id: 'seed-cr-2',
    _id: 'seed-cr-2',
    sport: 'Cricket',
    format: '6-a-side',
    title: 'Royal Box Cricket Blitz',
    locationName: 'Royal Box Cricket, Bhopal',
    dateTime: new Date(Date.now() + 3.5 * 60 * 60 * 1000).toISOString(),
    totalPlayers: 6,
    skillLevel: 4,
    joinedPlayers: ['u1', 'u2', 'u3', 'u4', 'u5'],
    participantAvatars: [],
    status: 'open',
    distanceKm: 1.5
  },
  {
    id: 'seed-bm-2',
    _id: 'seed-bm-2',
    sport: 'Badminton',
    format: 'Doubles',
    title: 'Smash Masters',
    locationName: 'Smash Indoor Arena, Bhopal',
    dateTime: new Date(Date.now() + 4.5 * 60 * 60 * 1000).toISOString(),
    totalPlayers: 4,
    skillLevel: 4,
    joinedPlayers: ['u1', 'u2', 'u3', 'u4'],
    participantAvatars: [],
    status: 'full',
    distanceKm: 3.0
  },
  {
    id: 'seed-tn-2',
    _id: 'seed-tn-2',
    sport: 'Tennis',
    format: 'Doubles',
    title: 'Weekend Tennis Doubles',
    locationName: 'Grand Slam Academy, Bhopal',
    dateTime: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    totalPlayers: 4,
    skillLevel: 3,
    joinedPlayers: ['u1', 'u2', 'u3'],
    participantAvatars: [],
    status: 'open',
    distanceKm: 4.0
  },
  {
    id: 'seed-pb-2',
    _id: 'seed-pb-2',
    sport: 'Pickleball',
    format: 'Doubles',
    title: 'Pickleball Social Meetup',
    locationName: 'Pickleball Hub, Bhopal',
    dateTime: new Date(Date.now() + 21 * 60 * 60 * 1000).toISOString(),
    totalPlayers: 6,
    skillLevel: 2,
    joinedPlayers: ['u1', 'u2', 'u3', 'u4'],
    participantAvatars: [],
    status: 'open',
    distanceKm: 2.2
  },
  {
    id: 'seed-fb-4',
    _id: 'seed-fb-4',
    sport: 'Football',
    format: '5-a-side',
    title: 'Late Night Turf Battle',
    locationName: 'Green Field Arena, Bhopal',
    dateTime: new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString(),
    totalPlayers: 10,
    skillLevel: 4,
    joinedPlayers: ['u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'u7', 'u8', 'u9'],
    participantAvatars: [],
    status: 'open',
    distanceKm: 3.5
  },
  {
    id: 'seed-cr-3',
    _id: 'seed-cr-3',
    sport: 'Cricket',
    format: '8-a-side',
    title: 'Metro Turf Cricket Series',
    locationName: 'Metro Cricket Turf, Bhopal',
    dateTime: new Date(Date.now() + 50 * 60 * 60 * 1000).toISOString(),
    totalPlayers: 8,
    skillLevel: 3,
    joinedPlayers: ['u1', 'u2', 'u3', 'u4', 'u5', 'u6'],
    participantAvatars: [],
    status: 'open',
    distanceKm: 2.9
  },
  {
    id: 'seed-bm-3',
    _id: 'seed-bm-3',
    sport: 'Badminton',
    format: 'Doubles',
    title: 'Shuttle Clash',
    locationName: 'Premier Shuttle Club, Bhopal',
    dateTime: new Date(Date.now() + 27 * 60 * 60 * 1000).toISOString(),
    totalPlayers: 4,
    skillLevel: 3,
    joinedPlayers: ['u1', 'u2', 'u3'],
    participantAvatars: [],
    status: 'open',
    distanceKm: 1.9
  }
];
