# Project Tomato 🍅

`A Little Journey to July 23` is a Flask birthday-site project with timed unlocks, handwritten letter pages, a puzzle, media placeholders, and a birthday finale.

## Run locally

```powershell
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Open `http://127.0.0.1:5000`.

## Personalize the schedule and writing

Open `app.py`:

- Set `YEAR` to the desired birthday year.
- The included schedule is July 21 at 6 PM, July 22 at 6 PM, and the July 23 birthday finale at midnight.
- Edit `CHAPTERS` to change the dates, letter writing, captions, and chapter order.
- Each unlock tuple is `(month, day, hour, minute)` in Lagos time.

## Add media

Copy files into the listed paths. The project shows a friendly placeholder if an image is missing.

```text
static/images/day-one.jpeg
static/images/day-two.jpeg
static/images/scrapbook-1.jpeg
static/images/scrapbook-2.jpeg
static/images/scrapbook-3.jpeg
static/images/video-cover.jpeg
static/images/finale.jpeg
static/videos/message.mp4
static/music/theme.mp3
```

## Deploy to Render

Push this project to GitHub. Create a Render Python Web Service using:

```text
Build command: pip install -r requirements.txt
Start command: gunicorn app:app
```

The included `render.yaml` contains the same settings.

## Important note on timed unlocks

The app calculates unlock status on the server in `Africa/Lagos` time. A visitor cannot reveal a page simply by changing their phone clock.
