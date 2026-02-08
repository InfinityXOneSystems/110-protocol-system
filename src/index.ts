/**
 * Main entry point for the 110% Protocol System
 */

export { Protocol110System } from './protocol';
export { ProtocolApiController } from './api';
export { SelfHealingSystem } from './self-healing';
export { SelfLearningSystem } from './self-learning';
export {
  IntegrationManager,
  HttpIntegrationAdapter,
  WebSocketIntegrationAdapter,
} from './integrations';
export { EnhancementTracker, RecommendationEngine } from './core';
export { Logger } from './logger';

export * from './types';
export * from './schema';

// Version
export const VERSION = '1.0.0';
