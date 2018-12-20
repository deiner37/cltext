import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-imageuploader',
  templateUrl: './imageuploader.component.html',
  styleUrls: ['./imageuploader.component.css']
})
export class ImageuploaderComponent implements OnInit {

	public uploader: FileUploader;
	private hasDragOver = true;

	@Input() private imageurl = '';
	@Input() private editmode = true;

	@Output() private changeImage = new EventEmitter();

	@ViewChild('fileInput') fileInput: ElementRef;

	constructor() {
		this.uploader = new FileUploader({
	  		url: 'http://localhost:9090/upload',
	  		disableMultipart: false,
	  		autoUpload: false
		});

		this.uploader.response.subscribe(res => {
	  		// Upload returns a JSON with the image ID
	  		//this.url = 'http://localhost:9090/get/' + JSON.parse(res).id;
	  		//this.urlChange.emit(this.url);
		});
	}

	public fileOver(e: any): void {
		this.hasDragOver = e;
	}

	ngOnInit() {
	}

	onContainerClick(): void{
        this.fileInput.nativeElement.click();
    }
    onChangeFile(input): void{
    	let me = this;
    	if (input.files && input.files[0]) {
		    var reader = new FileReader();
		    reader.onload = function(e) {
		       me.imageurl = e.target['result'];
		    }
		    reader.readAsDataURL(input.files[0]);
		    me.changeImage.emit({file: input.files[0]});
		}
    }
}
