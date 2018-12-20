import { OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NotificationsService } from '../utils/notifications/components';
import { PaginationComponent } from '../utils/pagination/pagination.component';
import { AbstractEntity } from '../models/entity.abstract';
import { EntityServiceAbstract } from '../services/entity.abstract.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ResponseModel } from '../models/response.model';

export abstract class AbstractList implements OnInit, OnDestroy  {
    abstract entities: Array<AbstractEntity>;
    abstract entity;
    public loading = false;
    
    private create:boolean = true;
    private edit:boolean = true;
    private delete:boolean = true;
  
    popoverTitle: string = 'Are you sure?';
    popoverMessage: string = 'Are you really <b>sure</b> you want to do this?';
    confirmText: string = 'Yes <i class="glyphicon glyphicon-ok"></i>';
    cancelText: string = 'No <i class="glyphicon glyphicon-remove"></i>';
    confirmClicked: boolean = false;
    cancelClicked: boolean = false;

    enableTitle: string = 'Are you sure?';
    disableMessage: string = 'Are you really <b>sure</b> you want to do this?';
    
    
    totalrecs: number = 0;
    currentpage: number = 0;
    pagelimit: number = 100;
    totalpages: number = 0;
    params: Object = {};
    extraparams: Object = {};
    
    constructor(protected titleService: Title, protected entityservice: EntityServiceAbstract, protected noti: NotificationsService, protected router: Router, protected activatedroute: ActivatedRoute, protected auth: AuthService) {
      
    }
    ngOnInit() {
        var me = this;
        me.titleService.setTitle(this.getPageTitle());
        me.onInit();
        this.activatedroute.queryParams.subscribe(function(params){
            if(params) Object.assign(me.params, params);
            else me.params = {};
            if(me['afterReadParams']) me['afterReadParams'].call(me);
            me.refreshList(me.params);
        });
    }
    ngOnDestroy() {};
    onInit():void{};
    abstract getPageTitle(): string;
    remove(model: AbstractEntity, e): void{
        if(e) e.preventDefault();
        let me = this;
        let entity = new me.entity();
        Object.assign(entity, model);
        this.loading = true;
        this.entityservice.remove(entity).then(function(){
            me.loading = false;
            me.noti.success('Deleted', "Server has been deleted successfully", {
                timeOut: 3000,
                showProgressBar: true,
                pauseOnHover: true,
                clickToClose: true
            });
            me.refreshList();
        }).catch(function(e){
            me.loading = false;
        });
    }
    refreshList(params?): void{
        let me = this;
        
        if(me.params['page']) 
        	me.currentpage = parseInt(me.params['page']) + 1;
        else{
            me.params['page'] = 0;
            me.currentpage = 1;
        }
        // this.paginationControl.page = 1;
        let filters = this.getFilters();
        if(filters){
           me.params['filter'] = JSON.stringify(filters);
        }
        me.params['per_page'] = me.pagelimit;
        
        Object.assign(me.params, me.extraparams);
       me.loading = true;
       me.entityservice.list(me.params).then(function(response:ResponseModel){
            me.loading = false;
            me.entities = response.data;
            me.totalrecs = response.total;            
            me.totalpages = Math.ceil(me.totalrecs/me.pagelimit);
        });
    }
    getFilters(): any{
        return null;
    }
    setQueryParamsToCurrentURL(params, merge?): void{
        let me = this;
        let conf = {
            queryParams: params,
            relativeTo: this.activatedroute,
        };
        if(merge === undefined || merge===true){
            conf['queryParamsHandling'] = "merge";    
        }
        this.router.navigate(['./'], conf);
    }
    goToPage(n: number): void {
        var me = this;
        me.setQueryParamsToCurrentURL({
            'page': (n - 1)           
        });
    }
}