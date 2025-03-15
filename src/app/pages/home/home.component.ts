import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BehaviorSubject, finalize } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GetFeedbackResponse } from '../../types';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  readonly categories = ['All', 'UI', 'UX', 'Enhancement', 'Bug', 'Feature'];
  selectedCategory: string = 'All';
  loading = new BehaviorSubject<boolean>(false);
  feedbackData: GetFeedbackResponse | undefined;
  savedFeedbackData = localStorage.getItem('feedbackData');
  apiError = '';

  constructor() {}

  ngOnInit(): void {
    if (this.savedFeedbackData) {
      this.feedbackData = JSON.parse(this.savedFeedbackData);
      return;
    }
    this.loadHomepage();
  }
  loadHomepage(): void {
    // this.loading.next(true);
    // this.homeService
    //   .getFeedback()
    //   .pipe(
    //     finalize(() => {
    //       this.loading.next(false);
    //     })
    //   )
    //   .subscribe({
    //     next: (res) => {
    //       this.feedbackData = res;
    //       localStorage.setItem('feedbackData', JSON.stringify(res));
    //     },
    //     error: ({ error }) => {
    //       this.apiError = error.message;
    //     },
    //   });
  }

  sortByCategory(category: string): void {
    this.selectedCategory = category;
    console.log(this.selectedCategory);
  }
}
