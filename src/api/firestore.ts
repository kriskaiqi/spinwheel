import { getFirestore, collection, addDoc, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';

const db = getFirestore();

export async function saveWheel(userId: string, entries: string[], premiumStatus: boolean) {
  const wheelsRef = collection(db, 'wheels');
  const q = query(wheelsRef, where('userId', '==', userId));
  const snapshot = await getDocs(q);

  if (!premiumStatus && snapshot.size >= 3) {
    throw new Error('Free users can only save up to 3 wheels.');
  }

  const newWheel = {
    userId,
    entries,
    createdAt: Date.now(),
  };

  const docRef = await addDoc(wheelsRef, newWheel);
  return { id: docRef.id, ...newWheel };
}

export async function loadWheels(userId: string) {
  const wheelsRef = collection(db, 'wheels');
  const q = query(wheelsRef, where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function deleteWheel(wheelId: string) {
  const wheelsRef = collection(db, 'wheels');
  await deleteDoc(doc(wheelsRef, wheelId));
}
