export class Controller{
    protected req:any;
    protected res:any;
    protected next:any;
    constructor(req:any, res:any, next:any) {
        this.req = req;
        this.res = res;
        this.next = next;
        this._initailize();
    }

    protected _initailize() {}

    protected redirect(path:any) {
        this.res.redirect(path);
    }

    protected Db() {

    }
}
