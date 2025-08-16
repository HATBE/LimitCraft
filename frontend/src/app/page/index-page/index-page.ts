import { CdkDragEnd, DragDropModule, Point } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import PlaygroundCard from '../../model/PlaygroundCard';
import Card from '../../model/Card';
import CardService from '../../service/CardService';

@Component({
  selector: 'app-index-page',
  imports: [CommonModule, DragDropModule],
  templateUrl: './index-page.html',
  styleUrl: './index-page.css',
})
export class IndexPage implements OnInit {
  @ViewChildren('dragEl') dragEls!: QueryList<ElementRef<HTMLDivElement>>;

  protected playGroundCards: PlaygroundCard[] = [];

  public constructor(private cardService: CardService) {}

  public ngOnInit() {
    this.createCard('💧', 'Water', 0, 0);
    this.createCard('🔥', 'Fire', 30, 50);
    this.createCard('🌎', 'Earth', 100, 100);
  }

  protected onDragStarted(id: string) {
    const movedEl = this.dragEls.find((el) => el.nativeElement.dataset['id'] === id);
    if (!movedEl) return;
    movedEl.nativeElement.style.zIndex = '999';
  }

  protected async onDragEnded(event: CdkDragEnd, id: string) {
    this.updatePlaygroundCardPosition(id, event.source.getFreeDragPosition());

    const movedEl = this.dragEls.find((el) => el.nativeElement.dataset['id'] === id);
    if (!movedEl) return;
    movedEl.nativeElement.style.zIndex = 'auto';

    const moved = this.findPlayGroundCardById(movedEl.nativeElement.dataset['id']!);

    if (!moved) return;

    for (const otherEl of this.dragEls) {
      const other = this.findPlayGroundCardById(otherEl.nativeElement.dataset['id']!);

      if (!other) continue;

      if (other.card.localId === id || moved.isLoading || other.isLoading) continue;

      if (
        this.areCardsOverlapping(
          otherEl.nativeElement.getBoundingClientRect(),
          movedEl.nativeElement.getBoundingClientRect()
        )
      ) {
        this.removeCardById(moved.card.localId);
        this.removeCardById(other.card.localId);

        const loadingId = this.createCard('⏳', 'Loading', other.x, other.y, true);

        // TODO: delete waiting
        try {
          const card = await this.cardService.combineWords(moved.card.word, other.card.word);

          this.createCard(card.icon, card.word, other.x, other.y);
        } catch (error) {
          console.log(error);
          this.createCard('❌', 'ERROR', other.x, other.y);
        } finally {
          this.removeCardById(loadingId);
        }
      }
    }
  }

  private updatePlaygroundCardPosition(id: string, position: Point) {
    this.playGroundCards = this.playGroundCards.map((card) =>
      card.card.localId === id ? { ...card, x: position.x, y: position.y } : card
    );
  }

  private findPlayGroundCardById(id: string): PlaygroundCard | undefined {
    return this.playGroundCards.find((i) => i.card.localId === id);
  }

  private areCardsOverlapping(a: DOMRect, b: DOMRect) {
    return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
  }

  protected onDeleteItem(event: Event) {
    event.preventDefault();
    const target = event.target as HTMLDivElement;
    const card = target.closest('.item') as HTMLDivElement;
    const id: string | undefined = card.dataset['id'];

    if (!id) return;

    this.playGroundCards = this.playGroundCards.filter((item) => item.card.localId !== id);
  }

  protected removeCardById(id: string) {
    this.playGroundCards = this.playGroundCards.filter((card) => card.card.localId !== id);
  }

  protected createCard(
    icon: string,
    word: string,
    x: number,
    y: number,
    isLoading: boolean = false
  ): string {
    const localId = crypto.randomUUID();
    this.playGroundCards.push({
      card: { icon, word, localId },
      x,
      y,
      isLoading,
    });
    return localId;
  }
}
