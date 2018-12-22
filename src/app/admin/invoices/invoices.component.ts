import { Component, OnInit, ViewChild } from '@angular/core';
import { InvoiceService } from '../../services/invoice.service';
import { InvoiceModel } from '../../models/invoice.model';
import * as moment from 'moment'; //Add this 1 of 4
import { ProductlistComponent } from './productlist/productlist.component';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css']
})
export class InvoicesComponent implements OnInit {
  moment = moment;
  invoices: Array<InvoiceModel>;
  @ViewChild('productlist') productlistModal:ProductlistComponent;

  constructor(private invoiceService: InvoiceService) { 
    let me = this;
    me.invoiceService.list().then(function(res){
      me.invoices = res.data;
    });
  }

  ngOnInit() {
  }

  showInvoiceProducts(invoice: InvoiceModel): void{
    this.productlistModal.open(invoice.products);
  }
}
