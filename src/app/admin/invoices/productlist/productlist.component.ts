import { Component, OnInit, Output, ViewChild, EventEmitter, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { NotificationsService } from '../../../utils/notifications/components';
import { AuthService } from '../../../services/auth.service';
import { ProductModel } from '../../../models/product.model';

@Component({
  selector: 'app-productlist',
  templateUrl: './productlist.component.html',
  styleUrls: ['./productlist.component.css']
})
export class ProductlistComponent implements OnInit {

  public modalRef: NgbModalRef;
  products: Array<ProductModel>;
  @Output() onSuccess: EventEmitter<any> = new EventEmitter();
  @Output() onError: EventEmitter<any> = new EventEmitter();

  @ViewChild('content') content;
  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(protected noti: NotificationsService, 
    protected auth: AuthService,
    public modalService: NgbModal) { 
      let me = this;
  }

  open(products: Array<ProductModel>) {
    this.products = products;
    this.modalRef = this.modalService.open(this.content, {
      backdrop: 'static',
      windowClass: 'fade',
      keyboard: false
    });
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

  ngOnInit() {
  }

}
