import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-reply-modal',
  templateUrl: './reply-modal.component.html',
  styleUrls: ['./reply-modal.component.css'],
  imports: [CommonModule,FormsModule, MatButtonModule, MatDialogModule],
})
export class ReplyModalComponent {
  replyText: string = '';

  constructor(
    public dialogRef: MatDialogRef<ReplyModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { commentId: string; replyingToUsername: string }
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  submitReply(): void {
    this.dialogRef.close(this.replyText);
  }
}
