import { CdkDragEnd, CdkDragMove, DragDropModule, Point } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import PlaygroundCard from '../../model/PlaygroundCard';
import CardService from '../../service/CardService';
import SidebarCard from '../../model/SidebarCard';
import { take } from 'rxjs';

@Component({
  selector: 'app-index-page',
  imports: [CommonModule, DragDropModule],
  templateUrl: './index-page.html',
  styleUrl: './index-page.css',
})
export class IndexPage implements OnInit {
  @ViewChildren('dragElRef', { read: ElementRef }) dragEls!: QueryList<ElementRef<HTMLElement>>;
  @ViewChild('playgroundElRef', { static: true }) playgroundRef!: ElementRef<HTMLElement>;

  protected playGroundCards: PlaygroundCard[] = [];
  protected sidebarCards: SidebarCard[] = [];

  public constructor(
    private cardService: CardService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}

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

  protected async onSidebarCardDragEnded(event: CdkDragEnd<SidebarCard>) {
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
          (el) => el.nativeElement.dataset['id'] === created.card.localId
        );
        if (!cardEl) return;

        const intersecting = this.getIntersectingPlaygroundCard(created.card.localId, cardEl);
        if (!intersecting) return;

        const moved = this.findPlayGroundCardById(created.card.localId);
        if (moved) {
          this.matchCards(intersecting, moved);
        }
      });
    });
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

    const intersectingPlaygroundCard = this.getIntersectingPlaygroundCard(
      moved.card.localId,
      movedEl
    );

    if (!intersectingPlaygroundCard) return;

    await this.matchCards(intersectingPlaygroundCard, moved);
  }

  private async matchCards(intersectingPlaygroundCard: PlaygroundCard, moved: PlaygroundCard) {
    if (!intersectingPlaygroundCard) return;

    this.removeCardById(moved.card.localId);
    this.removeCardById(intersectingPlaygroundCard.card.localId);

    const loadingCard = this.createPlaygroundCard(
      '⏳',
      'Loading',
      intersectingPlaygroundCard.x,
      intersectingPlaygroundCard.y,
      true
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
      this.removeCardById(loadingCard.card.localId);
    }
  }

  private getIntersectingPlaygroundCard(
    movedId: string,
    cardEl: ElementRef<HTMLElement>
  ): PlaygroundCard | null {
    for (const otherEl of this.dragEls) {
      const other = this.findPlayGroundCardById(otherEl.nativeElement.dataset['id']!);

      if (!other) continue;

      if (movedId === other.card.localId) continue;

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
  ): PlaygroundCard {
    const card = {
      card: { icon, word, localId: crypto.randomUUID() },
      x,
      y,
      isLoading,
    };

    this.playGroundCards.push(card);
    return card;
  }

  protected createSideBarCard(icon: string, word: string): string {
    const localId = crypto.randomUUID();
    this.sidebarCards.push({ card: { icon, word, localId }, lastX: 0, lastY: 0 });
    return localId;
  }
}
