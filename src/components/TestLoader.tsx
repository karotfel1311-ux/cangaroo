"use client";

import { LoadingOverlay } from "@mantine/core";
import { usePathname, useSearchParams } from "next/navigation";
import {
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
  createContext,
} from "react";

export const LoaderContext = createContext(() => {});

export function LoaderOverlay(props: PropsWithChildren) {
  const [showLoader, setShowLoader] = useState(true);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleShow = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setShowLoader(true);
    }, 300);
  };

  const handleHide = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setShowLoader(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    handleHide();
  }, [pathname, searchParams]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      {showLoader && (
        <div
          style={{
            position: "absolute",
            top: 0,
            width: "calc(100% - var(--app-shell-navbar-offset))",
            height: "100%",
            zIndex: 5,
            left: 0,
            marginLeft: "var(--app-shell-navbar-offset)",
          }}
        >
          <LoadingOverlay
            visible={true}
            zIndex={1000}
            overlayProps={{ radius: "sm", blur: 2 }}
          />
        </div>
      )}

      <LoaderContext.Provider value={handleShow}>
        {props.children}
      </LoaderContext.Provider>
    </>
  );
}
