import {
  CdkDropListGroup,
  CdkDropList,
  CdkDrag,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FeedbackService } from '../../core/services/feedback.service';
import { BehaviorSubject, finalize } from 'rxjs';
import { Feedback } from '../../types/feedback';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-roadmap',
  imports: [
    CommonModule,
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
    MatSnackBarModule,
    RouterModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './roadmap.component.html',
  styleUrl: './roadmap.component.css',
})
export class RoadmapComponent implements OnInit {
  loading = new BehaviorSubject<boolean>(false);
  error = '';
  planned: Feedback[] = [];
  inProgress: Feedback[] = [];
  live: Feedback[] = [];

  constructor(
    private readonly feedbackService: FeedbackService,
    private snackBar: MatSnackBar,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getFeedbacks();
  }

  goBackToPrevPage(): void {
    this.location.back();
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
          this.planned = response.productRequests.filter(
            (request) => request.status === 'planned'
          );
          this.inProgress = response.productRequests.filter(
            (request) => request.status === 'in-progress'
          );
          this.live = response.productRequests.filter(
            (request) => request.status === 'live'
          );
        },
        error: ({ error }) => {
          this.error = error.message;
        },
      });
  }

  drop(event: CdkDragDrop<Feedback[]>) {
    if (!event.previousContainer.data || !event.container.data) return;

    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      const movedItem = event.previousContainer.data[event.previousIndex];
      const previousStatus = movedItem.status;
      const newStatus = this.getStatusFromContainer(event.container.id);

      if (!newStatus) return;

      movedItem.status = newStatus;
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      this.feedbackService.updateFeedback(newStatus, movedItem.id).subscribe({
        error: () => {
          movedItem.status = previousStatus;
          transferArrayItem(
            event.container.data,
            event.previousContainer.data,
            event.currentIndex,
            event.previousIndex
          );

          this.snackBar.open(
            'Failed to update status. Please try again.',
            'Close',
            {
              duration: 3000,
              panelClass: ['error-snackbar'],
            }
          );
        },
      });
    }
  }

  private getStatusFromContainer(containerId: string): string | null {
    if (containerId.includes('planned')) return 'planned';
    if (containerId.includes('in-progress')) return 'in-progress';
    if (containerId.includes('live')) return 'live';
    return null;
  }
}
