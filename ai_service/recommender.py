from sklearn.neighbors import NearestNeighbors
import pandas as pd
import numpy as np
import math

def haversine_distance(lat1, lon1, lat2, lon2):
    """Calculate the great circle distance between two points in km."""
    if lat1 is None or lon1 is None or lat2 is None or lon2 is None:
        return 5.0 # Default fallback distance
    
    R = 6371.0 # Earth radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

# Position synergy matrix for popular sports
COMPLEMENTARY_POSITIONS = {
    'football': {
        'goalkeeper': ['defender', 'center back', 'full back', 'midfielder', 'striker'],
        'defender': ['goalkeeper', 'midfielder', 'winger', 'striker'],
        'midfielder': ['striker', 'winger', 'defender', 'goalkeeper'],
        'striker': ['midfielder', 'winger', 'playmaker', 'defender'],
        'winger': ['striker', 'midfielder', 'full back']
    },
    'basketball': {
        'point guard': ['center', 'power forward', 'shooting guard', 'small forward'],
        'shooting guard': ['point guard', 'center', 'power forward'],
        'center': ['point guard', 'shooting guard', 'small forward'],
        'power forward': ['point guard', 'center'],
        'small forward': ['point guard', 'shooting guard']
    },
    'badminton': {
        'front court': ['back court', 'smasher', 'all rounder'],
        'back court': ['front court', 'net player', 'all rounder'],
        'smasher': ['net player', 'front court'],
        'all rounder': ['all rounder', 'front court', 'back court']
    }
}

SKILL_LEVEL_NUMERIC = {
    'beginner': 1.0,
    'intermediate': 2.5,
    'advanced': 4.0,
    'competitive': 4.5,
    'professional': 5.0
}

def extract_player_skills(user):
    """Extract numeric skill and position list for a given user dict."""
    skill = 3.0
    positions = []
    
    if isinstance(user, dict):
        if 'skill_level' in user and user['skill_level'] is not None:
            try:
                skill = float(user['skill_level'])
            except (ValueError, TypeError):
                pass
        
        # Check rich sports structure
        sports = user.get('sports', [])
        if isinstance(sports, list) and len(sports) > 0:
            first_sport = sports[0]
            if isinstance(first_sport, dict):
                skill_str = str(first_sport.get('skillLevel', '')).lower()
                if skill_str in SKILL_LEVEL_NUMERIC:
                    skill = SKILL_LEVEL_NUMERIC[skill_str]
                pos_list = first_sport.get('positions', [])
                if isinstance(pos_list, list):
                    positions = [str(p).lower() for p in pos_list]
            elif isinstance(first_sport, str):
                pass
    return skill, positions

def calculate_synergy(user1, user2):
    """Calculate multi-dimensional synergy score (0-100) between 2 users."""
    if not user1 or not user2:
        return {'synergyScore': 75, 'breakdown': {'skillMatch': 25, 'positionSynergy': 25, 'distanceScore': 15, 'interestMatch': 10}}

    skill1, pos1 = extract_player_skills(user1)
    skill2, pos2 = extract_player_skills(user2)

    # 1. Skill Balance (Max 30 pts)
    skill_diff = abs(skill1 - skill2)
    skill_score = max(0.0, 30.0 - (skill_diff * 7.5))

    # 2. Position Synergy (Max 35 pts)
    position_score = 20.0 # Baseline
    if pos1 and pos2:
        match_found = False
        for p1 in pos1:
            for p2 in pos2:
                for sport, syn_map in COMPLEMENTARY_POSITIONS.items():
                    if p1 in syn_map and p2 in syn_map[p1]:
                        match_found = True
                        break
            if match_found:
                break
        if match_found:
            position_score = 35.0
        elif any(p in pos2 for p in pos1):
            position_score = 25.0 # Same position

    # 3. Distance Score (Max 25 pts)
    lat1 = user1.get('lat') if isinstance(user1, dict) else None
    lon1 = user1.get('lon') if isinstance(user1, dict) else None
    lat2 = user2.get('lat') if isinstance(user2, dict) else None
    lon2 = user2.get('lon') if isinstance(user2, dict) else None

    # Handle GeoJSON point if present
    if isinstance(user1, dict) and 'location' in user1 and isinstance(user1['location'], dict):
        coords = user1['location'].get('coordinates', [])
        if len(coords) == 2:
            lon1, lat1 = coords[0], coords[1]

    if isinstance(user2, dict) and 'location' in user2 and isinstance(user2['location'], dict):
        coords = user2['location'].get('coordinates', [])
        if len(coords) == 2:
            lon2, lat2 = coords[0], coords[1]

    dist_km = haversine_distance(lat1, lon1, lat2, lon2)
    distance_score = max(0.0, 25.0 * math.exp(-dist_km / 15.0))

    # 4. Interest & Sport Alignment (Max 10 pts)
    interest_score = 5.0
    interests1 = set(user1.get('interests', []) if isinstance(user1, dict) else [])
    interests2 = set(user2.get('interests', []) if isinstance(user2, dict) else [])
    if interests1 and interests2 and len(interests1.intersection(interests2)) > 0:
        interest_score = 10.0

    total = int(round(skill_score + position_score + distance_score + interest_score))
    total = max(50, min(99, total)) # Clamp between 50% and 99%

    return {
        'synergyScore': total,
        'breakdown': {
            'skillMatch': int(round(skill_score)),
            'positionSynergy': int(round(position_score)),
            'distanceScore': int(round(distance_score)),
            'interestMatch': int(round(interest_score))
        },
        'distanceKm': round(dist_km, 1)
    }

class SquadBuilder:
    """Balances a match roster into Team A and Team B with complementary roles."""
    
    REQUIRED_ROLES = {
        'football': ['goalkeeper', 'defender', 'midfielder', 'striker'],
        'basketball': ['point guard', 'shooting guard', 'center', 'power forward'],
        'badminton': ['front court', 'back court']
    }

    def balance_teams(self, players, sport='football'):
        if not players:
            return {'teamA': [], 'teamB': [], 'balanceScore': 50.0, 'missingRoles': {'teamA': [], 'teamB': []}}

        sport_key = str(sport).lower()
        required_roles = self.REQUIRED_ROLES.get(sport_key, ['player'])

        # Enrich players with skill and primary position
        enriched = []
        for p in players:
            skill, positions = extract_player_skills(p)
            enriched.append({
                'player': p,
                'skill': skill,
                'positions': positions,
                'primary_position': positions[0] if positions else 'flex'
            })

        # Sort descending by skill level
        enriched.sort(key=lambda x: x['skill'], reverse=True)

        team_a = []
        team_b = []
        skill_a = 0.0
        skill_b = 0.0

        # Snake draft partitioning
        for i, item in enumerate(enriched):
            if i % 2 == 0:
                if skill_a <= skill_b:
                    team_a.append(item)
                    skill_a += item['skill']
                else:
                    team_b.append(item)
                    skill_b += item['skill']
            else:
                if skill_b <= skill_a:
                    team_b.append(item)
                    skill_b += item['skill']
                else:
                    team_a.append(item)
                    skill_a += item['skill']

        total_skill = skill_a + skill_b
        balance_pct_a = (skill_a / total_skill * 100) if total_skill > 0 else 50.0
        balance_pct_b = (skill_b / total_skill * 100) if total_skill > 0 else 50.0

        # Check missing roles
        roles_a = set()
        for item in team_a:
            roles_a.update(item['positions'])
        
        roles_b = set()
        for item in team_b:
            roles_b.update(item['positions'])

        missing_a = [r for r in required_roles if r not in roles_a]
        missing_b = [r for r in required_roles if r not in roles_b]

        return {
            'teamA': [item['player'] for item in team_a],
            'teamB': [item['player'] for item in team_b],
            'teamASkill': round(skill_a, 1),
            'teamBSkill': round(skill_b, 1),
            'balanceScore': round(balance_pct_a, 1),
            'missingRoles': {
                'teamA': missing_a,
                'teamB': missing_b
            }
        }

class PlayerRecommender:
    def __init__(self):
        self.model = NearestNeighbors(n_neighbors=5, metric='euclidean')
        self.players_df = None

    def fit(self, players_data):
        self.players_df = pd.DataFrame(players_data)
        features = self.players_df[['skill_level', 'lat', 'lon']]
        self.model.fit(features)

    def recommend(self, player_id, n=5):
        if self.players_df is None or self.players_df.empty:
            return []
        player = self.players_df[self.players_df['id'] == player_id]
        if player.empty:
            return []
        
        features = player[['skill_level', 'lat', 'lon']]
        available_count = len(self.players_df)
        actual_n = min(n + 1, available_count)
        
        if actual_n <= 1:
            return []

        distances, indices = self.model.kneighbors(features, n_neighbors=actual_n)
        recommended_indices = indices[0][1:]
        return self.players_df.iloc[recommended_indices].to_dict(orient='records')

class MatchRecommender:
    def recommend(self, user_data, matches_data, n=3):
        if not matches_data:
            return []
        
        df = pd.DataFrame(matches_data)
        df = df[df['status'] == 'open']
        
        if df.empty:
            return []

        def calculate_score(row):
            score = 0
            if row['sport'] == user_data.get('sport_type') or row['sport'] in user_data.get('sports', []):
                score += 10
            
            dist = np.sqrt((row.get('lat', 0) - user_data.get('lat', 0))**2 + (row.get('lon', 0) - user_data.get('lon', 0))**2)
            score += max(0, (1 - dist) * 5)
            return score

        df['score'] = df.apply(calculate_score, axis=1)
        recommended = df.sort_values(by='score', ascending=False).head(n)
        return recommended.to_dict(orient='records')

recommender = PlayerRecommender()
match_recommender = MatchRecommender()
squad_builder = SquadBuilder()
