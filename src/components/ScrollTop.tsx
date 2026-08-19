import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** 換頁時回到頂端。SPA 預設會保留捲動位置。 */
export function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}
