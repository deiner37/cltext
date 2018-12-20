import { AbstractEntity } from './entity.abstract';
export class ProductCategoryModel extends AbstractEntity {
	id: any;
	name: string;
	description: string;
	constructor(values: Object = {}) {
		super();
		Object.assign(this, values);
	}
	getSlug(): string{
		return 'main/product/category';
	}
}