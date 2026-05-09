import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { isMobile } from "../helpers/isMobile";

const toastStyle = {
  background: "oklch(37% 0.013 285.805)",
  color: "oklch(98.5% 0 0)",
  border: "1px solid oklch(44.2% 0.017 285.786)",
  borderRadius: "9999px",
};

export function useMobileToasts(
  sidebarData: unknown,
  isLoading: boolean,
  hasLoaded: boolean,
  error: string,
) {
  const prevSideBar = useRef(sidebarData);
  const prevIsLoading = useRef(isLoading);
  const prevError = useRef(error);
  const prevHasLoaded = useRef(hasLoaded);

  // TODO: Fix: isLoading and hasLoaded toasts appear on initial render and other unrelated state changes

  useEffect(() => {
    // on sidebar change
    if (sidebarData !== prevSideBar.current) {
      if (prevSideBar.current !== null) {
        if (isMobile())
          toast("Segment updated", {
            icon: "🟢",
            duration: 2500,
            style: toastStyle,
          });
      }
      prevSideBar.current = sidebarData;
    }

    // on isLoading change
    if (isLoading !== prevIsLoading.current) {
      prevIsLoading.current = isLoading;
      if (isLoading && isMobile())
        toast("Loading data", {
          icon: "🟡",
          duration: 1500,
          style: toastStyle,
        });
    }

    // on hasLoaded change
    if (hasLoaded !== prevHasLoaded.current) {
      prevHasLoaded.current = hasLoaded;
      if (hasLoaded && !isLoading && isMobile())
        toast("Data loaded", {
          icon: "✅",
          duration: 2000,
          style: toastStyle,
        });
    }

    // on error change
    if (error !== prevError.current) {
      prevError.current = error;
      if (error && isMobile())
        toast.error(error, { duration: 2500, style: toastStyle });
    }
  }, [sidebarData, isLoading, hasLoaded, error]);
}
