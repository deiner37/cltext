import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthGuard} from '../guards/auth.guard';
import {AdminComponent} from './admin.component';
const AdminRoutes: Routes = [{
  path: '',
  component: AdminComponent,
  /*children: [{
    path: '**',
    redirectTo: 'myworkspace',
    pathMatch: 'full'
    //{ path: '**', component: NotFoundComponent }
  }]*/
}];
export const AdminRouting = RouterModule.forChild(AdminRoutes);