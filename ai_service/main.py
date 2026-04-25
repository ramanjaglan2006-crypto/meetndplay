from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Any
from recommender import recommender, match_recommender
import uvicorn

app = FastAPI(title="Meet-U AI Service")

class Player(BaseModel):
    id: str
    name: str
    sport_type: str
    skill_level: float
    lat: float
    lon: float

class RecommenderRequest(BaseModel):
    player_id: str
    all_players: List[Player]

class MatchRecommendationRequest(BaseModel):
    user: Any
    matches: List[Any]
    n: Optional[int] = 3

@app.get("/")
async def root():
    return {"message": "Meet-U AI Service Active"}

@app.post("/recommend/matches")
async def get_match_recommendations(request: MatchRecommendationRequest):
    try:
        recommendations = match_recommender.recommend(request.user, request.matches, n=request.n)
        return {"recommendations": recommendations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/recommend")
async def get_player_recommendations(request: RecommenderRequest):
    try:
        # Convert Pydantic models to dicts
        players_data = [p.model_dump() for p in request.all_players]
        recommender.fit(players_data)
        recommendations = recommender.recommend(request.player_id)
        return {"recommendations": recommendations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
