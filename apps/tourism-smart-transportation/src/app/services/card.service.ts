import { Observable } from 'rxjs';
import { Card, CardResponse, CardsResponse } from './../models/CardResponse';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  apiURL = environment.apiURL + 'admin/card';
  constructor(private http: HttpClient) {}
  getListCard(status?: number | null): Observable<CardsResponse> {
    let queryParams = new HttpParams();
    if (status != null) {
      queryParams = queryParams.append('Status', status);
    }
    return this.http.get<CardsResponse>(`${this.apiURL}`, {
      params: queryParams,
    });
  }
  getCardById(id: string): Observable<CardResponse> {
    return this.http.get<CardResponse>(`${this.apiURL}/${id}`);
  }
  createCard(Card: FormData): Observable<any> {
    return this.http.post<Card>(`${this.apiURL}`, Card);
  }
  updateCard(id: string, Card: Card): Observable<any> {
    return this.http.put<Card>(`${this.apiURL}/${id}`, Card);
  }
  deleteCard(id: string): Observable<any> {
    return this.http.delete(`${this.apiURL}/${id}`);
  }
}
