import { Injectable } from '@angular/core';
import { environment } from '../../../environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Feedback,
  GetFeedbackResponse,
  GetSingleFeedbackResponse,
} from '../../types/feedback';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getFeedbackData(): Observable<GetFeedbackResponse> {
    return this.http.get<GetFeedbackResponse>(
      `${this.baseUrl}product-requests`
    );
  }

  getSingleFeedback(id: string): Observable<GetSingleFeedbackResponse> {
    return this.http.get<GetSingleFeedbackResponse>(
      `${this.baseUrl}product-requests/${id}`
    );
  }

  postComment(comment: string, productRequest: string, replyingTo?: string) {
    const user = JSON.parse(localStorage.getItem('userData') || '{}');
    const header = new HttpHeaders().set(
      'Authorization',
      `Bearer ${user.token}`
    );
    const headers = { headers: header };
    return this.http.post(
      `${this.baseUrl}comments`,
      {
        content: comment,
        productRequest,
        replyingTo,
      },
      headers
    );
  }

  addFeedback(
    title: string,
    category: string,
    description: string,
    status: string
  ) {
    const user = JSON.parse(localStorage.getItem('userData') || '{}');
    const header = new HttpHeaders().set(
      'Authorization',
      `Bearer ${user.token}`
    );
    const headers = { headers: header };
    return this.http.post(
      `${this.baseUrl}product-requests`,
      {
        title,
        category,
        description,
        status,
      },
      headers
    );
  }
}
