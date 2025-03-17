import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Feedback } from '../../types/feedback';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FeedbackService } from '../../core/services/feedback.service';
import { BehaviorSubject, finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FeedbackCardComponent } from '../../shared/feedback-card/feedback-card.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ReplyModalComponent } from '../../shared/reply-modal/reply-modal.component';

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
  input = '';
  isFeedbackPoster: boolean | undefined;
  loading = new BehaviorSubject<boolean>(false);
  postingComment = new BehaviorSubject<boolean>(false);
  error = '';
  postCommentError = '';

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
    private dialog: MatDialog
  ) {}

  openReplyModal(commentId: string, replyingToUsername: string, comment:any): void {
    console.log(comment._id, comment);
    const dialogRef = this.dialog.open(ReplyModalComponent, {
      width: '400px',
      data: { commentId, replyingToUsername },
    });

    dialogRef.afterClosed().subscribe((replyText) => {
      if (replyText && this.feedbackDetails) {
        this.postComment(replyText, commentId);
      }
    });
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
            this.feedbackDetails.user ===
            JSON.parse(localStorage.getItem('userData') || '{}').user.id;
        },
        error: ({ error }: HttpErrorResponse) => {
          this.error = error.message;
        },
      });
  }

  postComment(comment: string, replyingTo?: string) {
    if (!this.feedbackDetails) return;
this.postingComment.next(true)
    this.feedbackService
      .postComment(comment, this.feedbackDetails.id, replyingTo).pipe(finalize(()=>{
        this.postingComment.next(false)
      }))
      .subscribe({
        next: () => {
          this.input=''
          this._snackBar.open('Comment posted!', '', { duration: 3000 });
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
