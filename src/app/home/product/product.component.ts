import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from '../../utils/notifications/components';
import { CartService } from '../../services/cart.service';
import { ProductModel } from '../../models/product.model';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  entity: ProductModel;
  loading: boolean = false;
  constructor( protected productService: ProductService,
    protected authService: AuthService, 
    private router:Router,
    private notification: NotificationsService,
    public activatedRoute: ActivatedRoute,
    public cartService: CartService) {

  }
  ngOnInit() {
    let me = this;
    me.activatedRoute.params.subscribe(params => {
      let productid = params['productid'];
      if(productid){
        me.productService.findOne(productid).then(function(e){
          me.entity = e;
          me.entity.count = 1;
        })
      }
    });
  }
  addToCart(prod): void{
    let me = this;
    me.loading=true;
    me.cartService.addProductToCard(me.entity, me.entity.count).then(function(){
      me.entity.count = 1;
      me.loading=false;
      me.notification.success('Added', "Product has been added", {
        timeOut: 3000,
        showProgressBar: true,
        pauseOnHover: true,
        clickToClose: true
      });
    });
  }

}
