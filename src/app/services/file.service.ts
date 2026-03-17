import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) {}

  convert(file: File, format: string): Observable<Blob> {

    const formData = new FormData();
    formData.append('file', file);
    formData.append('format', format);

    return this.http.post(
      'https://file-con-backend-1.onrender.com/api/convert',
      formData,
      {
        responseType: 'blob'
      }
    );
  }
}