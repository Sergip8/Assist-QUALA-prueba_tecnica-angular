import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SucursalesListComponent } from './sucursales-list.component';

describe('SucursalesListComponent', () => {
  let component: SucursalesListComponent;
  let fixture: ComponentFixture<SucursalesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SucursalesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SucursalesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
