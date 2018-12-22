import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ConfirmationPopoverModule} from 'angular-confirmation-popover';
import {LoadingModule} from 'ngx-loading';
import {SharedModule} from '../common/shared/shared.module';
import {
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatFormFieldModule
} from '@angular/material';

import {AdminComponent} from './admin.component';
import {AdminRouting} from './admin.routing';
import {UserService} from '../services/user.service';
import { ProductsComponent } from './products/products.component';
import { ProductcategoriesComponent } from './productcategories/productcategories.component';
import { CreateComponent } from './productcategories/create/create.component';
import { CreateProductComponent } from './products/create/create.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { ProductlistComponent } from './invoices/productlist/productlist.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ConfirmationPopoverModule.forRoot({
      focusButton: 'confirm'
    }),
    FormsModule,
    SharedModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatFormFieldModule,
    LoadingModule,
    AdminRouting,
  ],
  declarations: [AdminComponent, ProductsComponent, ProductcategoriesComponent, CreateComponent, CreateProductComponent, InvoicesComponent, ProductlistComponent, ProductlistComponent],
  providers: [
    UserService
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AdminModule {}