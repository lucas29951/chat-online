
// const socket = io();

document.getElementById('join-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const room = document.getElementById('room').value.trim();

    console.log(username, room);
    
    if (username && room) {

        sessionStorage.setItem('username', username);
        sessionStorage.setItem('room', room);

        window.location.href = 'chat.html';
    }
});