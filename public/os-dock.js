/**
 * Ordinance Systems — Universal App Dock
 * Inject into any HTML page via: <script src="http://localhost:3000/os-dock.js"></script>
 * Provides cross-navigation between all Ordinance Systems products.
 */
(function () {
    if (document.getElementById("os-dock-root")) return;

    const apps = [
        { code: "FU", name: "FollowUp", href: "http://localhost:5500/follow%20up%20-%20lead%20reponse/dashboard.html" },
        { code: "NU", name: "Numbers", href: "http://localhost:3000/" },
        { code: "SQ", name: "Sequence", href: "http://localhost:5500/sequence/index.html" },
        { code: "PD", name: "PaddleDuck", href: "http://localhost:3001" },
        { code: "ME", name: "Measure", href: "http://localhost:3000/measure" },
        { code: "IN", name: "Inspect", href: "http://localhost:3000/inspect" },
        { code: "LE", name: "Ledger", href: "http://localhost:3000/ledger" },
        { code: "RE", name: "Reveal", href: "http://localhost:3000/reveal" },
    ];

    const root = document.createElement("div");
    root.id = "os-dock-root";
    document.body.appendChild(root);

    const style = document.createElement("style");
    style.textContent = `
    #os-dock-root { font-family: 'Inter', 'Helvetica Neue', sans-serif; }
    #os-dock-trigger {
      position: fixed; bottom: 32px; right: 32px; z-index: 99999;
      width: 48px; height: 48px; background: #111; color: #fff;
      display: flex; align-items: center; justify-content: center;
      font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase;
      font-weight: 700; border: none; cursor: pointer;
      transition: background 0.2s, transform 0.2s;
    }
    #os-dock-trigger:hover { background: #333; transform: scale(1.05); }
    #os-dock-panel {
      position: fixed; bottom: 96px; right: 32px; z-index: 99998;
      background: #fafafa; border: 1px solid #e5e5e5;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.15);
      width: 288px; display: none;
      animation: osDockIn 0.25s ease-out;
    }
    #os-dock-panel.open { display: block; }
    @keyframes osDockIn {
      from { opacity: 0; transform: translateY(10px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .os-dock-header {
      padding: 16px 20px; border-bottom: 1px solid #f0f0f0;
      font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase;
      font-weight: 500; color: #bbb;
    }
    .os-dock-list { padding: 4px 0; }
    .os-dock-item {
      display: flex; align-items: center; gap: 16px;
      padding: 12px 20px; text-decoration: none; color: #888;
      transition: background 0.2s;
    }
    .os-dock-item:hover { background: #f0f0f0; }
    .os-dock-item:hover .os-dock-code { background: #111; color: #fff; border-color: #111; }
    .os-dock-item:hover .os-dock-name { color: #111; }
    .os-dock-code {
      width: 32px; height: 32px; display: flex; align-items: center;
      justify-content: center; font-size: 10px; letter-spacing: 0.05em;
      font-weight: 700; border: 1px solid #e5e5e5; color: #999;
      transition: all 0.2s;
    }
    .os-dock-name {
      font-size: 14px; font-weight: 200; letter-spacing: 0.03em;
      transition: color 0.2s;
    }
    .os-dock-hub {
      display: block; padding: 12px 20px; border-top: 1px solid #f0f0f0;
      font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
      font-weight: 500; color: #bbb; text-decoration: none;
      transition: all 0.2s;
    }
    .os-dock-hub:hover { color: #111; background: #f0f0f0; }
  `;
    document.head.appendChild(style);

    // Build UI
    const trigger = document.createElement("button");
    trigger.id = "os-dock-trigger";
    trigger.textContent = "OS";

    const panel = document.createElement("div");
    panel.id = "os-dock-panel";

    panel.innerHTML = `
    <div class="os-dock-header">Ordinance Systems</div>
    <div class="os-dock-list">
      ${apps.map((a) => `
        <a class="os-dock-item" href="${a.href}" target="_blank" rel="noopener noreferrer">
          <span class="os-dock-code">${a.code}</span>
          <span class="os-dock-name">${a.name}</span>
        </a>
      `).join("")}
    </div>
    <a class="os-dock-hub" href="http://localhost:3000/hub" target="_blank" rel="noopener noreferrer">← Command Center</a>
  `;

    root.appendChild(trigger);
    root.appendChild(panel);

    let isOpen = false;
    trigger.addEventListener("click", () => {
        isOpen = !isOpen;
        panel.classList.toggle("open", isOpen);
        trigger.textContent = isOpen ? "×" : "OS";
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
        if (isOpen && !root.contains(e.target)) {
            isOpen = false;
            panel.classList.remove("open");
            trigger.textContent = "OS";
        }
    });
})();
