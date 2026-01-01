export default function ExchangeMarquee() {
  const exchanges = [
    "Gate.io",
    "MEXC",
    "KuCoin",
    "Bybit",
    "DAO Maker",
    "Polkastarter",
  ];

  // Duplicate the array for seamless infinite scroll
  const duplicatedExchanges = [...exchanges, ...exchanges];

  return (
    <div className="relative w-full overflow-hidden py-8">
      {/* Left gradient fade */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0B0E14] to-transparent z-10 pointer-events-none"></div>
      
      {/* Right gradient fade */}
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0B0E14] to-transparent z-10 pointer-events-none"></div>

      {/* Scrolling container */}
      <div className="flex animate-marquee">
        {duplicatedExchanges.map((exchange, index) => (
          <div
            key={index}
            className="flex-shrink-0 mx-8 text-2xl font-bold text-white opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300 cursor-pointer"
            style={{ minWidth: "150px" }}
          >
            {exchange}
          </div>
        ))}
      </div>
    </div>
  );
}
