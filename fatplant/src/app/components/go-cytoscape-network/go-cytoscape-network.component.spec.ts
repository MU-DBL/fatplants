import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoCytoscapeNetworkComponent } from './go-cytoscape-network.component';

describe('GoCytoscapeNetworkComponent', () => {
  let component: GoCytoscapeNetworkComponent;
  let fixture: ComponentFixture<GoCytoscapeNetworkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoCytoscapeNetworkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoCytoscapeNetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
