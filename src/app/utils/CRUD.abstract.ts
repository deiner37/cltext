import { CRUDInterface } from './CRUD.interface';
import { EntityServiceAbstract } from '../services/entity.abstract.service';
import { AbstractEntity } from '../models/entity.abstract';

export abstract class CRUDAbstract implements CRUDInterface {
    
    abstract getService(): EntityServiceAbstract;
    
    public create(entity: AbstractEntity): Promise<any> {
        let me = this;
        return me.getService().create(entity);
    }
    public update(entity: AbstractEntity): Promise<any> {
        let me = this;
        return me.getService().update(entity);
    }
    public remove(entity: AbstractEntity): Promise<any> {
        let me = this;
        return me.getService().remove(entity);
        
    }
    public list(): Promise<Array<any>> {
        let me = this;
        return me.getService().list()
    }
}