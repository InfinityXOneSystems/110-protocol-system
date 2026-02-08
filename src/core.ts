import { randomUUID } from 'crypto';
import {
  Enhancement,
  EnhancementLevel,
  Priority,
  Recommendation,
  OperationResult,
  OperationStatus,
} from './types';

/**
 * Enhancement Tracker - tracks and manages enhancements in the system
 */
export class EnhancementTracker {
  private enhancements: Enhancement[] = [];

  /**
   * Creates a new enhancement
   */
  createEnhancement(
    description: string,
    impact: EnhancementLevel,
    priority: Priority,
    metadata?: Record<string, unknown>
  ): Enhancement {
    const enhancement: Enhancement = {
      id: randomUUID(),
      description,
      impact,
      priority,
      timestamp: new Date(),
      metadata,
    };

    this.enhancements.push(enhancement);
    return enhancement;
  }

  /**
   * Gets all enhancements
   */
  getEnhancements(): Enhancement[] {
    return [...this.enhancements];
  }

  /**
   * Gets enhancements by priority
   */
  getEnhancementsByPriority(priority: Priority): Enhancement[] {
    return this.enhancements.filter((e) => e.priority === priority);
  }

  /**
   * Gets enhancements by impact level
   */
  getEnhancementsByImpact(minImpact: EnhancementLevel): Enhancement[] {
    return this.enhancements.filter((e) => e.impact >= minImpact);
  }

  /**
   * Calculates average enhancement level
   */
  getAverageEnhancementLevel(): number {
    if (this.enhancements.length === 0) return EnhancementLevel.BASELINE;
    const sum = this.enhancements.reduce((acc, e) => acc + e.impact, 0);
    return sum / this.enhancements.length;
  }

  /**
   * Clears all enhancements
   */
  clear(): void {
    this.enhancements = [];
  }
}

/**
 * Recommendation Engine - generates and manages recommendations
 */
export class RecommendationEngine {
  private recommendations: Recommendation[] = [];

  /**
   * Creates a new recommendation
   */
  createRecommendation(
    title: string,
    description: string,
    priority: Priority,
    estimatedImpact: number,
    category: string,
    actionable: boolean = true
  ): Recommendation {
    const recommendation: Recommendation = {
      id: randomUUID(),
      title,
      description,
      priority,
      estimatedImpact,
      category,
      actionable,
      timestamp: new Date(),
    };

    this.recommendations.push(recommendation);
    return recommendation;
  }

  /**
   * Gets all recommendations
   */
  getRecommendations(): Recommendation[] {
    return [...this.recommendations];
  }

  /**
   * Gets recommendations by priority
   */
  getRecommendationsByPriority(priority: Priority): Recommendation[] {
    return this.recommendations.filter((r) => r.priority === priority);
  }

  /**
   * Gets actionable recommendations
   */
  getActionableRecommendations(): Recommendation[] {
    return this.recommendations.filter((r) => r.actionable);
  }

  /**
   * Gets top recommendations by estimated impact
   */
  getTopRecommendations(limit: number = 10): Recommendation[] {
    return [...this.recommendations]
      .sort((a, b) => b.estimatedImpact - a.estimatedImpact)
      .slice(0, limit);
  }

  /**
   * Clears all recommendations
   */
  clear(): void {
    this.recommendations = [];
  }
}

/**
 * Creates a successful operation result
 */
export function createSuccessResult<T>(
  data: T,
  enhancements: Enhancement[] = [],
  recommendations: Recommendation[] = []
): OperationResult<T> {
  return {
    success: true,
    status: enhancements.length > 0 ? OperationStatus.ENHANCED : OperationStatus.SUCCESS,
    data,
    enhancements,
    recommendations,
    metadata: {
      executionTime: 0,
      timestamp: new Date(),
      version: '1.0.0',
    },
  };
}

/**
 * Creates a failed operation result
 */
export function createFailureResult(
  error: string,
  recommendations: Recommendation[] = []
): OperationResult {
  return {
    success: false,
    status: OperationStatus.FAILED,
    data: { error },
    enhancements: [],
    recommendations,
    metadata: {
      executionTime: 0,
      timestamp: new Date(),
      version: '1.0.0',
    },
  };
}
