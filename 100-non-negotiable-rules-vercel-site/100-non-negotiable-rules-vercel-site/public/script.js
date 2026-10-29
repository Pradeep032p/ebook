const buyButton = document.getElementById("buy-button");
const statusEl = document.getElementById("checkout-status");
document.getElementById("year").textContent = new Date().getFullYear();

buyButton.addEventListener("click", async () => {
  statusEl.textContent = "";
  buyButton.disabled = true;
  buyButton.classList.add("is-loading");
  buyButton.querySelector("span").textContent = "…";
  try {
    const orderResponse = await fetch("/api/create-order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
    const orderData = await orderResponse.json();
    if (!orderResponse.ok) throw new Error(orderData.error || "Unable to start checkout.");

    const options = {
      key: orderData.keyId,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "100 Non-Negotiable Rules for Men",
      description: "Digital PDF eBook",
      order_id: orderData.orderId,
      image: "",
      theme: { color: "#c7a66a" },
      modal: { ondismiss: () => { buyButton.disabled = false; buyButton.classList.remove("is-loading"); buyButton.querySelector("span").textContent = "→"; statusEl.textContent = "Checkout closed. You can try again whenever you’re ready."; } },
      handler: async function (response) {
        statusEl.textContent = "Verifying your payment securely…";
        try {
          const verifyResponse = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response)
          });
          const verifyData = await verifyResponse.json();
          if (!verifyResponse.ok || !verifyData.success) throw new Error(verifyData.error || "Payment could not be verified.");
          window.location.href = `/thank-you.html?token=${encodeURIComponent(new URL(verifyData.downloadUrl, window.location.origin).searchParams.get("token"))}`;
        } catch (err) {
          statusEl.textContent = err.message + " If money was deducted, please contact the seller with your Razorpay payment ID.";
          buyButton.disabled = false; buyButton.classList.remove("is-loading"); buyButton.querySelector("span").textContent = "→";
        }
      }
    };
    if (!window.Razorpay) throw new Error("Razorpay Checkout could not load. Please check your internet connection and try again.");
    const checkout = new Razorpay(options);
    checkout.open();
  } catch (error) {
    statusEl.textContent = error.message || "Something went wrong. Please try again.";
    buyButton.disabled = false; buyButton.classList.remove("is-loading"); buyButton.querySelector("span").textContent = "→";
  }
});
