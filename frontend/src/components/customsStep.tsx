import { useState, useEffect } from "react";

export const triggerCustomsEmail = async (
  productData: any,
  calculationData: any,
  userEmail: string,
) => {
  try {
    const response = await fetch("/api/send-customs-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: userEmail,
        productName: productData.name,
        // Matematiksel hataları önlemek için sayıları burada da formatlıyoruz
        basePrice: calculationData.basePrice.toFixed(2),
        totalTax: calculationData.totalTax.toFixed(2),
        totalImportPrice: calculationData.totalImportPrice.toFixed(2),
        totalSavings: calculationData.totalSavings.toFixed(2),
        category: productData.category,
      }),
    });

    if (!response.ok) throw new Error("Mail gönderimi başarısız");
    return await response.json();
  } catch (error) {
    console.error("Resend tetikleme hatası:", error);
    return { success: false, error };
  }
};

export function CustomsStep({ product, calculationData, userEmail }: any) {
  const [steps, setSteps] = useState({
    invoice: "Bekliyor",
    cn23: "Bekliyor",
    email: "Gönderilmedi",
  });

  useEffect(() => {
    const processCustoms = async () => {
      // 1. & 2. Adımlar (Simülasyon)
      await new Promise((res) => setTimeout(res, 1500));
      setSteps((prev) => ({ ...prev, invoice: "Oluşturuldu" }));

      await new Promise((res) => setTimeout(res, 1000));
      setSteps((prev) => ({ ...prev, cn23: "Oluşturuldu" }));

      // 3. Adım: Mail Tetikleme
      // Buradaki parametre sırasının fonksiyon tanımıyla aynı olduğunu kontrol et
      const result = await triggerCustomsEmail(
        product,
        calculationData,
        userEmail,
      );

      if (result && result.success) {
        setSteps((prev) => ({ ...prev, email: "Gönderildi" }));
      }
    };

    processCustoms();
  }, [product, calculationData, userEmail]);

  return (
    <div className="space-y-4">
      {/* Görseldeki UI elemanlarını buradaki state'lere göre render edebilirsin */}
      <div className="flex justify-between p-4 bg-white rounded-lg border">
        <span>Ticari Fatura</span>
        <span className="text-green-600">{steps.invoice}</span>
      </div>
      <div className="flex justify-between p-4 bg-white rounded-lg border">
        <span>Gümrük Beyan Formu (CN23)</span>
        <span className="text-green-600">{steps.cn23}</span>
      </div>
    </div>
  );
}
