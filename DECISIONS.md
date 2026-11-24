# Decisions

**Booking goes through WhatsApp, not a form that saves data.** Almost every customer in Sargodha already uses WhatsApp, the owner can reply from his phone, and nothing needs a server or a database. The site only builds the message; the customer presses send.

**Left out on purpose (no overkill):** online payment, customer accounts, an admin panel, a booking calendar and a shopping cart. Payment happens at the car spa after the work. Any of these can be added later without redoing the page.

**One config file.** All details and prices live in `js/config.js`, so the same page can be moved to WordPress or Shopify, or reused for another local business, by changing data rather than code.

**English with an Urdu switch.** English is the default because that's how most people search. One button switches the whole page, including the WhatsApp message, to Urdu. The choice is remembered on that device only.

**Look.** Showroom navy and foam white, with kinnow orange as the only accent, a nod to Sargodha. The headline gets one animation: a squeegee wipes road dust off it on page load. Visitors who have turned off motion don't see it.

**Honest by default.** No countdown timers and no made-up reviews. Offers show real dates and hide themselves when they end. The reviews section links to Google rather than showing quotes. While the details are samples, a notice says so and no business data is sent to Google.

**Privacy.** No analytics, pixels or embedded maps. The map is a link, so Google only loads if the visitor taps it. Fonts are self-hosted.
