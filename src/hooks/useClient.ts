import {useContext} from "react";
import {ClientContext, ClientContextProps} from "../contexts/contexts.ts";

export default function useClient() {
  const context = useContext<ClientContextProps | undefined>(ClientContext)
  if (!context) {
    throw new Error("useClient must be used within ClientProvider!")
  }
  return context
}