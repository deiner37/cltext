import { AbstractEntity } from './entity.abstract';
export class UserModel extends AbstractEntity {
	id: any;
	photo: any;
	fullname: any;
	email: any;
	username: any;
	password: any;
	enabled: any;
	type: any;
	constructor(values: Object = {}) {
		super();
		Object.assign(this, values);
	}
	getSlug(): string{
		return 'admin/security/user';
	}
}