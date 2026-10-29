document.getElementById("year").textContent = new Date().getFullYear();
const button = document.getElementById("download-button");
const status = document.getElementById("download-status");
const token = new URLSearchParams(window.location.search).get("token");

if (!token) {
  button.disabled = true;
  status.textContent = "A verified download link was not found. If you have paid, please contact the seller with your Razorpay payment ID.";
}

button.addEventListener("click", () => {
  if (!token) return;
  status.textContent = "Preparing your download…";
  window.location.href = `/api/download?token=${encodeURIComponent(token)}`;
  status.textContent = "Your download should begin shortly. If it does not, click the button again.";
});
