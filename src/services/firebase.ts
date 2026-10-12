// ================================================================
// CẤU HÌNH VÀ KHỞI TẠO DỊCH VỤ GOOGLE FIREBASE
// Dự án: gochoctap-aaa4a
// Tối ưu hóa: Spark Free Tier (0 USD/tháng)
// ================================================================

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth, Auth,
  signInAnonymously,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyAvdmZ2OaaoW_krrvnvTJtuBa0YXkpfb68",
  authDomain: "gochoctap-aaa4a.firebaseapp.com",
  projectId: "gochoctap-aaa4a",
  storageBucket: "gochoctap-aaa4a.firebasestorage.app",
  messagingSenderId: "1098041237642",
  appId: "1:1098041237642:web:e52eb65d1b1c51cb9f4d73",
  measurementId: "G-150K19NVPG"
};

// Khởi tạo Singleton Firebase App
export const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Khởi tạo dịch vụ Authentication
export const auth: Auth = getAuth(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Khởi tạo dịch vụ Cloud Firestore
export const db: Firestore = getFirestore(app);

// Đăng nhập bằng Google (dành cho phụ huynh quản lý tài khoản)
// - Sign out anonymous trước để tránh conflict
// - Nếu vẫn bị auth/credential-already-in-use → dùng credentialFromError để recovery
export const signInWithGoogle = async (): Promise<User> => {
  // Sign out user hiện tại (anonymous) trước
  if (auth.currentUser) {
    await signOut(auth);
  }
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (err: any) {
    // Nếu credential đã liên kết với Firebase user khác, dùng credential đó để sign in
    if (err?.code === 'auth/credential-already-in-use') {
      const credential = GoogleAuthProvider.credentialFromError(err);
      if (credential) {
        await signOut(auth).catch(() => {});
        const { signInWithCredential } = await import('firebase/auth');
        const recovery = await signInWithCredential(auth, credential);
        return recovery.user;
      }
    }
    throw err;
  }
};

// Đăng xuất khỏi tài khoản Google
export const signOutGoogle = (): Promise<void> => {
  return signOut(auth);
};

// Lấy user hiện tại đang đăng nhập (nếu có)
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// Hàm đăng nhập ẩn danh bảo vệ thông tin trẻ em (COPPA Compliant)
// Chỉ dùng khi phụ huynh chưa đăng nhập Google
export const ensureAnonymousAuth = (): Promise<User> => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe();
      if (user) {
        resolve(user);
      } else {
        try {
          const cred = await signInAnonymously(auth);
          resolve(cred.user);
        } catch (error) {
          reject(error);
        }
      }
    });
  });
};
