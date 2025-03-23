import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Feedback } from '../../types/feedback';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FeedbackService } from '../../core/services/feedback.service';
import { BehaviorSubject, finalize, firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FeedbackCardComponent } from '../../shared/feedback-card/feedback-card.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../core/services/auth/auth.service';
import { AuthResponse } from '../../types/user';

@Component({
  selector: 'app-feedback-details',
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    MatProgressSpinnerModule,
    FeedbackCardComponent,
  ],
  templateUrl: './feedback-details.component.html',
  styleUrl: './feedback-details.component.css',
})
export class FeedbackDetailsComponent {
  feedbackId: string | null = null;
  feedbackDetails: Feedback | undefined;
  commentInput = '';
  replyInput = '';
  isFeedbackPoster: boolean | undefined;
  loading = new BehaviorSubject<boolean>(false);
  postingComment = new BehaviorSubject<boolean>(false);
  error = '';
  postCommentError = '';
  replyError = '';
  user: AuthResponse | null = null;
  activeReplyBoxId: string | null = null;
  replyingToUsername: string | null = '';
  activeParentCommentId: string | null = null;

  private _snackBar = inject(MatSnackBar);

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.feedbackId = params.get('id');
    });
    this.getFeedbackDetails();
  }

  constructor(
    private readonly feedbackService: FeedbackService,
    private route: ActivatedRoute,
    private readonly authService: AuthService
  ) {
    this.authService.user$.subscribe((user) => {
      this.user = user;
    });
  }

  showReplyBox(
    parentCommentId: string,
    replyId: string | null,
    username: string
  ): void {
    console.log(username);
    if (this.activeReplyBoxId === replyId) {
      this.activeReplyBoxId = null;
      this.activeParentCommentId = null;
      this.replyingToUsername = null;
    } else {
      this.activeReplyBoxId = replyId;
      this.activeParentCommentId = parentCommentId;
      this.replyingToUsername = username;
    }
  }
  getFeedbackDetails(): void {
    if (!this.feedbackId) return;
    this.loading.next(true);

    this.feedbackService
      .getSingleFeedback(this.feedbackId)
      .pipe(
        finalize(() => {
          this.loading.next(false);
        })
      )
      .subscribe({
        next: ({ productRequest }) => {
          this.feedbackDetails = productRequest;
          this.isFeedbackPoster =
            this.feedbackDetails.user === this.user?.user?.id;
        },
        error: ({ error }: HttpErrorResponse) => {
          this.error = error.message;
        },
      });
  }

  postComment(comment: string, replyingTo?: string) {
    if (!this.feedbackDetails) return;
    this.postingComment.next(true);
    this.feedbackService
      .postComment(comment, this.feedbackDetails.id, replyingTo)
      .pipe(
        finalize(() => {
          this.postingComment.next(false);
        })
      )
      .subscribe({
        next: () => {
          this.commentInput = '';
          this.replyInput=''
          this._snackBar.open('Comment posted!', '', { duration: 3000 });
          this.activeReplyBoxId = null;
          this.activeParentCommentId = null;
          this.replyingToUsername = null;
       
          this.getFeedbackDetails();
        },
        error: ({ error }: HttpErrorResponse) => {
          this.postCommentError = error.message;
        },
      });
  }

  getUserInitials(firstName: string, lastName: string): string {
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  }
}
