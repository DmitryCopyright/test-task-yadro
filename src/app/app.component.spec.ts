import {ComponentFixture, TestBed, tick, fakeAsync, flush} from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppComponent } from './app.component';
import { CurrencyService } from './services/currency.service';
import {of} from "rxjs";
import {FormsModule} from "@angular/forms";

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let currencyService: CurrencyService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [HttpClientTestingModule,FormsModule],
      providers: [CurrencyService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    currencyService = TestBed.inject(CurrencyService); // Получение инстанса CurrencyService через TestBed
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should display current date and time', () => {
    fixture.detectChanges();
    const currentDateElement = fixture.nativeElement.querySelector('.current-date');
    const currentTimeElement = fixture.nativeElement.querySelector('.current-time');

    expect(currentDateElement.textContent).toContain(component.currentDate);
    expect(currentTimeElement.textContent).toContain(component.currentTime);
  });


  it('should call getCurrencyRate when adding a new currency', fakeAsync(() => {
    spyOn(currencyService, 'getCurrencyRate').and.returnValue(of(1));

    component.selectedCurrency = 'CNY'; // Устанавливаем выбранную валюту
    component.addCurrency(); // Вызываем метод добавления валюты

    fixture.whenStable().then(() => {
      expect(currencyService.getCurrencyRate).toHaveBeenCalledWith('CNY');
    });

    tick(5000); // Ждем 5 секунд, чтобы сработало обновление курсов валют

    fixture.detectChanges(); // Обновляем представление компонента
  }));



});
