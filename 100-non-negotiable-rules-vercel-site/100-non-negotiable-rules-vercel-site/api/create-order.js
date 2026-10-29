const Razorpay = require("razorpay");

function json(res, status, data) {
  res.status(status).setHeader("Content-Type", "application/json").send(JSON.stringify(data));
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, { error: "Method not allowed" });
  }

  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  const price = Number(process.env.PRICE_INR || 499);

  if (!key_id || !key_secret) {
    return json(res, 500, { error: "Payment gateway is not configured yet. Please try again later." });
  }
  if (!Number.isFinite(price) || price < 1 || price > 100000) {
    return json(res, 500, { error: "Invalid product price configuration." });
  }

  try {
    const razorpay = new Razorpay({ key_id, key_secret });
    const order = await razorpay.orders.create({
      amount: Math.round(price * 100),
      currency: "INR",
      receipt: `ebook_${Date.now()}`,
      notes: { product: "100 Non-Negotiable Rules for Men eBook" }
    });

    return json(res, 200, {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: key_id,
      productName: "100 Non-Negotiable Rules for Men",
      description: "Digital PDF eBook"
    });
  } catch (error) {
    console.error("Razorpay order creation failed:", error.message);
    return json(res, 500, { error: "Could not start checkout. Please try again." });
  }
};
