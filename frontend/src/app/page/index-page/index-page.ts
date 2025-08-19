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
import { SidebarComponent } from '../../components/sidebar/sidebar';
import Card from '../../model/Card';
import { MenuComponent } from '../../components/menu/menu';

@Component({
  selector: 'app-index-page',
  imports: [
    CommonModule,
    DragDropModule,
    ZIndexOnCardDragDirective,
    SidebarComponent,
    MenuComponent,
  ],
  templateUrl: './index-page.html',
  styleUrl: './index-page.css',
})
export class IndexPage implements OnInit {
  @ViewChildren('dragElRef', { read: ElementRef }) dragEls!: QueryList<ElementRef<HTMLElement>>;
  @ViewChild('playgroundElRef', { static: true }) playgroundRef!: ElementRef<HTMLElement>;

  public constructor(private cardService: CardService, private cdr: ChangeDetectorRef) {}

  public async ngOnInit(): Promise<void> {
    this.cardService.initPlaygroundCards();
  }

  protected onCleanPlayground() {
    this.cardService.cleanPlaygroundCards();
  }

  protected getPlaygroundCards(): PlaygroundCard[] {
    return this.cardService.getPlaygroundCards();
  }

  protected async onSidebarCardDragEnded(event: CdkDragEnd<SidebarCard>): Promise<void> {
    event.source.reset();

    const { card: evtCard, lastX, lastY } = event.source.data as SidebarCard;

    const rect = this.playgroundRef.nativeElement.getBoundingClientRect();
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

    console.log(moved);

    const intersectingPlaygroundCard = this.getIntersectingPlaygroundCard(moved.localId, movedEl);

    if (!intersectingPlaygroundCard) return;

    await this.matchCards(intersectingPlaygroundCard, moved);
  }

  private async matchCards(
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
    this.cardService.updatePlaygroundCardPosition(id, position);
  }

  private findPlayGroundCardById(id: string) {
    return this.cardService.findPlaygroundCardById(id);
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

    this.cardService.deletePlaygroundCardById(id);
  }

  protected onDoubleClickSidebarCard(card: SidebarCard): void {
    this.cardService.createPlaygroundCard(
      card.card.id,
      card.card.icon,
      card.card.word,
      50 + Math.floor(Math.random() * this.playgroundRef.nativeElement.clientWidth - 200) + 1,
      50 + Math.floor(Math.random() * this.playgroundRef.nativeElement.clientHeight - 100) + 1,
      false
    );
  }

  protected onDoubleClickPlaygroundCard(card: PlaygroundCard): void {
    this.cardService.createPlaygroundCard(
      card.card.id,
      card.card.icon,
      card.card.word,
      card.x + 20,
      card.y + 20,
      false
    );
  }
}
