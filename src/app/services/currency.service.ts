import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private apiUrl = 'https://api.apilayer.com/currency_data/live';
  private apiKey = '5UPBETP2rd5YFNOmcnFAXRy7JGsFt1FK';

  constructor(private http: HttpClient) { }

  getCurrencies() {
    const sourceCurrency = 'RUB';
    const targetCurrencies = 'USD,EUR,GBP';

    const headers = new HttpHeaders().set('apikey', this.apiKey);
    const options = { headers: headers };

    return this.http.get<any>(`${this.apiUrl}?source=${sourceCurrency}&currencies=${targetCurrencies}`, options)
      .pipe(
        map(response => response.quotes)
      );
  }

  getCurrencyRate(code: string) {
    const sourceCurrency = 'RUB';
    const targetCurrency = code;

    const headers = new HttpHeaders().set('apikey', this.apiKey);
    const options = { headers: headers };

    return this.http.get<any>(`${this.apiUrl}?source=${sourceCurrency}&currencies=${targetCurrency}`, options)
      .pipe(
        map(response => response.quotes[`${sourceCurrency}${targetCurrency}`])
      );
  }


}
