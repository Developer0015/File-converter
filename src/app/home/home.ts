import {
  Component,
  HostListener,
  ElementRef,
  ViewChild,
  NgZone,
  ChangeDetectorRef,
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
  styleUrls: ['./home.css'],
})
export class Home {
  @ViewChild('dropdownContainer') dropdownContainer!: ElementRef;

  // We inject BOTH NgZone and ChangeDetectorRef
  constructor(
    private fileService: FileService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
  ) {}

  /* ---------- formats ---------- */
  formats: string[] = [
    'PDF',
    'DOC',
    'DOCX',
    'ODT',
    'RTF',
    'TXT',
    'HTML',
    'HTM',
    'EPUB',

    'XLS',
    'XLSX',
    'ODS',
    'CSV',

    'PPT',
    'PPTX',
    'ODP',
  ];

  searchText = '';
  filteredFormats: string[] = [...this.formats];
  dropdownOpen = false;

  selectedFormat = '';
  selectedFile: File | null = null;

  /* ---------- iLovePDF View State ---------- */
  currentStep: 'UPLOAD' | 'CONVERTING' | 'DONE' = 'UPLOAD';
  convertedBlob: Blob | null = null;

  /* ---------- dropdown ---------- */
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  filterFormats() {
    const value = this.searchText.toLowerCase();
    this.filteredFormats = this.formats.filter((f) => f.toLowerCase().includes(value));
    this.dropdownOpen = true;
  }

  selectFormat(format: string) {
    this.selectedFormat = format;
    this.searchText = format;
    this.dropdownOpen = false;
  }

  /* ---------- upload ---------- */
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  /* ---------- drag drop ---------- */
  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer?.files.length) {
      this.selectedFile = event.dataTransfer.files[0];
    }
  }

  /* ---------- convert ---------- */
  convertFile() {

  if (!this.selectedFile || !this.selectedFormat) {
    alert("Select file & format");
    return;
  }

  this.currentStep = 'CONVERTING';

  this.fileService.convert(this.selectedFile, this.selectedFormat)
    .subscribe({

      next: (res: any) => {

        // 🔥 CHECK IF RESPONSE IS JSON ERROR
        if (res.body.type === 'application/json') {

          const reader = new FileReader();

          reader.onload = () => {
            console.error("Backend error:", reader.result);
            alert("Conversion failed (backend error)");
            this.currentStep = 'UPLOAD';
          };

          reader.readAsText(res.body);
          return;
        }

        // ✅ SUCCESS
        this.convertedBlob = res.body;
        this.currentStep = 'DONE';

      },

      error: (err) => {
        console.error(err);
        alert("Conversion failed");
        this.currentStep = 'UPLOAD';
      }

    });
}

  /* ---------- download ---------- */
  downloadFile() {
    if (!this.convertedBlob) return;

    const url = window.URL.createObjectURL(this.convertedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted.' + this.selectedFormat.toLowerCase();
    a.click();
    window.URL.revokeObjectURL(url);
  }

  /* ---------- start over ---------- */
  startOver() {
    this.currentStep = 'UPLOAD';
    this.selectedFile = null;
    this.selectedFormat = '';
    this.searchText = '';
    this.convertedBlob = null;
  }

  /* ---------- close dropdown ---------- */
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    if (this.dropdownContainer && !this.dropdownContainer.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
    }
  }
}
