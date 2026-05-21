import pandas as pd
from database import engine

# Connect SQLite database
 


# =========================
# TEAM WIN RATES
# =========================

def team_win_rates():

    query = """
    SELECT
        winner as team,
        COUNT(*) as wins
    FROM matches
    WHERE winner != 'No Result'
    GROUP BY winner
    """

    df = pd.read_sql(query, engine)

    total_matches = pd.read_sql(
        "SELECT COUNT(*) as total FROM matches",
        engine
    )["total"][0]

    df["win_percentage"] = (
        df["wins"] / total_matches * 100
    ).round(2)

    return df.sort_values(
        by="win_percentage",
        ascending=False
    )


# =========================
# TOSS IMPACT
# =========================

def toss_impact():

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

    df = pd.read_sql(query, engine)

    total_matches = df["total_matches"][0]

    toss_match_wins = df["toss_match_wins"][0]

    percentage = round(
        toss_match_wins / total_matches * 100,
        2
    )

    print("\nTOSS IMPACT ANALYSIS")
    print("------------------------")

    print(f"Total Matches: {total_matches}")

    print(
        f"Toss Winner Also Won Match: {toss_match_wins}"
    )

    print(
        f"Success Percentage: {percentage}%"
    )


# =========================
# VENUE MATCH COUNTS
# =========================

def venue_match_counts():

    query = """
    SELECT
        venue,
        COUNT(*) as total_matches
    FROM matches
    GROUP BY venue
    ORDER BY total_matches DESC
    """

    df = pd.read_sql(query, engine)

    print("\nVENUES WITH MOST MATCHES")
    print("----------------------------")

    print(df.head(10))


# =========================
# BATTING FRIENDLY VENUES
# =========================

def batting_friendly_venues():

    query = """
    SELECT
        m.venue,

        ROUND(
            AVG(i.runs),
            2
        ) as avg_runs

    FROM innings i

    JOIN matches m
    ON i.match_id = m.match_id

    GROUP BY m.venue

    ORDER BY avg_runs DESC
    """

    df = pd.read_sql(query, engine)

    print("\nBATTING FRIENDLY VENUES")
    print("----------------------------")

    print(df.head(10))


# =========================
# CHASING SUCCESS
# =========================

def chasing_success():

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

    GROUP BY venue
    """

    df = pd.read_sql(query, engine)

    df["chasing_success_percentage"] = (
        df["chasing_wins"]
        / df["total_matches"]
        * 100
    ).round(2)

    print("\nCHASING SUCCESS BY VENUE")
    print("----------------------------")

    print(
        df.sort_values(
            by="chasing_success_percentage",
            ascending=False
        ).head(10)
    )


# =========================
# RUN EVERYTHING
# =========================

if __name__ == "__main__":

    print("\nTEAM WIN RATES")
    print("----------------------------")

    print(team_win_rates())

    toss_impact()

    venue_match_counts()

    batting_friendly_venues()

    chasing_success()
