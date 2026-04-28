import pandas as pd
from urllib.parse import urlparse

EXPECTED_COLUMNS = [
    "name",
    "value",
    "domain",
    "path",
    "expires",
    "httpOnly",
    "secure",
    "sameSite",
    "source_url",
    "category",
    "party_type",
]

def get_base_domain(host: str) -> str:
    host = (host or "").lower().strip()
    if host.startswith("www."):
        host = host[4:]
    if host.startswith("."):
        host = host[1:]
    parts = host.split(".")
    if len(parts) >= 2:
        return ".".join(parts[-2:])
    return host

def classify_cookie(name: str) -> str:
    token = (name or "").lower()
    if any(k in token for k in ["ga", "_ga", "gid", "analytics", "pk_"]):
        return "Analytics"
    if any(k in token for k in ["ad", "fb", "_fb", "doubleclick", "track", "pixel"]):
        return "Marketing"
    if any(k in token for k in ["sess", "csrf", "auth", "token", "wmf", "geoip"]):
        return "Essential"
    return "Unknown"

def classify_party_type(cookie_domain: str, site_url: str) -> str:
    cookie_base = get_base_domain(cookie_domain)
    site_host = urlparse(site_url).hostname or ""
    site_base = get_base_domain(site_host)
    return "First-Party" if cookie_base == site_base else "Third-Party"

def normalize_cookies(raw_items, site_url="synthetic"):
    if not raw_items:
        return pd.DataFrame(columns=EXPECTED_COLUMNS)

    df = pd.DataFrame(raw_items)

    for col in EXPECTED_COLUMNS:
        if col not in df.columns:
            df[col] = None

    df["source_url"] = df["source_url"].fillna(site_url)
    df["domain"] = df["domain"].fillna("unknown").astype(str).str.strip()
    df["name"] = df["name"].fillna("unnamed").astype(str).str.strip()
    df["value"] = df["value"].fillna("").astype(str)
    df["path"] = df["path"].fillna("/").astype(str)
    df["sameSite"] = df["sameSite"].fillna("Unknown").astype(str)
    df["secure"] = df["secure"].fillna(False).astype(bool)
    df["httpOnly"] = df["httpOnly"].fillna(False).astype(bool)

    if "category" not in df or df["category"].isna().all():
        df["category"] = df["name"].apply(classify_cookie)
    else:
        df["category"] = df["category"].fillna(df["name"].apply(classify_cookie))

    df["party_type"] = df["domain"].apply(lambda d: classify_party_type(d, site_url))

    return df[EXPECTED_COLUMNS]