import { Observable } from 'rxjs';
import { Card, CardResponse, CardsResponse } from './../models/CardResponse';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  apiURL = environment.apiURL + 'admin/card';
  constructor(private http: HttpClient) {}
  getListCard(): Observable<CardsResponse> {
    return this.http.get<CardsResponse>(`${this.apiURL}`);
  }
  getCardById(id: string): Observable<CardResponse> {
    return this.http.get<CardResponse>(`${this.apiURL}/${id}`);
  }
  createCard(Card: Card): Observable<any> {
    return this.http.post<Card>(`${this.apiURL}`, Card);
  }
  updateCard(id: string, Card: Card): Observable<any> {
    return this.http.put<Card>(`${this.apiURL}/${id}`, Card);
  }
  deleteCard(id: string): Observable<any> {
    return this.http.delete(`${this.apiURL}/${id}`);
  }
}
