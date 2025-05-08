import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { VisitorAnalyticsService } from './visitor-analytics.service';

describe('VisitorAnalyticsService', () => {
  let service: VisitorAnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(VisitorAnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
}); 