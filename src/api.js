import axios from 'axios';
axios.defaults.withCredentials = true;

const BASE_URL = 'http://localhost:8080';

export const MESSAGES_TO_LOAD = 10;

function url(path) { return `${BASE_URL}${path}`; }

// Check for existing session
export const getMe = () => {
  return axios.get(url('/users/me'))
    .then(res => { return res.data; })
    .catch(err => console.log(err));
};

/** 
 * Fetch users by requested ids
 * @param {Array<number | string>} ids
 */
export const getUsers = (ids) => {
  console.log(JSON.stringify(ids));
  return ids.map(element => {
    switch(element) {
      case "1":
        return { id: 1, username: "User1", isOnline: false };
      case "2":
        return { id: 2, username: "User2", isOnline: false };
      case "3":
        return { id: 3, username: "User3", isOnline: false };
      case "4":
        return { id: 4, username: "User4", isOnline: false };
      default:
        throw new Error("Wrong Username");
    } 
  })
  // return axios.get(url(`/users`), { params: { ids: ids.reduce((x, y) => `${x},${y}`) } }).then(x => { console.log("=======> " + JSON.stringify(x.data)); return x.data; });
  // return ids.filter()
};

/** Fetch users which are online */
export const getOnlineUsers = () => {
  return {};
  // return axios.get(url(`/users/online`)).then(x => { console.log("Online users: " + JSON.stringify(x.data)); return x.data; });
};

/** Handle user log in */
export const login = (username, password) => {
  if (password !== "password123") {
    throw new Error("Wrong Password");
  }

  switch(username) {
    case "User1":
      return { id: 1, username: "User1", isOnline: true };
    case "User2":
      return { id: 2, username: "User2", isOnline: true };
    case "User3":
      return { id: 3, username: "User3", isOnline: true };
    case "User4":
      return { id: 4, username: "User4", isOnline: true };
    default:
      throw new Error("Wrong Username");
  }
  // return axios.post(url('/auth/login'), {
  //   username,
  //   password
  // }).then(x =>
  //   { console.log(x.data); return x.data; }
  // )
  //   .catch(e => { throw new Error(e.response && e.response.data && e.response.data.message); });
};

export const logOut = () => {
  // return axios.post(url('/auth/logout'));
};

// export const getButtonLinks = () => {
//   return axios.get(url('/links'))
//     .then(x => x.data)
//     .catch(err => console.log(err));
// };
// 
// [{id:"1:2",names:["User1","User2"]},{id:"1:3",names:["User1","User3"]},{id:"1:4",names:["User1","User4"]},{id:"0",names:["General"]}]
// 
// 

/** 
 * @returns {Promise<Array<{ names: string[]; id: string }>>} 
 */
export const getRooms = (userId) => {
  switch(userId) {
    case 2:
      return [{id:"2:3",names:["User2","User3"]},{id:"1:2",names:["User1","User2"]},{id:"2:4",names:["User2","User4"]},{id:"0",names:["General"]}];
    case 1:
      return [{id:"1:2",names:["User1","User2"]},{id:"1:3",names:["User1","User3"]},{id:"1:4",names:["User1","User4"]},{id:"0",names:["General"]}];
    case 3:
      return [{id:"3:4",names:["User3","User4"]},{id:"2:4",names:["User2","User4"]},{id:"1:4",names:["User1","User4"]},{id:"0",names:["General"]}];
    case 4:
      return { id: 4, username: "User4", isOnline: true };
    default:
      throw new Error("Wrong UserID");
  }
  // return axios.get(url(`/rooms/user/${userId}`)).then(x => { console.log(JSON.stringify(x.data)); return x.data; });
};

// getRooms(4);

export const getMessages = (id,
  offset = 0,
  size = MESSAGES_TO_LOAD
) => {
  // console.log("+++" + typeof id)
  console.log("|||"+id+"|||");
  // [{"from":"1","date":1700127951,"message":"isld a dsjadlkjsada dlisajdl","roomId":"0"},{"from":"1","date":1700127958,"message":"jslks;dsada","roomId":"0"}] api.js:130

  let allMessages = JSON.parse(window.sessionStorage.getItem("allMessages"));
  return allMessages[id];
  // throw new Error("Wrong RoomID");
  // return axios.get(url(`/rooms/messages/${id}`), {
  //   params: {
  //     offset,
  //     size
  //   }
  // })
  //   .then(x => { console.log(JSON.stringify(x.data.reverse())); return x.data; });
};

/** This one is called on a private messages room created. */
// export const addRoom = async (user1, user2) => {
//   return axios.post(url(`/room`), { user1, user2 }).then(x => { console.log("Add room: " + x.data); return x.data; });
// };

export const emitMessage = (type = "", user, message) => {
  console.log("from api.js &&&&& "+JSON.stringify(user));
  let allMessages = JSON.parse(window.sessionStorage.getItem("allMessages"));
  allMessages[message.roomId].push(message);
  window.sessionStorage.setItem("allMessages", JSON.stringify(allMessages));
  console.log(allMessages[message.roomId]);
};

// export function getEventSource(userId) { return new EventSource(url(`/chat/stream?userId=${userId}`)); }
