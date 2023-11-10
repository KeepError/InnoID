import React from "react";
import { UserContext } from "../context/user";

export function useUserContext() {
  const userContext = React.useContext(UserContext);
  if (!userContext) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return userContext;
}
