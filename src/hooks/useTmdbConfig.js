import { useContext } from 'react';
import { TmdbConfigContext } from '../context/TmdbConfigContext'; // Adjust path as needed

export const useTmdbConfig = () => useContext(TmdbConfigContext); 