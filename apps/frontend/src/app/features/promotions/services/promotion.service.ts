import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Promotion, PromotionRequest } from '../models/promotion.model';

@Injectable({ providedIn: 'root' })
export class PromotionService {
  constructor(private http: HttpClient) {}

  list(query?: string, type?: string, status?: string): Observable<Promotion[]> {
    let params = new HttpParams();
    if (query) {
      params = params.set('q', query);
    }
    if (type) {
      params = params.set('type', type);
    }
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<Promotion[]>(`${environment.apiUrl}/promotions`, { params });
  }

  /** Promociones próximas a vencer, para avisos en el panel. */
  expiring(): Observable<Promotion[]> {
    return this.http.get<Promotion[]>(`${environment.apiUrl}/promotions/expiring`);
  }

  getById(id: string): Observable<Promotion> {
    return this.http.get<Promotion>(`${environment.apiUrl}/promotions/${id}`);
  }

  create(request: PromotionRequest): Observable<Promotion> {
    return this.http.post<Promotion>(`${environment.apiUrl}/promotions`, request);
  }

  update(id: string, request: PromotionRequest): Observable<Promotion> {
    return this.http.put<Promotion>(`${environment.apiUrl}/promotions/${id}`, request);
  }

  setActive(id: string, active: boolean): Observable<Promotion> {
    return this.http.patch<Promotion>(`${environment.apiUrl}/promotions/${id}/active`, { active });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/promotions/${id}`);
  }
}
