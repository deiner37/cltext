import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { SharedModule } from '../common/shared/shared.module';;

import { HomeRouting } from './home.routing';
import { HomeComponent } from './home.component';
import { LoadingModule } from 'ngx-loading';
import { RegisterComponent } from './register/register.component';
import { ProductsComponent } from './products/products.component';
import { ProductComponent } from './product/product.component';
import { ShoppingcartComponent } from './shoppingcart/shoppingcart.component';

@Pipe({
    name: 'sumtotals',
    pure: false
})
export class SUMTotalInProductsPipe implements PipeTransform {
    transform(items: Array<any>): any {
        let val = items.map(item => (item['count'] * item['value'])).reduce((prev, next) => prev + next);
        return val;
    }
}


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ConfirmationPopoverModule.forRoot({
            focusButton: 'confirm'
        }),
        FormsModule,
        SharedModule,
        LoadingModule,
        HomeRouting
    ],
    declarations: [HomeComponent, RegisterComponent, ProductsComponent, ProductComponent, ShoppingcartComponent, SUMTotalInProductsPipe],
    providers: [],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ]
})
export class HomeModule { }
