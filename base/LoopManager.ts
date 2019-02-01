class LoopManager {

    private static _init: boolean = false;
    private static frame: Handler[]; // 帧循环
    private static interval: any[]; // 自定义循环

    public static init() {
        if (!this._init) {
            this.frame = [];
            this.interval = [];
            this._init = true;
        }
    }

    /** 依赖框架的帧循环 */
    public static loop() {
        LoopManager.frameLoop();
        LoopManager.intervalLoop();
    }

    /** 调用frame里的方法 */
    private static frameLoop() {
        for (let i = this.frame.length - 1; i >= 0; i--) {
            let hdl = this.frame[i];
            if (hdl) hdl.run();
        }
    }

    /** 添加到帧循环 */
    public static addToFrame(caller: any, method: Function) {
        // 先判断是否已经存在
        for (let i = 0; i < this.frame.length; i++) {
            let hdl = this.frame[i];
            if (hdl.caller == caller && hdl.method == method) {
                return;
            }
        }
        // push
        this.frame.push(new Handler(caller, method));
    }

    /** 移除帧循环 */
    public static removeFromFrame(caller: any, method: Function) {
        for (let i = 0; i < this.frame.length; i++) {
            let hdl = this.frame[i];
            if (hdl.caller == caller && hdl.method == method) {
                this.frame.splice(i, 1);
                return;
            }
        }
    }

    /** 调用interval的方法
     * @param caller 调用者
     * @param method 
     * @param args 参数
     * @param 循环间隔 毫秒为单位
    */
    public static setInterval(caller: any, method: Function, args: any[], gap: number) {
        // isExist
        let hdl: IIntervelHdl = new Object() as IIntervelHdl;
        hdl.caller = caller;
        hdl.method = method;
        hdl.args = args;
        hdl.gap = gap;
        hdl.startTime = new Date().getTime();
        hdl.handler = new Handler(caller, method);
        this.interval.push(hdl);
    }

    /**  */
    private static intervalLoop() {
        let now = new Date().getTime();
        for (let i = this.interval.length - 1; i >= 0; i--) {
            let hdl = this.interval[i] as IIntervelHdl;
            if (hdl && (now - hdl.startTime >= hdl.gap)) {
                hdl.handler.run();
                hdl.startTime = now;
            } 
        }
    }

    private static removeInterval(caller: any, method: Function) {
        for (let i = 0; i < this.interval.length; i++) {
            let hdl = this.interval[i] as IIntervelHdl;
            if (hdl && hdl.caller == caller && hdl.method == method) {
                this.interval.splice(i, 1);
                return;
            }
        }
    }
}


function callLaterSec(sec: number = 3000) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        let method = descriptor.value;
        descriptor.value = function() {
            LoopManager.setInterval(propertyKey, method, null, sec);
        }
    }
}


interface IIntervelHdl {
    caller: any;
    method: Function;
    args: any;
    gap: number;
    startTime: number;
    handler: Handler;
}