import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BaselayoutComponent } from './baselayout.component';
import { MatMenuModule } from '@angular/material/menu';
import { BaselayoutService } from '../../services/baselayout.service';


// Mock the BaselayoutService
class MockBaselayoutService {
  // Provide mock methods if required by the component
}

describe('BaselayoutComponent', () => {
  let component: BaselayoutComponent;
  let fixture: ComponentFixture<BaselayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaselayoutComponent ],
      imports: [ 
        HttpClientTestingModule, 
        MatMenuModule 
      ],
      providers: [
        { provide: BaselayoutService, useClass: MockBaselayoutService }  // <-- Provide the mock service
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
