# 100 Non-Negotiable Rules for Men: sales page + thank-you page

Two static pages (plain HTML, CSS and a little JavaScript). No build step, no
database, no frameworks, nothing to install. You can open `site/index.html`
straight from your computer to preview it.

```
README.md                      <- this guide
ebook-upload/
  100_Non_Negotiable_Rules_for_Men.pdf   <- the eBook (upload this; it is NOT inside site/)
site/                          <- the folder you deploy
  index.html                   <- SALES PAGE
  thank-you.html               <- THANK-YOU / DOWNLOAD PAGE
  js/config.js                 <- the ONLY file you need to edit
  js/app.js                    <- shared behaviour (buttons, setup warnings)
  css/styles.css               <- shared design system (colours, type, buttons)
  assets/                      <- real cover and real sample pages from the PDF, favicon
```

---

## 1. What works immediately, and what needs your setup

| Works as soon as you deploy | Needs YOUR configuration |
|---|---|
| Both pages, mobile and desktop layouts | **Payment link** (`PAYMENT_URL`): every "Get This eBook" button |
| Real cover, contents, sample pages, readable sample rule | **Price** (`PRICE`) |
| FAQ accordion (5 questions, keyboard friendly) | **Download link** (`EBOOK_DOWNLOAD_URL`) |
| Sticky "Get This eBook" bar on phones | **Support e-mail**, **Privacy** and **Terms** links, **owner name** |
| Clear on-screen setup warnings while anything is missing | **Payment gateway**: set its success/redirect URL to your thank-you page |
| | **Secure delivery** (optional but recommended, see section 5) |

There is no fake checkout, no fake "payment successful" screen, no countdown, no
testimonials, no star ratings and no invented price or guarantee.

While a value is still missing, a yellow **SETUP NEEDED** bar appears at the top
of the page and the affected button shows a hatched pattern. Clicking it shows a
message instead of sending anyone to a broken page. Once every value in
`js/config.js` is filled in, the bar disappears.

---

## 2. Edit `site/js/config.js`

Open the file in any text editor (Notepad is fine). Change only the text inside
the quotation marks.

| Setting | What to put | Where it appears |
|---|---|---|
| `PAYMENT_URL` | Your gateway's checkout / payment-page link | All 5 "Get This eBook" buttons (top bar, hero, offer box, final section, mobile sticky bar) |
| `PRICE` | e.g. `"Rs. 499"` | Hero, offer box, mobile sticky bar |
| `EBOOK_DOWNLOAD_URL` | Link to the uploaded PDF | "Download Your eBook PDF" button |
| `SUPPORT_EMAIL` | e.g. `"help@yourdomain.com"` | Footer and download-help text |
| `PRIVACY_URL`, `TERMS_URL` | Full web addresses of your policies | Footer |
| `OWNER_NAME` | Your name or business name | Copyright line |
| `REQUIRE_PURCHASE_PARAM` | Optional, see section 5 | Thank-you page |

**To change the price:** edit `PRICE` once. Every price on the page updates.
Save, re-upload `config.js` (or the whole `site` folder), and refresh.

**To add your checkout URL:** paste it into `PAYMENT_URL`. All buttons use it.

---

## 3. Upload the PDF and set the download link

Upload `ebook-upload/100_Non_Negotiable_Rules_for_Men.pdf` somewhere, then paste
its web address into `EBOOK_DOWNLOAD_URL`.

* **Simplest (public link):** create a folder `site/downloads/`, put the PDF in
  it, and set
  `EBOOK_DOWNLOAD_URL: "downloads/100_Non_Negotiable_Rules_for_Men.pdf"`.
  **Warning:** anyone who guesses or is given this address can download the
  book without paying, and can share it. The page cannot protect a public file.
* **Google Drive:** upload the PDF, set sharing to "Anyone with the link", copy
  the file ID from the share link, and use
  `https://drive.google.com/uc?export=download&id=FILE_ID`.
  Test it in a private/incognito window. This is also a public link, and Google
  may change how it behaves.
* **Better (private storage + expiring link):** see section 5.

---

## 4. Deploy and get the thank-you page URL

Any static host works. Upload the **contents of the `site` folder** so that
`index.html` sits at the top level.

* **Netlify:** log in, open "Sites", drag the `site` folder onto the deploy area.
* **Cloudflare Pages / Vercel / GitHub Pages:** create a project, point it at
  the folder (no build command, output directory = the folder itself).
* Any normal web hosting: upload the files with the host's file manager or FTP.

Your two public addresses will be:

* Sales page: `https://YOUR-DOMAIN/` (or `https://YOUR-DOMAIN/index.html`)
* **Thank-you page: `https://YOUR-DOMAIN/thank-you.html`**

Open both on your phone after deploying. Use the exact thank-you address in the
next step.

---

## 5. Connect your payment gateway, and what "secure" really means

**Connect the redirect.** In your payment gateway's dashboard, find the setting
for what happens after a successful payment (it is usually called something like
*success URL*, *redirect URL*, *return URL* or *thank-you page*; the name differs
by provider). Paste `https://YOUR-DOMAIN/thank-you.html` there. Then copy the
checkout / payment-page link that the gateway gives you into `PAYMENT_URL`.

**Please understand this limit.** A redirect to the thank-you page is not proof
of payment. Anyone who types or shares the thank-you address can open it and
reach the download button. These pages never claim to verify payments, because
a plain website cannot do that safely. If the PDF link is public, anyone who
has it can share it.

You have three levels, from simplest to strongest:

1. **Launch simply (what the files do by default).** The thank-you page is
   marked `noindex`, so search engines will not list it. Use this to start, and
   accept that a determined person could get the PDF without paying.
2. **Basic parameter check (optional, not real security).** Many gateways add
   something like `?payment_id=...` to the redirect URL. If yours does, put that
   name in `REQUIRE_PURCHASE_PARAM` (for example `"payment_id"`). The download
   button then appears only when that parameter is in the address. Anyone can
   type a fake value, so this only blocks casual direct visits.
3. **Proper protection (needs a small backend).** Use the gateway's
   **server-side webhook** (the gateway calls your server when a payment truly
   succeeds). Your server should: (a) verify the webhook signature with the
   gateway's secret key, (b) record the order, and (c) either e-mail the buyer a
   **short-lived, signed download link** to a PDF stored privately (for example
   in private cloud storage), or send the buyer to a thank-you page that asks
   your server for such a link. Keep all secret keys on the server, never in
   `config.js` or any file in `site/`. Many gateways and digital-product
   platforms also offer built-in file delivery after payment; if yours does,
   that is the easiest route.

---

## 6. Changing things later

* **Text:** edit `index.html` / `thank-you.html` in any text editor.
* **Colours and fonts:** the variables at the top of `css/styles.css`.
* **Fonts:** loaded free from Google Fonts, with safe system fonts as backup. If
  you add analytics or fonts from third parties, mention it in your Privacy Policy.
* **If you replace the PDF with a new edition**, update these facts on the sales
  page so they stay true: the stat band (100 rules, 10 chapters, 100 actions,
  42 numbered sources), the chapter descriptions, the sample rule excerpt, and
  the five images in `assets/`. To re-create the images from a new PDF:
  `pdftoppm -r 150 -png -f PAGE -l PAGE your.pdf out` for the cover, contents,
  introduction, a rule page and the checklist page, then save them as WebP at
  about 900 px wide with the same file names.
* **Refund wording:** the FAQ says all sales are final, as you specified. Make
  sure your Terms page says the same thing, and that it respects any consumer
  rights that apply in your country.

---

## 7. Final launch checklist

- [ ] `config.js`: all seven values filled in; the yellow SETUP NEEDED bar is gone.
- [ ] Clicking "Get This eBook" (try every button) opens your real checkout.
- [ ] A real test payment redirects to `thank-you.html`.
- [ ] "Download Your eBook PDF" downloads the right file on phone and laptop.
- [ ] Privacy and Terms pages exist and the footer links open them.
- [ ] The page text matches the PDF you are actually selling.
