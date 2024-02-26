import { RoundCloseIcon } from "@/components/Icons/RoundCloseIcon/RoundCloseIcon";
import clsx from "clsx";
import React, {
  Dispatch,
  MutableRefObject,
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./Modal.module.scss";

interface IProps {
  children: ReactNode;
  isModalOpen: boolean;
  onClose: (open: boolean) => void;
  preserveClose?: boolean;
  noCloseIcon?: boolean;
  className?: string;
  setPortalActive?: () => void;
}

export const Modal: React.FC<IProps> = ({
  children,
  onClose,
  isModalOpen = false,
  setPortalActive,
  preserveClose,
  noCloseIcon,
  className,
}) => {
  const modalRef = useRef<HTMLDivElement | undefined>(null);
  const [closeActive, setCloseActive] = useState(false);

  const transitionEnd = useCallback(() => {
    if (!isModalOpen && setPortalActive) {
      setPortalActive();
    }
  }, [isModalOpen, setPortalActive]);

  const animationEnd = useCallback(() => setCloseActive(true), []);

  useEffect(() => {
    if (modalRef.current && setPortalActive) {
      const el = modalRef.current;

      el.addEventListener("transitionend", transitionEnd, { passive: false });
      el.addEventListener("animationend", animationEnd, { passive: false });

      return () => {
        el.removeEventListener("touchmove", transitionEnd);
        el.removeEventListener("touchmove", animationEnd);
      };
    }

    return () => {};
  }, [animationEnd, setPortalActive, transitionEnd]);

  const closeAction = useCallback(() => {
    if ((!setPortalActive || closeActive) && !preserveClose) {
      onClose(false);
    }
  }, [closeActive, onClose, preserveClose, setPortalActive]);

  return (
    <div
      className={clsx(
        styles.modal,
        isModalOpen && styles.open,
        setPortalActive && styles.portalModal
      )}
      onMouseDown={closeAction}
      ref={
        setPortalActive && (modalRef as MutableRefObject<HTMLDivElement | null>)
      }
    >
      <div
        className={clsx(
          styles.content,
          className,
          isModalOpen && styles.open,
          setPortalActive && styles.contentPortalModal
        )}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {!noCloseIcon && (
          <div className={styles.close} onClick={closeAction}>
            <RoundCloseIcon color="#222222" />
          </div>
        )}
        {children}
      </div>
    </div>
  );
};
