import { OnInit, OnDestroy } from '@angular/core';
import { Title, BrowserModule } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import {FormGroup } from '@angular/forms';
import { AuthService } from '../services/auth.service';

import { AbstractEntity } from '../models/entity.abstract';
import { EntityServiceAbstract } from '../services/entity.abstract.service';
import { NotificationsService } from '../utils/notifications/components';

export abstract class AbstractEdit implements OnInit, OnDestroy  {
    abstract entity: AbstractEntity;
    entityForm: FormGroup;
    protected sub: any;
    protected id = null;
    public loading = false;
    constructor(protected titleService: Title, protected entityservice: EntityServiceAbstract, protected noti: NotificationsService, protected route: ActivatedRoute, protected router: Router, protected auth: AuthService) { }
    ngOnInit() {
        let me = this;
        //me.titleService.setTitle('CT-IVR | Updating Server');
        me.titleService.setTitle(me.getPageTitle());
        me.createForm();
        me.onInit();
        me.sub = this.route.params.subscribe(params => {
            me.id = params['id']; 
            me.getEntity();
        });
    }
    getEntity(): void{
        var me = this;
        this.loading = true;
        me.entityservice.findOne(me.id).then(resp => {
            this.loading = false;
            Object.assign(this.entity, resp);
            var data = me.entity;
            me.entityForm.patchValue(data);
            if(me['onSetValues'] && typeof me['onSetValues'] == 'function') me['onSetValues'](data);
        });  
    }
    ngOnDestroy() {
        this.sub.unsubscribe();
    }
    abstract createForm(): void;
    abstract getPageTitle(): string;
    onInit():void{};
    create() {
        let me = this;
        if(this.entityForm.valid) {
            let values = this.entityForm.getRawValue(); 
            Object.assign(this.entity, values);
            this.loading = true;
            if(me['beforeSave'] && typeof me['beforeSave'] == "function"){
                 me['beforeSave'].call(me).then(function(){
                    me.entityservice.update(this.entity).then(function(resp){
                        if(me['afterSave'] && typeof me['afterSave'] == "function"){
                            me['afterSave'].call(me, resp).then(function(){
                                me.loading = false;
                                me.noti.success('Saved', "Entity has been saved successfully", {
                                    timeOut: 3000,
                                    showProgressBar: true,
                                    pauseOnHover: true,
                                    clickToClose: true
                                });
                                me.goBack();
                            });
                        }else{
                            me.loading = false;
                            me.noti.success('Saved', "Entity has been saved successfully", {
                                timeOut: 3000,
                                showProgressBar: true,
                                pauseOnHover: true,
                                clickToClose: true
                            });
                            me.goBack();
                        }
                    }).catch(function(e){
                        me.loading = false;
                    });     
                 })
            }else{
                this.entityservice.update(this.entity).then(function(resp){
                    if(me['afterSave'] && typeof me['afterSave'] == "function"){
                        me['afterSave'].call(me, resp).then(function(){
                            me.loading = false;
                            me.noti.success('Saved', "Entity has been saved successfully", {
                                timeOut: 3000,
                                showProgressBar: true,
                                pauseOnHover: true,
                                clickToClose: true
                            });
                            me.goBack();
                        });
                    }else{
                        me.loading = false;
                        me.noti.success('Saved', "Entity has been saved successfully", {
                            timeOut: 3000,
                            showProgressBar: true,
                            pauseOnHover: true,
                            clickToClose: true
                        });
                        me.goBack();
                    }
                }).catch(function(e){
                    me.loading = false;
                });
            }
        }
    }
    goBack(e?){
        if(e) e.preventDefault();
        let me = this;
        me.router.navigate(['../../'], {relativeTo: me.route});
    }
}