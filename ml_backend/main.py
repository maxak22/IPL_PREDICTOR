from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io
from model import train_model, predict as ml_predict
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

import json

@app.post("/api/upload")
async def upload_csv(file: UploadFile = File(...)):
    content = await file.read()
    df = pd.read_csv(io.StringIO(content.decode("utf-8")), low_memory=False)
    df.columns = [c.lower().strip() for c in df.columns]

    rename_map = {"batting_team": "team1", "bowling_team": "team2", "match_won_by": "winner"}
    df.rename(columns=rename_map, inplace=True)

    # Use pandas to_json which converts NaN → null, then parse back
    sample_data = json.loads(df.head(10).to_json(orient="records"))

    accuracy = train_model(df)

    return {
        "total_matches": len(df),
        "accuracy": accuracy,
        "sample_data": sample_data
    }

class PredictRequest(BaseModel):
    team1: str
    team2: str
    toss_winner: str
    toss_decision: str
    venue: str

@app.post("/api/predict")
def predict_match(req: PredictRequest):
    result = ml_predict(req.team1, req.team2, req.toss_winner, req.toss_decision, req.venue)
    return result