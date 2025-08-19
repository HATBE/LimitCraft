import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import CardService from '../../service/card.service';

@Component({
  selector: 'app-menu',
  imports: [CommonModule],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class MenuComponent {
  public constructor(private cardService: CardService) {}

  protected onCleanPlayground() {
    this.cardService.cleanPlaygroundCards();
  }
}
