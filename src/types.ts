/**
 * Core types and interfaces for the 110% Protocol System
 */

/**
 * Enhancement level indicating the degree of improvement
 */
export enum EnhancementLevel {
  BASELINE = 100,
  ENHANCED = 110,
  EXCEPTIONAL = 120,
  TRANSFORMATIVE = 150,
}

/**
 * Status of a protocol operation
 */
export enum OperationStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  SUCCESS = 'success',
  FAILED = 'failed',
  ENHANCED = 'enhanced',
}

/**
 * Priority levels for recommendations
 */
export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

/**
 * Represents a single enhancement or improvement
 */
export interface Enhancement {
  id: string;
  description: string;
  impact: EnhancementLevel;
  priority: Priority;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

/**
 * Represents a recommendation for system improvement
 */
export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  estimatedImpact: number;
  category: string;
  actionable: boolean;
  timestamp: Date;
}

/**
 * Result of a protocol operation
 */
export interface OperationResult<T = unknown> {
  success: boolean;
  status: OperationStatus;
  data?: T;
  enhancements: Enhancement[];
  recommendations: Recommendation[];
  metadata: {
    executionTime: number;
    timestamp: Date;
    version: string;
  };
}

/**
 * Configuration for the 110% Protocol System
 */
export interface ProtocolConfig {
  minEnhancementLevel: EnhancementLevel;
  enableSelfHealing: boolean;
  enableSelfLearning: boolean;
  enableContinuousImprovement: boolean;
  monitoringInterval: number;
  maxRecommendations: number;
}

/**
 * Health check result
 */
export interface HealthCheck {
  healthy: boolean;
  status: string;
  timestamp: Date;
  metrics: {
    uptime: number;
    enhancementRate: number;
    successRate: number;
    averageExecutionTime: number;
  };
  issues?: string[];
}

/**
 * System metrics
 */
export interface SystemMetrics {
  totalOperations: number;
  successfulOperations: number;
  failedOperations: number;
  enhancedOperations: number;
  averageEnhancementLevel: number;
  totalRecommendations: number;
  implementedRecommendations: number;
  uptime: number;
  lastUpdate: Date;
}
