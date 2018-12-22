import { Injectable } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { NotificationsService } from '../utils/notifications/components';

import * as globalVars from './../global';
import { ProductModel } from '../models/product.model';
import { InvoiceModel } from '../models/invoice.model';

@Injectable()
export class CartService {
    private vstorage: string = "cltextcart";
    countProducts: number = 0;
    constructor(private http: HttpClient, private noti: NotificationsService) {
        let me = this;
        me.refreshCountProducts();
    }

    refreshCountProducts(): void{
        let me = this;
        let productsSaved = me.getSessionItem("products");
        if(productsSaved){
            me.countProducts = productsSaved.length;
        }
    }

    private createSession(sessionData) {
        let strSessionData = JSON.stringify(sessionData);
        localStorage.setItem(this.vstorage, strSessionData);
        return true;
    }

    private destroySession() {
        return localStorage.removeItem(this.vstorage);
    }

    private getSessionItem(itemName) {
        var strSessionData = localStorage.getItem(this.vstorage);
        var sessionData = JSON.parse(strSessionData);
        if (!sessionData) return null;
        return sessionData[itemName];
    }

    private setSessionItem(itemName, value) {
        var strSessionData = localStorage.getItem(this.vstorage);
        var sessionData = JSON.parse(strSessionData);
        if(!sessionData) sessionData = {};
        sessionData[itemName] = value;
        this.createSession(sessionData);
    }

    addProductToCard(product: ProductModel, count: number): Promise<boolean> {
        let me = this;
        return new Promise(function(resolve, reject){
            let strProductsSaved = me.getSessionItem("products");
            let productsSaved = <Array<ProductModel>>strProductsSaved; 
            if(!productsSaved) productsSaved=<Array<ProductModel>>[];
            if(productsSaved.length > 0){
                let found = false;
                for (let index = 0; index < productsSaved.length; index++) {
                    if(productsSaved[index].id == product.id){
                        found = true;
                        productsSaved[index].count+=count;
                        break;
                    }
                }
                if(!found){
                    productsSaved.push(product);    
                }
            }else{
                productsSaved.push(product);
            }
            me.setSessionItem("products", productsSaved);
            me.refreshCountProducts();
            resolve(true);
        });
    }
    removeProductFromCard(product: ProductModel): void {
        let me = this;
        let productsSaved = <Array<ProductModel>>me.getSessionItem("products");
        if(!productsSaved){
            productsSaved=<Array<ProductModel>>[];
        }
        if(productsSaved.length > 0){
            for (let index = 0; index < productsSaved.length; index++) {
                const psaved = productsSaved[index];
                if(psaved.id == product.id){
                    productsSaved.splice(index, 1);
                    break;
                }
            }
        }
        me.setSessionItem("products", productsSaved);
        me.refreshCountProducts();
    }

    getProducts(): Promise<Array<ProductModel>>{
        let me = this;
        return new Promise(function(resolve, reject){
            let productsSaved = <Array<ProductModel>>me.getSessionItem("products");
            if(!productsSaved){
                productsSaved=<Array<ProductModel>>[];
            }
            resolve(productsSaved);
        });
    }

    removeAll(): void{
        let me = this;
        me.setSessionItem("products", []);
        me.refreshCountProducts();
    }

    purchase(invoice: InvoiceModel): Promise<boolean>{
        let me = this;
        return new Promise(function(resolve, reject){
            let url = globalVars.server + '/invoice';
            me.http.post(url, invoice).subscribe(function(resp) {
                resolve(true);
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
}