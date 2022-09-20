import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoicesDialogComponent } from './choices-dialog.component';

describe('ChoicesDialogComponent', () => {
  let component: ChoicesDialogComponent;
  let fixture: ComponentFixture<ChoicesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChoicesDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChoicesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
