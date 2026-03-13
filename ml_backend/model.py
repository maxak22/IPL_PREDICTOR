import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import OrdinalEncoder, LabelEncoder
from sklearn.model_selection import train_test_split

feature_encoder = None
winner_encoder = None
model = None
features = ["team1", "team2", "toss_winner", "toss_decision", "venue"]

def train_model(df: pd.DataFrame):
    global model, feature_encoder, winner_encoder

    target = "winner"
    df = df.dropna(subset=features + [target]).copy()

    X_raw = df[features].astype(str)
    y_raw = df[target].astype(str)

    feature_encoder = OrdinalEncoder(
        handle_unknown="use_encoded_value",
        unknown_value=-1
    )
    X = feature_encoder.fit_transform(X_raw)

    winner_encoder = LabelEncoder()
    y = winner_encoder.fit_transform(y_raw)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    acc = model.score(X_test, y_test) * 100
    return round(float(acc), 2)

def predict(team1, team2, toss_winner, toss_decision, venue):
    if model is None or feature_encoder is None or winner_encoder is None:
        return {"error": "Model not trained yet. Upload a CSV first."}

    try:
        X_raw = pd.DataFrame([{
            "team1": str(team1),
            "team2": str(team2),
            "toss_winner": str(toss_winner),
            "toss_decision": str(toss_decision),
            "venue": str(venue),
        }])[features]

        X = feature_encoder.transform(X_raw)
        pred_idx = int(model.predict(X)[0])
        proba = model.predict_proba(X)[0]
        confidence = round(float(np.max(proba)) * 100, 2)

        winner = winner_encoder.inverse_transform([pred_idx])[0]
        return {"winner": str(winner), "confidence": confidence}
    except Exception as e:
        return {"error": str(e)}