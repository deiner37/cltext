import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ResponseModel } from '../../models/response.model';
import { ProductModel } from '../../models/product.model';
import { CreateProductComponent } from './create/create.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  entities: Array<ProductModel>;
  popoverTitle: string = "Delete?";
  popoverMessage: string = "Are you sure?";
  loading: boolean = false;
  @ViewChild('create') createModal:CreateProductComponent;

  constructor(private entityService: ProductService) { 

  }
  refresh(): void{
    let me = this;
    me.loading = true;
    me.entityService.list().then(function(res:ResponseModel){
      me.entities = res.data;
      me.loading = false;
    })
  }
  ngOnInit() {
    this.refresh();
  }
  openCreateForm(): void{
    this.createModal.open();
  }
  remove(entity): void{
    let me = this;
    me.loading = true;
    me.entityService.remove(entity).then(function(){
      me.loading = false;
      me.refresh();
    })
  }

}
