import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetsNewComponent } from './datasets-new.component';

describe('DatasetsNewComponent', () => {
  let component: DatasetsNewComponent;
  let fixture: ComponentFixture<DatasetsNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatasetsNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
