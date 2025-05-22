import React, { createContext, useEffect, useState } from 'react';
import { fetchConfiguration } from '../services/tmdbApi';

export const TmdbConfigContext = createContext(null);

export const TmdbConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true);
        const apiConfig = await fetchConfiguration();
        setConfig(apiConfig);
        setError(null);
      } catch (err) {
        console.error("Failed to load TMDB configuration:", err);
        setError(err);
        // You might want to set some default config or show a global error
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  const getImageUrl = (filePath, size = "original") => {
    if (!config || !config.images || !config.images.secure_base_url || !filePath) {
      // Return a placeholder or null if config/path is not available
      // For now, returning null, but you might want a default placeholder image URL
      return null; 
    }
    // Example sizes: "w92", "w154", "w185", "w342", "w500", "w780", "original"
    // You might want to add logic to pick the best size from config.images.poster_sizes, etc.
    const baseUrl = config.images.secure_base_url;
    return `${baseUrl}${size}${filePath}`;
  };

  if (loading) {
    // You can return a global loading spinner here if needed
    // For now, children will render and components can handle their own loading based on context value
  }

  if (error) {
    // You can return a global error message here
    // Or let children render and they can check the error state from context
  }

  return (
    <TmdbConfigContext.Provider value={{ config, loading, error, getImageUrl }}>
      {children}
    </TmdbConfigContext.Provider>
  );
}; 