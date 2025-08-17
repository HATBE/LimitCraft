import { CdkDragEnd, CdkDragMove, DragDropModule, Point } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import PlaygroundCard from '../../model/PlaygroundCard';
import CardService from '../../service/card.service';
import SidebarCard from '../../model/SidebarCard';
import ZIndexOnCardDragDirective from '../../directive/ZIndexOnCardDrag.directive';

@Component({
  selector: 'app-index-page',
  imports: [CommonModule, DragDropModule, ZIndexOnCardDragDirective],
  templateUrl: './index-page.html',
  styleUrl: './index-page.css',
})
export class IndexPage implements OnInit {
  @ViewChildren('dragElRef', { read: ElementRef }) dragEls!: QueryList<ElementRef<HTMLElement>>;
  @ViewChild('playgroundElRef', { static: true }) playgroundRef!: ElementRef<HTMLElement>;

  protected playGroundCards: PlaygroundCard[] = [];
  protected sidebarCards: SidebarCard[] = [];

  public constructor(private cardService: CardService, private cdr: ChangeDetectorRef) {}

  public ngOnInit(): void {
    this.createSideBarCard('💧', 'Water');
    this.createSideBarCard('🔥', 'Fire');
    this.createSideBarCard('🌬️', 'Wind');
    this.createSideBarCard('🌎', 'Earth');
  }

  protected onSidebarCardMoved(event: CdkDragMove<SidebarCard>): void {
    this.updateSidebarCardPosition(
      event.source.data.localId,
      event.pointerPosition.x,
      event.pointerPosition.y
    );
  }

  protected async onSidebarCardDragEnded(event: CdkDragEnd<SidebarCard>): Promise<void> {
    event.source.reset();

    const { card: evtCard, lastX, lastY } = event.source.data as SidebarCard;

    const rect = this.playgroundRef.nativeElement.getBoundingClientRect();
    let x = lastX - rect.left;
    let y = lastY - rect.top;

    x = Math.max(0, Math.min(x, rect.width));
    y = Math.max(0, Math.min(y, rect.height));

    const created = this.createPlaygroundCard(evtCard.icon, evtCard.word, x, y);

    this.cdr.detectChanges();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const cardEl = this.dragEls.find(
          (el) => el.nativeElement.dataset['id'] === created.localId
        );
        if (!cardEl) return;

        const intersecting = this.getIntersectingPlaygroundCard(created.localId, cardEl);
        if (!intersecting) return;

        const moved = this.findPlayGroundCardById(created.localId);
        if (moved) {
          this.matchCards(intersecting, moved);
        }
      });
    });
  }

  protected onPlaygroundCardDragStarted(id: string): void {
    const movedEl = this.dragEls.find((el) => el.nativeElement.dataset['id'] === id);
    if (!movedEl) return;
  }

  protected async onPlaygroundCardDragEnded(event: CdkDragEnd, id: string): Promise<void> {
    this.updatePlaygroundCardPosition(id, event.source.getFreeDragPosition());

    const movedEl = this.dragEls.find((el) => el.nativeElement.dataset['id'] === id);
    if (!movedEl) return;

    const moved = this.findPlayGroundCardById(movedEl.nativeElement.dataset['id']!);

    if (!moved) return;

    const intersectingPlaygroundCard = this.getIntersectingPlaygroundCard(moved.localId, movedEl);

    if (!intersectingPlaygroundCard) return;

    await this.matchCards(intersectingPlaygroundCard, moved);
  }

  private async matchCards(
    intersectingPlaygroundCard: PlaygroundCard,
    moved: PlaygroundCard
  ): Promise<void> {
    if (!intersectingPlaygroundCard) return;

    this.removeCardById(moved.localId);
    this.removeCardById(intersectingPlaygroundCard.localId);

    const loadingCard = this.createLoadingPlaygroundCard(
      intersectingPlaygroundCard.x,
      intersectingPlaygroundCard.y
    );

    try {
      const card = await this.cardService.combineWords(
        moved.card.word,
        intersectingPlaygroundCard.card.word
      );

      this.createPlaygroundCard(
        card.icon,
        card.word,
        intersectingPlaygroundCard.x,
        intersectingPlaygroundCard.y
      );
      this.createSideBarCard(card.icon, card.word);
    } catch (error) {
      console.log(error);
      this.createPlaygroundCard(
        '❌',
        'ERROR',
        intersectingPlaygroundCard.x,
        intersectingPlaygroundCard.y
      );
    } finally {
      this.removeCardById(loadingCard.localId);
    }
  }

  private createLoadingPlaygroundCard(x: number, y: number): PlaygroundCard {
    return this.createPlaygroundCard('⏳', 'Loading', x, y, true);
  }

  private getIntersectingPlaygroundCard(
    movedId: string,
    cardEl: ElementRef<HTMLElement>
  ): PlaygroundCard | null {
    for (const otherEl of this.dragEls) {
      const other = this.findPlayGroundCardById(otherEl.nativeElement.dataset['id']!);
      if (!other) continue;

      if (movedId === other.localId) continue;

      if (other.isLoading) continue;

      if (
        this.areCardsOverlapping(
          otherEl.nativeElement.getBoundingClientRect(),
          cardEl.nativeElement.getBoundingClientRect()
        )
      ) {
        return other;
      }
    }
    return null;
  }

  private updatePlaygroundCardPosition(id: string, position: Point): void {
    this.playGroundCards = this.playGroundCards.map((card) =>
      card.localId === id ? { ...card, x: position.x, y: position.y } : card
    );
  }

  private updateSidebarCardPosition(id: string, x: number, y: number): void {
    this.sidebarCards = this.sidebarCards.map((card) =>
      card.localId === id ? { ...card, lastX: x, lastY: y } : card
    );
  }

  private findPlayGroundCardById(id: string): PlaygroundCard | undefined {
    return this.playGroundCards.find((i) => i.localId === id);
  }

  private areCardsOverlapping(a: DOMRect, b: DOMRect): boolean {
    return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
  }

  protected onPlaygroundCardDelete(event: Event): void {
    event.preventDefault();
    const target = event.target as HTMLDivElement;
    const card = target.closest('.item') as HTMLDivElement;

    const id: string | undefined = card.dataset['id'];

    if (!id) return;

    if (this.findPlayGroundCardById(id)?.isLoading) {
      return;
    }

    this.playGroundCards = this.playGroundCards.filter((item) => item.localId !== id);
  }

  protected removeCardById(id: string): void {
    this.playGroundCards = this.playGroundCards.filter((card) => card.localId !== id);
  }

  protected createPlaygroundCard(
    icon: string,
    word: string,
    x: number,
    y: number,
    isLoading: boolean = false
  ): PlaygroundCard {
    const card = {
      card: { icon, word, id: '-1' },
      localId: crypto.randomUUID(),
      x,
      y,
      isLoading,
    };

    this.playGroundCards.push(card);
    return card;
  }

  protected createSideBarCard(icon: string, word: string): SidebarCard | null {
    for (const card of this.sidebarCards) {
      if (card.card.word === word) {
        return null;
      }
    }

    const sidebarCard = {
      card: { icon, word, id: '-1' },
      localId: crypto.randomUUID(),
      lastX: 0,
      lastY: 0,
    };
    this.sidebarCards.push(sidebarCard);
    return sidebarCard;
  }
}
