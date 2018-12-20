import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AuthService } from './auth.service';
import { NotificationsService } from '../utils/notifications/components';

import * as io from 'socket.io-client';
import * as globalVars from '../global';


@Injectable()
export class SocketService {
    
    private socket: io.Socket;
    private currentComponent: string = null;

    constructor(private auth: AuthService, private noti:NotificationsService) {
        let me = this;
        this.connect();
    }

    isConnected(){
        let me = this;
        if(me.socket) return me.socket.connected;
        return false;
    }

    reconnect(){
        let me = this;
        if(!me.socket) 
            me.connect()
        else{
            console.log("RECONNECT: ", me.socket.connected);
            if (me.socket.connected === false) {
                // use a connect() or reconnect() here if you want
                me.socket.connect()
           }
       }
    }
    connect(){
        let me = this;
        me.socket = io(globalVars.server + '/namespace/' + me.auth.getUser().type, {
            transports: ['websocket'],
            query: {
                token: me.auth.getToken(),
                user: JSON.stringify({
                    id: me.auth.getUser().id,
                    username: me.auth.getUser().username,
                    fullname: me.auth.getUser().fullname,
                    photo: me.auth.getUser().photo
                })
            }
        });
        var onevent = me.socket.onevent;
        me.socket.onevent = function (packet) {
            var args = packet.data || [];
            onevent.call (this, packet);    // original call
            packet.data = ["*"].concat(args);
            onevent.call(this, packet);      // additional call to catch-all
        };


        me.socket.on('reconnect_attempt', () => {
            me.socket.io.opts.transports = ['websocket'];
            me.socket.io.opts.query = {
                token: me.auth.getToken()
            }
        });
        me.socket.on("connect", function(){
            //console.log("connect");
        });
        me.socket.on('disconnect', function () {
            console.error('DISCONNECT!!! ');
        });
        me.socket.on('error', function (err) {
            me.noti.error('ERROR', err.error, {
              timeOut: 3000,
              showProgressBar: true,
              pauseOnHover: true,
              clickToClose: true    
           });
        });
    }

    onAll() {
        var me = this;
        return Observable.create(observer => {
            me.socket.on('*', function(evt, data){
                observer.next({
                    evt: evt,
                    data: data
                });
            });
        });
    }

    // on
    on(msgtype) {
        var me = this;
        return Observable.create(observer => {
            me.socket.on(msgtype, function(data, callback){
                observer.next({
                    data: data, 
                    callback: callback
                });
            });
        });
    } 

    // EMITTER
    sendMessage(msgname:string, msg:any, callback?) {
        var me = this;
        if(callback){
            me.socket.emit(msgname, msg, function(data){
                callback.call(me, data);
            });  
        }else{
            me.socket.emit(msgname, msg);
        }
    }
    
    // HANDLER
    onNewMessage(msgtype) {
        var me = this;
        return Observable.create(observer => {
            me.socket.on(msgtype, data => {
                observer.next(data);
            });
        });
    } 

    destroy(): void{
        let me = this;
        me.socket.disconnect(true);
        me.socket = null;
    }
}
