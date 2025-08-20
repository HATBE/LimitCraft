import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { CdkDragEnd } from '@angular/cdk/drag-drop';
import CardService from '../../service/card.service';
import PlaygroundCard from '../../model/PlaygroundCard';
import { PlaygroundCardComponent } from './playground-card/playground-card';

@Component({
  selector: 'app-playground',
  standalone: true,
  imports: [CommonModule, PlaygroundCardComponent],
  templateUrl: './playground.html',
  styleUrl: './playground.css',
})
export class PlaygroundComponent implements AfterViewInit {
  @Input() getIntersectingPlaygroundCard!: (
    movedId: string,
    cardEl: ElementRef<HTMLElement>
  ) => PlaygroundCard | null;

  @Output() matchCards = new EventEmitter<{
    intersectingPlaygroundCard: PlaygroundCard;
    moved: PlaygroundCard;
  }>();

  @ViewChildren(PlaygroundCardComponent)
  private cardComponents!: QueryList<PlaygroundCardComponent>;

  @ViewChild('playgroundElRef', { static: true })
  private playgroundEl!: ElementRef<HTMLElement>;

  public constructor(private cardService: CardService) {}

  public ngAfterViewInit(): void {
    this.cardComponents.changes.subscribe(() => {});
  }

  public getPlaygroundElement(): ElementRef<HTMLElement> {
    return this.playgroundEl;
  }

  public getDragEls(): ElementRef<HTMLElement>[] {
    return this.cardComponents.toArray().map((c) => c.getDragEl());
  }

  public getCardComponents(): QueryList<PlaygroundCardComponent> {
    return this.cardComponents;
  }

  protected getPlaygroundCards(): PlaygroundCard[] {
    return this.cardService.getPlaygroundCards();
  }

  protected async onPlaygroundCardDragEnded(event: CdkDragEnd, id: string): Promise<void> {
    this.cardService.updatePlaygroundCardPosition(id, event.source.getFreeDragPosition());

    const movedEl = this.findDragElById(id);
    if (!movedEl) return;

    const moved = this.cardService.findPlaygroundCardById(id);
    if (!moved) return;

    const intersectingPlaygroundCard = this.getIntersectingPlaygroundCard(moved.localId, movedEl);

    if (!intersectingPlaygroundCard) return;

    this.matchCards.emit({ intersectingPlaygroundCard, moved });
  }

  protected onPlaygroundCardDragStarted(id: string): void {
    const movedEl = this.findDragElById(id);
    if (!movedEl) return;
  }

  private findDragElById(id: string): ElementRef<HTMLElement> | null {
    const card = this.cardComponents.find((card) => card.card.localId === id);
    return card ? card.getDragEl() : null;
  }
}
