// Configuration architecture for 5-a-side, 7-a-side, and 11-a-side formations

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
      // TEAM A (Bottom Half)
      { id: 'a_gk', team: 'A', position: 'Goalkeeper', label: 'GK', x: 50, y: 88, defaultRole: 'Goalkeeper' },
      { id: 'a_def1', team: 'A', position: 'Defender', label: 'DEF', x: 30, y: 72, defaultRole: 'Defender' },
      { id: 'a_def2', team: 'A', position: 'Defender', label: 'DEF', x: 70, y: 72, defaultRole: 'Defender' },
      { id: 'a_mid', team: 'A', position: 'Midfielder', label: 'MID', x: 50, y: 58, defaultRole: 'Midfielder' },
      { id: 'a_str', team: 'A', position: 'Striker', label: 'ST', x: 50, y: 44, defaultRole: 'Striker' },

      // TEAM B (Top Half)
      { id: 'b_gk', team: 'B', position: 'Goalkeeper', label: 'GK', x: 50, y: 12, defaultRole: 'Goalkeeper' },
      { id: 'b_def1', team: 'B', position: 'Defender', label: 'DEF', x: 30, y: 28, defaultRole: 'Defender' },
      { id: 'b_def2', team: 'B', position: 'Defender', label: 'DEF', x: 70, y: 28, defaultRole: 'Defender' },
      { id: 'b_mid', team: 'B', position: 'Midfielder', label: 'MID', x: 50, y: 42, defaultRole: 'Midfielder' },
      { id: 'b_str', team: 'B', position: 'Striker', label: 'ST', x: 50, y: 56, defaultRole: 'Striker' }
    ]
  },
  // Extensible for future 7-a-side
  '7-a-side': {
    format: '7-a-side',
    playersPerTeam: 7,
    totalPlayers: 14,
    roles: ['Goalkeeper', 'Defender', 'Midfielder', 'Winger', 'Striker'],
    slots: []
  },
  // Extensible for future 11-a-side
  '11-a-side': {
    format: '11-a-side',
    playersPerTeam: 11,
    totalPlayers: 22,
    roles: ['Goalkeeper', 'Defender', 'Midfielder', 'Winger', 'Striker'],
    slots: []
  }
};
