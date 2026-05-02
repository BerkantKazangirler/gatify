export const calculateGatifyTax = (
  price: number, 
  origin: 'EU' | 'NON_EU', 
  category: string,
  exchangeRate: number
) => {
  const baseInTry = price * exchangeRate;
  
  // 2026 Kuralları: AB %30, Diğer %60
  const dutyRate = origin === 'EU' ? 0.30 : 0.60;
  const otvRate = category === 'cosmetics' ? 0.20 : 0.0;
  
  const customsTax = baseInTry * dutyRate;
  const otvAmount = (baseInTry + customsTax) * otvRate;
  const flatFees = 150; // Damga ve sunum ücreti

  const totalTax = customsTax + otvAmount + flatFees;
  
  return {
    taxAmount: Math.round(totalTax),
    isRisky: baseInTry > 1050 // ~30 Euro sınırı kontrolü (opsiyonel)
  };
};