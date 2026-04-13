import { useState, useEffect, useCallback } from "react";
import { getToken } from "../utils/auth";

const useFetch = (endpoint, { isAuth = false, immediate = true } = {}) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const fetchData = useCallback(
    async (overrideEndpoint) => {
      const url = overrideEndpoint || endpoint;
      if (!url) return;

      setLoading(true);

      try {
        const headers = {
          Accept: "application/json",
          "Content-Type": "application/json",
        };

        if (isAuth) {
          const token = getToken();
          if (token) {
            headers["Authorization"] = `Bearer ${token}`;
          }
        }

        const res = await fetch(`http://localhost:4000/api/auth${url}`, {
          method: "GET",
          headers,
          credentials: "include",
        });

        const json = await res.json();

        if (!res.ok) {
          console.error("Fetch error response:", json);
          // Uncomment to show error toast to users:
          // toast.error(json.errors || json.message || "Something went wrong");
          return;
        }

        setData(json);
      } catch (err) {
        const message = err.message || "Network error";
        console.error("Fetch request failed:", message);
        // Uncomment to show error toast to users:
        // toast.error(message);
      } finally {
        setLoading(false);
      }
    },
    [endpoint, isAuth],
  );

  useEffect(() => {
    if (immediate && endpoint) {
      fetchData();
    }
  }, [immediate, endpoint, fetchData]);

  return { data, loading, refetch: fetchData };
};

export default useFetch;
