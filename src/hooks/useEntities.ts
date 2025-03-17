import {useContext} from "react";
import {EntitiesContext, EntitiesContextProps} from "../contexts/contexts.ts";

export default function useEntities() {
  const context = useContext<EntitiesContextProps | undefined>(EntitiesContext)
  if (!context) {
    throw new Error("useEntities must be used within EntitiesProvider!")
  }
  return context
}