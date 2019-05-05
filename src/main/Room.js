import io from 'socket.io-client'
import ChessBoardConfig from '../config/config.json'
import GoBang from './GoBang'
import Modal from './Modal'

export const socket = io.connect('ws://10.168.1.33:8080/GoBang')

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
    if (data.status === 1) {
        Room.white.innerHTML = data.name
    } else if (data.status === 2) {
        Room.black.innerHTML = data.name
    }
})

socket.on('leave', function(data) {
    if (data.status === 1) {
        Room.white.innerHTML = ''
    } else if (data.status === 2) {
        Room.black.innerHTML = ''
    }
})

socket.on('moveChess', function(data) {
    let x = data.coord[0]
    let y = data.coord[1]
    let side = data.status
    Room.GoBang.moveChess(x, y ,side)
})

socket.on('disconnect', function() {
    console.log('断开连接')
})

socket.on('error', function(error) {
    console.log(error)
    console.log('连接失败')
})

export const Room = {
    username: localStorage.getItem('username'),
    status: 3,  // 身份 1 白 2 黑 3 旁观
    white: document.querySelector('.side .white'),
    black: document.querySelector('.side .black'),
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
            Room.join()
            Room.start()
        }
    },
    start: function() {
        let restart = document.querySelector('#restart')
        let side = document.querySelector('.side')
        let sitWhite = document.querySelector('.side .sitWhite')
        let sitBlack = document.querySelector('.side .sitBlack')
        Room.GoBang = new GoBang(ChessBoardConfig)
        side.style.visibility = 'visible'
        restart.addEventListener('click', function() {
            Room.GoBang.restart()
        })
        sitWhite.addEventListener('click', function() {
            if (Room.white.innerHTML === '') {
                Room.leave()
                Room.status = 1
                Room.join()
            }
        })
        sitBlack.addEventListener('click', function() {
            if (Room.black.innerHTML === '') {
                Room.leave()
                Room.status = 2
                Room.join()
            }
        })
    },
    join: function() {
        socket.emit('join', {
            status: Room.status,
            name: Room.username
        })
    },
    leave: function() {
        socket.emit('leave', {
            status: Room.status,
            name: Room.username
        })
    }
}

// 监听浏览器刷新或关闭
window.onbeforeunload = Room.leave
