import { Component, OnInit } from '@angular/core';
import { ProductModel } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { InvoiceModel } from '../../models/invoice.model';

@Component({
  selector: 'app-shoppingcart',
  templateUrl: './shoppingcart.component.html',
  styleUrls: ['./shoppingcart.component.css']
})
export class ShoppingcartComponent implements OnInit {
  products: Array<ProductModel> = [];
  purchased: boolean = false;
  constructor(private cartService: CartService, private auth: AuthService, private router: Router) { 
    let me = this;
    cartService.getProducts().then(function(products){
      me.products = products;
      if(me.products.length == 0){
        me.router.navigate(['/']);
      }
    });
  }
  ngOnInit() {
  }
  removeProduct(pro: ProductModel): void{
    let me = this;
    let index = me.products.findIndex($p => $p.id == pro.id);
    if(index > -1) {
      me.cartService.removeProductFromCard(pro);
      me.products.splice(index, 1);
    }
  }
  buy(): void{
    let me = this;
    let nproducts = me.products.map(function(p){
      return {
        'id': p.id,
        'name': p.name,
        'description': p.description,
        'count': p.count,
        'price': p.value,
        'total': p.count * p.value
      }
    });
    let invoice = new InvoiceModel({
      products: nproducts,
      user: me.auth.getUser(),
      total: me.products.map(item => (item['count'] * item['value'])).reduce((prev, next) => prev + next)
    });
    me.cartService.purchase(invoice).then(function(res){
        me.cartService.removeAll();
        me.purchased = true;
    });
  }
}
