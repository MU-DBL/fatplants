import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigatorNewComponent } from './investigatorNew.component';

describe('InvestigatorComponent', () => {
  let component: InvestigatorNewComponent;
  let fixture: ComponentFixture<InvestigatorNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestigatorNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestigatorNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
