/**
 * A tiny `useState` wrapper that mirrors the value into localStorage.
 *
 * State is initialised lazily from storage (so a refresh restores the previous
 * session) and a `useEffect` writes every change back. All JSON/Storage errors
 * are swallowed: if the browser blocks storage the app should still work, it
 * just will not remember anything.
 */
import { useEffect, useState } from 'react'

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored === null ? initialValue : JSON.parse(stored)
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* storage unavailable or full - keep running in memory */
    }
  }, [key, value])

  return [value, setValue]
}
