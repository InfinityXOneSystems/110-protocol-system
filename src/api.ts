/**
 * API Contracts and Interfaces for the 110% Protocol System
 */

import { Protocol110System } from './protocol';
import { HealthCheck, SystemMetrics, OperationResult } from './types';

/**
 * API Request interface
 */
export interface ApiRequest {
  operation: string;
  params?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

/**
 * API Response interface
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

/**
 * API Controller for the 110% Protocol System
 */
export class ProtocolApiController {
  private protocol: Protocol110System;

  constructor(protocol: Protocol110System) {
    this.protocol = protocol;
  }

  /**
   * Health check endpoint
   */
  // eslint-disable-next-line @typescript-eslint/require-await
  async healthCheck(): Promise<ApiResponse<HealthCheck>> {
    try {
      const health = this.protocol.getHealthCheck();
      return {
        success: true,
        data: health,
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        error: String(error),
        timestamp: new Date(),
      };
    }
  }

  /**
   * Get system metrics endpoint
   */
  // eslint-disable-next-line @typescript-eslint/require-await
  async getMetrics(): Promise<ApiResponse<SystemMetrics>> {
    try {
      const metrics = this.protocol.getMetrics();
      return {
        success: true,
        data: metrics,
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        error: String(error),
        timestamp: new Date(),
      };
    }
  }

  /**
   * Get enhancements endpoint
   */
  // eslint-disable-next-line @typescript-eslint/require-await
  async getEnhancements(): Promise<ApiResponse> {
    try {
      const enhancements = this.protocol.getEnhancements();
      return {
        success: true,
        data: enhancements,
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        error: String(error),
        timestamp: new Date(),
      };
    }
  }

  /**
   * Get recommendations endpoint
   */
  // eslint-disable-next-line @typescript-eslint/require-await
  async getRecommendations(limit?: number): Promise<ApiResponse> {
    try {
      const recommendations = limit
        ? this.protocol.getTopRecommendations(limit)
        : this.protocol.getRecommendations();
      return {
        success: true,
        data: recommendations,
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        error: String(error),
        timestamp: new Date(),
      };
    }
  }

  /**
   * Execute operation endpoint
   */
  async executeOperation(request: ApiRequest): Promise<ApiResponse<OperationResult>> {
    try {
      // eslint-disable-next-line @typescript-eslint/require-await
      const result = await this.protocol.execute(async () => {
        // Execute the requested operation
        return { operation: request.operation, params: request.params };
      }, request.operation);

      return {
        success: true,
        data: result,
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        error: String(error),
        timestamp: new Date(),
      };
    }
  }

  /**
   * Get configuration endpoint
   */
  // eslint-disable-next-line @typescript-eslint/require-await
  async getConfig(): Promise<ApiResponse> {
    try {
      const config = this.protocol.getConfig();
      return {
        success: true,
        data: config,
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        error: String(error),
        timestamp: new Date(),
      };
    }
  }
}
