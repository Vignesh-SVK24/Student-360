import { useState, useCallback } from "react";

export function useToast(durationMs: number = 3000) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, durationMs);
  }, [durationMs]);

  return { toastMessage, showToast };
}