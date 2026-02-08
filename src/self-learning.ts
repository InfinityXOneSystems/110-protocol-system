/**
 * Self-Learning Module for the 110% Protocol System
 * Implements machine learning and adaptive behavior capabilities
 */

export interface LearningPattern {
  id: string;
  pattern: string;
  frequency: number;
  successRate: number;
  lastSeen: Date;
  metadata?: Record<string, unknown>;
}

export interface LearningInsight {
  id: string;
  insight: string;
  confidence: number;
  category: string;
  timestamp: Date;
}

/**
 * Self-Learning System
 */
export class SelfLearningSystem {
  private patterns: Map<string, LearningPattern> = new Map();
  private insights: LearningInsight[] = [];

  /**
   * Records a new pattern observation
   */
  recordPattern(
    pattern: string,
    success: boolean,
    metadata?: Record<string, unknown>
  ): LearningPattern {
    const existing = this.patterns.get(pattern);

    if (existing) {
      const totalOccurrences = existing.frequency + 1;
      const successCount = existing.successRate * existing.frequency + (success ? 1 : 0);

      existing.frequency = totalOccurrences;
      existing.successRate = successCount / totalOccurrences;
      existing.lastSeen = new Date();
      existing.metadata = { ...existing.metadata, ...metadata };

      return existing;
    }

    const newPattern: LearningPattern = {
      id: `pattern-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      pattern,
      frequency: 1,
      successRate: success ? 1 : 0,
      lastSeen: new Date(),
      metadata,
    };

    this.patterns.set(pattern, newPattern);
    return newPattern;
  }

  /**
   * Generates insights from learned patterns
   */
  generateInsights(): LearningInsight[] {
    const newInsights: LearningInsight[] = [];

    // Analyze patterns for high success rates
    for (const [, pattern] of this.patterns) {
      if (pattern.successRate >= 0.9 && pattern.frequency >= 5) {
        newInsights.push({
          id: `insight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          insight: `Pattern "${pattern.pattern}" has high success rate (${(pattern.successRate * 100).toFixed(1)}%)`,
          confidence: pattern.successRate,
          category: 'high-performer',
          timestamp: new Date(),
        });
      } else if (pattern.successRate < 0.5 && pattern.frequency >= 5) {
        newInsights.push({
          id: `insight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          insight: `Pattern "${pattern.pattern}" has low success rate (${(pattern.successRate * 100).toFixed(1)}%)`,
          confidence: 1 - pattern.successRate,
          category: 'needs-improvement',
          timestamp: new Date(),
        });
      }
    }

    this.insights.push(...newInsights);
    return newInsights;
  }

  /**
   * Gets all learned patterns
   */
  getPatterns(): LearningPattern[] {
    return Array.from(this.patterns.values());
  }

  /**
   * Gets patterns by minimum success rate
   */
  getSuccessfulPatterns(minSuccessRate: number = 0.8): LearningPattern[] {
    return Array.from(this.patterns.values()).filter((p) => p.successRate >= minSuccessRate);
  }

  /**
   * Gets all insights
   */
  getInsights(): LearningInsight[] {
    return [...this.insights];
  }

  /**
   * Clears learned data
   */
  clear(): void {
    this.patterns.clear();
    this.insights = [];
  }
}
