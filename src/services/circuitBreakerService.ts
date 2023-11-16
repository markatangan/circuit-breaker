// src/services/circuitBreakerService.ts
import CircuitBreaker from '../utils/circuitBreaker';
import OperationResult from '../models/transactions';
import redisClient from '../connection_providers/redis.connection.provider';



const circuitBreaker = new CircuitBreaker({
  maxConsecutiveFailures: 3,
  timeout: 5000,
});

const transactionCacheKey = 'transactionCache';

async function performCriticalOperation(transactionId: string): Promise<string> {
    try {
      // Simulate an operation that may fail
      const random = Math.random();
      if (random < 0.7) {
        throw new Error('Simulated operation failure');
      }
  
      const mongoInsert =  new OperationResult({ transactionId, status: 'success' });
      await mongoInsert.save()
  
      return 'Operation succeeded';
    } catch (error) {
      console.error('Failed to perform critical operation:', error);
      throw new Error('Failed to perform critical operation');
    }
  }
  

  export async function getResource(transactionId: string): Promise<string> {
    return circuitBreaker.execute(transactionId,() => performCriticalOperation(transactionId));
  }
