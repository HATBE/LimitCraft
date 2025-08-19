import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import ZIndexOnCardDragDirective from '../../directive/ZIndexOnCardDrag.directive';
import { CdkDragEnd, DragDropModule } from '@angular/cdk/drag-drop';
import CardService from '../../service/card.service';
import PlaygroundCard from '../../model/PlaygroundCard';

@Component({
  selector: 'app-playground',
  imports: [CommonModule, ZIndexOnCardDragDirective, DragDropModule],
  templateUrl: './playground.html',
  styleUrl: './playground.css',
})
export class PlaygroundComponent {
  @Input() getIntersectingPlaygroundCard!: (
    movedId: string,
    cardEl: ElementRef<HTMLElement>
  ) => PlaygroundCard | null;

  @Output() matchCards = new EventEmitter<{
    intersectingPlaygroundCard: PlaygroundCard;
    moved: PlaygroundCard;
  }>();

  @ViewChildren('dragElRef', { read: ElementRef })
  dragEls!: QueryList<ElementRef<HTMLElement>>;
  @ViewChild('playgroundElRef', { static: true }) playgroundEl!: ElementRef<HTMLElement>;

  public constructor(private cardService: CardService) {}

  public getPlaygroundElement(): ElementRef<HTMLElement> {
    return this.playgroundEl;
  }

  public getDragEls(): QueryList<ElementRef<HTMLElement>> {
    return this.dragEls;
  }

  protected getPlaygroundCards(): PlaygroundCard[] {
    return this.cardService.getPlaygroundCards();
  }

  protected onPlaygroundCardDelete(event: Event): void {
    event.preventDefault();
    const target = event.target as HTMLDivElement;
    const card = target.closest('.item') as HTMLDivElement;

    const id: string | undefined = card.dataset['id'];

    if (!id) return;

    if (this.cardService.findPlaygroundCardById(id)?.isLoading) {
      return;
    }

    this.cardService.deletePlaygroundCardById(id);
  }

  protected async onPlaygroundCardDragEnded(event: CdkDragEnd, id: string): Promise<void> {
    this.cardService.updatePlaygroundCardPosition(id, event.source.getFreeDragPosition());

    const movedEl = this.getDragEls().find((el) => el.nativeElement.dataset['id'] === id);
    if (!movedEl) return;

    const moved = this.cardService.findPlaygroundCardById(movedEl.nativeElement.dataset['id']!);
    if (!moved) return;

    console.log(moved);

    const intersectingPlaygroundCard = this.getIntersectingPlaygroundCard(moved.localId, movedEl);

    if (!intersectingPlaygroundCard) return;

    await this.matchCards.emit({ intersectingPlaygroundCard, moved });
  }

  protected onPlaygroundCardDragStarted(id: string): void {
    const movedEl = this.getDragEls().find((el) => el.nativeElement.dataset['id'] === id);
    if (!movedEl) return;
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
