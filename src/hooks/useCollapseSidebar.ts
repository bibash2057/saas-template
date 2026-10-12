import { useEffect, useRef } from "react";
import { useSidebar } from "#components/ui/sidebar";

export const useCollapseSidebar = () => {
  const { open, setOpen } = useSidebar();
  const previousOpen = useRef(open);

  useEffect(() => {
    const wasOpen = previousOpen.current;
    setOpen(false);

    return () => setOpen(wasOpen);
  }, []);
};
