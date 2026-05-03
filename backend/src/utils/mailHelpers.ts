// utils/mailHelpers.ts veya API Route
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendCustomsDocuments = async (
  userEmail: string,
  orderData: any,
) => {
  const { product, totalImportPrice, totalTax, customsTax, vat } = orderData;

  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: userEmail,
      subject: `Siparişiniz İçin Gümrük Belgeleri Hazır: ${product.name}`,
      html: `
        <h1>Gümrük Beyanınız Onaylandı</h1>
        <p>Sayın kullanıcımız, <strong>${product.name}</strong> ürününüz için gümrük belgeleri otomatik olarak oluşturulmuştur.</p>
        
        <h3>Maliyet Özeti:</h3>
        <ul>
          <li>Ürün Bedeli: $${Number(product.globalPrice).toFixed(2)}</li>
          <li>Toplam Gümrük Vergisi: $${customsTax.toFixed(2)}</li>
          <li>KDV: $${vat.toFixed(2)}</li>[cite: 1]
          <li><strong>Toplam Ödenen: $${totalImportPrice.toFixed(2)}</strong></li>[cite: 1]
        </ul>

        <p>Ek bilgiler: Ticari Fatura ve CN23 formu gümrük yetkililerine dijital olarak iletilmiştir.</p>
      `,
    });
  } catch (error) {
    console.error("Mail gönderim hatası:", error);
  }
};
