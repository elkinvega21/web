import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Territory, TerritoryRequest } from '../models/territory.model';

@Injectable({ providedIn: 'root' })
export class TerritoryService {
  constructor(private http: HttpClient) {}

  list(): Observable<Territory[]> {
    return this.http.get<Territory[]>(`${environment.apiUrl}/territories`);
  }

  getById(id: string): Observable<Territory> {
    return this.http.get<Territory>(`${environment.apiUrl}/territories/${id}`);
  }

  create(request: TerritoryRequest): Observable<Territory> {
    return this.http.post<Territory>(`${environment.apiUrl}/territories`, request);
  }

  update(id: string, request: TerritoryRequest): Observable<Territory> {
    return this.http.put<Territory>(`${environment.apiUrl}/territories/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/territories/${id}`);
  }
}
