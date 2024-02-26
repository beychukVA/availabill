import noop from "lodash/noop";
import throttle from "lodash/throttle";
import { useEffect, useState } from "react";

const throttleOptions = {
  leading: true,
  trailing: true,
} as const;

export const useElementHeightObserver = () => {
  const [height, setHeight] = useState(0);
  const [element, setElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (element) {
      const onHeightChange = throttle(setHeight, 300, throttleOptions);

      const observer = new ResizeObserver((entries) => {
        // only care about the first element, we expect one element to be watched
        const { height: newHeight } = entries[0].contentRect;

        onHeightChange(newHeight);
      });

      observer.observe(element);

      return () => observer.disconnect();
    }

    return noop;
  }, [element]);

  return { height, setElement };
};
