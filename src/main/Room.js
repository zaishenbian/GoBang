import io from 'socket.io-client'
import ChessBoardConfig from '../config/config.json'
import GoBang from '../main/GoBang'
import Modal from '../main/Modal'

let socket = io.connect('ws://localhost:8080/GoBang')

socket.on('connect', function() {
    console.log('连接成功')
})

socket.on('createUser', function(data) {
    if (data.isSuccess) {
        Room.start()
        localStorage.setItem('username', data.message)
    } else {
        alert('该昵称已存在')
    }
})

socket.on('join', function(data) {
    console.log('加入'+data)
})

socket.on('leave', function(data) {
    console.log('离开'+data)
})

socket.on('moveChess', function(data) {
    console.log('落子'+data)
})

socket.on('disconnect', function() {
    console.log('断开连接')
})

socket.on('error', function(error) {
    console.log(error)
    console.log('连接失败')
})

let Room = {
    username: localStorage.getItem('username'),
    status: 3,  // 身份 1 白 2 黑 3 旁观
    enterRoom: function() {
        if (!Room.username) {
            new Modal({
                title: '请输入昵称',
                content: `<input type="text" data="username" />`,
                ok: function() {
                    let username = document.querySelector("[data=username]")
                    socket.emit('createUser', username.value)
                }
            })
        } else {
            Room.start()
        }
    },
    start: function() {
        let restart = document.querySelector('#restart')
        let myGoBang = new GoBang(ChessBoardConfig)
        restart.addEventListener('click', function() {
            myGoBang.restart()
        })
    },
    join: function() {
        socket.emit('join', {
            status: Room.status,
            name: Room.username
        })
    }
}

export default Room

// window.onbeforeunload = function() {
//     socket.emit('leave', '123')
// }