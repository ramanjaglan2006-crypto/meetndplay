// Sport Configuration & Format Architecture for Football, Badminton, Tennis, Pickleball, and Cricket

export const POSITION_ABBREVIATIONS = {
  'Goalkeeper': 'GK',
  'Defender': 'DEF',
  'Midfielder': 'MID',
  'Winger': 'W',
  'Striker': 'ST'
};

export const MATCH_FORMATS = {
  '5-a-side': {
    format: '5-a-side',
    playersPerTeam: 5,
    totalPlayers: 10,
    roles: ['Goalkeeper', 'Defender', 'Midfielder', 'Winger', 'Striker'],
    slots: [
      // TEAM A (Bottom Half - Attacking Upwards)
      { id: 'a_gk', team: 'A', position: 'Goalkeeper', label: 'GK', x: 50, y: 88, defaultRole: 'Goalkeeper' },
      { id: 'a_def1', team: 'A', position: 'Defender', label: 'DEF', x: 28, y: 76, defaultRole: 'Defender' },
      { id: 'a_def2', team: 'A', position: 'Defender', label: 'DEF', x: 72, y: 76, defaultRole: 'Defender' },
      { id: 'a_mid', team: 'A', position: 'Midfielder', label: 'MID', x: 50, y: 65, defaultRole: 'Midfielder' },
      { id: 'a_str', team: 'A', position: 'Striker', label: 'ST', x: 42, y: 54, defaultRole: 'Striker' }, // Horizontal offset for zero overlap

      // TEAM B (Top Half - Attacking Downwards)
      { id: 'b_gk', team: 'B', position: 'Goalkeeper', label: 'GK', x: 50, y: 12, defaultRole: 'Goalkeeper' },
      { id: 'b_def1', team: 'B', position: 'Defender', label: 'DEF', x: 28, y: 24, defaultRole: 'Defender' },
      { id: 'b_def2', team: 'B', position: 'Defender', label: 'DEF', x: 72, y: 24, defaultRole: 'Defender' },
      { id: 'b_mid', team: 'B', position: 'Midfielder', label: 'MID', x: 50, y: 35, defaultRole: 'Midfielder' },
      { id: 'b_str', team: 'B', position: 'Striker', label: 'ST', x: 58, y: 46, defaultRole: 'Striker' }  // Horizontal offset for zero overlap
    ]
  }
};

export const SPORT_CONFIGS = {
  football: {
    sport: 'Football',
    layout: 'football',
    maxPlayers: 10,
    formatKey: '5-a-side'
  },
  badminton: {
    sport: 'Badminton',
    layout: 'badminton',
    maxPlayers: 4,
    slots: [
      { id: 'bad_a1', team: 'A', x: 32, y: 74 },
      { id: 'bad_a2', team: 'A', x: 68, y: 74 },
      { id: 'bad_b1', team: 'B', x: 32, y: 26 },
      { id: 'bad_b2', team: 'B', x: 68, y: 26 }
    ]
  },
  tennis: {
    sport: 'Tennis',
    layout: 'tennis',
    maxPlayers: 4,
    slots: [
      { id: 'ten_a1', team: 'A', x: 30, y: 76 },
      { id: 'ten_a2', team: 'A', x: 70, y: 76 },
      { id: 'ten_b1', team: 'B', x: 30, y: 24 },
      { id: 'ten_b2', team: 'B', x: 70, y: 24 }
    ]
  },
  pickleball: {
    sport: 'Pickleball',
    layout: 'pickleball',
    maxPlayers: 4,
    slots: [
      { id: 'pck_a1', team: 'A', x: 32, y: 74 },
      { id: 'pck_a2', team: 'A', x: 68, y: 74 },
      { id: 'pck_b1', team: 'B', x: 32, y: 26 },
      { id: 'pck_b2', team: 'B', x: 68, y: 26 }
    ]
  },
  cricket: {
    sport: 'Cricket',
    layout: 'cricket',
    maxPlayers: 16,
    roles: ['Batsman', 'Bowler', 'All-Rounder', 'Wicketkeeper'],
    slots: [
      // TEAM A (Attacking / Batting area top)
      { id: 'cr_a1', team: 'A', role: 'Batsman', label: 'Batsman', x: 30, y: 15 },
      { id: 'cr_a2', team: 'A', role: 'Batsman', label: 'Batsman', x: 50, y: 12 },
      { id: 'cr_a3', team: 'A', role: 'Batsman', label: 'Batsman', x: 70, y: 15 },
      { id: 'cr_a4', team: 'A', role: 'Wicketkeeper', label: 'Keeper', x: 50, y: 25 },
      { id: 'cr_a5', team: 'A', role: 'All-Rounder', label: 'All-Rounder', x: 35, y: 36 },
      { id: 'cr_a6', team: 'A', role: 'Bowler', label: 'Bowler', x: 65, y: 36 },

      // TEAM B (Fielding / Bowling area bottom)
      { id: 'cr_b1', team: 'B', role: 'Bowler', label: 'Bowler', x: 35, y: 64 },
      { id: 'cr_b2', team: 'B', role: 'Bowler', label: 'Bowler', x: 65, y: 64 },
      { id: 'cr_b3', team: 'B', role: 'All-Rounder', label: 'All-Rounder', x: 50, y: 75 },
      { id: 'cr_b4', team: 'B', role: 'Batsman', label: 'Batsman', x: 30, y: 85 },
      { id: 'cr_b5', team: 'B', role: 'Batsman', label: 'Batsman', x: 50, y: 88 },
      { id: 'cr_b6', team: 'B', role: 'Batsman', label: 'Batsman', x: 70, y: 85 }
    ]
  }
};
