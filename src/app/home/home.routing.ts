import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { HomeComponent } from './home.component';
const HomeRoutes: Routes = [{
    path: '',
    component: HomeComponent
}];
export const HomeRouting = RouterModule.forChild(HomeRoutes);