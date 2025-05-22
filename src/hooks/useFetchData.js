import { useCallback, useEffect, useState } from 'react';

const useFetchData = (fetchFunction, params = {}, autoFetch = true) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (currentParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchFunction(currentParams);
      setData(result);
    } catch (err) {
      console.error("Error in useFetchData:", err);
      setError(err);
      setData(null); // Clear data on error
    } finally {
      setIsLoading(false);
    }
  }, [fetchFunction]); // Removed params from useCallback dependency array as it's passed directly

  useEffect(() => {
    if (autoFetch) {
      // Convert params to a stable string for dependency array to avoid re-fetching on object reference change
      // Only simple objects are handled here. For complex objects, a deep comparison or more robust serialization might be needed.
      fetchData(params); // Pass the original params object
    }
  }, [fetchData, autoFetch, params]); // Use stringified params for effect dependency

  // Function to manually trigger a refetch, potentially with new params
  const refetch = useCallback((newParams) => {
    fetchData(newParams || params);
  }, [fetchData, params]); // Add fetchData and params as dependencies

  return { data, isLoading, error, refetch, setData }; // Expose setData for optimistic updates or cache manipulation
};

export default useFetchData; 