(function () {
  "use strict";

  const config = window.SITE_CONFIG;
  const text = window.SITE_TEXT;
  const LANG_KEY = "ecs-lang";

  const state = {
    lang: readSavedLang(),
    size: config.carSizes[1].id, // Sedan is the most common car in the city
  };

  // Browser storage can be missing or blocked; the site must still work.
  function readSavedLang() {
    try {
      const saved = localStorage.getItem(LANG_KEY);
      return saved === "ur" ? "ur" : "en";
    } catch (e) {
      return "en";
    }
  }

  function saveLang(lang) {
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch (e) {
      /* language just won't be remembered next visit */
    }
  }

  const t = (key) => text[state.lang][key] ?? text.en[key] ?? "";
  const pick = (value) => (value && typeof value === "object" ? value[state.lang] ?? value.en : value);

  function formatPrice(amount) {
    const number = new Intl.NumberFormat("en-PK").format(amount);
    return state.lang === "ur" ? `${number} روپے` : `Rs ${number}`;
  }

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([name, value]) => {
      if (name === "text") node.textContent = value;
      else if (name === "className") node.className = value;
      else node.setAttribute(name, value);
    });
    (children || []).forEach((child) => node.append(child));
    return node;
  }

  /* ---------- links built from config ---------- */

  function whatsappLink(message) {
    const base = `https://wa.me/${config.business.whatsapp}`;
    return message ? `${base}?text=${encodeURIComponent(message)}` : base;
  }

  const hrefs = {
    tel: () => `tel:${config.business.phoneDial}`,
    whatsapp: () => whatsappLink(t("msgHello")),
    maps: () => config.business.mapsLink,
    reviews: () => config.business.googleReviewLink,
    instagram: () => config.business.social.instagram,
    facebook: () => config.business.social.facebook,
    tiktok: () => config.business.social.tiktok,
  };

  const configText = {
    city: () => (state.lang === "ur" ? "سرگودھا" : config.business.city),
    hours: () => pick(config.business.hours),
    address: () => pick(config.business.address),
    pickupNote: () => pick(config.business.pickupNote),
    referral: () => pick(config.referral),
    phone: () => config.business.phoneDisplay,
  };

  /* ---------- language ---------- */

  function applyStaticText() {
    document.documentElement.lang = state.lang;
    document.documentElement.dir = state.lang === "ur" ? "rtl" : "ltr";

    document.querySelectorAll("[data-i18n]").forEach((node) => {
      node.textContent = t(node.dataset.i18n);
    });
    document.querySelectorAll("[data-i18n-attr]").forEach((node) => {
      node.dataset.i18nAttr.split(";").forEach((pair) => {
        const [attr, key] = pair.split(":");
        node.setAttribute(attr.trim(), t(key.trim()));
      });
    });
    document.querySelectorAll("[data-config]").forEach((node) => {
      const getter = configText[node.dataset.config];
      if (getter) node.textContent = getter();
    });
    document.querySelectorAll("[data-config-href]").forEach((node) => {
      const getter = hrefs[node.dataset.configHref];
      if (getter) node.setAttribute("href", getter());
    });

    // The switch names the other language, written in that language.
    document.getElementById("lang-switch").setAttribute("lang", state.lang === "ur" ? "en" : "ur");

    const share = `${t("referShareText")} ${location.href.split("#")[0]}`;
    document.getElementById("share-link").setAttribute("href", `https://wa.me/?text=${encodeURIComponent(share)}`);
  }

  /* ---------- prices ---------- */

  function renderSizePicker() {
    const box = document.getElementById("size-options");
    box.replaceChildren(
      ...config.carSizes.map((size) => {
        const input = el("input", { type: "radio", name: "car-size", id: `size-${size.id}`, value: size.id });
        input.checked = size.id === state.size;
        input.addEventListener("change", () => {
          state.size = size.id;
          document.getElementById("f-size").value = size.id;
          renderRates();
          updateSizeHint();
          updateEstimate();
        });
        return el("div", { className: "size-option" }, [input, el("label", { for: `size-${size.id}`, text: pick(size) })]);
      })
    );
    updateSizeHint();
  }

  function updateSizeHint() {
    const size = config.carSizes.find((s) => s.id === state.size);
    document.getElementById("size-hint").textContent = pick(size.hint);
  }

  function renderRates() {
    const board = document.getElementById("rate-board");
    board.replaceChildren(
      ...config.packages.map((pkg) => {
        const name = el("div", { className: "rate-name" }, [
          el("h3", { text: pick(pkg.name) }),
          el("p", { className: "rate-time", text: pick(pkg.time) }),
        ]);
        if (pkg.popular) name.prepend(el("span", { className: "badge", text: t("popular") }));

        const includes = el("ul", { className: "rate-includes" }, pick(pkg.includes).map((item) => el("li", { text: item })));
        const price = el("p", { className: "rate-price", text: formatPrice(pkg.prices[state.size]) });
        const button = el("button", { type: "button", className: "btn btn-ink btn-small", text: t("bookThis") });
        button.setAttribute("aria-label", `${t("bookThis")}: ${pick(pkg.name)}`);
        button.addEventListener("click", () => startBooking(pkg.id));

        return el("li", { className: pkg.popular ? "rate is-popular" : "rate" }, [name, includes, price, button]);
      })
    );
  }

  /* ---------- booking ---------- */

  const form = document.getElementById("book-form");
  const fields = {
    service: document.getElementById("f-service"),
    size: document.getElementById("f-size"),
    model: document.getElementById("f-model"),
    day: document.getElementById("f-day"),
    time: document.getElementById("f-time"),
    pickup: document.getElementById("f-pickup"),
    area: document.getElementById("f-area"),
    name: document.getElementById("f-name"),
    referral: document.getElementById("f-ref"),
  };

  function renderFormOptions() {
    const chosenService = fields.service.value;
    fields.service.replaceChildren(
      el("option", { value: "", text: "—" }),
      ...config.packages.map((pkg) => el("option", { value: pkg.id, text: pick(pkg.name) }))
    );
    fields.service.value = chosenService;

    fields.size.replaceChildren(...config.carSizes.map((size) => el("option", { value: size.id, text: pick(size) })));
    fields.size.value = state.size;
  }

  function startBooking(packageId) {
    fields.service.value = packageId;
    fields.size.value = state.size;
    showError("service", false);
    updateEstimate();
    document.getElementById("book").scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
    fields.service.focus({ preventScroll: true });
  }

  function updateEstimate() {
    const pkg = config.packages.find((p) => p.id === fields.service.value);
    document.getElementById("estimate-value").textContent = pkg ? formatPrice(pkg.prices[fields.size.value]) : "—";
  }

  function showError(name, show) {
    const input = fields[name];
    document.getElementById(`err-${name}`).hidden = !show;
    if (show) input.setAttribute("aria-invalid", "true");
    else input.removeAttribute("aria-invalid");
  }

  function buildMessage() {
    const pkg = config.packages.find((p) => p.id === fields.service.value);
    const size = config.carSizes.find((s) => s.id === fields.size.value);
    const car = [fields.model.value.trim(), `(${pick(size)})`].filter(Boolean).join(" ");
    const lines = [t("msgHello"), "", `${t("msgService")}: ${pick(pkg.name)}`, `${t("msgCar")}: ${car}`];

    if (fields.day.value) lines.push(`${t("msgDay")}: ${fields.day.value}`);
    if (fields.time.value) lines.push(`${t("msgTime")}: ${t(fields.time.value)}`);
    if (fields.pickup.checked) lines.push(`${t("msgPickup")}: ${fields.area.value.trim()}`);
    if (fields.name.value.trim()) lines.push(`${t("msgName")}: ${fields.name.value.trim()}`);
    if (fields.referral.value.trim()) lines.push(`${t("msgReferral")}: ${fields.referral.value.trim()}`);
    lines.push(`${t("msgPrice")}: ${formatPrice(pkg.prices[size.id])}`);
    return lines.join("\n");
  }

  function handleSubmit(event) {
    event.preventDefault();
    const missingService = !fields.service.value;
    const missingArea = fields.pickup.checked && !fields.area.value.trim();
    showError("service", missingService);
    showError("area", missingArea);
    if (missingService) return fields.service.focus();
    if (missingArea) return fields.area.focus();

    const url = whatsappLink(buildMessage());
    const fallback = document.getElementById("wa-fallback");
    fallback.href = url;
    // Some in-app browsers block new windows; then the visitor taps the link instead.
    const opened = window.open(url, "_blank", "noopener");
    fallback.hidden = Boolean(opened);
    if (!opened) fallback.focus();
  }

  function bindForm() {
    fields.service.addEventListener("change", () => {
      showError("service", false);
      updateEstimate();
    });
    fields.size.addEventListener("change", () => {
      state.size = fields.size.value;
      renderSizePicker();
      renderRates();
      updateEstimate();
    });
    fields.pickup.addEventListener("change", () => {
      document.getElementById("area-field").hidden = !fields.pickup.checked;
      if (!fields.pickup.checked) showError("area", false);
    });
    fields.area.addEventListener("input", () => showError("area", false));
    fields.day.min = new Date().toISOString().slice(0, 10);
    form.addEventListener("submit", handleSubmit);
  }

  /* ---------- offers and FAQ ---------- */

  function isRunning(offer, today) {
    if (offer.starts && today < offer.starts) return false;
    if (offer.ends && today > offer.ends) return false;
    return true;
  }

  function localToday() {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  }

  function formatDate(iso) {
    const [y, m, d] = iso.split("-").map(Number);
    return new Intl.DateTimeFormat(state.lang === "ur" ? "ur-PK" : "en-PK", { day: "numeric", month: "long", year: "numeric" })
      .format(new Date(y, m - 1, d));
  }

  function renderOffers() {
    const list = document.getElementById("offer-list");
    const running = config.offers.filter((offer) => isRunning(offer, localToday()));
    if (!running.length) {
      list.replaceChildren(el("p", { className: "offers-none", text: t("offersNone") }));
      return;
    }
    list.replaceChildren(
      ...running.map((offer) =>
        el("article", { className: "offer" }, [
          el("h3", { text: pick(offer.title) }),
          el("p", { text: pick(offer.text) }),
          el("p", {
            className: "offer-date",
            text: offer.ends ? `${t("offerEnds")}: ${formatDate(offer.ends)}` : t("offerNoEnd"),
          }),
        ])
      )
    );
  }

  function renderFaq() {
    document.getElementById("faq-list").replaceChildren(
      ...config.faq.map((item) => el("details", {}, [el("summary", { text: pick(item.q) }), el("p", { text: pick(item.a) })]))
    );
  }

  /* ---------- search engines ---------- */

  function addStructuredData() {
    const b = config.business;
    const data = {
      "@context": "https://schema.org",
      "@type": "AutoWash",
      name: b.name,
      telephone: b.phoneDial,
      address: { "@type": "PostalAddress", streetAddress: b.address.en, addressLocality: b.city, addressCountry: "PK" },
      hasMap: b.mapsLink,
      sameAs: Object.values(b.social),
      priceRange: `Rs ${Math.min(...config.packages.flatMap((p) => Object.values(p.prices)))}+`,
    };
    document.head.append(el("script", { type: "application/ld+json", text: JSON.stringify(data) }));
  }

  /* ---------- start ---------- */

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function renderAll() {
    applyStaticText();
    renderSizePicker();
    renderRates();
    renderFormOptions();
    renderOffers();
    renderFaq();
    updateEstimate();
  }

  document.getElementById("lang-switch").addEventListener("click", () => {
    state.lang = state.lang === "en" ? "ur" : "en";
    saveLang(state.lang);
    renderAll();
  });

  document.getElementById("draft-notice").hidden = !config.isDraft;
  document.getElementById("year").textContent = new Date().getFullYear();
  if (!config.isDraft) addStructuredData(); // never publish sample details to Google
  bindForm();
  renderAll();
})();
