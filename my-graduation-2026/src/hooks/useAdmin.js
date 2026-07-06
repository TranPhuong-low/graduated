import { useState, useEffect } from "react";
import { auth } from "../services/firebase";
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut 
} from "firebase/auth";

const adminEmailsString = import.meta.env.VITE_ADMIN_EMAILS || "";
const ADMIN_EMAILS = adminEmailsString.split(",").map(email => email.trim());

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && ADMIN_EMAILS.includes(user.email)) {
        setIsAdmin(true); 
      } else {
        setIsAdmin(false);
      }
    });

    return () => unsubscribe(); 
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    
    try {
      const result = await signInWithPopup(auth, provider);
      const userEmail = result.user.email;

      if (ADMIN_EMAILS.includes(userEmail)) {
        console.log("Đăng nhập Admin thành công!");
      } else {
        alert("Tài khoản của bạn không có đặc quyền Admin tại sự kiện này!");
        await signOut(auth); 
      }
    } catch (error) {
      console.error("Lỗi xác thực Google:", error.message);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setIsAdmin(false);
  };

  return { isAdmin, login, logout };
}