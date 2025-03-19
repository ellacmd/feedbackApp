import { Injectable } from '@angular/core';
import { environment } from '../../../environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import {
  Feedback,
  GetFeedbackResponse,
  GetSingleFeedbackResponse,
} from '../../types/feedback';
import { AuthService } from './auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  baseUrl = environment.apiUrl;
  private feedbackSubject = new BehaviorSubject<GetFeedbackResponse | null>(
    null
  );
  feedbackData$ = this.feedbackSubject.asObservable();
  private user: { token: string } | null = null;

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) {
    this.authService.user$.subscribe((user) => {
      this.user = user;
    });
  }
  private getAuthHeaders(): { headers: HttpHeaders } {
    if (!this.user) throw new Error('User not authenticated');
    return {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this.user.token}`
      ),
    };
  }

  getFeedbackData(): Observable<GetFeedbackResponse> {
    return this.http
      .get<GetFeedbackResponse>(`${this.baseUrl}product-requests`)
      .pipe(tap((response) => this.feedbackSubject.next(response)));
  }

  refreshFeedback(): void {
    this.getFeedbackData().subscribe();
  }

  getSingleFeedback(id: string): Observable<GetSingleFeedbackResponse> {
    return this.http.get<GetSingleFeedbackResponse>(
      `${this.baseUrl}product-requests/${id}`
    );
  }

  postComment(comment: string, productRequest: string, replyingTo?: string) {
    return this.http.post(
      `${this.baseUrl}comments`,
      {
        content: comment,
        productRequest,
        replyingTo,
      },
      this.getAuthHeaders()
    );
  }

  addFeedback(
    title: string,
    category: string,
    description: string,
    status: string
  ) {
    return this.http.post(
      `${this.baseUrl}product-requests`,
      {
        title,
        category,
        description,
        status,
      },
      this.getAuthHeaders()
    );
  }

  editFeedback(
    title: string,
    category: string,
    description: string,
    status: string,
    feedbackId:string
  ) {
    return this.http.post(
      `${this.baseUrl}product-requests`,
      {
        title,
        category,
        description,
        status,
      },
      this.getAuthHeaders()
    );
  }

  updateFeedback(status: string, id: string) {
    return this.http.put(
      `${this.baseUrl}product-requests/${id}`,
      {
        status,
      },
      this.getAuthHeaders()
    );
  }

  toggleUpvote(feedbackId: string): Observable<GetSingleFeedbackResponse> {
    return this.http
      .patch<GetSingleFeedbackResponse>(
        `${this.baseUrl}product-requests/${feedbackId}/upvote`,
        {},
        this.getAuthHeaders()
      )
      .pipe(
        tap(({productRequest}) => {
          if (productRequest) {
            this.updateFeedbackInState(productRequest);
          }
        })
      );
  }

  private updateFeedbackInState(updatedRequest: Feedback) {
    const currentState = this.feedbackSubject.value;
    if (!currentState) return;

    const index = currentState.productRequests.findIndex(
      (req) =>  req.id === updatedRequest.id
    );

    if (index !== -1) {
      const updatedRequests = [...currentState.productRequests];
      updatedRequests[index] = {
        ...updatedRequests[index],
        upvotes: updatedRequest.upvotes,
        upvotedBy: updatedRequest.upvotedBy,
      };

      this.feedbackSubject.next({
        ...currentState,
        productRequests: updatedRequests,
      });
    }
  }
}
