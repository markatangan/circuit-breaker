import redisClient from '../connection_providers/redis.connection.provider';

interface CircuitBreakerOptions {
  maxConsecutiveFailures: number;
  timeout: number;
}

export default class CircuitBreaker {
  private consecutiveFailures: number = 0;
  private circuitOpen: boolean = false;
  private lastFailureTimestamp: number | null = null;
  private readonly maxConsecutiveFailures: number;
  private readonly timeout: number;

  constructor(options: CircuitBreakerOptions) {
    this.maxConsecutiveFailures = options.maxConsecutiveFailures;
    this.timeout = options.timeout;
  }

  async execute<T>(transactionId: string, operation: () => Promise<T>): Promise<T> {
    const transactionCacheKey = 'delayed transactions';
    if (this.circuitOpen) {
      const elapsedTime = Date.now() - (this.lastFailureTimestamp || 0);
      if (elapsedTime >= this.timeout) {
        // If the timeout has passed, attempt to close the circuit
        this.circuitOpen = false;
        this.consecutiveFailures = 0;
        this.lastFailureTimestamp = null;
      } else {
        redisClient.rpush(transactionCacheKey, transactionId, (err) => {
          if (err) {
              console.error('Failed to push to Redis:', err);
          }
          });
        return Promise.reject(new Error('Circuit is open. Please try again later.'));
      }
    }

    try {
      const result = await operation();

      // If the operation succeeds, reset the consecutive failures
      this.consecutiveFailures = 0;
      return result;
    } catch (error) {
      // If the operation fails, increment consecutive failures
      this.consecutiveFailures++;
      if (this.consecutiveFailures >= this.maxConsecutiveFailures) {
        // If consecutive failures exceed the threshold, open the circuit
        this.circuitOpen = true;
        this.lastFailureTimestamp = Date.now();
        this.scheduleCircuitReset();
      }

      throw error;
    }
  }

  isCircuitOpen(): boolean {
    return this.circuitOpen;
  }

  private scheduleCircuitReset(): void {
    setTimeout(() => {
      console.log('Closing circuit. Resetting consecutive failures.');
      console.log('Should executea retry of all the delayed transactions');
      this.circuitOpen = false;
      this.consecutiveFailures = 0;
      this.lastFailureTimestamp = null;
    }, this.timeout);
  }
}
