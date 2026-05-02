import { db } from '../lib/firebase';

export const getProductByEan = async (eanCode: string) => {
  const productRef = db.collection('products').doc(eanCode);
  const doc = await productRef.get();
  
  if (!doc.exists) return null;
  return doc.data();
};

export const saveProduct = async (eanCode: string, productData: any) => {
  await db.collection('products').doc(eanCode).set(productData, { merge: true });
};