import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderItemEditorComponent } from './order-item-editor.component';

describe('OrderItemEditorComponent', () => {
  let component: OrderItemEditorComponent;
  let fixture: ComponentFixture<OrderItemEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderItemEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderItemEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
