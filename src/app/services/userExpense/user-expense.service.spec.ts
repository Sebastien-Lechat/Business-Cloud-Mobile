import { TestBed } from '@angular/core/testing';

import { UserExpenseService } from './user-expense.service';

describe('UserExpenseService', () => {
  let service: UserExpenseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserExpenseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
