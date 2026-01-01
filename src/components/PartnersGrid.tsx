export default function PartnersGrid() {
  const partners = [
    { name: "Gate.io", logo: "/logos/gateio.svg" },
    { name: "MEXC", logo: "/logos/mexc.svg" },
    { name: "KuCoin", logo: "/logos/kucoin.svg" },
    { name: "Bybit", logo: "/logos/bybit.svg" },
    { name: "DAO Maker", logo: "/logos/daomaker.svg" },
    { name: "Polkastarter", logo: "/logos/polkastarter.svg" },
    { name: "Binance", logo: "/logos/binance.svg" },
    { name: "Cointelegraph", logo: "/logos/cointelegraph.svg" },
    { name: "CoinDesk", logo: "/logos/coindesk.svg" },
    { name: "CoinMarketCap", logo: "/logos/coinmarketcap.svg" },
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {partners.map((partner, index) => (
          <div
            key={index}
            className="flex items-center justify-center gap-3 px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-lg hover:border-cyan-400/50 transition-all duration-300"
          >
            {/* Logo - Strictly h-8 w-auto */}
            <img
              src={partner.logo}
              alt={`${partner.name} logo`}
              className="h-8 w-auto object-contain grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all"
              onError={(e) => {
                // Fallback to first letter if image fails
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            
            {/* Fallback: First letter in circle */}
            <div className="hidden h-8 w-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {partner.name.charAt(0)}
            </div>
            
            {/* Partner Name */}
            <span className="text-sm font-semibold text-gray-300 whitespace-nowrap">
              {partner.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
