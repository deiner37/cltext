import { OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import {FormGroup } from '@angular/forms';
import { AuthService } from '../services/auth.service';

import { AbstractEntity } from '../models/entity.abstract';
import { EntityServiceAbstract } from '../services/entity.abstract.service';
import { NotificationsService } from '../utils/notifications/components';

export abstract class AbstractCreate implements OnInit  {
    abstract entity: AbstractEntity; 
    entityForm: FormGroup;
    public loading = false;
    constructor(protected titleService: Title, protected entityservice: EntityServiceAbstract, protected noti: NotificationsService, protected router: Router,  protected route: ActivatedRoute, protected auth: AuthService) {}
    ngOnInit() {
        var me = this;
        this.titleService.setTitle(this.getPageTitle());
        me.onInit();   
        me.createForm();
    }
    abstract createForm(): void
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
                    me.entityservice.create(this.entity).then(function(resp){        
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
                this.entityservice.create(this.entity).then(function(resp){
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
    goBack(){
        let me = this;
        me.router.navigate(['../'], {relativeTo: me.route});
    }
}
