import './css/index.less'
import chessBoardConfig from './js/config.json'

class GoBang {
    constructor(config) {
        this.config = {
            ...config,
            grid_width: config.CHESSBOARD_WIDTH / config.W_SIZE,
            grid_height: config.CHESSBOARD_HEIGHT / config.H_SIZE,
            w_padding: (config.CHESSBOARD_WIDTH - (config.CHESSBOARD_WIDTH / config.W_SIZE) * (config.W_SIZE - 1)) / 2,
            h_padding: (config.CHESSBOARD_HEIGHT - (config.CHESSBOARD_HEIGHT / config.H_SIZE) * (config.H_SIZE - 1)) / 2
        }
        this.ctx = document.querySelector('#GoBang').getContext('2d')
        this.drawChessBoard()
        this.drawChess(3, 3, this.config.WHITE)
    }
    // 初始化棋局
    init() {

    }
    /**
     * 绘制棋盘
     */
    drawChessBoard() {
        // 初始化棋盘背景
        let bg = new Image()
        bg.src = './imgs/bg.jpg'
        this.ctx.drawImage(bg, this.config.CHESSBOARD_WIDTH, this.config.CHESSBOARD_HEIGHT)
        // 画横向线
        this.ctx.strokeStyle = '#f1e05a';
        for (let i = 0; i < this.config.H_SIZE; i++) {
            this.ctx.moveTo(this.config.w_padding, this.config.h_padding + i * this.config.grid_height)
            this.ctx.lineTo(this.config.CHESSBOARD_WIDTH - this.config.w_padding, this.config.h_padding + i * this.config.grid_height)
            this.ctx.stroke()
        }
        // 画竖向线
        for (let i = 0; i < this.config.W_SIZE; i++) {
            this.ctx.moveTo(this.config.w_padding + i * this.config.grid_width, this.config.h_padding)
            this.ctx.lineTo(this.config.w_padding + i * this.config.grid_width, this.config.CHESSBOARD_HEIGHT - this.config.h_padding)
            this.ctx.stroke()
        }
    }
    /**
     * 绘制棋子
     */
    drawChess(x, y, side) {
        let r = this.config.grid_width * this.config.CHESS_RATIO
        x = x*this.config.grid_width + this.config.w_padding
        y = y*this.config.grid_height + this.config.h_padding
        this.ctx.beginPath()
        this.ctx.arc(x, y, r, 0, 2*Math.PI)
        this.ctx.closePath()
        // 绘制棋子中间阴影效果
        let grd = this.ctx.createRadialGradient(x, y, r, x, y, 0)
        if (side === this.config.WHITE) {
            grd.addColorStop(0, '#D1D1D1')
            grd.addColorStop(0, '#F9F9F9')
        } else {
            grd.addColorStop(0, '#0a0a0a')
            grd.addColorStop(1, '#636766')
        }
        this.ctx.fillStyle = grd
        this.ctx.fill()
    }
}

new GoBang(chessBoardConfig)