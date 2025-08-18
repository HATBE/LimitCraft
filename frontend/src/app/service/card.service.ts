import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import Card from '../model/Card';
import PlaygroundCard from '../model/PlaygroundCard';

@Injectable({
  providedIn: 'root',
})
export default class CardService {
  constructor(protected http: HttpClient) {}

  private sideBoardCardsKey = 'sideboardCards';
  private playgroundCardsKey = 'playgroundCards';

  public async combineWords(wordCardId1: string, wordCardId2: string): Promise<Card> {
    try {
      return await firstValueFrom(
        this.http.post<Card>('http://localhost:8081/api/v1/cards', { wordCardId1, wordCardId2 })
      );
    } catch (error) {
      throw error;
    }
  }

  public async getInitialCards(): Promise<Card[] | null> {
    try {
      return await firstValueFrom(this.http.get<Card[]>('http://localhost:8081/api/v1/cards'));
    } catch (error) {
      throw error;
    }
  }

  public saveSidebarCards(cards: Card[]): void {
    localStorage.setItem(this.sideBoardCardsKey, JSON.stringify(cards));
  }

  public getSidebordCards(): Card[] | null {
    const item = localStorage.getItem(this.sideBoardCardsKey);

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

  public savePlaygroundCards(cards: PlaygroundCard[]): void {
    cards = cards.filter((card) => !card.isLoading);

    localStorage.setItem(this.playgroundCardsKey, JSON.stringify(cards));
  }

  public getPlayGroundCards(): PlaygroundCard[] | null {
    const item = localStorage.getItem(this.playgroundCardsKey);

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
