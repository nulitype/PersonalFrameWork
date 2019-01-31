class Handler {

    public caller: any;
    public method: Function;

    constructor(caller: any, method: Function) {
        this.caller = caller;
        this.method = method;
    }

    public run() {
        this.method.call(this.caller);
    }

    public runWithArg(...arg) {
        this.method.apply(this.caller, arg);
    }

}