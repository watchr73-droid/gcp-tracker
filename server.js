import express from "express";
import fetch from "node-fetch";

const app = express();
let latest = 0;

async function fetchScore() {
  try {
    const r = await fetch("https://global-mind.org/gcpdot/gcp.html");
    const t = await r.text();

    // მოძებნე ნებისმიერი პროცენტული მნიშვნელობა
    const m = t.match(/([0-9]+\.?[0-9]*)/g);

    if (m && m.length) {
      let val = parseFloat(m[0]);

      if (val <= 1) val = val * 100;
      latest = Math.round(val);

      console.log("score:", latest);
    }
  } catch (e) {
    console.log("fetch error", e);
  }
}

setInterval(fetchScore, 60000);
fetchScore();

app.get("/", (req, res) => {
  res.send(`
  <html>
  <head>
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  <body style="background:#000;color:white;text-align:center;font-family:sans-serif">

  <h2>GCP Tracker</h2>

  <div style="width:48px;height:48px;background:white;margin:auto">
  <iframe src="https://global-mind.org/gcpdot/gcp.html" width="48" height="48" frameborder="0"></iframe>
  </div>

  <h1>${latest}%</h1>

  </body>
  </html>
  `);
});

app.listen(3000);