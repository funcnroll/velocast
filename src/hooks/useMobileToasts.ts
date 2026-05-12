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

  useEffect(() => {
    // changes should be tracked first
    const errorChanged = error !== prevError.current;
    const sidebarChanged = sidebarData !== prevSideBar.current;
    const isLoadingChanged = isLoading !== prevIsLoading.current;
    const hasLoadedChanged = hasLoaded !== prevHasLoaded.current;

    // immediately update refs to prevent duplicates
    if (errorChanged) prevError.current = error;
    if (sidebarChanged) prevSideBar.current = sidebarData;
    if (isLoadingChanged) prevIsLoading.current = isLoading;
    if (hasLoadedChanged) prevHasLoaded.current = hasLoaded;

    if (!isMobile()) return;

    // priority: error -> loading -> loaded -> segment update
    if (errorChanged && error) {
      toast.error(error, { duration: 2500, style: toastStyle });
    } else if (isLoadingChanged && isLoading) {
      toast("Loading data", {
        icon: "🟡",
        duration: 1500,
        style: toastStyle,
      });
    } else if (hasLoadedChanged && hasLoaded && !isLoading && !error) {
      toast("Data loaded", {
        icon: "✅",
        duration: 2000,
        style: toastStyle,
      });
    } else if (sidebarChanged && prevSideBar.current !== null) {
      toast("Segment updated", {
        icon: "🟢",
        duration: 2500,
        style: toastStyle,
      });
    }
  }, [sidebarData, isLoading, hasLoaded, error]);
}
