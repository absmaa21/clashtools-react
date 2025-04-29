import {useContext} from "react";
import {SettingsContext, SettingsContextProps} from "../contexts/contexts.ts";

export default function useSettings() {
  const context = useContext<SettingsContextProps | undefined>(SettingsContext)
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider!")
  }
  return context
}