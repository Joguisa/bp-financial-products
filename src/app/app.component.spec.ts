import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterModule.forRoot([])]
    }).compileComponents();
  });

  it('debe crear la aplicación', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('debe renderizar el header con título BANCO', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const header = fixture.nativeElement.querySelector('.main-header h1');
    expect(header.textContent).toContain('BANCO');
  });

  it('debe renderizar el router-outlet', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const outlet = fixture.nativeElement.querySelector('router-outlet');
    expect(outlet).toBeTruthy();
  });

  it('debe renderizar el componente de toast', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const toast = fixture.nativeElement.querySelector('bp-toast');
    expect(toast).toBeTruthy();
  });
});