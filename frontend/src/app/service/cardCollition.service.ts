import { ElementRef, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export default class CardCollisionService {
  private registry = new Map<string, ElementRef<HTMLElement>>();
  private boundary?: ElementRef<HTMLElement>;

  public setBoundaryEl(element: ElementRef<HTMLElement>) {
    this.boundary = element;
  }

  public register(id: string) {}
}
