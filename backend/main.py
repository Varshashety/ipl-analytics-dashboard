from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from database import engine
from models import Base

import pandas as pd

# Create tables
Base.metadata.create_all(bind=engine)

# FastAPI app
app = FastAPI()

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://ipl-analytics-dashboard-ebon.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# SQLite connection
analytics_engine = engine

ROOT_DIR = Path(__file__).resolve().parent.parent
FAVICON_PATH = ROOT_DIR / "frontend" / "public" / "favicon.svg"


def build_season_clause(season: str | None, has_where: bool = False):
    if season and season != "All Seasons":
        clause = " AND season = :season" if has_where else " WHERE season = :season"
        return clause, {"season": season}

    return "", {}


def build_team_clause(team: str | None, has_where: bool = False):
    if team:
        aliases = TEAM_ALIASES.get(team, [team])
        params = {}
        placeholders = []

        for index, alias in enumerate(aliases):
            param_name = f"team_{index}"
            placeholders.append(f":{param_name}")
            params[param_name] = alias

        team_list = ", ".join(placeholders)
        clause = (
            f" AND (team1 IN ({team_list}) OR team2 IN ({team_list}))"
            if has_where
            else f" WHERE (team1 IN ({team_list}) OR team2 IN ({team_list}))"
        )
        return clause, params

    return "", {}


TEAM_ALIASES = {
    "Chennai Super Kings": ["Chennai Super Kings"],
    "Deccan Chargers": ["Deccan Chargers"],
    "Delhi Capitals": ["Delhi Capitals", "Delhi Daredevils"],
    "Gujarat Lions": ["Gujarat Lions"],
    "Gujarat Titans": ["Gujarat Titans"],
    "Kings XI Punjab": ["Kings XI Punjab", "Punjab Kings"],
    "Kochi Tuskers Kerala": ["Kochi Tuskers Kerala"],
    "Kolkata Knight Riders": ["Kolkata Knight Riders"],
    "Lucknow Super Giants": ["Lucknow Super Giants"],
    "Mumbai Indians": ["Mumbai Indians"],
    "Pune Warriors": ["Pune Warriors"],
    "Punjab Kings": ["Punjab Kings", "Kings XI Punjab"],
    "Rajasthan Royals": ["Rajasthan Royals"],
    "Rising Pune Supergiant": ["Rising Pune Supergiant", "Rising Pune Supergiants"],
    "Rising Pune Supergiants": ["Rising Pune Supergiants", "Rising Pune Supergiant"],
    "Royal Challengers Bangalore": ["Royal Challengers Bangalore", "Royal Challengers Bengaluru"],
    "Royal Challengers Bengaluru": ["Royal Challengers Bengaluru", "Royal Challengers Bangalore"],
    "Sunrisers Hyderabad": ["Sunrisers Hyderabad"],
}


# =========================
# HOME ROUTE
# =========================

@app.get("/")
def home():

    return {
        "message": "IPL Analytics API Running"
    }


@app.get("/favicon.ico", include_in_schema=False)
def favicon():
    return FileResponse(
        FAVICON_PATH,
        media_type="image/svg+xml",
        filename="favicon.svg",
    )


@app.get("/seasons")
def seasons():
    df = pd.read_sql(
        "SELECT DISTINCT season FROM matches WHERE season IS NOT NULL",
        analytics_engine,
    )

    seasons = [str(season) for season in df["season"].dropna().tolist()]
    seasons = sorted(
        seasons,
        key=lambda value: int(str(value).split("/")[0]),
        reverse=True,
    )

    return ["All Seasons", *seasons]


# =========================
# TEAM WIN RATES API
# =========================

@app.get("/team-win-rates")
def team_win_rates(season: str | None = None, team: str | None = None):
    season_clause, season_params = build_season_clause(season, has_where=True)
    team_clause, team_params = build_team_clause(team, has_where=True)
    params = {**season_params, **team_params}

    if team:
        total_query = """
        SELECT COUNT(*) AS total
        FROM matches
        WHERE winner != 'No Result'
        """
        total_query += season_clause
        total_query += team_clause

        total_matches = pd.read_sql(
            total_query,
            analytics_engine,
            params=params,
        )["total"][0]

        wins_query = """
        SELECT COUNT(*) AS wins
        FROM matches
        WHERE winner IN ("""
        win_aliases = TEAM_ALIASES.get(team, [team])
        win_placeholders = []
        win_params = {}

        for index, alias in enumerate(win_aliases):
            param_name = f"win_team_{index}"
            win_placeholders.append(f":{param_name}")
            win_params[param_name] = alias

        wins_query += ", ".join(win_placeholders)
        wins_query += ")"
        wins_query += season_clause

        wins = int(
            pd.read_sql(
                wins_query,
                analytics_engine,
                params={**season_params, **win_params},
            )["wins"][0]
        )

        win_percentage = round((wins / total_matches * 100) if total_matches else 0, 2)

        return [
            {
                "team": team,
                "wins": wins,
                "win_percentage": win_percentage,
            }
        ]

    query = """
    SELECT
        winner as team,
        COUNT(*) as wins
    FROM matches
    WHERE winner != 'No Result'
    """

    query += season_clause
    query += """
    GROUP BY winner
    """

    df = pd.read_sql(query, analytics_engine, params=season_params)

    total_matches = pd.read_sql(
        "SELECT COUNT(*) as total FROM matches WHERE winner != 'No Result'"
        + season_clause,
        analytics_engine,
        params=season_params,
    )["total"][0]

    df["win_percentage"] = (
        df["wins"] / total_matches * 100
    ).round(2)

    df = df.sort_values(
        by="win_percentage",
        ascending=False
    )

    return df.to_dict(orient="records")


# =========================
# TOSS IMPACT API
# =========================

@app.get("/toss-impact")
def toss_impact(season: str | None = None, team: str | None = None):
    season_clause, season_params = build_season_clause(season, has_where=True)
    team_clause, team_params = build_team_clause(team, has_where=True)
    params = {**season_params, **team_params}

    query = """
    SELECT
        COUNT(*) as total_matches,

        SUM(
            CASE
                WHEN toss_winner = winner
                THEN 1
                ELSE 0
            END
        ) as toss_match_wins

    FROM matches

    WHERE winner != 'No Result'
    """

    query += season_clause
    query += team_clause

    df = pd.read_sql(query, analytics_engine, params=params)

    total_matches = int(df["total_matches"][0])

    toss_match_wins = int(
        df["toss_match_wins"][0]
    )

    percentage = round(
        toss_match_wins / total_matches * 100,
        2
    )

    return {
        "total_matches": total_matches,
        "toss_match_wins": toss_match_wins,
        "success_percentage": percentage
    }


# =========================
# VENUE ANALYTICS API
# =========================

@app.get("/venues")
def venue_analysis(season: str | None = None, team: str | None = None):
    season_clause, season_params = build_season_clause(season)
    team_clause, team_params = build_team_clause(team)
    params = {**season_params, **team_params}

    query = """
    SELECT
        venue,
        COUNT(*) as total_matches
    FROM matches
    """

    query += season_clause
    query += team_clause
    query += """
    GROUP BY venue
    ORDER BY total_matches DESC
    """

    df = pd.read_sql(query, analytics_engine, params=params)

    return df.to_dict(orient="records")


# =========================
# CHASING SUCCESS API
# =========================

@app.get("/chasing-analysis")
def chasing_success(season: str | None = None, team: str | None = None):
    season_clause, season_params = build_season_clause(season)
    team_clause, team_params = build_team_clause(team)
    params = {**season_params, **team_params}

    query = """
    SELECT
        venue,

        COUNT(*) as total_matches,

        SUM(
            CASE
                WHEN toss_winner = winner
                THEN 1
                ELSE 0
            END
        ) as chasing_wins

    FROM matches

    """

    query += season_clause
    query += team_clause
    query += """
    GROUP BY venue
    """

    df = pd.read_sql(query, analytics_engine, params=params)

    df["chasing_success_percentage"] = (
        df["chasing_wins"]
        / df["total_matches"]
        * 100
    ).round(2)

    df = df.sort_values(
        by="chasing_success_percentage",
        ascending=False
    )

    return df.to_dict(orient="records")
