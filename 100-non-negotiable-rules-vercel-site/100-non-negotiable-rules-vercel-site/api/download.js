const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

function parseAndVerifyToken(token, secret) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [encoded, suppliedSignature] = parts;
  const expectedSignature = crypto.createHmac("sha256", secret).update(encoded).digest("base64url");
  const a = Buffer.from(suppliedSignature);
  const b = Buffer.from(expectedSignature);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000) || !payload.paymentId || !payload.orderId) return null;
    return payload;
  } catch {
    return null;
  }
}

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).send("Method not allowed");
  }

  const secret = process.env.DOWNLOAD_SECRET;
  if (!secret) return res.status(500).send("Download service is not configured.");
  const token = Array.isArray(req.query.token) ? req.query.token[0] : req.query.token;
  const payload = parseAndVerifyToken(token, secret);
  if (!payload) return res.status(403).send("This download link is invalid or has expired. If you have paid, return to the thank-you page or contact support.");

  try {
    const filePath = path.join(process.cwd(), "private", "100_Non_Negotiable_Rules_for_Men.pdf");
    const file = fs.readFileSync(filePath);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="100_Non_Negotiable_Rules_for_Men.pdf"');
    res.setHeader("Cache-Control", "private, no-store, max-age=0");
    return res.status(200).send(file);
  } catch (error) {
    console.error("PDF read failed:", error.message);
    return res.status(500).send("The PDF file is temporarily unavailable. Please contact support.");
  }
};
