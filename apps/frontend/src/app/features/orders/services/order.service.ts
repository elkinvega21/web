import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Order, OrderRequest } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private http: HttpClient) {}

  list(query?: string, status?: string): Observable<Order[]> {
    let params = new HttpParams();
    if (query) {
      params = params.set('q', query);
    }
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<Order[]>(`${environment.apiUrl}/orders`, { params });
  }

  getById(id: string): Observable<Order> {
    return this.http.get<Order>(`${environment.apiUrl}/orders/${id}`);
  }

  create(request: OrderRequest): Observable<Order> {
    return this.http.post<Order>(`${environment.apiUrl}/orders`, request);
  }

  updateStatus(id: string, status: string): Observable<Order> {
    return this.http.patch<Order>(`${environment.apiUrl}/orders/${id}/status`, { status });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/orders/${id}`);
  }
}
