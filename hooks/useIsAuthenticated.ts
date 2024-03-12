import { useEffect, useState } from "react";

export const useIsAuthenticated = () => {
  const [authenticated, setAuthenticated] = useState(false);
  useEffect(() => {
    // Migrate away from the older persistent browser token store.
    for (const key of ["access_token", "refresh_token", "code_verifier"])
      localStorage.removeItem(key);
    const update = () =>
      setAuthenticated(Boolean(sessionStorage.getItem("access_token")));
    update();
    window.addEventListener("storage", update);
    return () => window.removeEventListener("storage", update);
  }, []);
  return authenticated;
};
