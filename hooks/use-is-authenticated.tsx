"use client";

import { useEffect, useState } from "react";

export function useIsAuthenticated() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (window.localStorage !== undefined) {
      const token = localStorage.getItem("token");

      if (token && token != "") {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    }
  }, []);

  return { isAuthenticated };
}
