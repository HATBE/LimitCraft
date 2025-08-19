import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import Card from '../model/Card';
import PlaygroundCard from '../model/PlaygroundCard';
import SidebarCard from '../model/SidebarCard';
import { Point } from '@angular/cdk/drag-drop';

@Injectable({
  providedIn: 'root',
})
export default class CardService {
  private sidebarCardsLocalStorageKey = 'sideboardCards';
  private playgroundCardsLocalStorageKey = 'playgroundCards';

  protected sidebarCards: SidebarCard[] = [];
  protected playgroundCards: PlaygroundCard[] = [];

  constructor(protected http: HttpClient) {}

  public getSidebarCards(): SidebarCard[] {
    return this.sidebarCards ?? [];
  }

  public getPlaygroundCards(): PlaygroundCard[] {
    return this.playgroundCards ?? [];
  }

  public async combineWords(wordCardId1: string, wordCardId2: string): Promise<Card> {
    try {
      return await firstValueFrom(
        this.http.post<Card>('http://localhost:8081/api/v1/cards', { wordCardId1, wordCardId2 })
      );
    } catch (error) {
      throw error;
    }
  }

  public saveSidebarCardsToLocalStorage(cards: Card[]): void {
    localStorage.setItem(this.sidebarCardsLocalStorageKey, JSON.stringify(cards));
  }

  public getSidebarCardsFromLocalStorage(): Card[] | null {
    const item = localStorage.getItem(this.sidebarCardsLocalStorageKey);

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

  public cleanPlaygroundCards() {
    this.playgroundCards = [];
  }

  public findPlaygroundCardById(id: string): PlaygroundCard | undefined {
    return this.playgroundCards.find((i) => i.localId === id);
  }

  public deletePlaygroundCardById(id: string) {
    this.playgroundCards = this.playgroundCards.filter((item) => item.localId !== id);
    this.savePlaygroundCards(this.playgroundCards);
  }

  public updateSidebarCardPosition(id: string, x: number, y: number): void {
    this.sidebarCards = this.sidebarCards.map((card) =>
      card.localId === id ? { ...card, lastX: x, lastY: y } : card
    );
  }

  public updatePlaygroundCardPosition(id: string, position: Point): void {
    this.playgroundCards = this.playgroundCards.map((card) =>
      card.localId === id ? { ...card, x: position.x, y: position.y } : card
    );

    this.savePlaygroundCards(this.playgroundCards);
  }

  public savePlaygroundCards(cards: PlaygroundCard[]): void {
    cards = cards.filter((card) => !card.isLoading); // do not save cards that have the loading attribute set to true (errors or loading ones)

    localStorage.setItem(this.playgroundCardsLocalStorageKey, JSON.stringify(cards));
  }

  public initPlaygroundCards() {
    const cards = this.getPlayGroundCardsFromLs();

    if (!cards) return;

    cards.forEach((card) => {
      this.createPlaygroundCard(card.card.id, card.card.icon, card.card.word, card.x, card.y);
    });
  }

  public createSidebarCard(id: string, icon: string, word: string): SidebarCard | null {
    // dont add if already in sidebar
    for (const card of this.sidebarCards) {
      if (card.card.id === id) {
        return null;
      }
    }

    const sidebarCard = {
      card: { icon, word, id },
      localId: crypto.randomUUID(),
      lastX: 0,
      lastY: 0,
    };
    this.sidebarCards.push(sidebarCard);

    const cards: Card[] = this.sidebarCards.map((card) => {
      return card.card;
    });

    this.saveSidebarCardsToLocalStorage(cards);

    return sidebarCard;
  }

  public createPlaygroundCard(
    id: string,
    icon: string,
    word: string,
    x: number,
    y: number,
    isLoading: boolean = false
  ): PlaygroundCard {
    const card = {
      card: { icon, word, id },
      localId: crypto.randomUUID(),
      x,
      y,
      isLoading,
    };

    this.playgroundCards.push(card);

    this.savePlaygroundCards(this.playgroundCards);

    return card;
  }

  public async initSidebarCards() {
    let cards = this.getSidebarCardsFromLocalStorage();

    if (!cards) {
      cards = (await this.getInitialSidebarCards()) ?? [];
    }

    cards.forEach((card) => {
      this.createSidebarCard(card.id, card.icon, card.word);
    });
  }

  public getPlayGroundCardsFromLs(): PlaygroundCard[] | null {
    const item = localStorage.getItem(this.playgroundCardsLocalStorageKey);

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

  public async getInitialSidebarCards(): Promise<Card[] | null> {
    try {
      return await firstValueFrom(this.http.get<Card[]>('http://localhost:8081/api/v1/cards'));
    } catch (error) {
      throw error;
    }
  }
}
