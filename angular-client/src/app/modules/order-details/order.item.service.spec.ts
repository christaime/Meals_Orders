import { TestBed } from '@angular/core/testing';

import { Order.ItemService } from './order.item.service';

describe('Order.ItemService', () => {
  let service: Order.ItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Order.ItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
