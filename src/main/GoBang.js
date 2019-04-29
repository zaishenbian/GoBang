import bg from '../assets/bg.jpg'
export default class GoBang {
    constructor(config) {
        // 初始化配置，人为白，机为黑
        this.config = {
            ...config,
            grid_width: config.CHESSBOARD_WIDTH / config.W_SIZE,
            grid_height: config.CHESSBOARD_HEIGHT / config.H_SIZE,
            w_padding: (config.CHESSBOARD_WIDTH - (config.CHESSBOARD_WIDTH / config.W_SIZE) * (config.W_SIZE - 1)) / 2,
            h_padding: (config.CHESSBOARD_HEIGHT - (config.CHESSBOARD_HEIGHT / config.H_SIZE) * (config.H_SIZE - 1)) / 2
        }
        // 获取画布对象
        this.canvas = document.querySelector('#GoBang')
        this.ctx = document.querySelector('#GoBang').getContext('2d')
        // 监听画布点击事件
        this.listenClick()
        // 加载图片(预先加载并缓存图片，防止重新开始游戏时画面闪烁)
        this.bgImg = new Image()
        this.bgImg.src = bg
        this.bgImg.onload = () => {
            // 开始游戏
            this.restart()
        }
    }
    /**
     * 重新开始
     */
    restart() {
        this.config.DONE = false
        this.config.SIDE = this.config.BLACK
        this.board = []
        // 通过重新设置画布大小来清空画布
        this.canvas.width = this.config.CHESSBOARD_WIDTH
        this.drawBoardBackground()
    }
    /**
     * 绘制棋盘背景
     */
    drawBoardBackground() {
        this.ctx.drawImage(this.bgImg, 0, 0, this.config.CHESSBOARD_WIDTH, this.config.CHESSBOARD_HEIGHT)
        // 绘制棋盘
        this.drawChessBoard()
    }
    /**
     * 绘制棋盘
     */
    drawChessBoard() {
        // 画横向线
        this.ctx.strokeStyle = '#0a0a0a';
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
        // 初始化填充棋子数据
        for (let i = 0; i < this.config.H_SIZE; i++) {
            this.board.push([])
            for (let j = 0; j < this.config.W_SIZE; j++) {
                this.board[i][j] = null
            }
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
            grd.addColorStop(1, '#F9F9F9')
        } else {
            grd.addColorStop(0, '#0a0a0a')
            grd.addColorStop(1, '#636766')
        }
        this.ctx.fillStyle = grd
        this.ctx.fill()
    }
    /**
     * 监听棋盘点击
     */
    listenClick() {
        let self = this
        this.canvas.addEventListener('click', function(e) {
            let x = Math.floor(e.offsetX / self.config.grid_width)
            let y = Math.floor(e.offsetY / self.config.grid_height)
            self.moveChess(x, y, self.config.SIDE)
        })
    }
    /**
     * 落子
     */
    moveChess(x, y, side) {
        if (this.checkChess(x, y) || !this.checkBoundary(x, y) || this.config.DONE) return
        this.drawChess(x, y, side)
        setTimeout(() => {
            this.board[x][y] = side
            let result = this.checkWin(x, y)
            this.finish(result)
            // 交换下棋
            this.config.SIDE = this.config.SIDE === this.config.WHITE ? this.config.BLACK : this.config.WHITE
        })
    }
    /**
     * 判断是否结束游戏
     */
    finish(result) {
        switch (result) {
            case 0:
                break;
            case 1:
                alert('白棋获胜')
                this.config.DONE = true
                break
            case 2:
                alert('黑旗获胜')
                this.config.DONE = true
                break
            case 3:
                alert('平局')
                break
            default:
                break;
        }
    }
    /**
     * 判断某个位置上是否已存在棋子
     */
    checkChess(x, y) {
        let chess = this.board[x][y]
        return chess === this.config.WHITE || chess === this.config.BLACK
    }
    /**
     * 判断最后一次落子后是否获胜
     */
    checkWin(x, y) {
        let winCount = this.config.WIN_COUNT
        let win = false
        // 判断四个方向
        for (let direction = 0; direction < 4; direction++) {
            let step = this.getStep(direction)
            for (let i = 0; i < winCount; i++) {
                let count;
                let startX = x - (4 - i)*step.x
                let startY = y - (4 - i)*step.y
                if (!this.checkBoundary(startX, startY)) {
                    continue
                }
                let preChess = this.board[startX][startY]
                for (count = 0; count < winCount; count++) {
                    let targetX = startX + count*step.x
                    let targetY = startY + count*step.y
                    if (!this.checkBoundary(targetX, targetY)) {
                        break
                    }
                    let currentChess = this.board[targetX][targetY]
                    if (currentChess !== preChess) {
                        break
                    }
                    preChess = currentChess
                }
                if (count === winCount) {
                    return preChess === this.config.WHITE ? this.config.WINNER.WHITE : this.config.WINNER.BLACK
                }
            }
        }
        // 如果没有获胜，判断是否还有空间
        for (let i = 0; i < this.config.W_SIZE; i++) {
            for(let j = 0; j < this.config.H_SIZE; j++) {
                if (this.board[i][j] === null) {
                    return 0
                }
            }
        }
        return this.config.WINNER.DRAW
    }
    /**
     * 延某个方向的步伐
     */
    getStep(direction) {
        let stepX = 0
        let stepY = 0
        switch (direction) {
            case 0:
                stepX = 1
                stepY = 0
                break
            case 1:
                stepX = 0
                stepY = 1
                break
            case 2:
                stepX = 1
                stepY = 1
                break
            case 3:
                stepX = 1
                stepY = -1
                break
            default:
                stepX = 0
                stepY = 0
                break
        }
        return {x: stepX, y: stepY}
    }
    // 判断是否超出边界
    checkBoundary(x, y) {
        return x >= 0 && x < this.config.W_SIZE && y >=0 && y <= this.config.H_SIZE
    }
}
