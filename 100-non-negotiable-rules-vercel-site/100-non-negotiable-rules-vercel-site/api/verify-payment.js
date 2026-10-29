const crypto = require("crypto");

function json(res, status, data) {
  res.status(status).setHeader("Content-Type", "application/json").send(JSON.stringify(data));
}
function safeEqual(a, b) {
  const aa = Buffer.from(String(a || ""));
  const bb = Buffer.from(String(b || ""));
  return aa.length === bb.length && crypto.timingSafeEqual(aa, bb);
}
function signDownloadToken(payload, secret) {
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", secret).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, { error: "Method not allowed" });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const downloadSecret = process.env.DOWNLOAD_SECRET;
  const expectedAmount = Math.round(Number(process.env.PRICE_INR || 499) * 100);

  if (!keyId || !keySecret || !downloadSecret) {
    return json(res, 500, { error: "Payment verification is not configured yet." });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return json(res, 400, { error: "Missing payment details." });
  }

  try {
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (!safeEqual(expectedSignature, razorpay_signature)) {
      return json(res, 400, { error: "Payment signature could not be verified." });
    }

    // Confirm payment status, amount and order with Razorpay's API as an extra server-side check.
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const response = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(razorpay_payment_id)}`, {
      headers: { Authorization: `Basic ${auth}` }
    });
    if (!response.ok) {
      return json(res, 502, { error: "Could not confirm payment with Razorpay. Contact support if money was deducted." });
    }

    const payment = await response.json();
    if (payment.order_id !== razorpay_order_id ||
        payment.status !== "captured" ||
        Number(payment.amount) !== expectedAmount ||
        payment.currency !== "INR") {
      return json(res, 400, { error: "Payment is not captured or the amount does not match." });
    }

    const now = Math.floor(Date.now() / 1000);
    const token = signDownloadToken({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      exp: now + 24 * 60 * 60
    }, downloadSecret);

    return json(res, 200, { success: true, downloadUrl: `/api/download?token=${encodeURIComponent(token)}` });
  } catch (error) {
    console.error("Payment verification failed:", error.message);
    return json(res, 500, { error: "Payment verification failed. Please contact support if money was deducted." });
  }
};
