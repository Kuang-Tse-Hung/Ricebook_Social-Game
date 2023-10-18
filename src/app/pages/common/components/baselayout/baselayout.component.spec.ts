import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BaselayoutComponent } from './baselayout.component';
import { MatMenuModule } from '@angular/material/menu';

describe('BaselayoutComponent', () => {
  let component: BaselayoutComponent;
  let fixture: ComponentFixture<BaselayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaselayoutComponent ],
      imports: [ 
        HttpClientTestingModule, 
        MatMenuModule  // <-- Add this line for MatMenuModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaselayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should logoutstate', () => {
    component.logout();
    expect(component.LoggedOutState).toBeTrue();
  });
});
