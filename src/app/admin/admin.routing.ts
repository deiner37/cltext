import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthGuard} from '../guards/auth.guard';
import {AdminComponent} from './admin.component';
import { ProductsComponent } from './products/products.component';
import { ProductcategoriesComponent } from './productcategories/productcategories.component';
import { InvoicesComponent } from './invoices/invoices.component';
const AdminRoutes: Routes = [{
  path: '',
  component: AdminComponent,
  children: [{
    path: 'products',
    component: ProductsComponent
  },{
    path: 'productcategories',
    component: ProductcategoriesComponent
  },{
    path: 'invoices',
    component: InvoicesComponent
  }
    /*path: '**',
    redirectTo: 'myworkspace',
    pathMatch: 'full'
    //{ path: '**', component: NotFoundComponent }*/
  ]
}];
export const AdminRouting = RouterModule.forChild(AdminRoutes);