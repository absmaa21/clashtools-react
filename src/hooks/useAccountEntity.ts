import {useContext} from "react";
import {AccountEntityContext, AccountEntityProps} from "../contexts/contexts.ts";

export default function useAccountEntity() {
  const context = useContext<AccountEntityProps | undefined>(AccountEntityContext)
  if (!context) {
    throw new Error('useAccountEntities must be used within AccountEntityProvider!')
  }
  return context
}