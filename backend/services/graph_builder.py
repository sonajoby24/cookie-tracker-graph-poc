def build_graph(df, site_label="Target Site"):
    nodes = []
    edges = []
    seen_nodes = set()
    seen_edges = set()

    site_id = "site:target"
    nodes.append({"id": site_id, "label": site_label, "type": "site"})
    seen_nodes.add(site_id)

    domain_degree = {}

    for _, row in df.iterrows():
        domain_id = f"domain:{row['domain']}"
        cookie_id = f"cookie:{row['domain']}:{row['name']}"
        category_id = f"category:{row['category']}"

        node_specs = [
            (domain_id, row["domain"], "domain"),
            (cookie_id, row["name"], "cookie"),
            (category_id, row["category"], "category"),
        ]

        for node_id, label, node_type in node_specs:
            if node_id not in seen_nodes:
                nodes.append({"id": node_id, "label": label, "type": node_type})
                seen_nodes.add(node_id)

        for source, target in [
            (site_id, domain_id),
            (domain_id, cookie_id),
            (cookie_id, category_id),
        ]:
            edge_id = f"{source}->{target}"
            if edge_id not in seen_edges:
                edges.append({"id": edge_id, "source": source, "target": target})
                seen_edges.add(edge_id)

        domain_degree[row["domain"]] = domain_degree.get(row["domain"], 0) + 1

    most_connected_domain = max(domain_degree, key=domain_degree.get) if domain_degree else "N/A"

    return {
        "nodes": nodes,
        "edges": edges,
        "stats": {
            "nodeCount": len(nodes),
            "edgeCount": len(edges),
            "thirdPartyLinks": int((df["party_type"] == "Third-Party").sum()) if not df.empty else 0,
            "mostConnectedDomain": most_connected_domain,
        },
    }