import { CdkDragEnd, CdkDragMove, DragDropModule, Point } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import PlaygroundCard from '../../model/PlaygroundCard';
import CardService from '../../service/card.service';
import SidebarCard from '../../model/SidebarCard';
import { SidebarComponent } from '../../components/sidebar/sidebar';
import { MenuComponent } from '../../components/menu/menu';
import { PlaygroundComponent } from '../../components/playground/playground';

@Component({
  selector: 'app-index-page',
  imports: [CommonModule, DragDropModule, PlaygroundComponent, SidebarComponent, MenuComponent],
  templateUrl: './index-page.html',
  styleUrl: './index-page.css',
})
export class IndexPage implements OnInit {
  @ViewChild(PlaygroundComponent, { static: true }) playgroundRef!: PlaygroundComponent;

  public constructor(private cardService: CardService, private cdr: ChangeDetectorRef) {}

  public async ngOnInit(): Promise<void> {
    this.cardService.initPlaygroundCards();
  }

  protected async onSidebarCardDragEnded(event: CdkDragEnd<SidebarCard>): Promise<void> {
    event.source.reset();

    const { card: evtCard, lastX, lastY } = event.source.data as SidebarCard;

    const rect = this.playgroundRef.getPlaygroundElement().nativeElement.getBoundingClientRect();
    let x = lastX - rect.left;
    let y = lastY - rect.top;

    x = Math.max(0, Math.min(x, rect.width));
    y = Math.max(0, Math.min(y, rect.height));

    const created = this.cardService.createPlaygroundCard(
      evtCard.id,
      evtCard.icon,
      evtCard.word,
      x,
      y
    );

    this.cdr.detectChanges();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const cardEl = this.playgroundRef
          .getDragEls()
          .find((el) => el.nativeElement.dataset['id'] === created.localId);
        if (!cardEl) return;

        const intersecting = this.getIntersectingPlaygroundCard(created.localId, cardEl);
        if (!intersecting) return;

        const moved = this.cardService.findPlaygroundCardById(created.localId);
        if (moved) {
          this.matchCards(intersecting, moved);
        }
      });
    });
  }

  protected async matchCards(
    intersectingPlaygroundCard: PlaygroundCard,
    moved: PlaygroundCard
  ): Promise<void> {
    if (!intersectingPlaygroundCard) return;

    this.cardService.deletePlaygroundCardById(moved.localId);
    this.cardService.deletePlaygroundCardById(intersectingPlaygroundCard.localId);

    const loadingCard = this.createLoadingPlaygroundCard(
      intersectingPlaygroundCard.x,
      intersectingPlaygroundCard.y
    );

    try {
      const card = await this.cardService.combineWords(
        moved.card.id,
        intersectingPlaygroundCard.card.id
      );

      this.cardService.createPlaygroundCard(
        card.id,
        card.icon,
        card.word,
        intersectingPlaygroundCard.x,
        intersectingPlaygroundCard.y
      );
      this.cardService.createSidebarCard(card.id, card.icon, card.word);
    } catch (error) {
      console.error(error);
      this.cardService.createPlaygroundCard(
        '-1',
        '❌',
        'ERROR',
        intersectingPlaygroundCard.x,
        intersectingPlaygroundCard.y,
        true
      );
    } finally {
      this.cardService.deletePlaygroundCardById(loadingCard.localId);
    }
  }

  private createLoadingPlaygroundCard(x: number, y: number): PlaygroundCard {
    return this.cardService.createPlaygroundCard('-1', '⏳', 'Loading', x, y, true);
  }

  protected getIntersectingPlaygroundCard(
    movedId: string,
    cardEl: ElementRef<HTMLElement>
  ): PlaygroundCard | null {
    for (const otherEl of this.playgroundRef.getDragEls()) {
      const other = this.cardService.findPlaygroundCardById(otherEl.nativeElement.dataset['id']!);
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

  private areCardsOverlapping(a: DOMRect, b: DOMRect): boolean {
    return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
  }

  protected onDoubleClickSidebarCard(card: SidebarCard): void {
    this.cardService.createPlaygroundCard(
      card.card.id,
      card.card.icon,
      card.card.word,
      50 +
        Math.floor(
          Math.random() * this.playgroundRef.getPlaygroundElement().nativeElement.clientWidth - 200
        ) +
        1,
      50 +
        Math.floor(
          Math.random() * this.playgroundRef.getPlaygroundElement().nativeElement.clientHeight - 100
        ) +
        1,
      false
    );
  }
}
