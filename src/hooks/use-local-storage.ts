"use client";

import { useState, useEffect, useCallback } from 'react';

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        window.dispatchEvent(new StorageEvent('storage', { key }));
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleStorageChange = useCallback((event: StorageEvent) => {
      if (event.key === key) {
          try {
              const item = window.localStorage.getItem(key);
              setStoredValue(item ? JSON.parse(item) : initialValue);
          } catch(error) {
              console.error(error);
              setStoredValue(initialValue);
          }
      }
  }, [key, initialValue]);

  useEffect(() => {
      window.addEventListener('storage', handleStorageChange);
      return () => {
          window.removeEventListener('storage', handleStorageChange);
      }
  }, [handleStorageChange]);


  return [storedValue, setValue];
}

export default useLocalStorage;
