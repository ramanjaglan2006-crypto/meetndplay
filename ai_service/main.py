from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Any, Dict
from recommender import recommender, match_recommender, squad_builder, calculate_synergy
import uvicorn

app = FastAPI(title="Meet-U AI Service")

class Player(BaseModel):
    id: Optional[str] = None
    _id: Optional[str] = None
    name: Optional[str] = None
    sport_type: Optional[str] = None
    skill_level: Optional[float] = 3.0
    lat: Optional[float] = 0.0
    lon: Optional[float] = 0.0

class RecommenderRequest(BaseModel):
    player_id: str
    all_players: List[Player]

class MatchRecommendationRequest(BaseModel):
    user: Any
    matches: List[Any]
    n: Optional[int] = 3

class SynergyRequest(BaseModel):
    user1: Any
    user2: Any

class SquadBalanceRequest(BaseModel):
    players: List[Any]
    sport: Optional[str] = "football"

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
        players_data = [p.model_dump() for p in request.all_players]
        recommender.fit(players_data)
        recommendations = recommender.recommend(request.player_id)
        return {"recommendations": recommendations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/recommend/synergy")
async def get_synergy(request: SynergyRequest):
    try:
        synergy_data = calculate_synergy(request.user1, request.user2)
        return synergy_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/recommend/squad")
async def get_squad_balance(request: SquadBalanceRequest):
    try:
        result = squad_builder.balance_teams(request.players, sport=request.sport)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
