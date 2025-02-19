"use client";

import { useEffect, useState } from "react";

export function useIsAuthenticated() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    console.log(token);

    if (token && token != "") {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [localStorage.getItem("token")]);

  return { isAuthenticated };
}
