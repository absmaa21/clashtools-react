import {ReactNode, useState} from "react";
import {SettingsContext} from "./contexts.ts";

interface Props {
  children: ReactNode,
}

function SettingsProvider({children}: Props) {

  const [reducedMotion, setReducedMotion] = useState<boolean>(window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  return (
    <SettingsContext value={{reducedMotion, setReducedMotion}}>
      {children}
    </SettingsContext>
  )
}

export default SettingsProvider