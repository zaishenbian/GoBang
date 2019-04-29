import ChessBoardConfig from './config/config.json'
import GoBang from './main/GoBang'
import './styles/global.less'

let restart = document.querySelector('#restart')
let myGoBang = new GoBang(ChessBoardConfig)
restart.addEventListener('click', function() {
    myGoBang.restart()
})