import { Component, OnInit } from '@angular/core';
import { ProductCategoryService } from '../services/productcategory.service';
import { ProductService } from '../services/product.service';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from '../utils/notifications/components';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(protected productCategoryService: ProductCategoryService,
    protected productService: ProductService,
    protected authService: AuthService, 
    private router:Router,
    private notification: NotificationsService,
    public activatedRoute: ActivatedRoute) { 
      let me = this;
      console.log(me.router.url);
      if(me.router.url == "/admin"){
        me.router.navigate(['/admin/productcategories']);
      }
  }
  ngOnInit() {}

}
