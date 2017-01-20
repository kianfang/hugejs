export class Controller{
    protected req:any;
    protected res:any;
    protected next:any;
    constructor(req, res, next) {
        this.req = req;
        this.res = res;
        this.next = next;
        this._initailize();
    }

    _initailize() {

    }
}
