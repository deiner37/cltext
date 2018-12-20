import { Injectable } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NotificationsService } from '../utils/notifications/components';
import { UserModel as EntityModel } from '../models/user.model';
import { EntityServiceAbstract } from './entity.abstract.service';
import * as globalVars from '../global';

@Injectable()
export class UserService extends EntityServiceAbstract {
	constructor(http: HttpClient, noti: NotificationsService) {
		super(http, noti);
	}
	getModel() {
		return EntityModel;
	}
	uploadPicture(id, file) {
		let me = this;
		return new Promise(function (resolve, reject) {
			var headers = new HttpHeaders({ 'Content-Type': 'multipart/form-data' });

			var fd = new FormData();
			fd.append('image', file);

			let entity = new EntityModel();
			let url = globalVars.server + '/' + entity.getSlug() + '/image/' + id;
			me.http.post(url, fd, { reportProgress: true }).subscribe(function (resp) {
				resolve(resp);
			}, function (err) {
				console.error(err)
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
	changePass(id, pass): Promise<any> {
		let me = this;
		return new Promise(function (resolve, reject) {
			let entity = new EntityModel();
			let url = globalVars.server + '/' + entity.getSlug() + '/password/' + id;
			me.http.put(url, { password: pass }).subscribe(function (resp) {
				resolve(resp);
			}, function (err) {
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
	checkSession(): Promise<any> {
		let me = this;
		return new Promise(function (resolve, reject) {
			let entity = new EntityModel();
			let url = globalVars.server + '/' + entity.getSlug() + '/session';
			me.http.get(url).subscribe(function (resp) {
				resolve(resp);
			}, function (err) {
				console.error(err.message)
				reject(err.error);
			});
		});
	}
}