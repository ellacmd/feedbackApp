import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BehaviorSubject, finalize } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  Feedback,
  GetFeedbackResponse,
  sortCriteria,
} from '../../types/feedback';
import { FeedbackCardComponent } from '../../shared/feedback-card/feedback-card.component';
import { FeedbackService } from '../../core/services/feedback.service';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { AuthResponse, User } from '../../types/user';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    MatProgressSpinnerModule,
    FeedbackCardComponent,
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  readonly categories = ['All', 'UI', 'UX', 'Enhancement', 'Bug', 'Feature'];
  selectedCategory: string = 'All';
  loading = new BehaviorSubject<boolean>(false);
  feedbackData: GetFeedbackResponse | undefined;
  filteredFeedbacks: Feedback[] = [];
  savedFeedbackData = localStorage.getItem('feedbackData');
  apiError = '';
  user: AuthResponse = JSON.parse(localStorage.getItem('userData') || '{}');

  statusCounts = {
    planned: 0,
    'in-progress': 0,
    live: 0,
  };
  selectedSortOption: sortCriteria = 'most-upvotes';

  constructor(
    private readonly feedbackService: FeedbackService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    // if (this.savedFeedbackData) {
    //   this.feedbackData = JSON.parse(this.savedFeedbackData);
    //   return;
    // }
    this.getFeedbacks();
  }
  getFeedbacks(): void {
    this.loading.next(true);
    this.feedbackService
      .getFeedbackData()
      .pipe(
        finalize(() => {
          this.loading.next(false);
        })
      )
      .subscribe({
        next: (response) => {
          this.feedbackData = response;
          this.filteredFeedbacks = response.productRequests;
          this.updateStatusCounts();
          localStorage.setItem('feedbackData', JSON.stringify(response));
        },
        error: ({ error }) => {
          this.apiError = error.message;
        },
      });
  }

  sortByCategory(category: string): void {
    this.selectedCategory = category;

    if (!this.feedbackData) return;

    this.filteredFeedbacks =
      category === 'All'
        ? this.feedbackData.productRequests
        : this.feedbackData.productRequests.filter(
            (request) => request.category === category.toLowerCase()
          );

    this.updateStatusCounts();
  }

  updateStatusCounts() {
    this.filteredFeedbacks.forEach((feedback) => {
      if (feedback.status === 'planned') this.statusCounts.planned++;
      if (feedback.status === 'in-progress') this.statusCounts['in-progress']++;
      if (feedback.status === 'live') this.statusCounts.live++;
    });

    return this.statusCounts;
  }

  sortFeedback(criteria: sortCriteria): void {
    if (!this.feedbackData) return;

    this.filteredFeedbacks.sort((a, b) => {
      switch (criteria) {
        case 'most-upvotes':
          return b.upvotes - a.upvotes;
        case 'least-upvotes':
          return a.upvotes - b.upvotes;
        case 'most-comments':
          return b.commentCount - a.commentCount;
        case 'least-comments':
          return a.commentCount - b.commentCount;
        default:
          return 0;
      }
    });
  }

  logout(): void {
    localStorage.removeItem('userData');
    this.router.navigate(['auth'], { replaceUrl: true });
  }
}
