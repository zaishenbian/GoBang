export default class Modal {
    constructor(config) {
        let basicConfig = {
            type: 'info',
            title: '提示',
            content: '',
            ok: () => {},
            cancel: () => {}
        }
        this.config = Object.assign(basicConfig, config || {})
        this.createModal()
    }
    createModal() {
        let modal = `<div class="GoBangModal">
                        <div class="header">${this.config.title}</div>
                        <div class="content">${this.config.content}</div>
                        <div class="footer">
                            <button class="cancel" style="display: none">取消</button>
                            <button class="ok">确定</button>
                        </div>
                    </div>`
        let modalDOM = this.parseDom(modal)
        let ok = modalDOM.querySelector('.ok')
        let cancel = modalDOM.querySelector('.cancel')
        let self = this
        ok.addEventListener('click', function(){ self.ok.call(self) })
        cancel.addEventListener('click', function(){ self.cancel.call(self) })
        document.querySelector('body').appendChild(modalDOM)
    }
    ok() {
        this.config.ok.call(this)
    }
    cancel() {
        console.log('cancel')
        this.config.cancel.call(this)
        this.remove()
    }
    remove() {
        let modal = document.querySelector('.GoBangModal')
        document.body.removeChild(modal)
    }
    parseDom(nodelist) {
        var objE = document.createElement("div");  
        objE.innerHTML = nodelist;
        return objE.childNodes[0];
    }
}