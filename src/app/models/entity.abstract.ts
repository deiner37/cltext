export abstract class AbstractEntity {
    id: null;
    constructor() {}
    abstract getSlug(): string;
    get(prop): any{
        return this[prop];
    }
    set(prop, val): boolean{
        this[prop] = val;
        return true;    
    }
}