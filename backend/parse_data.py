import json
from pathlib import Path

from database import SessionLocal
from models import Match, Innings

# Create database session
db = SessionLocal()

# IPL JSON folder path
DATA_PATH = r"D:\IPL analytics dashboard\data\ipl_json"

# Get all JSON files
files = list(Path(DATA_PATH).glob("*.json"))

print("Total files found:", len(files))

inserted_matches = 0
inserted_innings = 0
skipped_files = 0

# Loop through all files
for file in files:

    try:
        # Open JSON file
        with open(file, "r", encoding="utf-8") as f:
            data = json.load(f)

        # Extract match info
        info = data["info"]

        # Match data extraction
        match_data = {
            "match_id": info.get("match_type_number"),
            "season": str(info.get("season")),
            "team1": info["teams"][0],
            "team2": info["teams"][1],
            "venue": info.get("venue"),

            "winner": info.get("outcome", {}).get(
                "winner",
                "No Result"
            ),

            "toss_winner": info.get("toss", {}).get(
                "winner"
            )
        }

        # Create Match object
        new_match = Match(
            match_id=match_data["match_id"],
            season=match_data["season"],
            team1=match_data["team1"],
            team2=match_data["team2"],
            winner=match_data["winner"],
            toss_winner=match_data["toss_winner"],
            venue=match_data["venue"]
        )

        # Add match to DB
        db.add(new_match)

        inserted_matches += 1

        # =========================
        # INNINGS PARSING
        # =========================

        innings_data = data.get("innings", [])

        for inning in innings_data:

            batting_team = inning.get("team")

            overs_data = inning.get("overs", [])

            total_runs = 0
            wickets = 0

            # Loop through overs
            for over in overs_data:

                deliveries = over.get(
                    "deliveries",
                    []
                )

                # Loop through deliveries
                for delivery in deliveries:

                    runs = delivery.get(
                        "runs",
                        {}
                    ).get("total", 0)

                    total_runs += runs

                    # Count wickets
                    if "wickets" in delivery:
                        wickets += len(
                            delivery["wickets"]
                        )

            # Create innings record
            innings_record = Innings(
                match_id=match_data["match_id"],
                batting_team=batting_team,
                runs=total_runs,
                wickets=wickets,
                overs=len(overs_data)
            )

            # Add innings to DB
            db.add(innings_record)

            inserted_innings += 1

    except Exception as e:

        skipped_files += 1

        print(
            f"Skipped file {file.name}: {e}"
        )

# Commit all inserts
db.commit()

print("\n==============================")
print("DATABASE INSERT COMPLETED")
print("==============================")

print(f"Inserted Matches : {inserted_matches}")

print(f"Inserted Innings : {inserted_innings}")

print(f"Skipped Files    : {skipped_files}")

print("\nALL IPL DATA INSERTED SUCCESSFULLY!")