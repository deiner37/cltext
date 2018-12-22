import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductCategoryService } from '../../services/productcategory.service';
import { ResponseModel } from '../../models/response.model';
import { ProductCategoryModel } from '../../models/productcategory.model';
import { CreateComponent } from './create/create.component';

@Component({
  selector: 'app-productcategories',
  templateUrl: './productcategories.component.html',
  styleUrls: ['./productcategories.component.css']
})
export class ProductcategoriesComponent implements OnInit {
  entities: Array<ProductCategoryModel>;
  popoverTitle: string = "Delete?";
  popoverMessage: string = "Are you sure?";
  loading: boolean = false;
  @ViewChild('create') createModal:CreateComponent;
  
  constructor(private entityService: ProductCategoryService) { 
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
