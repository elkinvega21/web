import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Salesperson, SalespersonRequest } from '../models/salesperson.model';

@Injectable({ providedIn: 'root' })
export class SalespersonService {
  constructor(private http: HttpClient) {}

  list(query?: string, status?: string): Observable<Salesperson[]> {
    let params = new HttpParams();
    if (query) {
      params = params.set('q', query);
    }
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<Salesperson[]>(`${environment.apiUrl}/salespersons`, { params });
  }

  getById(id: string): Observable<Salesperson> {
    return this.http.get<Salesperson>(`${environment.apiUrl}/salespersons/${id}`);
  }

  create(request: SalespersonRequest): Observable<Salesperson> {
    return this.http.post<Salesperson>(`${environment.apiUrl}/salespersons`, request);
  }

  update(id: string, request: SalespersonRequest): Observable<Salesperson> {
    return this.http.put<Salesperson>(`${environment.apiUrl}/salespersons/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/salespersons/${id}`);
  }
}
