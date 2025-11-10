const now = new Date().toISOString();
const mockData = {
  playlist: {
    id: "default-playlist",
    items: [
      { type: "image", url: "/assets/demo.jpg", duration: 12, title: "Promo Tabungan" },
      { type: "rate", productId: "tabungan-simapanas", duration: 10 },
      { type: "economic", duration: 15 },
      { type: "news", duration: 12 }
    ]
  },
  rates: [
    {
      id: "tabungan-simapanas",
      productName: "Tabungan Simapanas",
      interestRate: 4.25,
      currency: "IDR",
      effectiveDate: now,
      displayUntil: "2025-12-31T23:59:59Z",
      terms: "Bunga dihitung saldo rata-rata harian"
    }
  ],
  economic: {
    currencyRates: { USD: 15600, SGD: 11600, JPY: 105.3 },
    goldPrice: { gram: 1200000, ounce: 2300 },
    stockIndex: { IHSG: 7115.23, Change: "+0.34%" },
    updatedAt: now
  },
  news: [
    { title: "BI pertahankan suku bunga acuan", source: "CNBC Indonesia", link: "#" },
    { title: "IHSG menguat di akhir sesi", source: "Kontan", link: "#" }
  ]
};

export default mockData;