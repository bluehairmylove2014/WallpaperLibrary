import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { WallpaperService } from '../Service/wallpaper.service';

@Component({
  selector: 'app-UploadWallpaper',
  templateUrl: './UploadWallpaper.component.html',
  styleUrls: ['./UploadWallpaper.component.css']
})
export class UploadWallpaperComponent implements OnInit {
  @Input() username: string = '';

  @ViewChild('dragdropfield') ddfRef!: ElementRef;
  @ViewChild('btn_wrapper') btnWrapperRef!: ElementRef;
  @ViewChild('previewImg') previewImgRef!: ElementRef;
  @ViewChild('inforHolder') inforHolderRef!: ElementRef;
  @ViewChild('notiHolder') notiHolderRef!: ElementRef;
  @ViewChild('uploadMain') uploadMainRef!: ElementRef;
  @ViewChild('main') componentBodyRef!: ElementRef;

  // Var
  imageUrl: string | null = null;
  fileUpload: any;
  listener = () => { }
  pi_name: string = '';
  pi_tags: string = '';
  pi_des: string = '';

  constructor(
    private renderer: Renderer2,
    private wpp_service: WallpaperService
  ) { }

  // Methods
  isTagValid(): boolean {
    let valid = true;
    !this.pi_tags.trim().length && (valid = false);
    return valid;
  }
  onClickContinue(): void {
    location.reload();
  }
  onClickSubmit(): void {
    if (this.isTagValid()) {
      // Use service to upload image
      this.wpp_service.upload(
        this.username,
        this.pi_name,
        this.pi_tags,
        this.pi_des,
        this.fileUpload
      );

      // Hide provide infor
      this.renderer.removeClass(this.inforHolderRef.nativeElement, 'active');
      this.listener && this.listener();
      // Show success notification
      this.renderer.addClass(this.notiHolderRef.nativeElement, 'active');
      setTimeout(() => {
        this.listener = this.renderer.listen(this.uploadMainRef.nativeElement, 'click', (event) => {
          if (event.target && !this.notiHolderRef.nativeElement.contains(event.target)) {
            this.renderer.removeClass(this.notiHolderRef.nativeElement, 'active');
            this.previewImgRef.nativeElement.style.filter = 'none';
            this.listener && this.listener();
          }
        })
      }, 300);
    }
  }
  onClickUpload() {
    this.previewImgRef.nativeElement.style.filter = 'blur(5px) brightness(0.6)';
    this.renderer.addClass(this.inforHolderRef.nativeElement, 'active');
    setTimeout(() => {
      this.listener = this.renderer.listen(this.uploadMainRef.nativeElement, 'click', (event) => {
        if (event.target && !this.inforHolderRef.nativeElement.contains(event.target)) {
          this.renderer.removeClass(this.inforHolderRef.nativeElement, 'active');
          this.previewImgRef.nativeElement.style.filter = 'none';
          this.listener && this.listener();
        }
      })
    }, 300);
  }
  onCancelUpload() {
    this.renderer.removeClass(this.componentBodyRef.nativeElement, 'active');
  }
  browseWallpaper() {

    let input = document.createElement('input');
    input.type = 'file';
    input.accept = "image/jpeg, image/png";
    input.onchange = _ => {
      // // you can use this method to get file and perform respective operations
      this.fileUpload = input.files && input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result as string;
      };
      this.fileUpload && reader.readAsDataURL(this.fileUpload);
    };
    input.click();
  }
  previewWallpaper() {
    const input = this.ddfRef.nativeElement.querySelector('.drag-drop-input');
    this.fileUpload = input.files && input.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl = reader.result as string;

      const browse_btn = this.btnWrapperRef.nativeElement.querySelector('.browse-btn');
      browse_btn && (browse_btn.style.display = 'block');

      const upload_btn = this.btnWrapperRef.nativeElement.querySelector('.upload-btn');
      upload_btn && (upload_btn.style.cursor = 'pointer');
    };
    this.fileUpload && reader.readAsDataURL(this.fileUpload);
  }
  onDragOver(event: DragEvent) {
    event.preventDefault();
  }
  onDrop(event: DragEvent) {
    event.preventDefault();
    let cur_target = event.target as HTMLElement;
    const files = event.dataTransfer?.files;
    if (files && files.length) {
      this.fileUpload = files[0];
      if (!this.fileUpload.type.match(/(png|jpg)$/)) {
        if (cur_target) {
          cur_target.style.backgroundColor = 'transparent';
          const browse_btn = cur_target.querySelector('.drag-drop-img');
          browse_btn && this.renderer.removeClass(browse_btn, 'unactive');
          alert('Only PNG and JPG images are supported.');
        }
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(this.fileUpload);
      reader.onload = (event) => {
        this.imageUrl = event.target?.result as string;

        const browse_btn = this.btnWrapperRef.nativeElement.querySelector('.browse-btn');
        browse_btn && (browse_btn.style.display = 'block');

        const upload_btn = this.btnWrapperRef.nativeElement.querySelector('.upload-btn');
        upload_btn && (upload_btn.style.cursor = 'pointer');
      };
    }
  }
  onDragEnter(event: DragEvent) {
    let curTarget = event.target as HTMLElement;
    if (curTarget) {
      if (curTarget.tagName === 'BUTTON') {
        curTarget = curTarget.parentElement || curTarget;
      }
      const browseBtn = curTarget.querySelector('.drag-drop-img');
      browseBtn && this.renderer.addClass(browseBtn, 'unactive');
      curTarget.style.backgroundColor = 'rgb(228, 218, 218)';
    }
  }
  onDragLeave(event: DragEvent) {
    let cur_target = event.target as HTMLElement;
    // event target tagname is on uppercase 
    if (cur_target) {
      if (cur_target.tagName === 'BUTTON') {
        cur_target = cur_target.parentElement ? cur_target.parentElement : cur_target;
      }
      const browse_btn = cur_target.querySelector('.drag-drop-img');
      browse_btn && this.renderer.removeClass(browse_btn, 'unactive');
      cur_target.style.backgroundColor = 'transparent';
    }
  }
  ngOnInit() {
  }

}
