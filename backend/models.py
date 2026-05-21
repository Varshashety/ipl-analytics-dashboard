from sqlalchemy import Column, Integer, String, Float

from database import Base


# =========================
# MATCHES TABLE
# =========================

class Match(Base):

    __tablename__ = "matches"

    match_id = Column(Integer, primary_key=True)

    season = Column(String)

    team1 = Column(String)
    team2 = Column(String)

    winner = Column(String)

    toss_winner = Column(String)

    venue = Column(String)


# =========================
# INNINGS TABLE
# =========================

class Innings(Base):

    __tablename__ = "innings"

    id = Column(Integer, primary_key=True)

    match_id = Column(Integer)

    batting_team = Column(String)

    runs = Column(Integer)

    wickets = Column(Integer)

    overs = Column(Float)