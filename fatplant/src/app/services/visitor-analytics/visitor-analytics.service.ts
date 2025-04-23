import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface MonthlyVisitor {
  month: string;
  count: number;
}

export interface CountryVisitor {
  name: string;
  count: number;
  path?: string;
  code: string;
}

@Injectable({
  providedIn: 'root'
})
export class VisitorAnalyticsService {

  constructor(private http: HttpClient) { }

  getMonthlyVisitors(months: number = 12): Observable<MonthlyVisitor[]> {
    return this.http.get<MonthlyVisitor[]>(`${environment.BASE_API_URL}analytics/monthly?months=${months}`)
      .pipe(
        catchError(this.handleError<MonthlyVisitor[]>('getMonthlyVisitors', []))
      );
  }

  getCountryVisitors(months: number = 12): Observable<CountryVisitor[]> {
    return this.http.get<CountryVisitor[]>(`${environment.BASE_API_URL}analytics/countries?months=${months}`)
      .pipe(
        catchError(this.handleError<CountryVisitor[]>('getCountryVisitors', []))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result
      return of(result as T);
    };
  }
} 