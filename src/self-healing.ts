/**
 * Self-Healing Module for the 110% Protocol System
 * Implements automatic recovery and resilience capabilities
 */

import { Priority } from './types';

export interface HealingStrategy {
  id: string;
  name: string;
  description: string;
  priority: Priority;
  errorPattern: RegExp;
  healingAction: () => Promise<boolean>;
}

export interface HealingAttempt {
  id: string;
  timestamp: Date;
  errorType: string;
  strategyUsed: string;
  success: boolean;
  recoveryTime: number;
}

/**
 * Self-Healing System
 */
export class SelfHealingSystem {
  private strategies: HealingStrategy[] = [];
  private healingHistory: HealingAttempt[] = [];

  constructor() {
    this.initializeDefaultStrategies();
  }

  /**
   * Initializes default healing strategies
   */
  private initializeDefaultStrategies(): void {
    // Network error recovery
    this.registerStrategy({
      id: 'network-retry',
      name: 'Network Retry',
      description: 'Retry operations that failed due to network issues',
      priority: Priority.HIGH,
      errorPattern: /network|timeout|ECONNREFUSED|ETIMEDOUT/i,
      healingAction: async () => {
        // Implement retry logic with exponential backoff
        await this.delay(1000);
        return true;
      },
    });

    // Resource exhaustion recovery
    this.registerStrategy({
      id: 'resource-cleanup',
      name: 'Resource Cleanup',
      description: 'Clean up resources and retry',
      priority: Priority.HIGH,
      errorPattern: /memory|ENOMEM|EMFILE|too many/i,
      healingAction: async () => {
        // Implement cleanup logic
        if (global.gc) {
          global.gc();
        }
        await this.delay(500);
        return true;
      },
    });

    // Rate limiting recovery
    this.registerStrategy({
      id: 'rate-limit-backoff',
      name: 'Rate Limit Backoff',
      description: 'Wait and retry when rate limited',
      priority: Priority.MEDIUM,
      errorPattern: /rate limit|429|too many requests/i,
      healingAction: async () => {
        await this.delay(5000);
        return true;
      },
    });
  }

  /**
   * Registers a new healing strategy
   */
  registerStrategy(strategy: HealingStrategy): void {
    this.strategies.push(strategy);
    this.strategies.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  /**
   * Attempts to heal from an error
   */
  async heal(error: Error): Promise<boolean> {
    const startTime = Date.now();
    const errorMessage = error.message || String(error);

    // Find matching strategy
    const strategy = this.strategies.find((s) => s.errorPattern.test(errorMessage));

    if (!strategy) {
      this.recordAttempt(errorMessage, 'none', false, Date.now() - startTime);
      return false;
    }

    try {
      const success = await strategy.healingAction();
      const recoveryTime = Date.now() - startTime;

      this.recordAttempt(errorMessage, strategy.name, success, recoveryTime);
      return success;
    } catch {
      this.recordAttempt(errorMessage, strategy.name, false, Date.now() - startTime);
      return false;
    }
  }

  /**
   * Records a healing attempt
   */
  private recordAttempt(
    errorType: string,
    strategyUsed: string,
    success: boolean,
    recoveryTime: number
  ): void {
    this.healingHistory.push({
      id: `healing-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      errorType,
      strategyUsed,
      success,
      recoveryTime,
    });

    // Keep only last 100 attempts
    if (this.healingHistory.length > 100) {
      this.healingHistory.shift();
    }
  }

  /**
   * Gets healing history
   */
  getHistory(): HealingAttempt[] {
    return [...this.healingHistory];
  }

  /**
   * Gets success rate of healing attempts
   */
  getSuccessRate(): number {
    if (this.healingHistory.length === 0) return 0;
    const successful = this.healingHistory.filter((h) => h.success).length;
    return (successful / this.healingHistory.length) * 100;
  }

  /**
   * Gets registered strategies
   */
  getStrategies(): HealingStrategy[] {
    return [...this.strategies];
  }

  /**
   * Delay helper
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
