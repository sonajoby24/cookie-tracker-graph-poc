import math

def category_risk(category: str, party_type: str) -> int:
    base = {
        "Essential": 20,
        "Analytics": 55,
        "Marketing": 80,
        "Unknown": 65,
    }.get(category, 50)

    if party_type == "Third-Party":
        base += 15

    return min(base, 100)

def build_metrics(df):
    if df.empty:
        return {
            "totalCookies": 0,
            "uniqueDomains": 0,
            "firstPartyCookies": 0,
            "thirdPartyCookies": 0,
            "analyticsCookies": 0,
            "marketingCookies": 0,
            "essentialCookies": 0,
            "unknownCookies": 0,
            "secureCookies": 0,
            "httpOnlyCookies": 0,
            "compositeRisk": 0,
            "categoryCounts": {},
            "partyTypeCounts": {},
        }

    df = df.copy()
    df["riskScore"] = df.apply(lambda r: category_risk(r["category"], r["party_type"]), axis=1)

    return {
        "totalCookies": int(len(df)),
        "uniqueDomains": int(df["domain"].nunique()),
        "firstPartyCookies": int((df["party_type"] == "First-Party").sum()),
        "thirdPartyCookies": int((df["party_type"] == "Third-Party").sum()),
        "analyticsCookies": int((df["category"] == "Analytics").sum()),
        "marketingCookies": int((df["category"] == "Marketing").sum()),
        "essentialCookies": int((df["category"] == "Essential").sum()),
        "unknownCookies": int((df["category"] == "Unknown").sum()),
        "secureCookies": int(df["secure"].sum()),
        "httpOnlyCookies": int(df["httpOnly"].sum()),
        "compositeRisk": int(round(df["riskScore"].mean())),
        "categoryCounts": df["category"].value_counts().to_dict(),
        "partyTypeCounts": df["party_type"].value_counts().to_dict(),
    }