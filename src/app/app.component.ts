import { Component, OnInit, OnDestroy } from '@angular/core';
import { CurrencyService } from './services/currency.service';
import { Currency } from './models/currency';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  currencies: Currency[] = [];
  currentTime: string = '';
  currentDate: string = '';
  selectedCurrency: string = '';
  currencyValue: string = '';
  showSelect: boolean = false;
  currencyUpdateSubscription: Subscription | undefined;
  dropdownCurrencies: string[] = ['CNY', 'JPY', 'TRY'];

  constructor(private currencyService: CurrencyService) {}

  ngOnInit() {
    this.getCurrencies();
    this.startDateTimeUpdates();
  }

  getCurrencies() {
    this.currencyService.getCurrencies().subscribe(quotes => {
      this.currencies = Object.keys(quotes).map(code => ({
        code: code.slice(3),
        rate: quotes[code],
      }));
    });
  }

  startDateTimeUpdates() {
    setInterval(() => {
      const now = new Date();
      this.currentTime = now.toLocaleTimeString();
      this.currentDate = now.toLocaleDateString();
    }, 1000);
  }

  addCurrency() {
    if (!this.showSelect) {
      this.showSelect = true;
    } else {
      if (this.selectedCurrency && !this.currencies.some(currency => currency.code === this.selectedCurrency)) {
        const currency: Currency = {
          code: this.selectedCurrency,
          rate: 0,
          diff: 0
        };
        this.currencies.push(currency);


        const index = this.dropdownCurrencies.indexOf(this.selectedCurrency);
        if (index !== -1) {
          this.dropdownCurrencies.splice(index, 1);
        }

        // Получение курса валюты
        this.currencyService.getCurrencyRate(currency.code).subscribe(rate => {
          if (rate !== null && !isNaN(+rate)) {
            currency.rate = +rate;
          } else {
            currency.rate = 0;
          }
        });

        // Запускаем обновление курса валюты
        this.startCurrencyUpdates();
      }
      this.showSelect = false;
    }
  }


  startCurrencyUpdates() {
    if (!this.currencyUpdateSubscription) {
      this.currencyUpdateSubscription = interval(5000).subscribe(() => {
        this.updateCurrencyRates();
      });
      this.updateCurrencyRates();
    }
  }



  updateCurrencyRates() {
    this.currencies.forEach(currency => {
      const previousRate = currency.rate; // Сохраняем предыдущий курс
      this.currencyService.getCurrencyRate(currency.code).subscribe(rate => {
        const currentRate = +rate || 0; // Текущий курс
        currency.diff = currentRate - previousRate;
        currency.rate = currentRate; // Обновляем текущий курс
      });
    });
  }

}
