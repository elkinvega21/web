import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Report } from '../models/report.model';

@Injectable({ providedIn: 'root' })
export class ReportService {
  constructor(private http: HttpClient) {}

  load(): Observable<Report> {
    return this.http.get<Report>(`${environment.apiUrl}/reports`);
  }
}
