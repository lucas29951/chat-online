
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const usersList = document.getElementById('users');


const username = sessionStorage.getItem('username');
const room = sessionStorage.getItem('room');


const socket = io();

socket.emit('joinRoom', { username, room });

socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

socket.on('message', message => {
    outputMessage(message);

    chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const msg = e.target.elements.msg.value;

    socket.emit('chatMessage', msg);

    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
					 <p class="text">${message.text}</p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

function outputRoomName(room) {
    roomName.innerText = room;
}

function outputUsers(users) {
    usersList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}

document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('Esta seguro que desea salir de la sala?');

    if (leaveRoom) {
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('room');

        window.location = '../index.html';
    } else {
        // Continuamos en la sala
    }
});