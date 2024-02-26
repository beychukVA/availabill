import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Props = React.PropsWithChildren<{
  handlePortalNode: (portalNode: HTMLDivElement | null) => void;
}>;

export const Portal = ({ children, handlePortalNode }: Props) => {
  const [portalNode, setPortalNode] = useState<HTMLDivElement | null>(null);

  const handlePortalNodeRef = useRef(handlePortalNode);

  handlePortalNodeRef.current = handlePortalNode;

  useEffect(() => {
    const node = document.createElement("div");

    document.body.appendChild(node);

    handlePortalNodeRef.current(node);

    setPortalNode(node);

    return () => {
      setPortalNode(null);

      handlePortalNodeRef.current(null);

      document.body.removeChild(node);
    };
  }, []);

  if (!portalNode) {
    return null;
  }

  return createPortal(children, portalNode);
};
