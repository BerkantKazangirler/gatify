# Gatify: Global Shopping & Customs Automation Gateway ✈️📦

**Gatify**, sınır ötesi e-ticaret süreçlerindeki karmaşıklığı gidermek için tasarlanmış; gümrük vergilerini (ÖTV, KDV, TRT Bandrolü) gerçek zamanlı hesaplayan ve yasal beyan belgelerini otomatik olarak dijitalleştiren bir altyapı çözümüdür.

> **Geliştirme Notu:** Bu proje, bir teknoloji hackathon'u kapsamında kısıtlı bir sürede geliştirilmeye başlanmıştır. Projenin teknik mimarisi ve "Proof of Concept" (Kavram Kanıtı) aşaması tamamlanarak açık kaynak dünyasına sunulmuştur.
> 
---

## 👥 Geliştirici Ekibi: 404 ERROR
Proje, **404 ERROR** ekibi tarafından kolektif bir çabayla hayata geçirilmiştir:

*   **Ş. Songül Duran:** Team Lead & Sunum
*   **Berkant Kazangirler:** Fullstack Developer
*   **Raife Altan:** UI/UX Design & Planlama
*   **Halime Tunceli:** Frontend Developer

---

## 🛠️ Temel Özellikler
*   **Hassas Vergi Hesaplama:** Mevcut gümrük mevzuatına tam uyumlu; kategori bazlı ÖTV, KDV ve ek maliyetlerin dinamik hesaplanması.
*   **Otomatik Belgelendirme:** Ticari Fatura ve CN23 Gümrük Beyan formlarının veri girişine dayalı olarak anlık üretilmesi.
*   **E-Posta Entegrasyonu:** İşlem tamamlandığında maliyet dökümünün ve belgelerin ilgili taraflara otomatik iletilmesi.
*   **Maliyet Analizi (Worth It Score):** Ürünün toplam ithalat maliyeti ile yerel piyasa değerini kıyaslayan akıllı algoritma.

## 💻 Teknik Mimari

Gatify, yüksek veri doğruluğu ve performans odaklı modern bir fullstack mimari üzerine inşa edilmiştir:

*   **Core Framework:** Next.js (App Router) ve TypeScript kullanılarak tip güvenliği yüksek, SEO dostu ve hızlı bir altyapı oluşturulmuştur.
*   **Backend & API:** Sunucu taraflı işlemler ve dinamik veri akışı, Next.js API Routes üzerinden Node.js çalışma ortamında yönetilmektedir.
*   **Veri Yönetimi:** Ürün parametreleri, vergi oranları ve kullanıcı verileri için esnek bir doküman yapısı sunan Firestore (NoSQL) tercih edilmiştir.
*   **Bildirim Sistemi:** Gümrük belgelerinin ve maliyet dökümlerinin yüksek teslimat oranıyla iletilmesi için Resend SDK entegrasyonu sağlanmıştır.
*   **Arayüz & Deneyim:** Kullanıcı dostu ve duyarlı (responsive) bir deneyim için Tailwind CSS ve Lucide Icons kütüphaneleriyle modern bir tasarım dili uygulanmıştır.
*   **Deployment:** Projenin sürekliliği ve ölçeklenebilirliği Vercel ve Cloudflare ekosistemi üzerinden optimize edilmiştir.

## 🏗️ Mühendislik Yaklaşımı
Gatify, finansal verilerde oluşabilecek hataları engellemek adına özel bir matematiksel katman kullanır. JavaScript'in ondalık sayı (Floating Point) hesaplama hatalarına karşı geliştirilen güvenli yuvarlama ve tip zorlama mekanizmaları sayesinde, kullanıcıya yansıtılan rakamlar her zaman tutarlıdır.

## 🚧 Mevcut Durum
Geliştirme süresince projenin aşağıdaki temel bileşenleri işler hale getirilmiştir:
*   [x] Dinamik ürün detay ve vergi dağılım motoru.
*   [x] Checkout ve gümrük süreç simülasyonu.
*   [x] Gerçek zamanlı vergi döküm tablosu.
*   [ ] Tam kapsamlı PDF üretim ve arşivleme sistemi (Gelecek planı).
