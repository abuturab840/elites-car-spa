/*
 * Every business detail for the site lives here, so the owner's real
 * details can be swapped in without touching the layout or the code.
 *
 * While `isDraft` is true, a thin notice tells visitors the details are
 * samples. Set it to false only after every value below is real.
 */
window.SITE_CONFIG = {
  isDraft: true,

  business: {
    name: "Elite's Car Spa",
    city: "Sargodha",
    // International format without "+" or spaces, used for WhatsApp links.
    whatsapp: "923000000000",
    // As people dial it locally; shown on the page and used for the call button.
    phoneDisplay: "0300 0000000",
    phoneDial: "+923000000000",
    address: {
      en: "Sample address, University Road, Sargodha",
      ur: "نمونہ پتہ، یونیورسٹی روڈ، سرگودھا",
    },
    mapsLink: "https://maps.google.com/?q=Sargodha",
    hours: {
      en: "Every day, 9:00 am to 9:00 pm (closed Friday 1:00 to 2:30 pm)",
      ur: "روزانہ صبح 9 بجے سے رات 9 بجے تک (جمعہ 1 سے 2:30 بجے تک بند)",
    },
    pickupNote: {
      en: "Free pick-up and drop-off inside Sargodha city on orders over Rs 2,500.",
      ur: "سرگودھا شہر کے اندر 2,500 روپے سے زیادہ کے آرڈر پر مفت پک اینڈ ڈراپ۔",
    },
    social: {
      instagram: "https://instagram.com/",
      facebook: "https://facebook.com/",
      tiktok: "https://tiktok.com/",
    },
    googleReviewLink: "https://maps.google.com/?q=Sargodha",
  },

  // Car sizes the price list switches between.
  carSizes: [
    { id: "small", en: "Hatchback", ur: "چھوٹی گاڑی", hint: { en: "Alto, Mehran, Cultus, Wagon R", ur: "آلٹو، مہران، کلٹس، ویگن آر" } },
    { id: "sedan", en: "Sedan", ur: "سیڈان", hint: { en: "Corolla, Civic, City, Yaris", ur: "کرولا، سوک، سٹی، یارس" } },
    { id: "suv", en: "SUV / Jeep", ur: "ایس یو وی / جیپ", hint: { en: "Fortuner, Sportage, Tucson, Prado", ur: "فارچونر، اسپورٹیج، ٹوسان، پراڈو" } },
  ],

  // Prices in PKR, one per car size id.
  packages: [
    {
      id: "express",
      name: { en: "Express wash", ur: "ایکسپریس واش" },
      time: { en: "About 20 minutes", ur: "تقریباً 20 منٹ" },
      includes: {
        en: ["Foam wash outside", "Tyres and rims", "Hand dry with microfibre"],
        ur: ["باہر سے فوم واش", "ٹائر اور رِم", "مائیکرو فائبر سے خشک"],
      },
      prices: { small: 600, sedan: 800, suv: 1000 },
    },
    {
      id: "full",
      name: { en: "Full wash", ur: "فل واش" },
      time: { en: "About 45 minutes", ur: "تقریباً 45 منٹ" },
      includes: {
        en: ["Everything in Express", "Vacuum seats, mats and boot", "Dashboard and glass wiped inside"],
        ur: ["ایکسپریس کی ہر چیز", "سیٹوں، میٹس اور ڈگی کی ویکیوم", "اندر سے ڈیش بورڈ اور شیشے صاف"],
      },
      prices: { small: 1000, sedan: 1300, suv: 1700 },
      popular: true,
    },
    {
      id: "interior",
      name: { en: "Interior deep clean", ur: "اندرونی ڈیپ کلین" },
      time: { en: "3 to 4 hours", ur: "3 سے 4 گھنٹے" },
      includes: {
        en: ["Seats shampooed or leather cleaned", "Roof, carpets and door panels", "Smell removed, AC vents cleaned"],
        ur: ["سیٹوں کی شیمپو یا لیدر کی صفائی", "چھت، قالین اور دروازوں کے پینل", "بدبو ختم، اے سی وینٹس صاف"],
      },
      prices: { small: 3500, sedan: 4500, suv: 6000 },
    },
    {
      id: "polish",
      name: { en: "Polish and wax", ur: "پالش اور ویکس" },
      time: { en: "4 to 5 hours", ur: "4 سے 5 گھنٹے" },
      includes: {
        en: ["Full wash first", "Machine polish to remove light scratches", "Wax coat for shine and dust protection"],
        ur: ["پہلے فل واش", "ہلکے اسکریچ ہٹانے کے لیے مشین پالش", "چمک اور گرد سے بچاؤ کے لیے ویکس"],
      },
      prices: { small: 4000, sedan: 5000, suv: 6500 },
    },
  ],

  /*
   * Offers show only between their start and end dates and hide by
   * themselves afterwards, so the page never shows an expired deal.
   * Dates are YYYY-MM-DD. Leave `ends` empty for an offer with no end.
   */
  offers: [
    {
      id: "student",
      title: { en: "Student deal", ur: "اسٹوڈنٹ آفر" },
      text: {
        en: "Show your university or college card and get Rs 200 off any Full wash.",
        ur: "یونیورسٹی یا کالج کارڈ دکھائیں اور کسی بھی فل واش پر 200 روپے کی رعایت پائیں۔",
      },
      starts: "2026-01-01",
      ends: "",
    },
    {
      id: "first",
      title: { en: "First visit", ur: "پہلی بار" },
      text: {
        en: "First time with us? Your tyre shine is free with any wash.",
        ur: "پہلی بار آ رہے ہیں؟ کسی بھی واش کے ساتھ ٹائر شائن مفت۔",
      },
      starts: "2026-01-01",
      ends: "2027-01-31",
    },
  ],

  referral: {
    en: "Send this site to a friend. When they book and mention your name, you both get Rs 150 off your next wash.",
    ur: "یہ ویب سائٹ کسی دوست کو بھیجیں۔ جب وہ بکنگ کرتے وقت آپ کا نام بتائیں گے تو اگلی واش پر دونوں کو 150 روپے کی رعایت ملے گی۔",
  },

  faq: [
    {
      q: { en: "Do I need to book before coming?", ur: "کیا آنے سے پہلے بکنگ ضروری ہے؟" },
      a: {
        en: "Walk-ins are welcome, but booking on WhatsApp means no waiting, especially on weekends.",
        ur: "بغیر بکنگ بھی آ سکتے ہیں، لیکن واٹس ایپ پر بکنگ سے انتظار نہیں کرنا پڑتا، خاص طور پر ویک اینڈ پر۔",
      },
    },
    {
      q: { en: "How do I pay?", ur: "ادائیگی کیسے ہوگی؟" },
      a: {
        en: "Pay after the work is done, in cash or by JazzCash, Easypaisa or bank transfer. Nothing is paid on this website.",
        ur: "کام مکمل ہونے کے بعد نقد، جاز کیش، ایزی پیسہ یا بینک ٹرانسفر سے ادائیگی کریں۔ اس ویب سائٹ پر کوئی ادائیگی نہیں ہوتی۔",
      },
    },
    {
      q: { en: "Is the polish safe for my paint?", ur: "کیا پالش سے پینٹ کو نقصان تو نہیں ہوگا؟" },
      a: {
        en: "Yes. We use paint-safe machine polish and check the paint first. If a scratch is too deep to polish out, we tell you before starting.",
        ur: "جی نہیں۔ ہم پینٹ کے لیے محفوظ مشین پالش استعمال کرتے ہیں اور پہلے پینٹ چیک کرتے ہیں۔ اگر اسکریچ زیادہ گہرا ہو تو کام شروع کرنے سے پہلے بتا دیتے ہیں۔",
      },
    },
    {
      q: { en: "Can you collect my car from home or office?", ur: "کیا آپ گاڑی گھر یا دفتر سے لے جا سکتے ہیں؟" },
      a: {
        en: "Yes, inside Sargodha city. Tick pick-up when you book and share your area.",
        ur: "جی ہاں، سرگودھا شہر کے اندر۔ بکنگ کرتے وقت پک اپ پر نشان لگائیں اور اپنا علاقہ بتائیں۔",
      },
    },
  ],
};
