import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-playground-board',
  imports: [CommonModule, DragDropModule],
  templateUrl: './playground-board.html',
  styleUrl: './playground-board.css',
})
export class PlaygroundBoard {}
