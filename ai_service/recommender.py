from sklearn.neighbors import NearestNeighbors
import pandas as pd
import numpy as np

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
    def __init__(self):
        pass

    def recommend(self, user_data, matches_data, n=3):
        """
        Simple scoring based recommendation for matches
        """
        if not matches_data:
            return []
        
        df = pd.DataFrame(matches_data)
        # Filters: only open matches
        df = df[df['status'] == 'open']
        
        if df.empty:
            return []

        # Scoring logic
        def calculate_score(row):
            score = 0
            # Sport similarity
            if row['sport'] == user_data['sport_type']:
                score += 10
            
            # Distance (very basic Euclidean)
            dist = np.sqrt((row['lat'] - user_data['lat'])**2 + (row['lon'] - user_data['lon'])**2)
            score += max(0, (1 - dist) * 5)
            
            # Availability / Urgency
            # (In a real app, we'd check time difference)
            
            return score

        df['score'] = df.apply(calculate_score, axis=1)
        recommended = df.sort_values(by='score', ascending=False).head(n)
        
        return recommended.to_dict(orient='records')

recommender = PlayerRecommender()
match_recommender = MatchRecommender()
