import { useState, useEffect } from 'react'
import secureStorage from '../Utils/secureStorage'

function getSessionStorageOrDefault(key, defaultValue) {
  const stored = secureStorage.getItem(key)
  if (!stored) {
    return defaultValue
  }
  return stored
}

export function useSessionStorage(key, defaultValue){
  const [value, setValue] = useState(
    getSessionStorageOrDefault(key, defaultValue)
  )

  useEffect(() => {
    secureStorage.setItem(key, value);
  }, [key, value])

  return [value, setValue]
}