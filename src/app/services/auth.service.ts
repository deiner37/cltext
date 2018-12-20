import {Injectable} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClient} from '@angular/common/http';
import {NotificationsService} from '../utils/notifications/components';

import {UserModel} from '../models/user.model';
import { UserService } from '../services/user.service'

import * as globalVars from './../global';

@Injectable()
export class AuthService {
  private sessionName: string = "cltextdata";
  constructor(private http: HttpClient, private noti: NotificationsService) {
    let me = this;
  }
  public checkSession(): Promise<any>{
      let me = this;
      return new Promise(function(resolve, reject){
          let entity = new UserModel();
          let url = globalVars.server + '/' + entity.getSlug() + '/session';
          me.http.get(url).subscribe(function(resp) {
              //console.log('Has Session:', me.hasSession());
              if(!me.hasSession()){
                me.logout();
              }
              resolve(resp);
          }, function(err) {
              //reject(err.error);
          });
      });
    }
  
  public login(user: UserModel): Promise<any> {
    let me = this;
    let url = globalVars.server + '/session';
    return new Promise(function(resolve, reject) {
      me.http.post(url, user).subscribe(function(resp) {
        let isCreated = me.createSession(resp);
        resolve(isCreated);
      }, function(err) {
        reject(err.error);
      });
    });
  }

  public logout(server?): Promise<any> {
    let me = this;
    return new Promise(function(resolve, reject) {
      if(server != undefined && !server){
        me.destroySession();
        resolve(true);
      }else{
        let user = me.getSessionItem('user');
        let url = globalVars.server + '/session';
        me.http.delete(url, user).subscribe(function(resp) {
          me.destroySession();
          resolve(true);
        }, function(err) {
          me.noti.error('ERROR', err.error, {
            timeOut: 3000,
            showProgressBar: true,
            pauseOnHover: true,
            clickToClose: true
          });
        });
      }
    });
  }

  private createSession(sessionData) {
    let strSessionData = JSON.stringify(sessionData);
    localStorage.setItem(this.sessionName, strSessionData); 
    return true; 
  }

  private destroySession() {
    return localStorage.removeItem(this.sessionName);
  }

  private getSessionItem(itemName) {
    var strSessionData = localStorage.getItem(this.sessionName);
    var sessionData = JSON.parse(strSessionData);
    if(!sessionData) return null;
    return sessionData[itemName];
  }
  
  private setSessionItem(itemName, value) {
    var strSessionData = localStorage.getItem(this.sessionName);
    var sessionData = JSON.parse(strSessionData);
    sessionData[itemName] = value;
    this.createSession(sessionData);
  }

  public getToken(): string {
    let token = this.getSessionItem('token');
    return token;
  }

  public hasSession(): boolean {
    return localStorage.getItem(this.sessionName) != null;
  }

  public getUser(): UserModel {
    return Object.assign(new UserModel, this.getSessionItem('user'));
  }
}
