import { useEffect, useState, useCallback } from "react";

export function useFetch(url = "", options = {}, initialValue = {}) {
  const [data, setData] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(false);
    fetch(url, options)
      .then(res => res.json())
      .then(json_data => {
        setData(json_data);
        setLoading(true);
      })
      .catch(err => setError(err.message));
  }, [url, options]);

  return { data, loading, error };
}
export function useLazyFetch(url = "", options = {}, initialValue = {}) {
  const [data, setData] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetch_call = useCallback(() => {
    setLoading(false);
    fetch(url, options)
      .then(res => res.json())
      .then(json_data => {
        setData(json_data);
        setLoading(true);
      })
      .catch(err => setError(err.message));
  }, [url, options]);

  return [fetch_call, { data, loading, error }];
}
