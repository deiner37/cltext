import { Injectable } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NotificationsService } from '../utils/notifications/components';

import { InvoiceModel as EntityModel } from '../models/invoice.model';
import { EntityServiceAbstract } from './entity.abstract.service';
import * as globalVars from '../global';

@Injectable()
export class InvoiceService extends EntityServiceAbstract {
	constructor(http: HttpClient, noti: NotificationsService) {
		super(http, noti);
	}
	getModel() {
		return EntityModel;
	}
}