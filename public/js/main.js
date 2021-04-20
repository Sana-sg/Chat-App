
const chatForm= document.getElementById('chat-form');
const chatmsgs= document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });

console.log(username,room);

const socket= io();

socket.emit('joinRoom',{username,room});

socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
  });

socket.on('message',message=>{
    console.log(message);
    outputmsg(message);

    //scroll
    chatmsgs.scrollTop=chatmsgs.scrollHeight;
});
socket.on('info',info=>{
  outputinfo(info);
  chatmsgs.scrollTop=chatmsgs.scrollHeight;
})

chatForm.addEventListener('submit',e=>{
    e.preventDefault();

    const msg=e.target.elements.msg.value;
    socket.emit('chatmsg',msg);

    e.target.elements.msg.value='';
    e.target.elements.msg.focus();
});

function outputmsg(message){
    const div=document.createElement('div');
    div.classList.add('message');
    div.innerHTML=`<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
        </p>`;
        document.querySelector('.chat-messages').appendChild(div);
}
function outputinfo(info){
  const div=document.createElement('div');
  div.classList.add('info');
  div.innerHTML=`<b><span class="ls">${info.text}</span><br>`
  document.querySelector('.chat-messages').appendChild(div);
}
function outputRoomName(room) {
    roomName.innerText = room;
  }

  function outputUsers(users) {
    userList.innerHTML = '';
    users.forEach((user) => {
      const li = document.createElement('li');
      li.innerText = user.username;
      userList.appendChild(li);
    });
  }
  