"use client";

import { Affix, CheckIcon, Notification } from "@mantine/core";
import { XIcon } from "@phosphor-icons/react/dist/ssr";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from "react";

type ToastContextType = (msg: string, ok: boolean) => void;

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
}

export function ToastProvider(props: PropsWithChildren) {
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = useCallback((msg: string, ok: boolean) => {
    setToast({ msg, ok });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {props.children}
      {toast && (
        <Affix
          position={{ bottom: 50, left: "50%" }}
          style={{ transform: "translateX(-50%)" }}
        >
          <Notification
            withCloseButton={false}
            withBorder
            title={toast.ok ? "Success" : "Error"}
            color={toast.ok ? "green" : "red"}
            icon={toast.ok ? <CheckIcon size={20} /> : <XIcon size={20} />}
          >
            {toast.msg}
          </Notification>
        </Affix>
      )}
    </ToastContext.Provider>
  );
}
