import {fakeAsync, TestBed, tick} from "@angular/core/testing";
import {CurrencyService} from "./currency.service";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";

describe('CurrencyService', () => {
  let service: CurrencyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CurrencyService],
    });
    service = TestBed.inject(CurrencyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve currencies from the API', () => {
    const sourceCurrency = 'RUB';
    const targetCurrencies = 'USD,EUR,GBP';
    const mockResponse = {
      quotes: {
        USDRUB: 70.123,
        EURRUB: 80.456,
        GBPRUB: 90.789
      }
    };

    service.getCurrencies().subscribe((quotes: any) => {
      expect(quotes).toEqual(mockResponse.quotes);
    });


    const req = httpMock.expectOne(`${service['apiUrl']}?source=${sourceCurrency}&currencies=${targetCurrencies}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle API error', () => {
    const sourceCurrency = 'RUB';
    const targetCurrency = 'USD';

    let error: any;

    service.getCurrencyRate(targetCurrency).subscribe({
      error: (err) => {
        error = err;
      },
    });

    const req = httpMock.expectOne(`${service['apiUrl']}?source=${sourceCurrency}&currencies=${targetCurrency}`);
    req.error(new ErrorEvent('API error'));

    expect(error).toBeDefined();
  });

});
