/* ==========================================================================
   SITE CONFIGURATION  -  the ONLY file you need to edit to launch.
   Both pages (index.html and thank-you.html) read everything from here.
   Replace every value that still says REPLACE_WITH... or [IN SQUARE BRACKETS].
   ========================================================================== */

window.SITE_CONFIG = {

  /* 1. YOUR PAYMENT CHECKOUT LINK
        Every "Get This eBook" button on the sales page goes here.
        Paste the checkout / payment-page URL from your payment gateway.
        Example: "https://your-gateway.example/pay/abc123"                    */
  PAYMENT_URL: "REPLACE_WITH_MY_PAYMENT_CHECKOUT_URL",

  /* 2. YOUR EBOOK DOWNLOAD LINK
        The "Download Your eBook PDF" button on the thank-you page goes here.
        Use the URL of the uploaded PDF (see README.md, section 3).
        A site-relative path also works, e.g. "downloads/my-ebook.pdf".       */
  EBOOK_DOWNLOAD_URL: "REPLACE_WITH_SECURE_EBOOK_DOWNLOAD_URL",

  /* 3. PRICE (shown on the sales page exactly as you type it)
        Example: "Rs. 499"  or  "INR 499"  or  "$9"                           */
  PRICE: "[PRICE]",

  /* 4. SUPPORT E-MAIL (shown in the footer and on the thank-you page)       */
  SUPPORT_EMAIL: "[SUPPORT_EMAIL]",

  /* 5. LEGAL PAGES  (full web addresses of your own pages)                   */
  PRIVACY_URL: "",   // e.g. "https://yourdomain.com/privacy"
  TERMS_URL: "",     // e.g. "https://yourdomain.com/terms"

  /* 6. NAME SHOWN IN THE COPYRIGHT LINE                                      */
  OWNER_NAME: "[YOUR NAME OR BUSINESS NAME]",

  /* 7. OPTIONAL: SIMPLE CHECK ON THE THANK-YOU PAGE
        Many gateways add something like ?payment_id=xxxx or ?order_id=xxxx to
        the redirect URL. If you type that parameter name here, the download
        button is shown only when the parameter is present in the page address.
        Leave it empty ("") to turn this off.
        IMPORTANT: this is only a basic convenience check. Anyone can type a
        fake value, so it does NOT prove payment. See README.md, section 5.   */
  REQUIRE_PURCHASE_PARAM: ""
};
