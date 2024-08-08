import { TestBed } from '@angular/core/testing';

import { FirestoreConnectionService } from '../firestore-access/firestore-connection.service';

describe('FirestoreConnectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FirestoreConnectionService = TestBed.get(FirestoreConnectionService);
    expect(service).toBeTruthy();
  });
});
