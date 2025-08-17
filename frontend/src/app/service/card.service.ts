import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import Card from '../model/Card';

@Injectable({
  providedIn: 'root',
})
export default class CardService {
  constructor(protected http: HttpClient) {}

  private lsKey = 'cards';

  public async combineWords(cardName1: string, cardName2: string): Promise<Card> {
    try {
      return await firstValueFrom(
        this.http.post<Card>('http://localhost:8081/api/v1/cards', { cardName1, cardName2 })
      );
    } catch (error) {
      throw error;
    }
  }

  public saveSidebarCards(cards: Card[]): void {
    localStorage.setItem(this.lsKey, JSON.stringify(cards));
  }

  public getSidebordCards(): Card[] | null {
    const item = localStorage.getItem(this.lsKey);

    if (!item) {
      return null;
    }

    try {
      return JSON.parse(item);
    } catch (error) {
      console.log(error);
    }

    return null;
  }
}
