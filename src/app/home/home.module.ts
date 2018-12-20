import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule }  from '@angular/forms';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { SharedModule } from '../common/shared/shared.module';;

import {HomeRouting} from './home.routing';
import {HomeComponent} from './home.component';
import { LoadingModule } from 'ngx-loading';
import { RegisterComponent } from './register/register.component';

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
declarations: [HomeComponent, RegisterComponent],
providers: [],
exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
]
})
export class HomeModule { }
