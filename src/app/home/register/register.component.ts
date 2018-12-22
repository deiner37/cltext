import { Component, OnInit, ElementRef, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, AbstractControl } from '@angular/forms';
import { AfterViewInit, Directive, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { NgbModal, ModalDismissReasons, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { NotificationsService } from '../../utils/notifications/components';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { UserModel } from '../../models/user.model';

function passwordConfirming(c: AbstractControl): any {
  if(!c.parent || !c) return;
  const pwd = c.parent.get('password');
  const cpwd = c.parent.get('confirm_password');

  if(!pwd || !cpwd) return ;
  if (pwd.value !== cpwd.value) {
      return { invalid: true };
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
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
    protected userService: UserService,
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
      firstname:new FormControl(null, Validators.required),
      lastname:new FormControl(null, Validators.required),
      city:new FormControl(null),
      state:new FormControl(null),
      address:new FormControl(null),
      province:new FormControl(null),
      zip:new FormControl(null),
      phonenumber:new FormControl(null),
      email:new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
      confirm_password: new FormControl(null, [Validators.required, passwordConfirming]),
    });        
  }
  ngOnInit() {
  }
  create(){
    let me = this;
    if(me.entityForm.valid) {
      let values = me.entityForm.getRawValue(); 
      delete values['confirm_password'];
      let user = new UserModel(values);
      me.loading = true;
      me.userService.create(user).then(function(res){
        me.loading = false;
        console.log(res);
        me.close()
      });
    }
  }
}
