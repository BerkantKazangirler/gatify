import { auth, db } from "../lib/firebase.js";

// Gelen API cevabı için tip tanımı
interface FirebaseAuthResponse {
  idToken?: string;
  localId?: string;
  email?: string;
  error?: {
    message: string;
  };
}

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  citizenId: string;
}) {
  try {
    const userRecord = await auth.createUser({
      email: data.email,
      password: data.password,
      displayName: data.name,
    });

    const userDoc = {
      uid: userRecord.uid,
      name: data.name,
      email: data.email,
      citizenId: data.citizenId,
      role: "buyer",
      createdAt: new Date().toISOString(),
    };

    // Firebase v12/Admin SDK yazımı
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
      throw new Error("FIREBASE_API_KEY ortam değişkeni tanımlanmamış.");
    }

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

    // Hatanın çözümü: data değişkenini tip ile tanımlıyoruz
    const data = (await response.json()) as FirebaseAuthResponse;

    if (!response.ok) {
      throw new Error(data.error?.message || "Giriş başarısız.");
    }

    if (!data.localId) {
      throw new Error("Kullanıcı ID'si alınamadı.");
    }

    // Firestore'dan veriyi çek
    const userDoc = await db.collection("users").doc(data.localId).get();

    return {
      token: data.idToken,
      user: userDoc.exists
        ? userDoc.data()
        : { uid: data.localId, email: data.email },
    };
  } catch (error: any) {
    throw new Error(error.message || "Giriş işlemi sırasında hata oluştu.");
  }
}