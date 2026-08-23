import { useEffect, useRef, useState } from "react";

const COUNTRIES = [
  ["Indonesia", "ID"], ["United States", "US"], ["United Kingdom", "GB"],
  ["Canada", "CA"], ["Mexico", "MX"], ["Brazil", "BR"], ["Argentina", "AR"],
  ["Germany", "DE"], ["France", "FR"], ["Spain", "ES"], ["Italy", "IT"],
  ["Netherlands", "NL"], ["Portugal", "PT"], ["Poland", "PL"], ["Ukraine", "UA"],
  ["Nigeria", "NG"], ["South Africa", "ZA"], ["Egypt", "EG"], ["Kenya", "KE"],
  ["Morocco", "MA"], ["Saudi Arabia", "SA"], ["UAE", "AE"], ["Turkey", "TR"],
  ["India", "IN"], ["Pakistan", "PK"], ["Bangladesh", "BD"], ["Sri Lanka", "LK"],
  ["Philippines", "PH"], ["Vietnam", "VN"], ["Thailand", "TH"], ["Malaysia", "MY"],
  ["Singapore", "SG"], ["Japan", "JP"], ["South Korea", "KR"], ["China", "CN"],
  ["Taiwan", "TW"], ["Hong Kong", "HK"], ["Australia", "AU"], ["New Zealand", "NZ"],
  ["Russia", "RU"], ["Sweden", "SE"], ["Norway", "NO"], ["Switzerland", "CH"],
  ["Colombia", "CO"], ["Chile", "CL"], ["Peru", "PE"], ["Venezuela", "VE"],
  ["Other", "UN"],
];

function flagEmoji(code) {
  if (code === "UN") return "🏳️";
  return code
    .toUpperCase()
    .replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
}

const LAYOUT = {
  canvasW: 1824,
  canvasH: 592,
  photoBox: { x: 1364, y: 46, w: 268, h: 266 },
  flagBox: { x: 1358, y: 328, w: 40, h: 27, color: "#2b2540" },
  nameLine: { x: 1420, y: 360, size: 30, coverX: 1418, coverY: 332, coverW: 280, coverH: 34, color: "#2b2540" },
  cityLine: { x: 1420, y: 400, size: 22, coverX: 1420, coverY: 382, coverW: 240, coverH: 24, color: "#332a4a" },
  countryLine: { x: 1420, y: 432, size: 22, coverX: 1420, coverY: 414, coverW: 240, coverH: 24, color: "#4a3a5a" },
};

export default function Home() {
  const canvasRef = useRef(null);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [countryCode, setCountryCode] = useState("ID");
  const [photoImg, setPhotoImg] = useState(null);
  const [templateImg, setTemplateImg] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const img = new window.Image();
    img.src = "/banner-template.png";
    img.onload = () => {
      setTemplateImg(img);
      setReady(true);
    };
  }, []);

  useEffect(() => {
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, city, countryCode, photoImg, templateImg]);

  function draw() {
    const canvas = canvasRef.current;
    if (!canvas || !templateImg) return;
    canvas.width = LAYOUT.canvasW;
    canvas.height = LAYOUT.canvasH;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(templateImg, 0, 0, LAYOUT.canvasW, LAYOUT.canvasH);

    if (photoImg) {
      const { x, y, w, h } = LAYOUT.photoBox;
      ctx.save();
      ctx.beginPath();
      ctx.rect(x, y, w, h);
      ctx.clip();
      const scale = Math.max(w / photoImg.width, h / photoImg.height);
      const dw = photoImg.width * scale;
      const dh = photoImg.height * scale;
      const dx = x + (w - dw) / 2;
      const dy = y + (h - dh) / 2;
      ctx.drawImage(photoImg, dx, dy, dw, dh);
      ctx.restore();
    }

    const fb = LAYOUT.flagBox;
    ctx.fillStyle = fb.color;
    ctx.fillRect(fb.x, fb.y, fb.w, fb.h);
    ctx.font = "24px sans-serif";
    ctx.textBaseline = "middle";
    ctx.fillText(flagEmoji(countryCode), fb.x + 2, fb.y + fb.h / 2 + 2);

    function coverAndWrite(line, text, bold) {
      ctx.fillStyle = line.color;
      ctx.fillRect(line.coverX, line.coverY, line.coverW, line.coverH);
      ctx.fillStyle = "#f2e2c4";
      ctx.font = `${bold ? "bold " : ""}${line.size}px Georgia, serif`;
      ctx.textBaseline = "alphabetic";
      ctx.fillText(text, line.x, line.y);
    }

    coverAndWrite(LAYOUT.nameLine, (name || "YOUR NAME HERE").toUpperCase(), true);
    coverAndWrite(LAYOUT.cityLine, (city || "YOUR CHAPTER / CITY").toUpperCase(), false);
    const countryName =
      COUNTRIES.find((c) => c[1] === countryCode)?.[0] || "YOUR COUNTRY / REGION";
    coverAndWrite(LAYOUT.countryLine, countryName.toUpperCase(), false);
  }

  function handlePhotoUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new window.Image();
      img.onload = () => setPhotoImg(img);
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }

  function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `arc-pfp-${(name || "member").replace(/\s+/g, "-").toLowerCase()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.h1}>Arc Community Banner Maker</h1>
        <p style={styles.sub}>Isi nama, foto, kota/chapter, dan negara — lalu unduh PNG.</p>

        <div style={styles.previewWrap}>
          {!ready && <div style={styles.loading}>Memuat template…</div>}
          <canvas ref={canvasRef} style={styles.canvas} />
        </div>

        <div style={styles.form}>
          <label style={styles.label}>
            Foto Profil
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              style={styles.input}
            />
          </label>

          <label style={styles.label}>
            Nama
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama kamu"
              style={styles.input}
              maxLength={30}
            />
          </label>

          <label style={styles.label}>
            Chapter / Kota
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="cth: Jakarta Chapter"
              style={styles.input}
              maxLength={30}
            />
          </label>

          <label style={styles.label}>
            Negara / Region
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              style={styles.input}
            >
              {COUNTRIES.map(([n, code]) => (
                <option key={code} value={code}>
                  {n}
                </option>
              ))}
            </select>
          </label>

          <button style={styles.button} onClick={handleDownload} disabled={!ready}>
            Unduh PNG
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0f0b1e",
    color: "#f2e2c4",
    fontFamily: "system-ui, sans-serif",
    padding: "24px 16px 60px",
  },
  container: { maxWidth: 960, margin: "0 auto" },
  h1: { fontSize: 24, marginBottom: 4 },
  sub: { opacity: 0.75, marginBottom: 20, fontSize: 14 },
  previewWrap: {
    width: "100%",
    overflowX: "auto",
    background: "#000",
    borderRadius: 12,
    marginBottom: 24,
    position: "relative",
  },
  loading: { padding: 20, fontSize: 14 },
  canvas: { width: "100%", display: "block", borderRadius: 12 },
  form: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 14,
    background: "rgba(255,255,255,0.04)",
    padding: 20,
    borderRadius: 12,
  },
  label: { display: "flex", flexDirection: "column", gap: 6, fontSize: 13 },
  input: {
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.15)",
    background: "#1b1530",
    color: "#f2e2c4",
    fontSize: 15,
  },
  button: {
    marginTop: 8,
    padding: "12px 20px",
    borderRadius: 8,
    border: "none",
    background: "linear-gradient(90deg,#7c5cff,#c8a6ff)",
    color: "#1b0f33",
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
  },
};
