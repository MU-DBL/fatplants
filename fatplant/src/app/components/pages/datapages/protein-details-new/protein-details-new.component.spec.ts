import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProteinDetailsNewComponent } from './protein-details-new.component';

describe('ProteinDetailsNewComponent', () => {
  let component: ProteinDetailsNewComponent;
  let fixture: ComponentFixture<ProteinDetailsNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProteinDetailsNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProteinDetailsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
