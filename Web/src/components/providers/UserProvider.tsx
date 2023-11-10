import { UserContext } from "../../context/user";
import { User } from "../../lib/api/entities";
import { ReactNode, useEffect, useState } from "react";
import {
  getCurrentUser,
} from "../../lib/api/modules/profile";
import { useAPIRequest } from "../../hooks/apiRequest";
import { useLocation } from 'react-router-dom';
import { links } from "../../consts";

interface UserProviderProps {
  children: ReactNode;
}

export default function UserProvider({
  children,
}: UserProviderProps): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const { data, error, loading, call } = useAPIRequest(getCurrentUser);
  const [userLoading, setUserLoading] = useState<boolean>(true);
  const refreshUser = () => {
    setUserLoading(true);
    call();
  };
  const location = useLocation();
  useEffect(() => {
    if (!(location.pathname.startsWith(links.login) || location.pathname.startsWith(links.loginHandleSSO))) {
      refreshUser();
    }
  }, []);
  useEffect(() => {
    if (data) {
      setUser(data.user);
      setUserLoading(false);
    }
    if (error) {
      setUser(null);
      setUserLoading(false);
    }
  }, [data, error, loading]);
  return (
    <UserContext.Provider value={{ user, userLoading, setUser, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
}
