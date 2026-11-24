# Elite's Car Spa website

A one-page website for Elite's Car Spa in Sargodha. Visitors see prices for their car size, build a booking, and send it to the car spa on WhatsApp. The site works in English and Urdu.

It is plain HTML, CSS and JavaScript. No build step, no database and no third-party scripts. The fonts are stored with the site, so visitors' browsers never contact Google or anyone else just to load the page.

## What's inside

```
site/
  index.html        the page
  css/styles.css    all styling
  js/config.js      every business detail: phone, address, prices, offers, FAQ
  js/i18n.js        fixed page text in English and Urdu
  js/main.js        language switch, price list, booking message, offers
  fonts/            Archivo and Noto Nastaliq Urdu (SIL Open Font License)
  img/favicon.svg
tests/check.mjs     quick content check
DECISIONS.md        why things are built the way they are
```

## Before going live

1. Open `site/js/config.js` and replace every sample value: WhatsApp number, phone, address, Google Maps link, hours, prices, offers, social links and Google reviews link.
2. Only keep `popular: true` on a package if it really is the most booked one.
3. Add real before-and-after photos to `site/img/` and swap them in where `index.html` says so. Write a short `alt` text for each photo.
4. Remove the `<meta name="robots" content="noindex, nofollow">` line from `site/index.html`, so Google can list the site.
5. Set `isDraft: false`. That removes the orange "samples" notice and turns on the Google business data.
6. Run the check: `node tests/check.mjs`

## Run it on your computer

Any small web server works. From the `site` folder:

```
python3 -m http.server 8000
```

Then open http://localhost:8000. Opening `index.html` directly also works, apart from the custom fonts.

## Putting it online

**GitHub Pages (current preview).** Every push to `main` publishes the `site/` folder through `.github/workflows/pages.yml`. In the repo, Settings → Pages → Source must be set to GitHub Actions.

**Any hosting (quickest).** Upload the contents of `site/` to the web root (`public_html` on most cPanel hosting). Done. Free options also work: Cloudflare Pages, Netlify or GitHub Pages.

**WordPress.** Two routes:
- Simple: make a small theme whose `index.php` holds the body of `index.html`, then load `css/` and `js/` with `wp_enqueue_style` and `wp_enqueue_script`. `config.js` stays the place to edit details.
- Editable by the owner: move prices, offers and FAQ into the WordPress editor (custom fields or a settings page) and print them into `window.SITE_CONFIG`. The rest of the code stays the same.

**Shopify.** Only worth it if Abdullah later wants to sell products such as car care kits. Turn the page sections into theme sections, keep `main.js` as a theme asset, and fill the config from theme settings.

## Changing things

- Prices, offers, FAQ, timings: `site/js/config.js` only.
- Button and heading text: `site/js/i18n.js`. Every key needs an English and an Urdu version; the check will catch a missing one.
- Offers have start and end dates and hide by themselves when they end.
