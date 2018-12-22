import { AbstractEntity } from './entity.abstract';
import { ProductCategoryModel } from './productcategory.model';
import { UserModel } from './user.model';
import { ProductModel } from './product.model';
export class InvoiceModel extends AbstractEntity {
	id: any;
	user: UserModel;
	products: Array<ProductModel>;
    total: number;
	entrydate: any;
	constructor(values: Object = {}) {
		super();
		Object.assign(this, values);
	}
	getSlug(): string{
		return 'invoice';
	}
}