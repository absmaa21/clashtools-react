import {useContext} from "react";
import {EntityStatsContext, EntityStatsContextProps} from "../contexts/contexts.ts";

export default function useEntityStats() {
  const context = useContext<EntityStatsContextProps | undefined>(EntityStatsContext)
  if (!context) {
    throw new Error("useEntityStats must be used within EntityStatsProvider!")
  }
  return context
}