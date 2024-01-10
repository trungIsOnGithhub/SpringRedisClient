
import { useEffect, useState } from "react";
import { getMe, login, logOut } from "./api";

const useUser = (onUserLoaded = (user) => { }, dispatch) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      return;
    }

    getMe().then((user) => {
      setUser(user);
      setLoading(false);
      onUserLoaded(user);
    }).catch((err) => {
      setUser(null);
      setLoading(false);
    });
  }, [onUserLoaded, loading]);

  const onLogIn = (
    username = "",
    password = "",
    onError = (param) => { },
    onLoading = (param) => { }
  ) => {
    onLoading(true);
    onError(null);

    setUser(login(username, password));
  };

  /** Log out form */
  const onLogOut = async () => {
    // logOut().then(() => {
      setUser(null);
      dispatch({ type: "clear" });
      setLoading(true);
    // });
  };

  return { user: typeof user === "string" ? null : user, onLogIn, onLogOut, loading };
};

export {
  useUser
};