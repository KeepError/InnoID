import { createContext } from "react";
import { User } from "../lib/api/entities";

interface UserContext {
  user: User | null;
  userLoading: boolean;
  setUser: (user: User | null) => void;
  refreshUser: () => void;
}

export const UserContext = createContext<UserContext | undefined>(undefined);
