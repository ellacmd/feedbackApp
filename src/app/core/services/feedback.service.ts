import { Injectable } from '@angular/core';
import { environment } from '../../../environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetFeedbackResponse } from '../../types/feedback';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  baseurl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getFeedbackData(): Observable<GetFeedbackResponse> {
    return this.http.get<GetFeedbackResponse>(
      `${this.baseurl}product-requests`
    );
  }
}
