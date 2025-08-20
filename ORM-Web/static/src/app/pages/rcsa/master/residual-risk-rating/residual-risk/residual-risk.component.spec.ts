import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidualRiskComponent } from './residual-risk.component';

describe('ResidualRiskComponent', () => {
  let component: ResidualRiskComponent;
  let fixture: ComponentFixture<ResidualRiskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResidualRiskComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResidualRiskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
