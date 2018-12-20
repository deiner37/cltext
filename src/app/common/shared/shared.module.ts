import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { PaginationComponent } from '../../utils/pagination/pagination.component';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { ImageuploaderComponent } from '../../utils/imageuploader/imageuploader.component';

import {
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
} from '@angular/material';

@NgModule({
    imports: [
        CommonModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        FormsModule,
        ReactiveFormsModule,
        ConfirmationPopoverModule.forRoot({
            focusButton: 'confirm'
        }),
    ],
    declarations: [
        PaginationComponent, ImageuploaderComponent
    ],
    exports: [
        PaginationComponent, ImageuploaderComponent
    ]
})
export class SharedModule { }
