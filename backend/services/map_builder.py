from urllib.parse import urlparse

CATEGORY_COLOR = {
    "Essential": [34, 197, 94, 180],
    "Analytics": [56, 189, 248, 210],
    "Marketing": [129, 140, 248, 210],
    "Unknown": [148, 163, 184, 200],
}

def get_coords_for_domain(domain: str):
    seed = sum(ord(c) for c in domain)
    lng = 60 + (seed % 120)
    lat = -25 + (seed % 50)
    return [float(lng), float(lat)]

def get_site_coords(site_url: str):
    host = urlparse(site_url).hostname or "site"
    return get_coords_for_domain(host)

def build_map_payload(df, site_url: str):
    site_coords = get_site_coords(site_url)
    site_node = {
        "id": "site-origin",
        "label": site_url,
        "coordinates": site_coords,
        "type": "site",
        "color": [34, 211, 238, 255],
        "radius": 90000,
    }

    domain_nodes = []
    arcs = []
    seen = set()

    for _, row in df.iterrows():
        domain = row["domain"]
        if domain in seen:
            continue
        seen.add(domain)

        coords = get_coords_for_domain(domain)
        count = int((df["domain"] == domain).sum())
        category = row["category"]
        party_type = row["party_type"]

        domain_nodes.append({
            "id": f"domain:{domain}",
            "label": domain,
            "coordinates": coords,
            "type": "domain",
            "category": category,
            "partyType": party_type,
            "cookieCount": count,
            "color": CATEGORY_COLOR.get(category, [148, 163, 184, 200]),
            "radius": 40000 + (count * 12000),
        })

        arcs.append({
            "sourcePosition": site_coords,
            "targetPosition": coords,
            "sourceColor": [56, 189, 248, 180],
            "targetColor": CATEGORY_COLOR.get(category, [148, 163, 184, 180]),
            "label": domain,
            "partyType": party_type,
            "cookieCount": count,
        })

    return {
        "siteNode": site_node,
        "domainNodes": domain_nodes,
        "arcs": arcs,
    }