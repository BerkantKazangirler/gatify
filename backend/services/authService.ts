import { auth, db } from "../lib/firebase.js";

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  citizenId: string;
}) {
  try {
    // 1. Firebase Auth'ta Kullanıcı Oluştur (Admin SDK)
    const userRecord = await auth.createUser({
      email: data.email,
      password: data.password,
      displayName: data.name,
    });

    // 2. Firestore'da users collection'ına veriyi kaydet (Şifreyi kaydetmiyoruz!)
    const userDoc = {
      uid: userRecord.uid,
      name: data.name,
      email: data.email,
      citizenId: data.citizenId,
      role: "buyer",
      createdAt: new Date().toISOString(),
    };

    await db.collection("users").doc(userRecord.uid).set(userDoc);

    return userDoc;
  } catch (error: any) {
    throw new Error(error.message || "Kullanıcı oluşturulamadı.");
  }
}

export async function loginUser(email: string, password: string) {
  try {
    const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;
    if (!FIREBASE_API_KEY) {
      throw new Error(
        "FIREBASE_API_KEY ortam değişkeni backend'de tanımlanmamış.",
      );
    }

    // Admin SDK şifre ile girişi desteklemediği için Firebase Identity Toolkit API kullanılıyor.
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Giriş başarısız.");
    }

    // Firestore'dan kullanıcı detaylarını çek (Eğer giriş başarılıysa uid döner)
    const userDoc = await db.collection("users").doc(data.localId).get();

    return {
      token: data.idToken, // JWT Token (Client'ta saklanabilir)
      user: userDoc.exists
        ? userDoc.data()
        : { uid: data.localId, email: data.email },
    };
  } catch (error: any) {
    throw new Error(error.message || "Giriş işlemi sırasında hata oluştu.");
  }
}
