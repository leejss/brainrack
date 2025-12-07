"use client";

import { useEffect, useState } from "react";

const useHydratedClient = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Use requestAnimationFrame to avoid sync setState inside an effect
    let raf = 0;
    raf = requestAnimationFrame(() => setIsHydrated(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return isHydrated;
};

export default useHydratedClient;
