import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SearchBarComponent } from './search-bar.component';

describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchBarComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe emitir búsqueda después del debounce', fakeAsync(() => {
    const emitSpy = jest.spyOn(component.search, 'emit');

    component.onInput({ target: { value: 'test' } } as unknown as Event);
    expect(emitSpy).not.toHaveBeenCalled();

    tick(300);
    expect(emitSpy).toHaveBeenCalledWith('test');
  }));

  it('no debe emitir valores duplicados consecutivos', fakeAsync(() => {
    const emitSpy = jest.spyOn(component.search, 'emit');

    component.onInput({ target: { value: 'test' } } as unknown as Event);
    tick(300);

    component.onInput({ target: { value: 'test' } } as unknown as Event);
    tick(300);

    expect(emitSpy).toHaveBeenCalledTimes(1);
  }));

  it('debe renderizar el input', () => {
    const input = fixture.nativeElement.querySelector('input');
    expect(input).toBeTruthy();
    expect(input.placeholder).toBe('Buscar...');
  });
});