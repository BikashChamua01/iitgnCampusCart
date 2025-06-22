import { useState, useEffect } from "react";

export default function useScreenSize() {
  const getLabel = () => {
    const w = window.innerWidth;
    if (w < 640) return "xs";
    if (w < 768) return "sm";
    if (w < 1024) return "md";
    if (w < 1280) return "lg";
    if (w < 1536) return "xl";
    return "2xl";
  };

  const [screenSize, setScreenSize] = useState(getLabel());

  useEffect(() => {
    const onResize = () => setScreenSize(getLabel());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return screenSize;
}
