'use client'

import { useEffect } from 'react'

/** Dev-only: `?qa-flat=1` flattens the page so a single headless screenshot
 *  can capture the whole document. Compiled out of production builds. */
export function QaFlat() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return
    if (new URLSearchParams(window.location.search).has('qa-flat')) {
      document.documentElement.classList.add('qa-flat')
    }
  }, [])
  return null
}
