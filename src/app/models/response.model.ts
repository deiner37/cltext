export class ResponseModel {
    total: 0;
    data: Array<any>; 
    constructor() {}
    get(prop): any{
        return this[prop];
    }
    set(prop, val): boolean{
        this[prop] = val;
        return true;    
    }
}