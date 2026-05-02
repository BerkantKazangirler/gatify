export const calculateTax = (price: number, origin: string, category: string, exchangeRate: number) => {
  const priceTry = price * exchangeRate;
  const taxRate = origin === 'EU' ? 0.30 : 0.60;
  const otvRate = category === 'cosmetics' ? 0.20 : 0.0; // Parfüm vurgununa dikkat

  const customsTax = priceTry * taxRate;
  const otv = (priceTry + customsTax) * otvRate;
  const fees = 150; // Damga ve sunum

  const total = priceTry + customsTax + otv + fees;
  return {
    totalTax: Math.round(customsTax + otv + fees),
    finalPrice: Math.round(total),
    isWorthIt: (total / (priceTry * 2.5)) < 0.70 // %70 kâr marjı kontrolü
  };
};