import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AskChatgptService {

  constructor(private http: HttpClient) { }

  askChatGPT(query: string) {
    return this.http.get(environment.BASE_API_URL+"chatgpt/?content=" + encodeURIComponent(query));
  }
}
