import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private API = 'https://file-con-backend-1.onrender.com/api/convert';

  constructor(private http: HttpClient) {}

  convert(file: File, format: string): Observable<HttpResponse<Blob>> {

    const formData = new FormData();
    formData.append('file', file);
    formData.append('format', format);

    return this.http.post(this.API, formData, {
      responseType: 'blob',
      observe: 'response'
    });
  }
}