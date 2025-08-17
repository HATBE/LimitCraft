import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaygroundBoard } from './playground-board';

describe('PlaygroundBoard', () => {
  let component: PlaygroundBoard;
  let fixture: ComponentFixture<PlaygroundBoard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaygroundBoard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaygroundBoard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
