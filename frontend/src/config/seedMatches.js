// Development & Demo Seed Dataset — 2 Real Matches per Sport across 7 Sports

export const SEED_MATCHES = [
  // 1. FOOTBALL (2 Matches)
  {
    id: 'seed-fb-1',
    _id: 'seed-fb-1',
    sport: 'Football',
    format: '5-a-side',
    title: '5-a-side Football Showdown',
    locationName: 'Power Play Arena, Bhopal',
    dateTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
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
    title: 'Night Turf Football',
    locationName: 'Central Turf, Bhopal',
    dateTime: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
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

  // 2. BADMINTON (2 Matches)
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
    id: 'seed-bm-2',
    _id: 'seed-bm-2',
    sport: 'Badminton',
    format: 'Doubles',
    title: 'Smash Masters Doubles',
    locationName: 'Smash Indoor Arena, Bhopal',
    dateTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    totalPlayers: 4,
    skillLevel: 4,
    joinedPlayers: ['u1', 'u2', 'u3', 'u4'],
    participantAvatars: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100'
    ],
    status: 'full',
    distanceKm: 2.8
  },

  // 3. TENNIS (2 Matches)
  {
    id: 'seed-tn-1',
    _id: 'seed-tn-1',
    sport: 'Tennis',
    format: 'Doubles',
    title: 'Grand Slam Tennis Doubles',
    locationName: 'Elite Tennis Club, Bhopal',
    dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    totalPlayers: 4,
    skillLevel: 4,
    joinedPlayers: ['u1', 'u2', 'u3'],
    participantAvatars: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=100'
    ],
    status: 'open',
    distanceKm: 4.5
  },
  {
    id: 'seed-tn-2',
    _id: 'seed-tn-2',
    sport: 'Tennis',
    format: 'Doubles',
    title: 'Weekend Tennis Clash',
    locationName: 'Grand Slam Academy, Bhopal',
    dateTime: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    totalPlayers: 4,
    skillLevel: 3,
    joinedPlayers: ['u1', 'u2', 'u3', 'u4'],
    participantAvatars: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100'
    ],
    status: 'full',
    distanceKm: 4.0
  },

  // 4. PICKLEBALL (2 Matches)
  {
    id: 'seed-pb-1',
    _id: 'seed-pb-1',
    sport: 'Pickleball',
    format: 'Doubles',
    title: 'Pickleball Night Doubles',
    locationName: 'Smash Arena, Bhopal',
    dateTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
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
    id: 'seed-pb-2',
    _id: 'seed-pb-2',
    sport: 'Pickleball',
    format: 'Doubles',
    title: 'Pickleball Social League',
    locationName: 'Pickleball Hub, Bhopal',
    dateTime: new Date(Date.now() + 21 * 60 * 60 * 1000).toISOString(),
    totalPlayers: 4,
    skillLevel: 3,
    joinedPlayers: ['u1', 'u2', 'u3', 'u4'],
    participantAvatars: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'
    ],
    status: 'full',
    distanceKm: 2.2
  },

  // 5. CRICKET (2 Matches)
  {
    id: 'seed-cr-1',
    _id: 'seed-cr-1',
    sport: 'Cricket',
    format: '8-a-side',
    title: 'City Cricket Box Tournament',
    locationName: 'City Cricket Ground, Bhopal',
    dateTime: new Date(Date.now() + 22 * 60 * 60 * 1000).toISOString(),
    totalPlayers: 12,
    skillLevel: 3,
    joinedPlayers: ['u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'u7', 'u8', 'u9'],
    participantAvatars: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100'
    ],
    status: 'open',
    distanceKm: 2.1
  },
  {
    id: 'seed-cr-2',
    _id: 'seed-cr-2',
    sport: 'Cricket',
    format: '6-a-side',
    title: 'Royal Box Cricket Blitz',
    locationName: 'Royal Box Cricket, Bhopal',
    dateTime: new Date(Date.now() + 3.5 * 60 * 60 * 1000).toISOString(),
    totalPlayers: 12,
    skillLevel: 4,
    joinedPlayers: ['u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'u7', 'u8', 'u9', 'u10'],
    participantAvatars: [],
    status: 'open',
    distanceKm: 1.5
  },

  // 6. BASKETBALL (2 Matches)
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
    id: 'seed-bk-2',
    _id: 'seed-bk-2',
    sport: 'Basketball',
    format: '3v3 Half-Court',
    title: 'Street Hoops Championship',
    locationName: 'Metro Basketball Court, Bhopal',
    dateTime: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(),
    totalPlayers: 6,
    skillLevel: 4,
    joinedPlayers: ['u1', 'u2', 'u3', 'u4', 'u5', 'u6'],
    participantAvatars: [],
    status: 'full',
    distanceKm: 4.1
  },

  // 7. VOLLEYBALL (2 Matches)
  {
    id: 'seed-vb-1',
    _id: 'seed-vb-1',
    sport: 'Volleyball',
    format: '6v6 Full-Court',
    title: 'Weekend Spike Volleyball',
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
    id: 'seed-vb-2',
    _id: 'seed-vb-2',
    sport: 'Volleyball',
    format: '6v6 Full-Court',
    title: 'Sunset Beach Volleyball',
    locationName: 'City Sports Complex, Bhopal',
    dateTime: new Date(Date.now() + 44 * 60 * 60 * 1000).toISOString(),
    totalPlayers: 12,
    skillLevel: 3,
    joinedPlayers: ['u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'u7', 'u8', 'u9', 'u10', 'u11'],
    participantAvatars: [],
    status: 'open',
    distanceKm: 3.9
  }
];

// Helper function to return populated Match Room details for ANY seed match
export const getSeedMatchRoomData = (matchId) => {
  const seedMatch = SEED_MATCHES.find(m => m.id === matchId || m._id === matchId) || SEED_MATCHES[0];

  const demoUsers = [
    { _id: 'u1', id: 'u1', name: 'Raman Kumar', skill_level: 4, photos: ['https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'] },
    { _id: 'u2', id: 'u2', name: 'Arjun Verma', skill_level: 4, photos: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150'] },
    { _id: 'u3', id: 'u3', name: 'Ananya Sharma', skill_level: 3, photos: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150'] },
    { _id: 'u4', id: 'u4', name: 'Vikram Singh', skill_level: 4, photos: ['https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=150'] },
    { _id: 'u5', id: 'u5', name: 'Rohan Patel', skill_level: 3, photos: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'] },
    { _id: 'u6', id: 'u6', name: 'Neha Gupta', skill_level: 3, photos: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'] },
    { _id: 'u7', id: 'u7', name: 'Karan Mehra', skill_level: 4, photos: ['https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150'] },
    { _id: 'u8', id: 'u8', name: 'Priya Sen', skill_level: 3, photos: ['https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150'] },
    { _id: 'u9', id: 'u9', name: 'Siddharth Rao', skill_level: 4, photos: ['https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150'] },
    { _id: 'u10', id: 'u10', name: 'Isha Kapoor', skill_level: 3, photos: ['https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150'] }
  ];

  const sportName = seedMatch.sport.toLowerCase();
  
  // Position mapping based on sport
  let posListA = ['Goalkeeper', 'Defender', 'Defender', 'Midfielder', 'Striker'];
  let posListB = ['Goalkeeper', 'Defender', 'Defender', 'Midfielder', 'Striker'];

  if (sportName.includes('cricket')) {
    posListA = ['Batsman', 'Batsman', 'Batsman', 'Wicketkeeper', 'All-Rounder', 'Bowler'];
    posListB = ['Bowler', 'Bowler', 'All-Rounder', 'Batsman', 'Batsman', 'Batsman'];
  } else if (sportName.includes('badminton') || sportName.includes('tennis') || sportName.includes('pickleball')) {
    posListA = ['Player', 'Player'];
    posListB = ['Player', 'Player'];
  }

  const joinedIds = seedMatch.joinedPlayers || ['u1', 'u2', 'u3'];
  const participants = [];

  joinedIds.forEach((uid, idx) => {
    const userObj = demoUsers.find(u => u.id === uid || u._id === uid) || demoUsers[idx % demoUsers.length];
    const isTeamA = idx % 2 === 0;
    const teamList = isTeamA ? posListA : posListB;
    const pos = teamList[Math.floor(idx / 2)] || 'Player';

    participants.push({
      id: `part-${seedMatch.id}-${idx}`,
      user: userObj,
      team: isTeamA ? 'A' : 'B',
      position: pos,
      role: pos,
      status: 'confirmed'
    });
  });

  const teamAParticipants = participants.filter(p => p.team === 'A');
  const teamBParticipants = participants.filter(p => p.team === 'B');

  return {
    match: {
      id: seedMatch.id,
      _id: seedMatch.id,
      sport: seedMatch.sport,
      format: seedMatch.format || 'Standard',
      title: seedMatch.title,
      locationName: seedMatch.locationName,
      dateTime: seedMatch.dateTime,
      description: `Casual ${seedMatch.sport} match. All skill levels welcome. Please arrive 10 minutes before kickoff.`,
      rules: 'Standard sport rules apply. Bring appropriate gear.',
      status: seedMatch.status || 'open',
      playersPerTeam: Math.ceil((seedMatch.totalPlayers || 10) / 2),
      totalPlayers: seedMatch.totalPlayers || 10
    },
    organizer: demoUsers[1], // Arjun Verma
    participants,
    capacity: {
      joined: participants.length,
      total: seedMatch.totalPlayers || 10,
      remaining: Math.max(0, (seedMatch.totalPlayers || 10) - participants.length),
      teamA: teamAParticipants.length,
      teamB: teamBParticipants.length
    }
  };
};
