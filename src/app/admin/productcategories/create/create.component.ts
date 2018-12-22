import { Component, OnInit, ElementRef, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, AbstractControl } from '@angular/forms';
import { AfterViewInit, Directive, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { NgbModal, ModalDismissReasons, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { NotificationsService } from '../../../utils/notifications/components';
import { AuthService } from '../../../services/auth.service';
import { ProductCategoryService } from '../../../services/productcategory.service';
import { ProductCategoryModel } from '../../../models/productcategory.model';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  public entityForm: FormGroup;
  public modal: any = null;
  public modalRef: NgbModalRef;
  public loading:boolean = false;
  @Output() onSuccess: EventEmitter<any> = new EventEmitter();
  @Output() onError: EventEmitter<any> = new EventEmitter();

  @ViewChild('content') content;
  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(protected noti: NotificationsService, 
    protected auth: AuthService,
    protected pcService: ProductCategoryService,
    public modalService: NgbModal) { 
      this.createForm();
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
      description:new FormControl(null)
    });        
  }
  ngOnInit() {
  }
  create(){
    let me = this;
    if(me.entityForm.valid) {
      let values = me.entityForm.getRawValue(); 
      let pcModel = new ProductCategoryModel(values);
      me.loading = true;
      me.pcService.create(pcModel).then(function(res){
        me.loading = false;
        me.onSuccess.emit();
        me.close()
      });
    }
  }
}
