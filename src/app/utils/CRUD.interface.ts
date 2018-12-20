import { AbstractEntity } from '../models/entity.abstract';
export interface CRUDInterface {
    create(entity: AbstractEntity): Promise<any>;
    update(entity: AbstractEntity): Promise<any>;
    remove(entity: AbstractEntity): Promise<any>;
    list(): Promise<Array<any>>;
}