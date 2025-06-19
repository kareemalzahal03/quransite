import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

/**
 * AsyncFetchData - A reusable data-fetching component that asynchronously fetches JSON
 * from a given URL and passes the result to its child function.
 *
 * @param {string} url - The URL to fetch data from.
 * @param {function} children - A render prop that receives the fetched data.
 */
export function AsyncFetchData({ url, children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    setLoading(true);
    setError(null);
    setData(null);

    fetch(url, { signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => setData(json))
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Unknown error');
        }
      })
      .finally(() => {
        if (!signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [url]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (!data) return null;

  return children(data);
}
