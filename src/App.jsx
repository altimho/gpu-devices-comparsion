import { useState, useMemo } from "react";

// ─── COMPARISON TABLE DATA ────────────────────────────────────────────────────
const tableData = [
  { gen: "M1", chip: "M1 (7-core)", gpuCores: 7,  nvLaptop: "GTX 1050 Ti Laptop", nvDesktop: "GTX 960",          notes: "" },
  { gen: "M1", chip: "M1 (8-core)", gpuCores: 8,  nvLaptop: "GTX 1060 Laptop",    nvDesktop: "GTX 1060",         notes: "" },
  { gen: "M1", chip: "M1 Pro (14-core)", gpuCores: 14, nvLaptop: "RTX 3050 Laptop",    nvDesktop: "GTX 1070",         notes: "" },
  { gen: "M1", chip: "M1 Pro (16-core)", gpuCores: 16, nvLaptop: "RTX 3050 Ti Laptop", nvDesktop: "GTX 1070 Ti",      notes: "" },
  { gen: "M1", chip: "M1 Max (24-core)", gpuCores: 24, nvLaptop: "RTX 3060 Laptop",    nvDesktop: "RTX 3060",         notes: "" },
  { gen: "M1", chip: "M1 Max (32-core)", gpuCores: 32, nvLaptop: "RTX 3070 Laptop",    nvDesktop: "RTX 3060 Ti",      notes: "" },
  { gen: "M2", chip: "M2 (10-core)",    gpuCores: 10, nvLaptop: "GTX 1660 Ti Laptop",  nvDesktop: "GTX 1070",         notes: "" },
  { gen: "M2", chip: "M2 Pro (16-core)",gpuCores: 16, nvLaptop: "RTX 3060 Laptop",     nvDesktop: "RTX 3060",         notes: "" },
  { gen: "M2", chip: "M2 Max (30-core)",gpuCores: 30, nvLaptop: "RTX 3070 Ti Laptop",  nvDesktop: "RTX 3070",         notes: "" },
  { gen: "M2", chip: "M2 Max (38-core)",gpuCores: 38, nvLaptop: "RTX 3080 Laptop",     nvDesktop: "RTX 3070 Ti",      notes: "" },
  { gen: "M3", chip: "M3 (10-core)",    gpuCores: 10, nvLaptop: "RTX 3060 Laptop",     nvDesktop: "RTX 3060",         notes: "1st gen HW ray tracing" },
  { gen: "M3", chip: "M3 Pro (18-core)",gpuCores: 18, nvLaptop: "RTX 4060 Laptop",     nvDesktop: "RTX 3070",         notes: "" },
  { gen: "M3", chip: "M3 Max (40-core)",gpuCores: 40, nvLaptop: "RTX 4070 Laptop",     nvDesktop: "RTX 3080 Ti",      notes: "" },
  { gen: "M4", chip: "M4 (10-core)",    gpuCores: 10, nvLaptop: "GTX 1650 Laptop",     nvDesktop: "GTX 1650",         notes: "Weaker than M2 in games due to arch. change" },
  { gen: "M4", chip: "M4 Pro (20-core)",gpuCores: 20, nvLaptop: "RTX 4060 Laptop",     nvDesktop: "RTX 3070",         notes: "" },
  { gen: "M4", chip: "M4 Max (32-core)",gpuCores: 32, nvLaptop: "RTX 4060 Laptop",     nvDesktop: "RTX 4060",         notes: "" },
  { gen: "M4", chip: "M4 Max (40-core)",gpuCores: 40, nvLaptop: "RTX 4070 Laptop",     nvDesktop: "RTX 4070 / 3080 Ti", notes: "Blender: −30% vs RTX 4090" },
  { gen: "M5", chip: "M5 (10-core)",    gpuCores: 10, nvLaptop: "RTX 3050 Laptop",     nvDesktop: "GTX 1660 Ti",      notes: "Cyberpunk Low+MetalFX: 35–45 FPS" },
  { gen: "M5", chip: "M5 Pro (20-core)",gpuCores: 20, nvLaptop: "RTX 4070 Laptop",     nvDesktop: "RTX 4070",         notes: "+24–26% vs M4 Pro; OpenCL ≈ RTX 4070 desktop" },
  { gen: "M5", chip: "M5 Max (40-core)",gpuCores: 40, nvLaptop: "RTX 5070 Laptop",     nvDesktop: "RTX 4070 Ti",      notes: "OpenCL: RTX 5070 Laptop level" },
  // ── Consoles & Other ─────────────────────────────────────────────────────
  { gen: "Other", chip: "Steam Deck OLED",               gpuCores: 8,    nvLaptop: "GTX 1050 Laptop",        nvDesktop: "GTX 1050 Ti",              notes: "Handheld, 800p, 4–15W, RDNA 2" },
  { gen: "Other", chip: "Nintendo Switch 2 (docked)",    gpuCores: null, nvLaptop: "RTX 2050 Laptop",        nvDesktop: "GTX 1050 Ti / GTX 1650",   notes: "Ampere, 3 TFLOPS, DLSS, $449" },
  { gen: "Other", chip: "Xbox Series S",                 gpuCores: null, nvLaptop: "GTX 1660 Super Laptop",  nvDesktop: "GTX 1660 Super",           notes: "RDNA 2, 4 TFLOPS, 1440p/60" },
  { gen: "Other", chip: "PS5 / Xbox Series X",           gpuCores: null, nvLaptop: "RTX 3060 Ti Laptop",     nvDesktop: "RTX 3060 Ti",              notes: "RDNA 2, ~10–12 TFLOPS, $499" },
  { gen: "Other", chip: "PS5 Pro",                       gpuCores: null, nvLaptop: "RTX 5060 Ti Laptop",     nvDesktop: "RTX 5060 Ti",              notes: "RDNA 3.5, 45% faster than PS5 (DF 2025), $699" },
  { gen: "Other", chip: "Framework Desktop (AI Max 385)",gpuCores: 32,   nvLaptop: "RTX 4060 Laptop",        nvDesktop: "RTX 4060",                 notes: "Radeon 8050S, 32 CU iGPU, $1099" },
  { gen: "Other", chip: "Framework Desktop (AI Max+ 395)",gpuCores: 40,  nvLaptop: "RTX 4060 Ti Laptop",     nvDesktop: "RTX 4060 Ti / Intel B580", notes: "Radeon 8060S, 40 CU iGPU, $1699" },
  { gen: "Other", chip: "Steam Machine (hyp.)",           gpuCores: 28,  nvLaptop: "RTX 3060 Laptop",        nvDesktop: "RTX 3060 / RX 7600",       notes: "RDNA 3, 28 CU, 8GB GDDR6, SteamOS +30% vs Windows. Price $699→$949?" },
];

// ─── VALUE RANKING DATA ───────────────────────────────────────────────────────
// Blender Open Data scores (Metal for Apple, OptiX/CUDA for NVIDIA).
// Prices: Mac Mini MSRP / GPU MSRP at launch in USD.
// ⚠ Apple Metal vs NVIDIA CUDA are different APIs — efficiency shown separately per type.
const valueData = [
  { name: "Apple M1 (8-core)",     type: "Apple",  price: 699,  blender: 320,  note: "Mac Mini M1 2020" , pcCost: 0 },
  { name: "Apple M2 (10-core)",    type: "Apple",  price: 599,  blender: 480,  note: "Mac Mini M2 2023" , pcCost: 0 },
  { name: "Apple M2 Pro (16-core)",type: "Apple",  price: 1299, blender: 940,  note: "Mac Mini M2 Pro 2023" , pcCost: 0 },
  { name: "Apple M4 (10-core)",    type: "Apple",  price: 599,  blender: 560,  note: "Mac Mini M4 2024" , pcCost: 0 },
  { name: "Apple M4 Pro (16-core)",type: "Apple",  price: 1399, blender: 2100, note: "Mac Mini M4 Pro 2024" , pcCost: 0 },
  { name: "Apple M5 (10-core)",    type: "Apple",  price: 699,  blender: 730,  note: "Mac Mini M5 2026 (est.)" , pcCost: 0 },
  { name: "Apple M5 Pro (20-core)",type: "Apple",  price: 1399, blender: 2600, note: "Mac Mini M5 Pro 2026 (est.)" , pcCost: 0 },
  // ── GTX ────────────────────────────────────────────────────────────────────
  { name: "GTX 960",               type: "NVIDIA", price: 199,  blender: 55,   note: "MSRP 2015" , pcCost: 350 },
  { name: "GTX 1060 6GB",          type: "NVIDIA", price: 249,  blender: 95,   note: "MSRP 2016" , pcCost: 350 },
  { name: "GTX 1070",              type: "NVIDIA", price: 379,  blender: 145,  note: "MSRP 2016" , pcCost: 350 },
  { name: "GTX 1070 Ti",           type: "NVIDIA", price: 449,  blender: 175,  note: "MSRP 2017" , pcCost: 350 },
  { name: "GTX 1080",              type: "NVIDIA", price: 599,  blender: 220,  note: "MSRP 2016 — top of its era" , pcCost: 350 },
  { name: "GTX 1080 Ti",           type: "NVIDIA", price: 699,  blender: 290,  note: "MSRP 2017 — legendary card" , pcCost: 350 },
  { name: "GTX 1650",              type: "NVIDIA", price: 149,  blender: 72,   note: "MSRP 2019" , pcCost: 350 },
  { name: "GTX 1660 Ti",           type: "NVIDIA", price: 279,  blender: 185,  note: "MSRP 2019" , pcCost: 350 },
  // ── RTX 20xx ──────────────────────────────────────────────────────────────
  { name: "RTX 2060 Super",        type: "NVIDIA", price: 399,  blender: 650,  note: "MSRP 2019" , pcCost: 350 },
  { name: "RTX 2070 Super",        type: "NVIDIA", price: 499,  blender: 820,  note: "MSRP 2019" , pcCost: 350 },
  { name: "RTX 2080 Ti",           type: "NVIDIA", price: 999,  blender: 1950, note: "MSRP 2018 — Turing flagship" , pcCost: 350 },
  // ── RTX 30xx ──────────────────────────────────────────────────────────────
  { name: "RTX 3050",              type: "NVIDIA", price: 249,  blender: 700,  note: "MSRP 2022" , pcCost: 350 },
  { name: "RTX 3060",              type: "NVIDIA", price: 329,  blender: 1350, note: "MSRP 2021" , pcCost: 350 },
  { name: "RTX 3060 Ti",          type: "NVIDIA", price: 399,  blender: 1900, note: "MSRP 2020" , pcCost: 350 },
  { name: "RTX 3070",              type: "NVIDIA", price: 499,  blender: 2350, note: "MSRP 2020" , pcCost: 350 },
  { name: "RTX 3070 Ti",          type: "NVIDIA", price: 599,  blender: 2650, note: "MSRP 2021" , pcCost: 350 },
  { name: "RTX 3080 10GB",        type: "NVIDIA", price: 699,  blender: 4700, note: "MSRP 2020 — crowd favorite" , pcCost: 350 },
  { name: "RTX 3080 12GB",        type: "NVIDIA", price: 799,  blender: 4900, note: "MSRP 2022" , pcCost: 350 },
  { name: "RTX 3080 Ti",          type: "NVIDIA", price: 1199, blender: 5193, note: "MSRP 2021" , pcCost: 350 },
  { name: "RTX 3090",              type: "NVIDIA", price: 1499, blender: 6200, note: "MSRP 2020 — 24 GB VRAM" , pcCost: 350 },
  { name: "RTX 3090 Ti",          type: "NVIDIA", price: 1999, blender: 7000, note: "MSRP 2022" , pcCost: 350 },
  // ── RTX 40xx ──────────────────────────────────────────────────────────────
  { name: "RTX 4060",              type: "NVIDIA", price: 299,  blender: 2600, note: "MSRP 2023" , pcCost: 350 },
  { name: "RTX 4060 Ti",          type: "NVIDIA", price: 399,  blender: 3200, note: "MSRP 2023" , pcCost: 350 },
  { name: "RTX 4070",              type: "NVIDIA", price: 599,  blender: 5128, note: "MSRP 2023" , pcCost: 350 },
  { name: "RTX 4070 Super",       type: "NVIDIA", price: 599,  blender: 6200, note: "MSRP 2024 — best sweet spot 40xx" , pcCost: 350 },
  { name: "RTX 4070 Ti",          type: "NVIDIA", price: 799,  blender: 7200, note: "MSRP 2023" , pcCost: 350 },
  { name: "RTX 4070 Ti Super",    type: "NVIDIA", price: 799,  blender: 8100, note: "MSRP 2024" , pcCost: 350 },
  { name: "RTX 4080",              type: "NVIDIA", price: 1199, blender: 8500, note: "MSRP 2022" , pcCost: 350 },
  { name: "RTX 4080 Super",       type: "NVIDIA", price: 999,  blender: 10100, note: "MSRP 2024 — best sweet spot 40xx high-end" , pcCost: 350 },
  { name: "RTX 4090",              type: "NVIDIA", price: 1599, blender: 10880,note: "MSRP 2022 — flagship of the generation" , pcCost: 350 },
  // ── RTX 50xx ──────────────────────────────────────────────────────────────
  { name: "RTX 5060 Ti",          type: "NVIDIA", price: 379,  blender: 4800, note: "MSRP 2025" , pcCost: 350 },
  { name: "RTX 5070",              type: "NVIDIA", price: 549,  blender: 7500, note: "MSRP 2025" , pcCost: 350 },
  { name: "RTX 5070 Ti",          type: "NVIDIA", price: 749,  blender: 9200, note: "MSRP 2025 — ≈ RTX 4080 for $749" , pcCost: 350 },
  { name: "RTX 5080",              type: "NVIDIA", price: 999,  blender: 9800, note: "MSRP 2025" , pcCost: 350 },
  { name: "RTX 5090",              type: "NVIDIA", price: 1999, blender: 14945,note: "MSRP 2025 — new flagship" , pcCost: 350 },
  // ── Consoles & Framework ──────────────────────────────────────────────────
  // Blender scores for consoles are estimated/unavailable — shown as gaming performance proxy
  // Price = full device MSRP. Rows with 🔺 — updated prices after price hike
  { name: "Steam Deck OLED",               type: "Other", price: 549,  blender: 55,   note: "Before price hike (May 2026). Handheld, 800p, ~GTX 1050 Ti" , pcCost: 0 },
  { name: "Steam Deck OLED 🔺",            type: "Other", price: 789,  blender: 55,   note: "After price hike — May 2026 (+$240). RAM/tariff crisis" , pcCost: 0 },
  { name: "Nintendo Switch 2",             type: "Other", price: 449,  blender: 80,   note: "Before price hike. Docked, Ampere, DLSS, ~GTX 1050 Ti–1650" , pcCost: 0 },
  { name: "Nintendo Switch 2 🔺",          type: "Other", price: 499,  blender: 80,   note: "After price hike — from Sep 1, 2026 (+$50)" , pcCost: 0 },
  { name: "Xbox Series S",                 type: "Other", price: 299,  blender: 130,  note: "RDNA 2, 4 TFLOPS, ~GTX 1660 Super" , pcCost: 0 },
  { name: "PS5 / Xbox Series X",           type: "Other", price: 499,  blender: 1900, note: "RDNA 2, ~RTX 3060 Ti — console optimization" , pcCost: 0 },
  { name: "PS5 Pro",                       type: "Other", price: 699,  blender: 3200, note: "Before price hike. RDNA 3.5, ~RTX 5060 Ti (DF 2025)" , pcCost: 0 },
  { name: "PS5 Pro 🔺",                    type: "Other", price: 899,  blender: 3200, note: "After Sony price hike 2026 (+$200)" , pcCost: 0 },
  { name: "Steam Machine (hyp.)",          type: "Other", price: 699,  blender: 1500, note: "Estimated pre-crisis (LTT). RDNA 3, 28 CU, ~RX 7600, SteamOS" , pcCost: 0 },
  { name: "Steam Machine 🔺 (hyp.)",       type: "Other", price: 949,  blender: 1500, note: "Estimated post-RAM/tariff crisis 2026. Not officially announced" , pcCost: 0 },
  { name: "Framework Desktop (AI Max 385)",type: "Other", price: 1099, blender: 1800, note: "Radeon 8050S, full computer without OS/SSD" , pcCost: 0 },
  { name: "Framework Desktop (AI Max+ 395)",type:"Other", price: 1699, blender: 1900, note: "Radeon 8060S, full computer without OS/SSD" , pcCost: 0 },
];

// ─── SHARED STYLES ────────────────────────────────────────────────────────────
const GEN_COLORS = {
  M1:    { bg: "rgba(120,180,255,0.13)", accent: "#60a5fa", dot: "#3b82f6" },
  M2:    { bg: "rgba(160,130,255,0.13)", accent: "#a78bfa", dot: "#8b5cf6" },
  M3:    { bg: "rgba(100,210,180,0.13)", accent: "#34d399", dot: "#10b981" },
  M4:    { bg: "rgba(255,180,80,0.13)",  accent: "#fbbf24", dot: "#f59e0b" },
  M5:    { bg: "rgba(255,100,100,0.13)", accent: "#f87171", dot: "#ef4444" },
  Other: { bg: "rgba(220,180,255,0.13)", accent: "#c084fc", dot: "#a855f7" },
};

const TYPE_COLORS = {
  Apple:  { bg: "rgba(120,180,255,0.13)", accent: "#60a5fa", dot: "#3b82f6" },
  NVIDIA: { bg: "rgba(118,185,0,0.13)",   accent: "#84cc16", dot: "#65a30d" },
  Other:  { bg: "rgba(220,180,255,0.13)", accent: "#c084fc", dot: "#a855f7" },
};

function SortIcon({ active, dir }) {
  return (
    <span style={{ marginLeft: 4, opacity: active ? 1 : 0.3, fontSize: 11 }}>
      {active ? (dir === "asc" ? "▲" : "▼") : "⇅"}
    </span>
  );
}

// ─── TAB 1: VALUE RANKING ────────────────────────────────────────────────────
function ValueTab() {
  const [activeTypes, setActiveTypes] = useState(new Set());  // empty = show all
  const [sortKey, setSortKey] = useState("efficiency");
  const [sortDir, setSortDir] = useState("desc");
  const types = ["Apple","NVIDIA","Other"];

  function toggleType(t) {
    setActiveTypes(prev => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t); else next.add(t);
      return next;
    });
  }

  function toggleSort(key) {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  }

  const sorted = useMemo(() => {
    let rows = valueData.map(r => ({ ...r, totalPrice: r.price + (r.pcCost || 0), efficiency: parseFloat((r.blender / (r.price + (r.pcCost || 0))).toFixed(2)) }));
    if (activeTypes.size > 0) rows = rows.filter(r => activeTypes.has(r.type));
    rows.sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      if (typeof av === "number") return sortDir === "asc" ? av - bv : bv - av;
      return sortDir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
    return rows;
  }, [activeTypes, sortKey, sortDir]);

  const maxEff = useMemo(() => {
    const all = valueData.map(r => r.blender / (r.price + (r.pcCost || 0)));
    return Math.max(...all);
  }, []);

  const topEff = sorted.length > 0 ? sorted[0].efficiency : 1;

  return (
    <>
      {/* Controls */}
      <div style={{ display:"flex", alignItems:"center", gap:12, flexWrap:"wrap", marginBottom:20 }}>
        <div style={{ fontSize:12, color:"#475569", letterSpacing:"0.05em" }}>Filter:</div>
        <button className="gen-btn" onClick={() => setActiveTypes(new Set())} style={{
          background: activeTypes.size === 0 ? "rgba(255,255,255,0.1)" : "transparent",
          borderColor: activeTypes.size === 0 ? "#64748b" : "#2d2d4e",
          color: activeTypes.size === 0 ? "#e2e8f0" : "#475569",
        }}>All</button>
        {types.map(t => {
          const active = activeTypes.has(t);
          const col = TYPE_COLORS[t];
          return (
            <button key={t} className="gen-btn multi-btn" onClick={() => toggleType(t)} style={{
              background: active ? col.bg : "transparent",
              borderColor: active ? col.accent : "#2d2d4e",
              color: active ? col.accent : "#475569",
              boxShadow: active ? `0 0 0 1px ${col.accent}55` : "none",
            }}>
              {active && <span style={{marginRight:4, fontSize:10}}>✓</span>}{t}
            </button>
          );
        })}
        <span style={{ marginLeft:"auto", fontSize:11, color:"#334155" }}>
          ⚠ Metal (Apple) ≠ CUDA (NVIDIA) — different APIs
        </span>
      </div>

      <div style={{ background:"#12121f", borderRadius:12, border:"1px solid #1e1e36", overflow:"hidden" }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ borderBottom:"1px solid #1e1e36" }}>
                <th className="col-header" style={{ width:44, cursor:"default", textAlign:"center" }}>#</th>
                <th className="col-header" style={{ width:36, cursor:"default" }}></th>
                <th className="col-header" onClick={() => toggleSort("name")}>
                  Device <SortIcon active={sortKey==="name"} dir={sortDir} />
                </th>
                <th className="col-header" onClick={() => toggleSort("type")}>
                  Type <SortIcon active={sortKey==="type"} dir={sortDir} />
                </th>
                <th className="col-header" onClick={() => toggleSort("price")} style={{ textAlign:"right" }}>
                  GPU / Device <SortIcon active={sortKey==="price"} dir={sortDir} />
                </th>
                <th className="col-header" style={{ textAlign:"right", cursor:"default", color:"#475569" }}>+ PC</th>
                <th className="col-header" onClick={() => toggleSort("totalPrice")} style={{ textAlign:"right" }}>
                  Total <SortIcon active={sortKey==="totalPrice"} dir={sortDir} />
                </th>
                <th className="col-header" onClick={() => toggleSort("blender")} style={{ textAlign:"right" }}>
                  Blender <SortIcon active={sortKey==="blender"} dir={sortDir} />
                </th>
                <th className="col-header" onClick={() => toggleSort("efficiency")} style={{ minWidth:200 }}>
                  Efficiency (pts/$) <SortIcon active={sortKey==="efficiency"} dir={sortDir} />
                </th>
                <th className="col-header" style={{ cursor:"default" }}>Price Tier</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((row, i) => {
                const col = TYPE_COLORS[row.type];
                const barBase = sortKey === "efficiency" ? (sorted[0]?.efficiency || 1) : maxEff;
                const barPct = Math.min(100, (row.efficiency / barBase) * 100);
                const isTop3 = sortKey === "efficiency" && i < 3;
                return (
                  <tr key={row.name} className="row-hover" style={{
                    background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.018)",
                    borderBottom:"1px solid #1a1a2e",
                  }}>
                    {/* Rank */}
                    <td style={{ padding:"10px 8px", textAlign:"center" }}>
                      {isTop3
                        ? <span style={{ fontSize:16 }}>{["🥇","🥈","🥉"][i]}</span>
                        : <span style={{ fontSize:12, color:"#475569" }}>{i + 1}</span>}
                    </td>
                    {/* Dot */}
                    <td style={{ padding:"10px 8px", textAlign:"center" }}>
                      <span style={{ display:"inline-block", width:8, height:8, borderRadius:"50%", background:col.dot, boxShadow:`0 0 6px ${col.dot}88` }} />
                    </td>
                    {/* Name */}
                    <td style={{ padding:"10px 16px" }}>
                      <div style={{ fontSize:13, color:"#e2e8f0", fontWeight:500 }}>{row.name}</div>
                      <div style={{ fontSize:11, color:"#475569", marginTop:2 }}>{row.note}</div>
                    </td>
                    {/* Type */}
                    <td style={{ padding:"10px 12px" }}>
                      <span className="chip-tag" style={{ background:col.bg, color:col.accent, border:`1px solid ${col.accent}33` }}>{row.type}</span>
                    </td>
                    {/* Price: GPU/device */}
                    <td style={{ padding:"10px 16px", textAlign:"right", fontSize:13, color:"#94a3b8", fontVariantNumeric:"tabular-nums" }}>
                      ${row.price.toLocaleString()}
                    </td>
                    {/* +PC cost */}
                    <td style={{ padding:"10px 12px", textAlign:"right", fontSize:12, color:"#475569", fontVariantNumeric:"tabular-nums" }}>
                      {row.pcCost > 0 ? <span style={{color:"#4b5563"}}>+$350</span> : <span style={{color:"#1e1e36"}}>—</span>}
                    </td>
                    {/* Total */}
                    <td style={{ padding:"10px 16px", textAlign:"right", fontSize:13, fontWeight:600, color:"#e2e8f0", fontVariantNumeric:"tabular-nums" }}>
                      ${row.totalPrice.toLocaleString()}
                    </td>
                    {/* Blender */}
                    <td style={{ padding:"10px 16px", textAlign:"right", fontSize:13, color:"#94a3b8", fontVariantNumeric:"tabular-nums" }}>
                      {row.blender.toLocaleString()}
                    </td>
                    {/* Bar */}
                    <td style={{ padding:"10px 16px", minWidth:200 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <div style={{ flex:1, height:6, background:"#1e1e36", borderRadius:3, overflow:"hidden" }}>
                          <div style={{
                            height:"100%", borderRadius:3,
                            width:`${barPct}%`,
                            background: isTop3
                              ? `linear-gradient(90deg, ${col.accent}, ${col.dot})`
                              : col.dot,
                            transition:"width 0.3s ease",
                          }} />
                        </div>
                        <span style={{ fontSize:12, color:col.accent, minWidth:42, textAlign:"right", fontVariantNumeric:"tabular-nums" }}>
                          {row.efficiency.toFixed(2)}
                        </span>
                      </div>
                    </td>
                    {/* Price tier */}
                    <td style={{ padding:"10px 12px" }}>
                      <span style={{
                        fontSize:11, padding:"2px 7px", borderRadius:4,
                        background: row.price < 400 ? "rgba(52,211,153,0.12)"
                          : row.price < 800 ? "rgba(251,191,36,0.12)"
                          : "rgba(248,113,113,0.12)",
                        color: row.price < 400 ? "#34d399"
                          : row.price < 800 ? "#fbbf24"
                          : "#f87171",
                        border: `1px solid ${row.price < 400 ? "#34d39933" : row.price < 800 ? "#fbbf2433" : "#f8717133"}`,
                      }}>
                        {row.price < 400 ? "Budget" : row.price < 800 ? "Mid-range" : "Premium"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginTop:14, fontSize:11, color:"#334155", lineHeight:1.6 }}>
        Blender Open Data (Metal for Apple, OptiX/CUDA for NVIDIA). NVIDIA: GPU price + $350 (minimum build: CPU+motherboard+16GB RAM+500GB SSD). Apple/consoles/Framework: full device price.<br />
        Apple: full Mac Mini price (computer). NVIDIA: GPU price only. Direct comparison is approximate.
      </div>
    </>
  );
}

// ─── TAB 2: COMPARISON TABLE ─────────────────────────────────────────────────
function CompareTab() {
  const [search, setSearch] = useState("");
  const [activeGens, setActiveGens] = useState(new Set());  // empty = show all
  const [sort, setSort] = useState({ key: null, dir: "asc" });
  const gens = ["M1","M2","M3","M4","M5","Other"];

  function toggleGen(g) {
    setActiveGens(prev => {
      const next = new Set(prev);
      if (next.has(g)) next.delete(g); else next.add(g);
      return next;
    });
  }

  const filtered = useMemo(() => {
    let rows = tableData;
    if (activeGens.size > 0) rows = rows.filter(r => activeGens.has(r.gen));
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(r =>
        r.chip.toLowerCase().includes(q) ||
        r.nvLaptop.toLowerCase().includes(q) ||
        r.nvDesktop.toLowerCase().includes(q) ||
        r.notes.toLowerCase().includes(q)
      );
    }
    if (sort.key) {
      rows = [...rows].sort((a, b) => {
        const av = a[sort.key], bv = b[sort.key];
        if (typeof av === "number") return sort.dir === "asc" ? av - bv : bv - av;
        return sort.dir === "asc"
          ? String(av).localeCompare(String(bv))
          : String(bv).localeCompare(String(av));
      });
    }
    return rows;
  }, [search, activeGens, sort]);

  function toggleSort(key) {
    setSort(prev =>
      prev.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" }
    );
  }

  return (
    <>
      {/* Controls */}
      <div style={{ display:"flex", alignItems:"center", gap:12, flexWrap:"wrap", marginBottom:20 }}>
        <input className="search-input" placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} />
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", alignItems:"center" }}>
          <button className="gen-btn" onClick={() => setActiveGens(new Set())} style={{
            background: activeGens.size === 0 ? "rgba(255,255,255,0.1)" : "transparent",
            borderColor: activeGens.size === 0 ? "#64748b" : "#2d2d4e",
            color: activeGens.size === 0 ? "#e2e8f0" : "#475569",
          }}>All</button>
          {gens.map(g => {
            const active = activeGens.has(g);
            const col = GEN_COLORS[g];
            return (
              <button key={g} className="gen-btn multi-btn" onClick={() => toggleGen(g)} style={{
                background: active ? col.bg : "transparent",
                borderColor: active ? col.accent : "#2d2d4e",
                color: active ? col.accent : "#475569",
                boxShadow: active ? `0 0 0 1px ${col.accent}55` : "none",
              }}>
                {active && <span style={{marginRight:4, fontSize:10}}>✓</span>}{g}
              </button>
            );
          })}
        </div>
        <span style={{ marginLeft:"auto", fontSize:12, color:"#475569" }}>{filtered.length} / {tableData.length}</span>
      </div>

      {/* Table */}
      <div style={{ background:"#12121f", borderRadius:12, border:"1px solid #1e1e36", overflow:"hidden" }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ borderBottom:"1px solid #1e1e36" }}>
                <th className="col-header" style={{ width:36, cursor:"default" }}></th>
                <th className="col-header" onClick={() => toggleSort("chip")}>
                  Chip <SortIcon active={sort.key==="chip"} dir={sort.dir} />
                </th>
                <th className="col-header" onClick={() => toggleSort("gpuCores")} style={{ textAlign:"center" }}>
                  GPU Cores <SortIcon active={sort.key==="gpuCores"} dir={sort.dir} />
                </th>
                <th className="col-header" onClick={() => toggleSort("nvLaptop")}>
                  NVIDIA (Laptop) <SortIcon active={sort.key==="nvLaptop"} dir={sort.dir} />
                </th>
                <th className="col-header" onClick={() => toggleSort("nvDesktop")}>
                  NVIDIA (Desktop) <SortIcon active={sort.key==="nvDesktop"} dir={sort.dir} />
                </th>
                <th className="col-header">Notes</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6} style={{ padding:32, textAlign:"center", color:"#475569", fontSize:13 }}>Nothing found</td></tr>
              )}
              {filtered.map((row, i) => {
                const col = GEN_COLORS[row.gen];
                return (
                  <tr key={row.chip} className="row-hover" style={{
                    background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.018)",
                    borderBottom:"1px solid #1a1a2e",
                  }}>
                    <td style={{ padding:"10px 8px 10px 16px", textAlign:"center" }}>
                      <span style={{ display:"inline-block", width:8, height:8, borderRadius:"50%", background:col.dot, boxShadow:`0 0 6px ${col.dot}88` }} />
                    </td>
                    <td style={{ padding:"10px 16px" }}>
                      <span className="chip-tag" style={{ background:col.bg, color:col.accent, border:`1px solid ${col.accent}33` }}>{row.chip}</span>
                    </td>
                    <td style={{ padding:"10px 16px", textAlign:"center" }}>
                      <span style={{ display:"inline-block", minWidth:32, padding:"2px 8px", background:"#1e1e36", borderRadius:4, fontSize:13, fontWeight:500, color:"#94a3b8" }}>{row.gpuCores}</span>
                    </td>
                    <td style={{ padding:"10px 16px", fontSize:13, color:"#cbd5e1" }}>{row.nvLaptop}</td>
                    <td style={{ padding:"10px 16px", fontSize:13, color:"#cbd5e1" }}>{row.nvDesktop}</td>
                    <td style={{ padding:"10px 16px" }}>
                      {row.notes
                        ? <span className="note-badge">{row.notes}</span>
                        : <span style={{ color:"#2d2d4e", fontSize:12 }}>—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display:"flex", gap:20, flexWrap:"wrap", alignItems:"center", marginTop:16 }}>
        {Object.entries(GEN_COLORS).map(([gen, col]) => (
          <span key={gen} style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"#64748b" }}>
            <span style={{ width:8, height:8, borderRadius:"50%", background:col.dot, display:"inline-block" }} />
            {gen}
          </span>
        ))}
        <span style={{ marginLeft:"auto", fontSize:11, color:"#334155" }}>* Native Metal games, 1080p. Approximate data.</span>
      </div>
    </>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("value");

  return (
    <div style={{
      minHeight:"100vh",
      background:"#0d0d14",
      color:"#e2e8f0",
      fontFamily:"'DM Mono', 'Fira Mono', 'Courier New', monospace",
      padding:"32px 16px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Space+Grotesk:wght@300;400;600;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width:6px; height:6px; }
        ::-webkit-scrollbar-track { background:#1a1a2e; }
        ::-webkit-scrollbar-thumb { background:#334155; border-radius:3px; }
        .row-hover:hover { background:rgba(255,255,255,0.04) !important; cursor:pointer; }
        .chip-tag { display:inline-block; padding:2px 8px; border-radius:4px; font-size:12px; font-weight:500; letter-spacing:0.03em; }
        .gen-btn { padding:5px 14px; border-radius:20px; border:1px solid transparent; font-family:'DM Mono',monospace; font-size:12px; cursor:pointer; transition:all 0.15s; letter-spacing:0.05em; }
        .gen-btn:hover { opacity:0.85; }
        .col-header { padding:10px 16px; text-align:left; font-size:11px; letter-spacing:0.1em; text-transform:uppercase; cursor:pointer; white-space:nowrap; color:#94a3b8; user-select:none; transition:color 0.15s; }
        .col-header:hover { color:#e2e8f0; }
        .search-input { background:#1a1a2e; border:1px solid #2d2d4e; border-radius:8px; color:#e2e8f0; font-family:'DM Mono',monospace; font-size:13px; padding:8px 14px; outline:none; width:220px; transition:border-color 0.2s; }
        .search-input:focus { border-color:#4f46e5; }
        .search-input::placeholder { color:#475569; }
        .note-badge { background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); border-radius:4px; padding:1px 7px; font-size:11px; color:#94a3b8; max-width:260px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .multi-btn { transition: all 0.12s; }
        .multi-btn:hover { opacity: 0.9; transform: translateY(-1px); }
        .tab-btn { padding:8px 22px; border-radius:8px; border:1px solid transparent; font-family:'DM Mono',monospace; font-size:13px; cursor:pointer; transition:all 0.15s; letter-spacing:0.03em; }
      `}</style>

      {/* Header */}
      <div style={{ maxWidth:1140, margin:"0 auto 24px" }}>
        <div style={{ fontFamily:"'Space Grotesk',sans-serif", marginBottom:4 }}>
          <span style={{ fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:"#4f46e5" }}>GPU Comparison</span>
        </div>
        <h1 style={{
          fontFamily:"'Space Grotesk',sans-serif",
          fontSize:26, fontWeight:700, margin:"0 0 6px",
          background:"linear-gradient(90deg,#e2e8f0 30%,#6366f1)",
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
          letterSpacing:"-0.01em",
        }}>Apple Silicon → NVIDIA</h1>
        <p style={{ color:"#64748b", fontSize:13, margin:0 }}>GPU comparison and efficiency</p>
      </div>

      {/* Tabs */}
      <div style={{ maxWidth:1140, margin:"0 auto 24px", display:"flex", gap:8 }}>
        {[["value","$ Efficiency"],["compare","⇆ Comparison"]].map(([key,label]) => (
          <button key={key} className="tab-btn" onClick={() => setTab(key)} style={{
            background: tab === key ? "rgba(99,102,241,0.15)" : "transparent",
            borderColor: tab === key ? "#6366f1" : "#2d2d4e",
            color: tab === key ? "#a5b4fc" : "#64748b",
          }}>{label}</button>
        ))}
      </div>

      {/* Content */}
      <div style={{ maxWidth:1140, margin:"0 auto" }}>
        {tab === "value" ? <ValueTab /> : <CompareTab />}
      </div>
    </div>
  );
}
