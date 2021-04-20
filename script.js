const users=[];
const moment = require('moment');

function formatmsg(username, text) {
  return {
    username,
    text,
    time: moment().format('h:mm a')
  };
}
function infomsg(text){
  return {
    text,
    time:moment().format('h:mm a')
  };
}

function adduser(id,username,room) {
    const user= {id, username,room};

    users.push(user);

    return user;
}

function getUser(id){
    return users.find(user => user.id==id);
}


function userLeave(id) {
    const index = users.findIndex(user => user.id === id);
      
        if (index !== -1) {
          return users.splice(index, 1)[0];
        }
      }


function getRoomUsers(room) {
    return users.filter(user => user.room === room);
  }

module.exports={
    formatmsg,
    infomsg,
    adduser,
    getUser,
    userLeave,
    getRoomUsers
};