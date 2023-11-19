import React, { useEffect, useCallback } from "react";
import Login from "./components/Login";
import Chat from "./components/Chat";
import { getOnlineUsers, getRooms } from "./api";
import useAppStateContext, { AppContext } from "./state";
import moment from "moment";
import { parseRoomName } from "./utils";
import { LoadingScreen } from "./components/LoadingScreen";
import Navbar from "./components/Navbar";
import { useUser } from "./hooks";
import { useSocket } from "./use-socket";

const App = () => {
  const {
    loading,
    user,
    state,
    dispatch,
    onLogIn,
    onMessageSend,
    onLogOut,
  } = useAppHandlers();

  if (loading) {
    return <LoadingScreen />;
  }

  const showLogin = !user;

  // https://www.reddit.com/r/ProgrammerHumor/comments/108auwz/guys_i_want_to_put_a_funny_programming_quote_on/
  window.sessionStorage.setItem("allMessages", JSON.stringify({
    "0": [{"from":"4","date":1697093948,"message":"boss make a dollar; I make a dime; that's why my algorithms run in exponential time","roomId":"0"},{"from":"1","date":1697094148,"message":"There are 10 types of people: those who understand binary and those who don’t","roomId":"0"},{"from":"1","date":1697094348,"message":"","roomId":"0"},{"from":"3","date":1697094548,"message":"","roomId":"0"},{"from":"4","date":1700123793,"message":"There are two ways to write error-free programs; only the third one works.🍾","roomId":"1:4"},{"from":"1","date":1697094746,"message":"A user interface is like a joke. If you have to explain it, it’s not that good 🍸","roomId":"0"},{"from":"1","date":1700127946,"message":"jieuoiufo;sjdo","roomId":"0"},{"from":"1","date":1700127951,"message":"Before software can be reusable it first has to be usable🥑","roomId":"0"},{"from":"1","date":1700127958,"message":"If one programmer can do it in one week, then 2 programmers can do it in 2 weeks!","roomId":"0"}],
    "1:4": [{"from":"4","date":1697094704,"message":"There are two ways to write error-free programs; only the third one works.🍾","roomId":"1:4"},{"from":"1","date":1697094746,"message":"A user interface is like a joke. If you have to explain it, it’s not that good 🍸","roomId":"1:4"}],
    "1:2": [{"from":"2","date":1700126273,"message":"Programming is the art of adding bugs to an empty text file.","roomId":"1:2"},{"from":"2","date":1700126276,"message":"akdlskf;sa\\nkd;lsa","roomId":"1:2"}],
    "2:3": [{"from":"3","date":1697094544,"message":"I told him I can't open the JAR, and he said go download Java ☕️","roomId":"2:3"},{"from":"2","date":1697094585,"message":"In order to understand recursion, one must first understand recursion 😎","roomId":"2:3"}],
    "2:4": [{"from":"4","date":1697094685,"message":"A good programmer is someone who always looks both ways before crossing a one-way street.🥝","roomId":"2:4"},{"from":"2","date":1697094738,"message":"The trouble is that you can never tell what a programmer is doing until it’s too late.🥗","roomId":"2:4"}]
  }));

  return (
    <AppContext.Provider value={[state, dispatch]}>
      <div
        className={`full-height ${showLogin ? "bg-light" : ""}`}
        style={{
          backgroundColor: !showLogin ? "#495057" : undefined,
        }}
      >
        <Navbar showLogin={showLogin}/>
        {showLogin ? (
          <Login onLogIn={onLogIn} />
        ) : (
          <Chat user={user} onMessageSend={onMessageSend} onLogOut={onLogOut} />
        )}
      </div>
    </AppContext.Provider>
  );
};

const useAppHandlers = () => {
  const [state, dispatch] = useAppStateContext();
  const onUserLoaded = useCallback(
    (user) => {
      if (user !== null) {
        if (!state.users[user.id]) {
          dispatch({ type: "set user", payload: { ...user, online: true } });
        }
      }
    },
    [dispatch, state.users]
  );

  const { user, onLogIn, onLogOut: onLogOutA, loading } = useUser(
    onUserLoaded,
    dispatch
  );
  const [socket, connected, onLogOut] = useSocket(user, dispatch, onLogOutA);

  useEffect(() => {
    if (user === null) {
      return;
    }
    if (connected) {
      const newRooms = [];
      Object.keys(state.rooms).forEach((roomId) => {
        const room = state.rooms[roomId];
        if (room.connected) {
          return;
        }
        newRooms.push({ ...room, connected: true });
      });
      if (newRooms.length !== 0) {
        dispatch({ type: "set rooms", payload: newRooms });
      }
    } else {
      /**
       * It's necessary to set disconnected flags on rooms
       * once the client is not connected
       */
      const newRooms = [];
      Object.keys(state.rooms).forEach((roomId) => {
        const room = state.rooms[roomId];
        if (!room.connected) {
          return;
        }
        newRooms.push({ ...room, connected: false });
      });
      /** Only update the state if it's only necessary */
      if (newRooms.length !== 0) {
        dispatch({ type: "set rooms", payload: newRooms });
      }
    }
  }, [user, connected, dispatch, socket, state.rooms, state.users]);

  /** Populate default rooms when user is not null */
  useEffect(() => {
    if (Object.values(state.rooms).length === 0 && user !== null) {
      let users = getOnlineUsers();
      // .then((users) => {
        // dispatch({
        //   type: "append users",
        //   payload: users,
        // });
      // });
  
      let rooms = getRooms(user.id);
        const payload = [];
        rooms.forEach(({ id, names }) => {
          payload.push({ id, name: parseRoomName(names, user.username) });
        });
        /** Here we also can populate the state with default chat rooms */
        dispatch({
          type: "set rooms",
          payload,
        });
        dispatch({ type: "set current room", payload: "0" });
    }
  }, [dispatch, state.rooms, user]);

  const onMessageSend = useCallback(
    (message, roomId) => {
      console.log("?????????????__> " + JSON.stringify(message));
  
      if (typeof message !== "string" || message.trim().length === 0) {
        return;
      }
      if (!socket) {
        console.error("Couldn't send message");
      }
      socket.emit("message", {
        roomId: roomId,
        message,
        from: user.id,
        date: moment(new Date()).unix(),
      });
    },
    [user, socket]
  );

  return {
    loading,
    user,
    state,
    dispatch,
    onLogIn,
    onMessageSend,
    onLogOut,
  };
};

export default App;
