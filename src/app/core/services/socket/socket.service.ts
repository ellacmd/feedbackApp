import { Injectable, OnDestroy } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class SocketService implements OnDestroy {
  private destroy$ = new Subject<void>();
  private connectionStatus = false;

  constructor(private socket: Socket, private authService: AuthService) {}

  connect(): void {
    try {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');

      if (!userData || !userData.token) {
        console.error('Cannot connect: No authentication token available');
        return;
      }

      if (!this.socket.ioSocket.connected) {
        this.socket.ioSocket.io.opts.extraHeaders = {
          token: userData.token,
        };
        this.socket.connect();
        console.log('Attempting to connect socket...');
      }

      this.socket
        .fromEvent('connect')
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.connectionStatus = true;
          console.log('Socket connected successfully!');
        });

      this.socket
        .fromEvent('connect_error')
        .pipe(takeUntil(this.destroy$))
        .subscribe((err) => {
          this.connectionStatus = false;
          console.error('Socket connection failed:', err);
        });
    } catch (error) {
      console.error('Error connecting to socket:', error);
    }
  }

  /**
   * Disconnect from the socket server
   */
  disconnect(): void {
    this.socket.disconnect();
    this.connectionStatus = false;
  }

  /**
   * Check if socket is connected
   */
  isConnected(): boolean {
    return this.connectionStatus;
  }

  /**
   * Listen for upvote events
   */
  onUpvote(): Observable<any> {
    return this.socket.fromEvent<string, any>('upvote').pipe(
      takeUntil(this.destroy$),
      catchError((error) => {
        console.error('Error in upvote event:', error);
        return throwError(() => new Error('Failed to process upvote event'));
      })
    );
  }

  /**
   * Listen for upvote updated events
   */
  onUpvoteUpdated(): Observable<any> {
    return this.socket.fromEvent<string, any>('upvoteUpdated').pipe(
      takeUntil(this.destroy$),
      catchError((error) => {
        console.error('Error in upvoteUpdated event:', error);
        return throwError(
          () => new Error('Failed to process upvoteUpdated event')
        );
      })
    );
  }

  /**
   * Emit an upvote event
   */
  emitUpvote(feedbackId: string): void {
    if (!this.connectionStatus) {
      console.warn('Socket not connected. Attempting to connect...');
      this.connect();
    }

    console.log('Emitting upvote for:', feedbackId);
    this.socket.emit('upvote', { productRequest: feedbackId });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.disconnect();
  }
}
