import { AbstractEntity } from './entity.abstract';
import { ProductCategoryModel } from './productcategory.model';
export class ProductModel extends AbstractEntity {
	id: any;
	name: string;
	description: string;
    value: number;
    category: ProductCategoryModel;
	constructor(values: Object = {}) {
		super();
		Object.assign(this, values);
	}
	getSlug(): string{
		return 'main/product';
	}
}