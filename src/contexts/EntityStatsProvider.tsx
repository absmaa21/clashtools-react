import {ReactNode, useEffect, useState} from "react";
import {EntityStatsContext} from "./contexts.ts";

interface EntityStatsProviderProps {
  children: ReactNode,
}

function EntityStatsProvider({children}: EntityStatsProviderProps) {

  const [stats, setStats] = useState<EntityStat[]>([])

  useEffect(() => {
    // Todo: fetch all available stats from backend
    setStats([])
  }, []);

  return (
    <EntityStatsContext.Provider value={{stats}}>
      {children}
    </EntityStatsContext.Provider>
  );
}

export default EntityStatsProvider;