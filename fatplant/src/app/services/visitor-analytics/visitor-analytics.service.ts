import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface MonthlyVisitor {
  month_id: number; // 1-12
  hits: number;
}

export interface LocationVisitor {
  country: string;
  city: string;
  hits: number;
}

@Injectable({
  providedIn: 'root'
})
export class VisitorAnalyticsService {

  constructor(private http: HttpClient) { }

getMonthlyVisitors(): Observable<MonthlyVisitor[]> {
  return this.http.get<MonthlyVisitor[]>(`${environment.BASE_API_URL}visitor/monthly-hits`)
    .pipe(
      catchError(this.handleError<MonthlyVisitor[]>('getMonthlyVisitors', []))
    );
}

  getLocationVisitors(): Observable<LocationVisitor[]> {
    return this.http.get<LocationVisitor[]>(`${environment.BASE_API_URL}visitor/location-hits`)
      .pipe(
        catchError(this.handleError<LocationVisitor[]>('getLocationVisitors', []))
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