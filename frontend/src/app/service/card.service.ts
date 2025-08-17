import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import Card from '../model/Card';

@Injectable({
  providedIn: 'root',
})
export default class CardService {
  constructor(protected http: HttpClient) {}

  public async combineWords(cardName1: string, cardName2: string): Promise<Card> {
    try {
      return await firstValueFrom(
        this.http.post<Card>('http://localhost:8081/api/v1/cards', { cardName1, cardName2 })
      );
    } catch (error) {
      throw error;
    }
  }
}
