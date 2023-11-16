// src/controllers/resourceController.ts
import { Request, Response } from 'express';
import * as CircuitBreakerService from '../services/circuitBreakerService';
import moment from 'moment';

function log(message: string): void {
  const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
  console.log(`[${timestamp}] ${message}`);
}

export async function getResource(req: Request, res: Response): Promise<void> {
  const { transactionId } = req.query;

  if (!transactionId || typeof transactionId !== 'string') {
    res.status(400).json({ error: 'Invalid transaction ID' });
    return;
  }

  try {
    const result = await CircuitBreakerService.getResource(transactionId);
    log('Operation succeeded');
    res.json({ result });
  } catch (error) {
    log(`Operation failed: ${error}`);
    res.status(500).json({ error: 'Operation failed' });
  }
}
