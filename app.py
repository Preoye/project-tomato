from datetime import datetime
from zoneinfo import ZoneInfo

from flask import Flask, jsonify, render_template

app = Flask(__name__)

# Change this once if the birthday year or timezone needs to change.
TIMEZONE = ZoneInfo("Africa/Lagos")
YEAR = 2026

CHAPTERS = [
    {
        "id": "letter-one", "unlock": (7, 21, 18, 0), "kind": "letter",
        "title": "The first page", "date_label": "July 21 · 6:00 PM",
        "flower": "🌼", "photo": "images/day-one.jpeg",
        "caption": "One of my favourite memories of us.",
        "lines": [
            "Dear Toyin,",
            "I thought about waiting until your birthday.",
            "But then I realised that the waiting could be part of the gift.",
            "So I made a little place for a few moments, surprises, and reminders of how special you are.",
            "Welcome to A Little Journey to July 23.",
            "One page, one smile, one memory at a time. ❤️",
        ],
    },
    {
        "id": "puzzle", "unlock": (7, 22, 18, 0), "kind": "puzzle",
        "title": "A little challenge", "date_label": "July 22 · 6:00 PM",
        "flower": "🍅", 
        "lines": [
            "I heard you are brilliant at word puzzles, so I could not leave one out.",
            "Unscramble the five words below. The last message is your reward.",
        ],
    },
    {
        "id": "birthday", "unlock": (7, 23, 0, 0), "kind": "birthday",
        "title": "Happy Birthday, Toyintomatoo!", "date_label": "July 23 · Midnight",
        "flower": "🎂", "lines": [
            "Today is yours. I hope it is full of warmth, laughter, beautiful food, and every good thing you deserve.",
            "Thank you for taking this little journey with me.",
            "Happy Birthday, Toyin. ❤️",
            "— Precious",
        ],
    },
]


def unlock_time(chapter):
    month, day, hour, minute = chapter["unlock"]
    return datetime(YEAR, month, day, hour, minute, tzinfo=TIMEZONE)


def page_context():
    now = datetime.now(TIMEZONE)
    chapters = []
    next_unlock = None
    for chapter in CHAPTERS:
        item = chapter.copy()
        item["unlock_at"] = unlock_time(chapter)
        item["unlocked"] = now >= item["unlock_at"]
        chapters.append(item)
        if not item["unlocked"] and next_unlock is None:
            next_unlock = item
    return now, chapters, next_unlock


@app.route("/")
def home():
    now, chapters, next_unlock = page_context()
    return render_template(
        "index.html", chapters=chapters, next_unlock=next_unlock,
        now=now, timezone_name="WAT (Lagos time)", year=YEAR,
    )


@app.route("/api/status")
def status():
    now, chapters, next_unlock = page_context()
    return jsonify({
        "now": now.isoformat(),
        "next_unlock": next_unlock["unlock_at"].isoformat() if next_unlock else None,
        "all_unlocked": next_unlock is None,
        "chapters": [{"id": c["id"], "unlocked": c["unlocked"]} for c in chapters],
    })


@app.route("/health")
def health():
    return {"status": "ok"}


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
