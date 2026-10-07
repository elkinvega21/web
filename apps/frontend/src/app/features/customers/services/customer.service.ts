import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Customer, CustomerRequest } from '../models/customer.model';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  constructor(private http: HttpClient) {}

  list(query?: string, status?: string): Observable<Customer[]> {
    let params = new HttpParams();
    if (query) {
      params = params.set('q', query);
    }
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<Customer[]>(`${environment.apiUrl}/customers`, { params });
  }

  getById(id: string): Observable<Customer> {
    return this.http.get<Customer>(`${environment.apiUrl}/customers/${id}`);
  }

  create(request: CustomerRequest): Observable<Customer> {
    return this.http.post<Customer>(`${environment.apiUrl}/customers`, request);
  }

  update(id: string, request: CustomerRequest): Observable<Customer> {
    return this.http.put<Customer>(`${environment.apiUrl}/customers/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/customers/${id}`);
  }
}
