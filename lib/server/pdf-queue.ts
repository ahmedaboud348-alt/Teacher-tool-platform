/**
 * Bounded concurrency limiter for PDF rendering.
 *
 * Headless-Chromium renders are CPU/RAM heavy, so we cap how many run at once.
 * Instead of rejecting the moment the cap is hit, callers WAIT in a bounded
 * queue (graceful handling of user bursts). Only when the queue itself is full
 * do we shed load with a 503, so a traffic spike degrades into "slightly slower"
 * rather than "many failures".
 */
export class RenderLimiter {
  private active = 0;
  private readonly waiters: Array<() => void> = [];

  constructor(
    private readonly maxConcurrent: number,
    private readonly maxQueue: number
  ) {}

  /**
   * Resolves true once a render slot is held. Resolves false if the queue is
   * already full (shed immediately) or if `timeoutMs` elapses while waiting
   * (so a user never waits forever under sustained overload).
   */
  async acquire(timeoutMs = 0): Promise<boolean> {
    if (this.active < this.maxConcurrent) {
      this.active += 1;
      return true;
    }
    if (this.waiters.length >= this.maxQueue) {
      return false; // shed load — queue full
    }
    return new Promise<boolean>((resolve) => {
      let timer: ReturnType<typeof setTimeout> | undefined;
      const waiter = () => {
        if (timer) clearTimeout(timer);
        // A released slot was handed directly to us (active already counts it).
        resolve(true);
      };
      this.waiters.push(waiter);
      if (timeoutMs > 0) {
        timer = setTimeout(() => {
          const idx = this.waiters.indexOf(waiter);
          if (idx !== -1) {
            this.waiters.splice(idx, 1);
            resolve(false); // waited too long — shed
          }
        }, timeoutMs);
      }
    });
  }

  release(): void {
    const next = this.waiters.shift();
    if (next) {
      next(); // transfer the slot to the next waiter; active stays the same
    } else {
      this.active -= 1;
    }
  }

  get stats() {
    return { active: this.active, queued: this.waiters.length };
  }
}
