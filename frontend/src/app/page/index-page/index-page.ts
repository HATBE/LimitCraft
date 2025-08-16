import { CdkDragEnd, CdkDragMove, DragDropModule, Point } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import PlaygroundCard from '../../model/PlaygroundCard';
import CardService from '../../service/CardService';
import SidebarCard from '../../model/SidebarCard';
import Card from '../../model/Card';

@Component({
  selector: 'app-index-page',
  imports: [CommonModule, DragDropModule],
  templateUrl: './index-page.html',
  styleUrl: './index-page.css',
})
export class IndexPage implements OnInit {
  @ViewChildren('dragElRef') dragEls!: QueryList<ElementRef<HTMLElement>>;
  @ViewChild('playgroundElRef', { static: true }) playgroundRef!: ElementRef<HTMLElement>;

  protected playGroundCards: PlaygroundCard[] = [];
  protected sidebarCards: SidebarCard[] = [];

  public constructor(private cardService: CardService) {}

  public ngOnInit() {
    this.createSideBarCard('💧', 'Water');
    this.createSideBarCard('🔥', 'Fire');
    this.createSideBarCard('🌬️', 'Wind');
    this.createSideBarCard('🌎', 'Earth');
  }

  protected onSidebarCardMoved(event: CdkDragMove<SidebarCard>) {
    // TODO: find center
    this.updateSidebarCardPosition(
      event.source.data.card.localId,
      event.pointerPosition.x,
      event.pointerPosition.y
    );
  }

  protected onSidebarCardDragEnded(event: CdkDragEnd<SidebarCard>) {
    event.source.reset();

    const card = (event.source.data as SidebarCard).card;

    this.createPlaygroundCard(
      card.icon,
      card.word,
      event.source.data.lastX,
      event.source.data.lastY
    );
  }

  protected onPlaygroundCardDragStarted(id: string) {
    const movedEl = this.dragEls.find((el) => el.nativeElement.dataset['id'] === id);
    if (!movedEl) return;
    movedEl.nativeElement.style.zIndex = '999';
  }

  protected async onPlaygroundCardDragEnded(event: CdkDragEnd, id: string) {
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

        const loadingId = this.createPlaygroundCard('⏳', 'Loading', other.x, other.y, true);

        try {
          const card = await this.cardService.combineWords(moved.card.word, other.card.word);

          this.createPlaygroundCard(card.icon, card.word, other.x, other.y);
        } catch (error) {
          console.log(error);
          this.createPlaygroundCard('❌', 'ERROR', other.x, other.y);
        } finally {
          this.removeCardById(loadingId);
        }
      }
    }
  }

  private isThisCardIntersectingWithAPlayGroundCard(card: Card) {}

  private updatePlaygroundCardPosition(id: string, position: Point) {
    this.playGroundCards = this.playGroundCards.map((card) =>
      card.card.localId === id ? { ...card, x: position.x, y: position.y } : card
    );
  }

  private updateSidebarCardPosition(id: string, x: number, y: number) {
    this.sidebarCards = this.sidebarCards.map((card) =>
      card.card.localId === id ? { ...card, lastX: x, lastY: y } : card
    );
  }

  private findPlayGroundCardById(id: string): PlaygroundCard | undefined {
    return this.playGroundCards.find((i) => i.card.localId === id);
  }

  private areCardsOverlapping(a: DOMRect, b: DOMRect) {
    return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
  }

  protected onPlaygroundCardDelete(event: Event) {
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

  protected createPlaygroundCard(
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

  protected createSideBarCard(icon: string, word: string): string {
    const localId = crypto.randomUUID();
    this.sidebarCards.push({ card: { icon, word, localId }, lastX: 0, lastY: 0 });
    return localId;
  }
}
