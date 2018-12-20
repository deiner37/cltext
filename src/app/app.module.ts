import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { AppRouting } from './app.routing';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { NoLoginGuard } from './guards/nologin.guard';
import { TokenInterceptor } from './common/token.interceptor'; 
import { NotificationsService, SimpleNotificationsModule } from './utils/notifications/components';
import { PaginationComponent } from './utils/pagination/pagination.component';
import { LoadingModule } from 'ngx-loading';
import { ProductCategoryService } from './services/productcategory.service';
import { ProductService } from './services/product.service';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule, 
    HttpClientModule, 
    AppRouting, 
    HttpModule, 
    CommonModule, 
    FormsModule,
    SimpleNotificationsModule,
    LoadingModule,
    NgbModule.forRoot()
  ],
  providers: [
    AuthGuard, 
    AuthService, 
    NoLoginGuard, 
    {
        provide: HTTP_INTERCEPTORS,
        useClass: TokenInterceptor,
        multi: true
    },
    NotificationsService,
    ProductCategoryService,
    ProductService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
