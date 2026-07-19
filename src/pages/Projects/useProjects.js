import { useEffect } from "react";
import { syncFromFirebase } from "./utils/firebaseSync";

export const useProjects = () => {
  useEffect(() => {
    syncFromFirebase().catch((err) => {
      console.warn("Firebase startup sync bypassed or failed:", err);
    });
  }, []);
};
