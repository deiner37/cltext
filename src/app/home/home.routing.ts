import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { HomeComponent } from './home.component';
import { ProductsComponent } from './products/products.component';
import { ProductComponent } from './product/product.component';
import { ShoppingcartComponent } from './shoppingcart/shoppingcart.component';
const HomeRoutes: Routes = [{
    path: '',
    component: HomeComponent,
    children: [{
		  path: '',
		  component: ProductsComponent,
	  },{
		  path: 'shoppingcart',
		  component: ShoppingcartComponent
	  },{
		  path: ':categoryid',
		  component: ProductsComponent,
	  },{
		path: ':categoryid/:productid',
		component: ProductComponent,
	}]
}];
export const HomeRouting = RouterModule.forChild(HomeRoutes);