import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductCategoryService } from '../services/productcategory.service';
import { ProductCategoryModel } from '../models/productcategory.model';
import { ResponseModel } from '../models/response.model';
import { _ } from 'core-js';
import { AuthService } from '../services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Event, NavigationStart, NavigationEnd, Params } from '@angular/router';
import { NotificationsService } from '../utils/notifications/components';
import { RegisterComponent } from './register/register.component';
import { ProductService } from '../services/product.service';
import { ProductModel } from '../models/product.model';
import { CartService } from '../services/cart.service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  categories: Array<ProductCategoryModel>;
  products: Array<ProductModel>;
  loginForm: FormGroup;
  loading: boolean = false;
  paramsSubscribe: Subscription;
  
  search = {
    'id': null,
    'label': 'All',
    'text': null
  };
  @ViewChild('register') registerModal:RegisterComponent;

  constructor(protected productCategoryService: ProductCategoryService,
            protected productService: ProductService,
            protected authService: AuthService, 
            private router:Router,
            private notification: NotificationsService,
            public activatedRoute: ActivatedRoute,
            public cartService: CartService) {
    let me = this;
    productCategoryService.list().then(function(res: ResponseModel){
      me.categories = res.data;
    });
    this.router.events.subscribe((event : Event) => {
      if(event instanceof NavigationEnd) {
         //An event triggered when navigation ends successfully.
         me.refreshSearch();
      }
    });
    me.createLoginForm();
  }
  ngOnInit() {
  }

  refreshSearch(): void{
    let me = this;
    me.search.id = null;
    me.search.label = 'All';
    me.search.text = null;
  }

  createLoginForm(): void{
    this.loginForm = new FormGroup({
      username:new FormControl(null, [Validators.required, Validators.email]),
      password:new FormControl(null, Validators.required),
    });
  }
  searchProducts(event): void{
    if(event.keyCode == 13) {
      //alert('you just clicked enter');
      // rest of your code
      this.applyFilter();
    }
  }
  applyFilter(): void{
    let me = this;
    if(me.search.id && me.search.text && me.search.text != ''){
      me.router.navigate(['/', me.search.id], { 
        queryParams: { 
          pn: me.search.text
        }
      });
    }else if(me.search.text && me.search.text != ''){
      me.router.navigate(['/'], { 
        queryParams: {
          pn: me.search.text
        }
      });
    }

    /*if(Object.keys(me.search).length > 0){
      me.productCategoryService.list({
        filter: JSON.stringify(filter)
      }).then(function(res: ResponseModel){
        me.categories = res.data;
      });
    }else{
      me.productCategoryService.list().then(function(res: ResponseModel){
        me.categories = res.data;
      });
    }*/
  }
  login(): void{
    let me = this;
    if(this.loginForm.valid) {
      let values = this.loginForm.getRawValue(); 
      this.loading = true;
      this.authService.login(values).then((logged) => {
          //if(logged) location.reload();
          me.loading = false;
      }).catch((err) => {
          me.loading = false;
          this.notification.error("ERROR", err.message, {
            timeOut: 3000,
            showProgressBar: true,
            pauseOnHover: true,
            clickToClose: true
          });
      });
    }
  }
  openRegisterForm(): void{
    this.registerModal.open();
  }
  onSuccessRegister():void{
      this.registerModal.close();
      location.reload();
  }
  logout(): void{
    let me = this;
    me.loading=true;
    me.authService.logout().then(function(){
      me.loading=false;
      location.reload();
    });
  }
}
