"use client";

import { useEffect, useRef, useState } from "react";

const COUNTRIES = [
  ["Indonesia", "ID"],
  ["United States", "US"],
  ["United Kingdom", "GB"],
  ["Canada", "CA"],
  ["Mexico", "MX"],
  ["Brazil", "BR"],
  ["Argentina", "AR"],
  ["Germany", "DE"],
  ["France", "FR"],
  ["Spain", "ES"],
  ["Italy", "IT"],
  ["Netherlands", "NL"],
  ["Portugal", "PT"],
  ["Poland", "PL"],
  ["Ukraine", "UA"],
  ["Nigeria", "NG"],
  ["South Africa", "ZA"],
  ["Egypt", "EG"],
  ["Kenya", "KE"],
  ["Morocco", "MA"],
  ["Saudi Arabia", "SA"],
  ["United Arab Emirates", "AE"],
  ["Turkey", "TR"],
  ["India", "IN"],
  ["Pakistan", "PK"],
  ["Bangladesh", "BD"],
  ["Sri Lanka", "LK"],
  ["Philippines", "PH"],
  ["Vietnam", "VN"],
  ["Thailand", "TH"],
  ["Malaysia", "MY"],
  ["Singapore", "SG"],
  ["Japan", "JP"],
  ["South Korea", "KR"],
  ["China", "CN"],
  ["Taiwan", "TW"],
  ["Hong Kong", "HK"],
  ["Australia", "AU"],
  ["New Zealand", "NZ"],
  ["Russia", "RU"],
  ["Sweden", "SE"],
  ["Norway", "NO"],
  ["Switzerland", "CH"],
  ["Colombia", "CO"],
  ["Chile", "CL"],
  ["Peru", "PE"],
  ["Venezuela", "VE"],
  ["Other", "UN"],
];

function flagEmoji(code) {
  if (code === "UN") return "🏳️";

  return code
    .toUpperCase()
    .replace(/./g, (char) =>
      String.fromCodePoint(127397 + char.charCodeAt(0))
    );
}

/*
  Template asli kamu:
  1824 x 592

  Semua koordinat di bawah menggunakan ukuran tersebut.
  Jadi kalau template berubah ukuran, canvas tetap menyesuaikan.
*/

const BASE_W = 1824;
const BASE_H = 592;

const LAYOUT = {
  photo: {
    x: 1388,
    y: 60,
    w: 220,
    h: 218,
  },

  // Area informasi kanan
  info: {
    x: 1350,
    width: 350,
  },

  flag: {
    x: 1358,
    y: 328,
    size: 32,
  },

  name: {
    x: 1405,
    y: 359,
    maxWidth: 285,
    fontSize: 30,
  },

  city: {
    x: 1420,
    y: 400,
    maxWidth: 250,
    fontSize: 21,
  },

  country: {
    x: 1420,
    y: 432,
    maxWidth: 250,
    fontSize: 21,
  },
};

export default function Home() {
  const canvasRef = useRef(null);

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [countryCode, setCountryCode] = useState("ID");

  const [photoImg, setPhotoImg] = useState(null);
  const [templateImg, setTemplateImg] = useState(null);
  const [ready, setReady] = useState(false);

  const countryName =
    COUNTRIES.find((item) => item[1] === countryCode)?.[0] || "Other";

  /*
   * Load template
   */
  useEffect(() => {
    const img = new window.Image();

    img.onload = () => {
      setTemplateImg(img);
      setReady(true);
    };

    img.onerror = () => {
      console.error("Template banner-template.png tidak ditemukan.");
    };

    img.src = "/banner-template.png";
  }, []);

  /*
   * Redraw canvas setiap ada perubahan
   */
  useEffect(() => {
    drawBanner();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, city, countryCode, photoImg, templateImg]);

  /*
   * Utility: text uppercase + clean
   */
  function cleanText(text) {
    return text.trim().replace(/\s+/g, " ");
  }

  /*
   * Utility:
   * Mengecilkan font jika teks terlalu panjang.
   */
  function fitFont(ctx, text, maxWidth, startSize, minSize = 12) {
    let size = startSize;

    while (size > minSize) {
      ctx.font = `bold ${size}px Georgia, serif`;

      if (ctx.measureText(text).width <= maxWidth) {
        break;
      }

      size -= 1;
    }

    return size;
  }

  /*
   * Utility:
   * Menggambar foto dengan crop cover.
   */
  function drawCoverImage(ctx, image, x, y, width, height) {
    const imageRatio = image.width / image.height;
    const boxRatio = width / height;

    let drawWidth;
    let drawHeight;

    if (imageRatio > boxRatio) {
      drawHeight = height;
      drawWidth = height * imageRatio;
    } else {
      drawWidth = width;
      drawHeight = width / imageRatio;
    }

    const drawX = x + (width - drawWidth) / 2;
    const drawY = y + (height - drawHeight) / 2;

    ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
  }

  /*
   * Utility:
   * Rounded rectangle.
   */
  function roundedRect(ctx, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);

    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + width - r, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + r);
    ctx.lineTo(x + width, y + height - r);
    ctx.quadraticCurveTo(
      x + width,
      y + height,
      x + width - r,
      y + height
    );
    ctx.lineTo(x + r, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  /*
   * Utility:
   * Cover teks bawaan template.
   *
   * Kita menggunakan warna yang mirip background template
   * supaya teks bawaan tidak terlihat.
   */
  function coverArea(ctx, x, y, width, height, color) {
    ctx.save();

    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);

    ctx.restore();
  }

  /*
   * Utility:
   * Tulis text dengan auto-size.
   */
  function drawTextFit(
    ctx,
    text,
    x,
    y,
    maxWidth,
    startSize,
    options = {}
  ) {
    const {
      bold = false,
      color = "#f2e2c4",
      align = "left",
    } = options;

    const finalText = cleanText(text).toUpperCase();

    const size = fitFont(
      ctx,
      finalText,
      maxWidth,
      startSize,
      Math.max(12, startSize - 12)
    );

    ctx.save();

    ctx.fillStyle = color;
    ctx.font = `${bold ? "bold " : ""}${size}px Georgia, serif`;
    ctx.textBaseline = "alphabetic";
    ctx.textAlign = align;

    ctx.fillText(finalText, x, y);

    ctx.restore();
  }

  function drawBanner() {
    const canvas = canvasRef.current;

    if (!canvas || !templateImg) return;

    canvas.width = BASE_W;
    canvas.height = BASE_H;

    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, BASE_W, BASE_H);

    /*
     * 1. TEMPLATE
     */
    ctx.drawImage(
      templateImg,
      0,
      0,
      BASE_W,
      BASE_H
    );

    /*
     * 2. FOTO PROFIL
     */
    if (photoImg) {
      const { x, y, w, h } = LAYOUT.photo;

      ctx.save();

      /*
       * Shadow
       */
      ctx.shadowColor = "rgba(0,0,0,0.55)";
      ctx.shadowBlur = 16;
      ctx.shadowOffsetY = 5;

      /*
       * Clip kotak foto
       */
      ctx.beginPath();
      ctx.rect(x, y, w, h);
      ctx.clip();

      drawCoverImage(
        ctx,
        photoImg,
        x,
        y,
        w,
        h
      );

      ctx.restore();

      /*
       * Border emas
       */
      ctx.save();

      ctx.strokeStyle = "#d8b875";
      ctx.lineWidth = 3;

      ctx.strokeRect(
        x + 1.5,
        y + 1.5,
        w - 3,
        h - 3
      );

      ctx.restore();
    }

    /*
     * 3. MEMBERSHIP INFO
     *
     * Menyatukan area kanan supaya tidak terlihat
     * seperti beberapa kotak terpisah.
     */

    /*
     * Nama
     */
    coverArea(
      ctx,
      1398,
      332,
      305,
      34,
      "#29233f"
    );

    /*
     * Kota
     */
    coverArea(
      ctx,
      1416,
      382,
      252,
      25,
      "#332a4a"
    );

    /*
     * Negara
     */
    coverArea(
      ctx,
      1416,
      414,
      252,
      25,
      "#4a3a5a"
    );

    /*
     * 4. FLAG
     */
    const flagX = LAYOUT.flag.x;
    const flagY = LAYOUT.flag.y;

    ctx.save();

    /*
     * Background kecil untuk flag
     */
    ctx.fillStyle = "rgba(43,37,64,0.88)";

    roundedRect(
      ctx,
      flagX - 4,
      flagY - 3,
      40,
      30,
      4
    );

    ctx.fill();

    /*
     * Flag
     */
    ctx.font = "25px sans-serif";
    ctx.textBaseline = "middle";

    ctx.fillText(
      flagEmoji(countryCode),
      flagX,
      flagY + 11
    );

    ctx.restore();

    /*
     * 5. NAME
     */
    drawTextFit(
      ctx,
      name || "YOUR NAME HERE",
      LAYOUT.name.x,
      LAYOUT.name.y,
      LAYOUT.name.maxWidth,
      LAYOUT.name.fontSize,
      {
        bold: true,
        color: "#f2e2c4",
      }
    );

    /*
     * 6. CITY
     */
    drawTextFit(
      ctx,
      city || "YOUR CHAPTER / CITY",
      LAYOUT.city.x,
      LAYOUT.city.y,
      LAYOUT.city.maxWidth,
      LAYOUT.city.fontSize,
      {
        color: "#f2e2c4",
      }
    );

    /*
     * 7. COUNTRY
     */
    drawTextFit(
      ctx,
      countryName || "YOUR COUNTRY / REGION",
      LAYOUT.country.x,
      LAYOUT.country.y,
      LAYOUT.country.maxWidth,
      LAYOUT.country.fontSize,
      {
        color: "#f2e2c4",
      }
    );
  }

  /*
   * Upload foto
   */
  function handlePhotoUpload(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar.");
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new window.Image();

      img.onload = () => {
        setPhotoImg(img);
      };

      img.src = event.target.result;
    };

    reader.readAsDataURL(file);
  }

  /*
   * Reset foto
   */
  function removePhoto() {
    setPhotoImg(null);

    const input = document.getElementById("photo-upload");

    if (input) {
      input.value = "";
    }
  }

  /*
   * Download
   */
  function handleDownload() {
    const canvas = canvasRef.current;

    if (!canvas || !ready) return;

    const safeName =
      cleanText(name || "member")
        .replace(/[^a-zA-Z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .toLowerCase();

    const link = document.createElement("a");

    link.download = `arc-banner-${safeName || "member"}.png`;

    link.href = canvas.toDataURL(
      "image/png",
      1
    );

    link.click();
  }

  return (
    <main style={styles.page}>
      <div style={styles.backgroundGlow} />

      <div style={styles.container}>

        {/* HEADER */}
        <header style={styles.header}>
          <div>
            <div style={styles.logoText}>
              ARC
            </div>

            <h1 style={styles.h1}>
              Community Banner Maker
            </h1>

            <p style={styles.sub}>
              Buat banner Arc kamu sendiri dengan
              nama, foto, chapter, dan negara.
            </p>
          </div>

          <div style={styles.badge}>
            ARC COMMUNITY
          </div>
        </header>

        {/* PREVIEW */}
        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <div>
              <h2 style={styles.cardTitle}>
                Live Preview
              </h2>

              <p style={styles.cardSub}>
                Perubahan akan langsung muncul di banner.
              </p>
            </div>

            <span style={styles.status}>
              ● LIVE
            </span>
          </div>

          <div style={styles.previewOuter}>
            {!ready && (
              <div style={styles.loading}>
                <div style={styles.spinner} />
                Memuat template…
              </div>
            )}

            <canvas
              ref={canvasRef}
              style={{
                ...styles.canvas,
                opacity: ready ? 1 : 0,
              }}
            />
          </div>

          <div style={styles.resolution}>
            1824 × 592 px • PNG
          </div>
        </section>

        {/* FORM */}
        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <div>
              <h2 style={styles.cardTitle}>
                Customize Your Banner
              </h2>

              <p style={styles.cardSub}>
                Isi informasi kamu di bawah.
              </p>
            </div>
          </div>

          <div style={styles.formGrid}>

            {/* FOTO */}
            <div style={styles.field}>
              <label style={styles.label}>
                Foto Profil
              </label>

              <div style={styles.uploadBox}>
                {photoImg ? (
                  <div style={styles.photoPreview}>
                    <img
                      src={photoImg.src}
                      alt="Preview"
                      style={styles.photoPreviewImg}
                    />

                    <div style={styles.photoActions}>
                      <label
                        htmlFor="photo-upload"
                        style={styles.changePhoto}
                      >
                        Ganti
                      </label>

                      <button
                        type="button"
                        onClick={removePhoto}
                        style={styles.removeButton}
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ) : (
                  <label
                    htmlFor="photo-upload"
                    style={styles.uploadLabel}
                  >
                    <span style={styles.uploadIcon}>
                      +
                    </span>

                    <span style={styles.uploadTitle}>
                      Upload Foto
                    </span>

                    <span style={styles.uploadSub}>
                      JPG, PNG atau WEBP
                    </span>
                  </label>
                )}

                <input
                  id="photo-upload"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handlePhotoUpload}
                  style={styles.hiddenInput}
                />
              </div>
            </div>

            {/* NAME */}
            <div style={styles.field}>
              <label style={styles.label}>
                Nama
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Contoh: CHIMIL"
                maxLength={30}
                style={styles.input}
              />

              <span style={styles.helper}>
                Maksimal 30 karakter
              </span>
            </div>

            {/* CITY */}
            <div style={styles.field}>
              <label style={styles.label}>
                Chapter / Kota
              </label>

              <input
                type="text"
                value={city}
                onChange={(e) =>
                  setCity(e.target.value)
                }
                placeholder="Contoh: Jakarta"
                maxLength={30}
                style={styles.input}
              />

              <span style={styles.helper}>
                Kota atau nama chapter kamu
              </span>
            </div>

            {/* COUNTRY */}
            <div style={styles.field}>
              <label style={styles.label}>
                Negara / Region
              </label>

              <div style={styles.selectWrap}>
                <span style={styles.selectFlag}>
                  {flagEmoji(countryCode)}
                </span>

                <select
                  value={countryCode}
                  onChange={(e) =>
                    setCountryCode(e.target.value)
                  }
                  style={styles.select}
                >
                  {COUNTRIES.map(
                    ([country, code]) => (
                      <option
                        key={code}
                        value={code}
                      >
                        {country}
                      </option>
                    )
                  )}
                </select>
              </div>

              <span style={styles.helper}>
                Flag akan otomatis berubah.
              </span>
            </div>

          </div>

          {/* DOWNLOAD */}
          <div style={styles.downloadArea}>
            <button
              type="button"
              onClick={handleDownload}
              disabled={!ready}
              style={{
                ...styles.downloadButton,
                opacity: ready ? 1 : 0.5,
                cursor: ready
                  ? "pointer"
                  : "not-allowed",
              }}
            >
              <span>
                ↓
              </span>

              Unduh Banner PNG
            </button>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={styles.footer}>
          <span>
            Built for the Arc Community
          </span>

          <span>
            •
          </span>

          <span>
            Architects · Builders · Community · Impact
          </span>
        </footer>

      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    position: "relative",
    overflow: "hidden",
    background:
      "radial-gradient(circle at top, #282044 0%, #120d22 42%, #090712 100%)",
    color: "#f2e2c4",
    fontFamily:
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    padding: "32px 16px 70px",
  },

  backgroundGlow: {
    position: "fixed",
    width: 500,
    height: 500,
    top: -250,
    left: "50%",
    transform: "translateX(-50%)",
    background:
      "radial-gradient(circle, rgba(124,92,255,0.18), transparent 68%)",
    pointerEvents: "none",
  },

  container: {
    width: "100%",
    maxWidth: 1100,
    margin: "0 auto",
    position: "relative",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 20,
    marginBottom: 24,
  },

  logoText: {
    display: "inline-block",
    fontSize: 13,
    fontWeight: 800,
    letterSpacing: 4,
    color: "#c8a6ff",
    marginBottom: 5,
  },

  h1: {
    margin: 0,
    fontSize: "clamp(25px, 4vw, 38px)",
    lineHeight: 1.1,
    letterSpacing: "-0.8px",
  },

  sub: {
    margin: "9px 0 0",
    color: "rgba(242,226,196,0.62)",
    fontSize: 14,
    lineHeight: 1.6,
    maxWidth: 550,
  },

  badge: {
    padding: "9px 13px",
    borderRadius: 999,
    border:
      "1px solid rgba(216,184,117,0.28)",
    background:
      "rgba(216,184,117,0.07)",
    color: "#d8b875",
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: 1.4,
    whiteSpace: "nowrap",
  },

  card: {
    background:
      "linear-gradient(145deg, rgba(255,255,255,0.065), rgba(255,255,255,0.025))",
    border:
      "1px solid rgba(255,255,255,0.10)",
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    boxShadow:
      "0 20px 60px rgba(0,0,0,0.28)",
    backdropFilter: "blur(12px
