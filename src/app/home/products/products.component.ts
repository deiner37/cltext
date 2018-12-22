import { Component, OnInit } from '@angular/core';
import { ProductCategoryModel } from '../../models/productcategory.model';
import { ProductModel } from '../../models/product.model';
import { ProductCategoryService } from '../../services/productcategory.service';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from '../../utils/notifications/components';
import { ResponseModel } from '../../models/response.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  categories: Array<ProductCategoryModel>;
  products: Array<ProductModel>;
  loading: boolean = false;
  currentCategory: ProductCategoryModel;
  pname: string;
  constructor(protected productCategoryService: ProductCategoryService,
    protected productService: ProductService,
    protected authService: AuthService, 
    private router:Router,
    private notification: NotificationsService,
    public activatedRoute: ActivatedRoute,
    public cartService: CartService ) {
    let me = this;
    productCategoryService.list().then(function(res: ResponseModel){
      me.categories = res.data;
      me.init();
    });
  }

  ngOnInit() {
    let me = this;
  }
  init(){
    let me = this;
    me.activatedRoute.queryParams.subscribe(queryParams => {
      me.pname = queryParams['pn'];
      me.activatedRoute.params.subscribe(params => {
        let categoryid = params['categoryid']; 
        if(categoryid){
          me.currentCategory = null;
          if(me.categories && me.categories.length > 0){
            me.currentCategory = me.categories.find($c => $c.id == categoryid);
            me.loadCategoryProduct(me.currentCategory);
          }else{
            me.loadCategoryProduct();
          }
        }else{
          me.loadCategoryProduct();
        }
      });		
    });
  }
  loadCategoryProduct(cat?):void{
    let me = this;
    let params = {};
    
    if(me.currentCategory) params['category'] = me.currentCategory.id;
    if(me.pname) params['pn'] = me.pname;

    me.productService.list(params).then(function(res: ResponseModel){
      me.products = res.data;
      me.products.forEach(function(item){
        item.count = 1;
      })
    });
  }
  selectFirstCategory(): void{
    let me = this;
    if(me.categories && me.categories.length > 0){
      let cat = me.categories[0];
      me.currentCategory = cat;
      me.router.navigate(['/', cat.id]);
    }
  }
  addToCart(prod): void{
    let me = this;
    me.loading=true;
    me.cartService.addProductToCard(prod, prod.count).then(function(){
      prod.count = 1;
      me.loading=false;
      me.notification.success('Added', "Product has been added", {
        timeOut: 3000,
        showProgressBar: true,
        pauseOnHover: true,
        clickToClose: true
      });
    });
  }
  viewProduct(prod): void{
    let me = this;
    me.router.navigate(['/', prod.category_id, prod.id]);
  }

}
