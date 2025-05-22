
import * as React from "react"
import { isMobileDevice } from "@/utils/mobile";

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Check both screen size and device type
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    const onChange = () => {
      // Consider both screen width and device detection
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT || isMobileDevice())
    }
    
    mql.addEventListener("change", onChange)
    onChange() // Set initial value
    
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
