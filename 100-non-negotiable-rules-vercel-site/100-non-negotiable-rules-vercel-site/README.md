# 100 Non-Negotiable Rules for Men — Vercel + Razorpay

This project contains:
- A responsive sales page at `/`
- A thank-you/download page at `/thank-you.html`
- Razorpay order creation and server-side payment verification
- A time-limited, signed download link for the included PDF
- The PDF stored in `private/` rather than the public static folder

## Important before launch

The displayed price is a starter value of **₹499**. Set the real price using `PRICE_INR` in Vercel Environment Variables before accepting live payments. The price shown on the page is also set in `public/index.html` and should be changed to match.

### 1. Deploy to Vercel
1. Unzip this project.
2. Push the folder to a new GitHub repository, or import the folder using Vercel's supported Git workflow.
3. Import the repository into Vercel and deploy.
4. In Vercel, open **Project → Settings → Environment Variables** and add:
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
   - `PRICE_INR` (for example `499`)
   - `DOWNLOAD_SECRET` (a long random secret, 32+ characters)
   - `SITE_URL` (your deployed URL; optional in this starter)
5. Redeploy after adding or changing environment variables.

### 2. Configure Razorpay
1. In Razorpay Dashboard, create API keys.
2. First use Test Mode keys (`rzp_test_...`) to test the full purchase flow.
3. After testing, use Live Mode keys (`rzp_live_...`) and complete any account activation requirements.
4. Keep `RAZORPAY_KEY_SECRET` private. Never put it in browser JavaScript or commit it to GitHub.
5. Ensure payment capture is enabled in Razorpay. The server confirms the payment status is `captured` before issuing the download token.

### 3. Set the correct price
- Change `PRICE_INR` in Vercel to your selling price in rupees.
- Change the visible `₹499` text in `public/index.html` to the same price.
- Redeploy after changes.
- Do not advertise the starter price unless it is your intended price.

### 4. Customize support details
Replace `YOUR_SUPPORT_EMAIL@example.com` in:
- `public/index.html`
- `public/thank-you.html`

with a real support email address.

### 5. Test the flow
- Test a successful payment using Razorpay Test Mode.
- Test that the thank-you page only appears after server-side verification.
- Test the download link, and test that an invalid/expired token is rejected.
- Test cancelled checkout and failed payments.
- Verify the downloaded PDF is the intended eBook.
- Before launch, review your refund policy and other terms for compliance with applicable law and Razorpay requirements.

## Security notes
- The PDF is not placed in `public/`; downloads go through `/api/download`.
- Download tokens expire after 24 hours.
- The server checks the Razorpay signature, then checks the payment with Razorpay's API for matching order, captured status, currency and amount.
- This is a starter implementation, not a complete order-management system. It does not persist an order database or automatically reconcile delayed payments. For production at scale, add a Razorpay webhook and durable order storage.
- A buyer can share a valid download link during its 24-hour validity period. If you need single-use downloads, use durable storage and server-side token redemption.
- This site does not send emails. The verified checkout redirects to the thank-you page, where the customer downloads the PDF.

## Project structure

```text
.
├── api/
│   ├── create-order.js
│   ├── verify-payment.js
│   └── download.js
├── private/
│   └── 100_Non_Negotiable_Rules_for_Men.pdf
├── public/
│   ├── index.html
│   ├── script.js
│   ├── styles.css
│   ├── thank-you.html
│   └── thank-you.js
├── package.json
└── vercel.json
```
