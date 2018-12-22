import { Component, OnInit, ElementRef, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, AbstractControl } from '@angular/forms';
import { AfterViewInit, Directive, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { NgbModal, ModalDismissReasons, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { NotificationsService } from '../../../utils/notifications/components';
import { AuthService } from '../../../services/auth.service';
import { ProductService } from '../../../services/product.service';
import { ProductModel } from '../../../models/product.model';
import { ProductCategoryModel } from '../../../models/productcategory.model';
import { ProductCategoryService } from '../../../services/productcategory.service';
import { ResponseModel } from '../../../models/response.model';


@Component({
  selector: 'app-createproduct',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateProductComponent implements OnInit {
  public entityForm: FormGroup;
  public modal: any = null;
  public modalRef: NgbModalRef;
  public loading:boolean = false;
  public categories: Array<ProductCategoryModel>;
  @Output() onSuccess: EventEmitter<any> = new EventEmitter();
  @Output() onError: EventEmitter<any> = new EventEmitter();

  @ViewChild('content') content;
  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(protected noti: NotificationsService, 
    protected auth: AuthService,
    protected pcService: ProductService,
    protected catService: ProductCategoryService,
    public modalService: NgbModal) { 
      let me = this;
      me.createForm();
      catService.list().then(function(res: ResponseModel){
        me.categories = res.data;
      });
  }

  open() {
    this.modalRef = this.modalService.open(this.content, {
      backdrop: 'static',
      windowClass: 'fade',
      keyboard: false
    });
    this.entityForm.reset();
    this.modalRef.result.then((result) => {
      //console.log(result);
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //console.log(reason);
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  close(){
      this.modalRef.close();
  }
  createForm(): void{
    let self = this;
    this.entityForm = new FormGroup({
      name:new FormControl(null, Validators.required),
      category_id:new FormControl(null, Validators.required),
      value:new FormControl(0, Validators.required),
      description:new FormControl(null)
    });        
  }
  ngOnInit() {
  }
  create(){
    let me = this;
    if(me.entityForm.valid) {
      let values = me.entityForm.getRawValue(); 
      let pcModel = new ProductModel(values);
      me.loading = true;
      me.pcService.create(pcModel).then(function(res){
        me.loading = false;
        me.onSuccess.emit();
        me.close()
      });
    }
  }
}
