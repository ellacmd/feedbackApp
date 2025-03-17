import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Feedback } from '../../types/feedback';

@Component({
  selector: 'app-feedback-card',
  imports: [CommonModule],
  templateUrl: './feedback-card.component.html',
  styleUrl: './feedback-card.component.css',
})
export class FeedbackCardComponent {
  @Input()
  feedback!: Feedback;
  @Input() cursorStyle : string| undefined

  upvote(event: { stopPropagation: () => void }) {
    console.log(event);
    event.stopPropagation();
  }
}
