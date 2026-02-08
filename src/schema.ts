import { z } from 'zod';
import { EnhancementLevel, Priority, OperationStatus } from './types';

/**
 * Schema validation for the 110% Protocol System
 */

export const EnhancementSchema = z.object({
  id: z.string().uuid(),
  description: z.string().min(1).max(500),
  impact: z.nativeEnum(EnhancementLevel),
  priority: z.nativeEnum(Priority),
  timestamp: z.date(),
  metadata: z.record(z.unknown()).optional(),
});

export const RecommendationSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  priority: z.nativeEnum(Priority),
  estimatedImpact: z.number().min(0).max(100),
  category: z.string().min(1).max(50),
  actionable: z.boolean(),
  timestamp: z.date(),
});

export const OperationResultSchema = z.object({
  success: z.boolean(),
  status: z.nativeEnum(OperationStatus),
  data: z.unknown().optional(),
  enhancements: z.array(EnhancementSchema),
  recommendations: z.array(RecommendationSchema),
  metadata: z.object({
    executionTime: z.number().min(0),
    timestamp: z.date(),
    version: z.string(),
  }),
});

export const ProtocolConfigSchema = z.object({
  minEnhancementLevel: z.nativeEnum(EnhancementLevel),
  enableSelfHealing: z.boolean(),
  enableSelfLearning: z.boolean(),
  enableContinuousImprovement: z.boolean(),
  monitoringInterval: z.number().min(1000).max(3600000),
  maxRecommendations: z.number().min(1).max(100),
});

export const HealthCheckSchema = z.object({
  healthy: z.boolean(),
  status: z.string(),
  timestamp: z.date(),
  metrics: z.object({
    uptime: z.number().min(0),
    enhancementRate: z.number().min(0).max(100),
    successRate: z.number().min(0).max(100),
    averageExecutionTime: z.number().min(0),
  }),
  issues: z.array(z.string()).optional(),
});

/**
 * Validates enhancement data
 */
export function validateEnhancement(data: unknown): boolean {
  try {
    EnhancementSchema.parse(data);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates recommendation data
 */
export function validateRecommendation(data: unknown): boolean {
  try {
    RecommendationSchema.parse(data);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates operation result data
 */
export function validateOperationResult(data: unknown): boolean {
  try {
    OperationResultSchema.parse(data);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates protocol configuration
 */
export function validateProtocolConfig(data: unknown): boolean {
  try {
    ProtocolConfigSchema.parse(data);
    return true;
  } catch {
    return false;
  }
}
