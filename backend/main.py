from pathlib import Path
import io
import json
from urllib.parse import urlparse

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse

from services.normalize import normalize_cookies
from services.metrics import build_metrics
from services.graph_builder import build_graph

BASE_DIR = Path(__file__).resolve().parent
DATA_FILE = BASE_DIR / "data" / "scans" / "cookies.json"

app = FastAPI(title="Cookie Tracker Graph Intelligence API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SYNTHETIC_SITE = "https://targetsite.com"

SYNTHETIC_DATA = [
    {
        "name": "_ga",
        "value": "x",
        "domain": ".google-analytics.com",
        "path": "/",
        "secure": True,
        "httpOnly": False,
        "sameSite": "None",
        "source_url": SYNTHETIC_SITE,
    },
    {
        "name": "sessionid",
        "value": "y",
        "domain": "targetsite.com",
        "path": "/",
        "secure": True,
        "httpOnly": True,
        "sameSite": "Lax",
        "source_url": SYNTHETIC_SITE,
    },
    {
        "name": "_fbp",
        "value": "z",
        "domain": ".facebook.com",
        "path": "/",
        "secure": True,
        "httpOnly": False,
        "sameSite": "None",
        "source_url": SYNTHETIC_SITE,
    },
]

WHY_THIS_MATTERS = (
    "Cookie relationships expose hidden dependencies between site operators, analytics vendors, "
    "and third-party tracking infrastructure. A graph view turns raw browser artifacts into "
    "operational intelligence for privacy, security, and compliance review."
)

WHO_CONTROLS_THE_RAIL = (
    "The tracking rail is shaped by site owners, embedded script vendors, browser policies, "
    "analytics stacks, and ad-tech intermediaries. The graph highlights who introduces, persists, "
    "and extends cookie reach across the browsing surface."
)


def load_raw():
    if DATA_FILE.exists():
        try:
            payload = json.loads(DATA_FILE.read_text(encoding="utf-8"))

            if isinstance(payload, dict) and isinstance(payload.get("cookies"), list):
                return {
                    "site": payload.get("site", SYNTHETIC_SITE),
                    "cookies": payload.get("cookies", []),
                    "sourceStatus": "Live",
                }

            if isinstance(payload, list) and len(payload) > 0:
                return {
                    "site": SYNTHETIC_SITE,
                    "cookies": payload,
                    "sourceStatus": "Live",
                }
        except Exception:
            pass

    return {
        "site": SYNTHETIC_SITE,
        "cookies": SYNTHETIC_DATA,
        "sourceStatus": "Synthetic",
    }


def get_site_label(site_url: str) -> str:
    host = urlparse(site_url).hostname or "Target Site"
    host = host.replace("www.", "").strip()
    return host or "Target Site"


@app.get("/")
def root():
    return {
        "message": "Cookie Tracker Graph Intelligence API is running",
        "docs": "/docs",
        "dashboard": "/dashboard",
    }


@app.get("/summary")
def summary():
    payload = load_raw()
    df = normalize_cookies(payload["cookies"], payload["site"])
    metrics = build_metrics(df)

    return {
        "sourceStatus": payload["sourceStatus"],
        "site": payload["site"],
        "metrics": metrics,
    }


@app.get("/graph")
def graph():
    payload = load_raw()
    df = normalize_cookies(payload["cookies"], payload["site"])

    return {
        "sourceStatus": payload["sourceStatus"],
        "site": payload["site"],
        "graph": build_graph(df, site_label=get_site_label(payload["site"])),
    }


@app.get("/cookies")
def cookies():
    payload = load_raw()
    df = normalize_cookies(payload["cookies"], payload["site"])

    return {
        "sourceStatus": payload["sourceStatus"],
        "site": payload["site"],
        "rows": df.to_dict(orient="records"),
    }


@app.get("/source-status")
def source_status():
    payload = load_raw()

    return {
        "sourceStatus": payload["sourceStatus"],
        "recordCount": len(payload["cookies"]),
        "site": payload["site"],
    }


@app.get("/dashboard")
def dashboard():
    payload = load_raw()
    df = normalize_cookies(payload["cookies"], payload["site"])
    metrics = build_metrics(df)
    graph_payload = build_graph(df, site_label=get_site_label(payload["site"]))

    return JSONResponse(
        {
            "title": "Cookie Tracker Graph Intelligence Dashboard",
            "site": payload["site"],
            "sourceStatus": payload["sourceStatus"],
            "metrics": metrics,
            "graph": graph_payload,
            "sidebar": {
                "whyThisMatters": WHY_THIS_MATTERS,
                "whoControlsTheRail": WHO_CONTROLS_THE_RAIL,
                "highLevelMetric": metrics["totalCookies"],
                "recordCount": len(payload["cookies"]),
            },
            "downloads": {
                "csv": "http://127.0.0.1:8000/download/csv",
                "json": "http://127.0.0.1:8000/download/json",
            },
        }
    )


@app.get("/download/json")
def download_json():
    payload = load_raw()
    buffer = io.BytesIO(json.dumps(payload, indent=2).encode("utf-8"))

    return StreamingResponse(
        buffer,
        media_type="application/json",
        headers={"Content-Disposition": "attachment; filename=cookie-scan.json"},
    )


@app.get("/download/csv")
def download_csv():
    payload = load_raw()
    df = normalize_cookies(payload["cookies"], payload["site"])
    buffer = io.StringIO()
    df.to_csv(buffer, index=False)

    return StreamingResponse(
        iter([buffer.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=cookie-scan.csv"},
    )