// services/notificationService.ts veya dosyanın üstü
export const triggerCustomsEmail = async (
  productData: any,
  calculationData: any,
  userEmail: string,
) => {
  try {
    // URL'in başına tam adres eklemek 404 hatasını çözebilir (örn: http://localhost:3000)
    const response = await fetch("/api/send-customs-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: userEmail,
        productName: productData.name,
        // Küsürat canavarını burada öldürüyoruz[cite: 1]
        basePrice: Number(calculationData.basePrice).toFixed(2),
        totalTax: Number(calculationData.totalTax).toFixed(2),
        totalImportPrice: Number(calculationData.totalImportPrice).toFixed(2),
        totalSavings: Number(calculationData.totalSavings || 0).toFixed(2),
        category: productData.category,
      }),
    });

    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Resend tetikleme hatası:", error);
    return { success: false, error };
  }
};
