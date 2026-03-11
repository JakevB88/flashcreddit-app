
import { useEffect, useState } from "react";

export default function FadeWrapper({ children }) {
  const [fadeClass, setFadeClass] = useState("fade-enter");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFadeClass("fade-enter-active");
    }, 10);

    return () => clearTimeout(timeout);
  }, []);

  return <div className={fadeClass}>{children}</div>;
}
