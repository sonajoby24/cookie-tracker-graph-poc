const output = document.getElementById("output");
const details = document.getElementById("details");

const loadCookiesBtn = document.getElementById("loadCookiesBtn");
const loadGraphBtn = document.getElementById("loadGraphBtn");
const fitGraphBtn = document.getElementById("fitGraphBtn");

const statCookies = document.getElementById("statCookies");
const statDomains = document.getElementById("statDomains");
const statSecure = document.getElementById("statSecure");
const statHttpOnly = document.getElementById("statHttpOnly");

let cy = null;
let latestGraph = null;

function updateCookieStats(cookieData) {
  const cookies = cookieData.cookies || [];
  const domains = new Set(cookies.map(c => c.domain));
  const secureCount = cookies.filter(c => c.secure).length;
  const httpOnlyCount = cookies.filter(c => c.httpOnly).length;

  statCookies.textContent = cookies.length;
  statDomains.textContent = domains.size;
  statSecure.textContent = secureCount;
  statHttpOnly.textContent = httpOnlyCount;
}

function updateGraphStats(graphData) {
  const domainCount = graphData.nodes.filter(n => n.type === "domain").length;
  const cookieCount = graphData.nodes.filter(n => n.type === "cookie").length;
  const secureCount = graphData.nodes.filter(
    n => n.type === "cookie" && n.details && n.details.secure
  ).length;
  const httpOnlyCount = graphData.nodes.filter(
    n => n.type === "cookie" && n.details && n.details.httpOnly
  ).length;

  statCookies.textContent = cookieCount;
  statDomains.textContent = domainCount;
  statSecure.textContent = secureCount;
  statHttpOnly.textContent = httpOnlyCount;
}

async function loadCookies() {
  try {
    const res = await fetch("http://127.0.0.1:8000/cookies");
    const data = await res.json();
    output.textContent = JSON.stringify(data, null, 2);
    details.textContent = "Loaded cookie JSON.\n\nClick Load Graph to visualize it.";
    updateCookieStats(data);
  } catch (err) {
    output.textContent = "Error loading cookies: " + err.message;
  }
}

function renderGraph(data) {
  const elements = [];

  data.nodes.forEach(node => {
    elements.push({
      data: {
        id: node.id,
        label: node.label,
        type: node.type,
        details: node.details || null
      }
    });
  });

  data.edges.forEach((edge, index) => {
    elements.push({
      data: {
        id: "edge-" + index,
        source: edge.source,
        target: edge.target,
        label: edge.label
      }
    });
  });

  if (cy) {
    cy.destroy();
  }

  cy = cytoscape({
    container: document.getElementById("cy"),
    elements: elements,
    style: [
      {
        selector: "node",
        style: {
          "label": "data(label)",
          "text-valign": "center",
          "text-halign": "center",
          "color": "#ffffff",
          "font-size": "11px",
          "font-weight": "600",
          "text-wrap": "wrap",
          "text-max-width": "100px",
          "border-width": 2,
          "border-color": "#dfe6ff"
        }
      },
      {
        selector: 'node[type="site"]',
        style: {
          "background-color": "#7c4dff",
          "shape": "round-rectangle",
          "width": 120,
          "height": 56
        }
      },
      {
        selector: 'node[type="domain"]',
        style: {
          "background-color": "#2196f3",
          "shape": "ellipse",
          "width": 100,
          "height": 100
        }
      },
      {
        selector: 'node[type="cookie"]',
        style: {
          "background-color": "#00c853",
          "shape": "hexagon",
          "width": 110,
          "height": 100
        }
      },
      {
        selector: "edge",
        style: {
          "width": 2.5,
          "line-color": "#90a4ff",
          "target-arrow-color": "#90a4ff",
          "target-arrow-shape": "triangle",
          "curve-style": "bezier",
          "label": "data(label)",
          "font-size": "9px",
          "color": "#dbe3ff",
          "text-rotation": "autorotate"
        }
      },
      {
        selector: ":selected",
        style: {
          "border-color": "#ffd54f",
          "border-width": 4
        }
      }
    ],
    layout: {
      name: "breadthfirst",
      directed: true,
      padding: 30,
      spacingFactor: 1.4,
      animate: true
    }
  });

  cy.on("tap", "node", function (evt) {
    const node = evt.target;
    details.textContent = JSON.stringify(node.data(), null, 2);
  });

  cy.fit();
}

async function loadGraph() {
  try {
    const res = await fetch("http://127.0.0.1:8000/graph");
    const data = await res.json();
    latestGraph = data;
    output.textContent = JSON.stringify(data, null, 2);
    updateGraphStats(data);
    renderGraph(data);
    details.textContent = "Graph loaded.\n\nClick any node to inspect it.";
  } catch (err) {
    output.textContent = "Error loading graph: " + err.message;
  }
}

loadCookiesBtn.addEventListener("click", loadCookies);
loadGraphBtn.addEventListener("click", loadGraph);

fitGraphBtn.addEventListener("click", () => {
  if (cy) {
    cy.fit();
  }
});