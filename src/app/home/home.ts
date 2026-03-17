import {
  Component,
  HostListener,
  ElementRef,
  ViewChild
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FileService } from '../services/file.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {

  constructor(private fileService: FileService) {}

  @ViewChild('dropdownContainer') dropdownContainer!: ElementRef;

  formats: string[] = [
    'PDF','DOC','DOCX','ODT','RTF','TXT','HTML','HTM','EPUB',
    'XLS','XLSX','ODS','CSV',
    'PPT','PPTX','ODP'
  ];

  searchText = '';
  filteredFormats: string[] = [...this.formats];
  dropdownOpen = false;

  selectedFormat = '';
  selectedFile: File | null = null;

  currentStep: 'UPLOAD' | 'CONVERTING' | 'DONE' = 'UPLOAD';

  convertedBlob: Blob | null = null;

  /* ---------- dropdown ---------- */

  toggleDropdown(){
    this.dropdownOpen = !this.dropdownOpen;
  }

  filterFormats(){
    const value = this.searchText.toLowerCase();
    this.filteredFormats = this.formats.filter(f =>
      f.toLowerCase().includes(value)
    );
    this.dropdownOpen = true;
  }

  selectFormat(format:string){
    this.selectedFormat = format;
    this.searchText = format;
    this.dropdownOpen = false;
  }

  /* ---------- upload ---------- */

  onFileSelected(event:any){
    this.selectedFile = event.target.files[0];
  }

  /* ---------- drag drop ---------- */

  onDragOver(event: DragEvent){
    event.preventDefault();
  }

  onDrop(event: DragEvent){
    event.preventDefault();
    if(event.dataTransfer?.files.length){
      this.selectedFile = event.dataTransfer.files[0];
    }
  }

  /* ---------- convert ---------- */

  convertFile(){

    if(!this.selectedFile){
      alert("Upload file first");
      return;
    }

    if(!this.selectedFormat){
      alert("Select format first");
      return;
    }

    this.currentStep = 'CONVERTING';

    this.fileService.convert(this.selectedFile, this.selectedFormat)
      .subscribe({
        next: (res: Blob) => {
          this.convertedBlob = res;
          this.currentStep = 'DONE';
        },
        error: (err:any) => {
          console.error(err);
          alert("Conversion failed");
          this.currentStep = 'UPLOAD';
        }
      });
  }

  /* ---------- download ---------- */

  downloadFile(){
    if(!this.convertedBlob) return;

    const blob = new Blob([this.convertedBlob], {
      type: 'application/octet-stream'
    });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "converted." + this.selectedFormat.toLowerCase();

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    window.URL.revokeObjectURL(url);
  }

  /* ---------- reset ---------- */

  startOver(){
    this.currentStep = 'UPLOAD';
    this.selectedFile = null;
    this.selectedFormat = '';
    this.searchText = '';
    this.convertedBlob = null;
  }

  /* ---------- close dropdown ---------- */

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event){
    if(
      this.dropdownContainer &&
      !this.dropdownContainer.nativeElement.contains(event.target)
    ){
      this.dropdownOpen = false;
    }
  }
}