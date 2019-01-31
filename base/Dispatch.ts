class Dispatch {

    private static observers: any = {};

    constructor() {

    }

    public static register(msg: string, caller: any, method: Function) {
        let funcs: Handler[] = this.observers[msg];
        if (!funcs) {
            funcs = [];
            this.observers[msg] = funcs;
        }
        // 先判断是否存在
        for (let i:number = 0; i < funcs.length; i++) {
            let fun = funcs[i];
            if (fun.caller == caller && fun.method == method) {
                return;
            }
        }
        var hdl = new Handler(caller, method);
        funcs.push(hdl);
    } 

    public static dispatch(msg: string, ...arg) {
        let funcs: Handler[] = this.observers[msg];
        if (funcs) {
            for (let i: number = 0; i < funcs.length; i++) {
                if (arg && arg.length) {
                    funcs[i].runWithArg(arg);
                } else {
                    funcs[i].run();
                }
            }
        }
    }

    public static remove(msg: string, caller: any, method: Function) {
        let funcs: Handler[] = this.observers[msg];
        if (funcs) {
            for (let i: number = 0; i < funcs.length; i++) {
                if (funcs[i].caller == caller && funcs[i].method == method) {
                    funcs.splice(i, 1);
                    return;
                }
            }
        }
    }
    
}