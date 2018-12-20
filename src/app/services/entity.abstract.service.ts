import { HttpClient } from '@angular/common/http';
import { NotificationsService } from '../utils/notifications/components';
import { AbstractEntity } from '../models/entity.abstract';
import * as globalVars from '../global';

export abstract class EntityServiceAbstract {
    protected http: HttpClient = null
    protected noti: NotificationsService = null
    constructor(http: HttpClient, noti: NotificationsService) {
        let me = this;
        me.http = http;
        me.noti = noti;
    }

    abstract getModel()

    public create(entity: AbstractEntity): Promise<any> {
        let me = this;
        return new Promise(function(resolve, reject) {
            let url = globalVars.server + '/' + entity.getSlug() + '/';
            me.http.post(url, entity).subscribe(function(resp) {
                resolve(resp);
            }, function(err) {
                me.noti.error('Error', err.message, {
                    timeOut: 3000,
                    showProgressBar: true,
                    pauseOnHover: true,
                    clickToClose: true
                });
                reject(err.error);
            });
        });
    }
    public update(entity: AbstractEntity): Promise<any> {
        let me = this;
        return new Promise(function(resolve, reject) {
            let url = globalVars.server + '/' + entity.getSlug() + '/' + entity.get('id');
            me.http.put(url, entity).subscribe(function(resp) {
                resolve(resp);
            }, function(err) {
                me.noti.error('Error', err.message, {
                    timeOut: 3000,
                    showProgressBar: true,
                    pauseOnHover: true,
                    clickToClose: true
                });
                reject(err.error);
            });
        });
    }
    public remove(entity: AbstractEntity): Promise<any> {
        let me = this;
        return new Promise(function(resolve, reject) {
            let url = globalVars.server + '/' + entity.getSlug() + '/' + entity.get('id');
            me.http.delete(url).subscribe(function(resp) {
                resolve(resp);
            }, function(err) {
                console.error(err.message)
                me.noti.error('Error', err.message, {
                    timeOut: 3000,
                    showProgressBar: true,
                    pauseOnHover: true,
                    clickToClose: true
                });
                reject(err.error);
            });
        });
    }
    public list(params?): Promise<any> {
        let me = this;
        let Model = this.getModel();
        var model = new Model();
        let url = globalVars.server + '/' + model.getSlug();
        return new Promise(function(resolve, reject) {
            params = params || { 'page': 0, 'per_page': 100};
            me.http.get(url, {params: params}).subscribe(function(resp) {
                resolve(resp);
            }, function(err) {
                console.error(err.message)
                me.noti.error('Error', err.message, {
                    timeOut: 3000,
                    showProgressBar: true,
                    pauseOnHover: true,
                    clickToClose: true
                });
                reject(err.error);
            });
        });
    }
    public findOne(id): Promise<any> {
        let me = this;
        let Model = this.getModel();
        var model = new Model();
        let url = globalVars.server + '/' + model.getSlug() + '/' + id;
        return new Promise(function(resolve, reject) {
            me.http.get(url).subscribe(function(resp) {
                resolve(resp);
            }, function(err) {
                console.error(err.message)
                me.noti.error('Error', err.message, {
                    timeOut: 3000,
                    showProgressBar: true,
                    pauseOnHover: true,
                    clickToClose: true
                });
                reject(err.error);
            });
        });
    }
}