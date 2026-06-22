"use client";

import React, { ReactNode, useEffect, useRef, useState } from "react";

interface ModalControlProps {
  isVisible: boolean;
  handleShow: () => void;
  handleHide: () => void;
}

type WithTriggerProps = {
  children: (handleShow: () => void, handleHide: () => void) => ReactNode;
  isVisible?: never;
  onHide?: never;
};

export function withTrigger<P extends object>(
  WrappedComponent: React.ComponentType<P & ModalControlProps>,
) {
  return function WithTrigger(props: P & WithTriggerProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [hasBeenOpened, setHasBeenOpened] = useState(false);
    const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
      if ("isVisible" in props) {
        setIsVisible(Boolean(props.isVisible));
        if (props.isVisible) setHasBeenOpened(true);
      }
    }, [props, props.isVisible]);

    useEffect(() => {
      return () => {
        if (hideTimeout.current) clearTimeout(hideTimeout.current);
      };
    }, []);

    const handleShow = () => {
      setHasBeenOpened(true);
      requestAnimationFrame(() => setIsVisible(true));
    };

    const handleHide = () => {
      setIsVisible(false);
      hideTimeout.current = setTimeout(() => setHasBeenOpened(false), 500);
    };

    return (
      <>
        {"children" in props && props?.children?.(handleShow, handleHide)}
        {hasBeenOpened && (
          <WrappedComponent
            {...props}
            isVisible={isVisible}
            handleShow={handleShow}
            handleHide={handleHide}
          />
        )}
      </>
    );
  };
}
