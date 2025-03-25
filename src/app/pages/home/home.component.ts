import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BehaviorSubject, Observable, finalize } from 'rxjs';
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
import { AuthService } from '../../core/services/auth/auth.service';
import { MatSidenavModule } from '@angular/material/sidenav';

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
    MatSidenavModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {
  readonly categories = ['All', 'UI', 'UX', 'Enhancement', 'Bug', 'Feature'];
  selectedCategory: string = 'All';
  loading = new BehaviorSubject<boolean>(false);
  feedbackData$: Observable<GetFeedbackResponse | null>;
  filteredFeedbacks: Feedback[] = [];
  apiError = '';
  user: AuthResponse | null = null;

  statusCounts = {
    planned: 0,
    'in-progress': 0,
    live: 0,
  };
  selectedSortOption: sortCriteria = 'most-upvotes';

  constructor(
    private readonly feedbackService: FeedbackService,
    private readonly router: Router,
    private readonly authService: AuthService
  ) {
    this.feedbackData$ = this.feedbackService.feedbackData$;
    this.authService.user$.subscribe((user) => {
      this.user = user;
    });
  }

  ngOnInit(): void {
    this.feedbackData$.subscribe((data) => {
      if (!data) {
        this.getFeedbacks();
      } else {
        this.filteredFeedbacks = data.productRequests;
        this.getStatusCount();
        this.sortFeedback(this.selectedSortOption);
      }
    });
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
        error: ({ error }) => {
          this.apiError = error.message;
        },
      });
  }

  sortByCategory(category: string): void {
    this.selectedCategory = category;

    if (!this.feedbackData$) return;

    this.feedbackData$.subscribe((feedbackData) => {
      if (!feedbackData) return;
      this.filteredFeedbacks =
        category === 'All'
          ? feedbackData.productRequests
          : feedbackData.productRequests.filter(
              (request) =>
                request.category.toLowerCase() === category.toLowerCase()
            );

      this.sortFeedback(this.selectedSortOption);
    });
  }

  getStatusCount() {
    this.statusCounts = {
      planned: this.filteredFeedbacks.filter((f) => f.status === 'planned')
        .length,
      'in-progress': this.filteredFeedbacks.filter(
        (f) => f.status === 'in-progress'
      ).length,
      live: this.filteredFeedbacks.filter((f) => f.status === 'live').length,
    };

    return this.statusCounts;
  }

  sortFeedback(criteria: sortCriteria): void {
    if (!this.feedbackData$) return;

    this.selectedSortOption = criteria;

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
    this.authService.setUser(null);
    this.router.navigate(['auth'], { replaceUrl: true });
  }
}
