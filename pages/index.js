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
  photoBox: { x: 1362, y: 46, w: 256, h: 268 },
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
    coverAndWrite(LAYOUT.countryLine, countryName.toUpp
