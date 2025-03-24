import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Feedback } from '../../types/feedback';
import { BehaviorSubject } from 'rxjs';
import { FeedbackService } from '../../core/services/feedback.service';
import { AuthResponse } from '../../types/user';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-feedback-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feedback-card.component.html',
  styleUrl: './feedback-card.component.css',
})
export class FeedbackCardComponent implements OnInit {
  @Input() feedback!: Feedback;
  @Input() cursorStyle: string | undefined;
  userData: AuthResponse | null = null;
  isLoading = new BehaviorSubject<boolean>(false);
  isUpvoted = this.feedback?.upvotedBy.includes(this.userData!.user.id);

  constructor(
    private readonly feedbackService: FeedbackService,
    private readonly authService: AuthService
  ) {
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.userData = user;
      } else {
        this.userData = null;
      }
    });
  }

  ngOnInit(): void {
    if (this.feedback && this.userData?.user.id) {
      this.isUpvoted = this.feedback?.upvotedBy.includes(
        this.userData?.user.id
      );
    }
  }

  upvote(event: { stopPropagation: () => void }) {
    event.stopPropagation();

    if (!this.feedback.id) return;

    this.isLoading.next(true);

    this.feedbackService.toggleUpvote(this.feedback._id).subscribe({
      next: (response) => {
        this.isUpvoted = response.productRequest.upvotedBy.includes(
          this.userData!.user.id
        );
        this.feedback = {
          ...this.feedback,
          upvotes: response.productRequest.upvotes,
          upvotedBy: response.productRequest.upvotedBy,
        };
      },
      error: (error) => {
        console.error('Error toggling upvote:', error);
        this.isLoading.next(false);
      },
    });
  }
}
