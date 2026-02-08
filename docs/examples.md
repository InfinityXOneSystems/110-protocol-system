# Examples

## Basic Usage

### Simple Operation

```typescript
import { Protocol110System } from '110-protocol-system';

async function basicExample() {
  const protocol = new Protocol110System();

  const result = await protocol.execute(async () => {
    return { message: 'Hello, World!' };
  }, 'hello-world');

  console.log('Success:', result.success);
  console.log('Data:', result.data);
  console.log('Enhancements:', result.enhancements);
  console.log('Recommendations:', result.recommendations);
}

basicExample();
```

### With Custom Configuration

```typescript
import { Protocol110System, EnhancementLevel } from '110-protocol-system';

async function customConfigExample() {
  const protocol = new Protocol110System({
    minEnhancementLevel: EnhancementLevel.EXCEPTIONAL,
    enableSelfHealing: true,
    enableSelfLearning: true,
    maxRecommendations: 25,
  });

  const result = await protocol.execute(async () => {
    // Your business logic
    return await fetchUserData();
  }, 'fetch-user');

  console.log('Average Enhancement:', protocol.getMetrics().averageEnhancementLevel);
}
```

## Self-Healing Example

```typescript
import { Protocol110System } from '110-protocol-system';

async function selfHealingExample() {
  const protocol = new Protocol110System({ enableSelfHealing: true });

  try {
    const result = await protocol.execute(async () => {
      // Simulated network call that might fail
      const response = await fetch('https://api.example.com/data');
      if (!response.ok) throw new Error('Network error');
      return await response.json();
    }, 'network-operation');

    console.log('Success:', result.success);
  } catch (error) {
    console.error('Failed even with self-healing:', error);
  }

  // Check metrics
  const metrics = protocol.getMetrics();
  console.log('Success Rate:', 
    (metrics.successfulOperations / metrics.totalOperations) * 100);
}
```

## Self-Learning Example

```typescript
import { SelfLearningSystem } from '110-protocol-system';

async function selfLearningExample() {
  const learning = new SelfLearningSystem();

  // Record user login patterns
  learning.recordPattern('user-login-morning', true);
  learning.recordPattern('user-login-morning', true);
  learning.recordPattern('user-login-morning', true);
  learning.recordPattern('user-login-evening', false);
  learning.recordPattern('user-login-evening', false);

  // Generate insights
  const insights = learning.generateInsights();
  console.log('Insights:', insights);

  // Get successful patterns
  const successfulPatterns = learning.getSuccessfulPatterns(0.8);
  console.log('Successful Patterns:', successfulPatterns);
}
```

## Integration Example

```typescript
import { 
  IntegrationManager, 
  HttpIntegrationAdapter,
  Protocol110System 
} from '110-protocol-system';

async function integrationExample() {
  // Setup integrations
  const manager = new IntegrationManager();
  const apiAdapter = new HttpIntegrationAdapter('external-api', 'https://api.example.com');
  
  manager.registerAdapter(apiAdapter);
  await manager.connectAll();

  // Use with protocol
  const protocol = new Protocol110System();

  const result = await protocol.execute(async () => {
    const adapter = manager.getAdapter('external-api');
    
    // Send data to external API
    await adapter?.send({
      event: 'user-action',
      timestamp: new Date(),
      data: { action: 'clicked-button' },
    });

    return { sent: true };
  }, 'send-analytics');

  console.log('Result:', result);

  // Cleanup
  await manager.disconnectAll();
}
```

## API Controller Example

```typescript
import { Protocol110System, ProtocolApiController } from '110-protocol-system';
import express from 'express';

async function apiExample() {
  const protocol = new Protocol110System();
  const api = new ProtocolApiController(protocol);
  
  const app = express();
  app.use(express.json());

  // Health check endpoint
  app.get('/health', async (req, res) => {
    const health = await api.healthCheck();
    res.json(health);
  });

  // Metrics endpoint
  app.get('/metrics', async (req, res) => {
    const metrics = await api.getMetrics();
    res.json(metrics);
  });

  // Recommendations endpoint
  app.get('/recommendations', async (req, res) => {
    const limit = parseInt(req.query.limit as string) || 10;
    const recommendations = await api.getRecommendations(limit);
    res.json(recommendations);
  });

  // Execute operation endpoint
  app.post('/execute', async (req, res) => {
    const result = await api.executeOperation(req.body);
    res.json(result);
  });

  app.listen(3000, () => {
    console.log('API server running on port 3000');
  });
}
```

## Monitoring Example

```typescript
import { Protocol110System } from '110-protocol-system';

async function monitoringExample() {
  const protocol = new Protocol110System();

  // Setup periodic health checks
  setInterval(() => {
    const health = protocol.getHealthCheck();
    
    if (!health.healthy) {
      console.error('ALERT: System unhealthy!', health.issues);
      // Send alert to monitoring system
    }

    console.log('Health Status:', {
      healthy: health.healthy,
      uptime: health.metrics.uptime / 1000 / 60, // minutes
      successRate: health.metrics.successRate.toFixed(2) + '%',
      enhancementRate: health.metrics.enhancementRate.toFixed(2) + '%',
    });
  }, 60000); // Every minute

  // Execute some operations
  for (let i = 0; i < 10; i++) {
    await protocol.execute(async () => {
      return { iteration: i };
    }, `operation-${i}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}
```

## Advanced: Complete Application

```typescript
import {
  Protocol110System,
  ProtocolApiController,
  IntegrationManager,
  HttpIntegrationAdapter,
  SelfLearningSystem,
  EnhancementLevel,
  Priority,
} from '110-protocol-system';

class Application {
  private protocol: Protocol110System;
  private api: ProtocolApiController;
  private integrations: IntegrationManager;
  private learning: SelfLearningSystem;

  constructor() {
    // Initialize protocol with production config
    this.protocol = new Protocol110System({
      minEnhancementLevel: EnhancementLevel.ENHANCED,
      enableSelfHealing: true,
      enableSelfLearning: true,
      enableContinuousImprovement: true,
      monitoringInterval: 60000,
      maxRecommendations: 100,
    });

    // Initialize API
    this.api = new ProtocolApiController(this.protocol);

    // Initialize integrations
    this.integrations = new IntegrationManager();
    this.integrations.registerAdapter(
      new HttpIntegrationAdapter('metrics', process.env.METRICS_URL!)
    );

    // Initialize learning
    this.learning = new SelfLearningSystem();
  }

  async start() {
    // Connect integrations
    await this.integrations.connectAll();

    // Start monitoring
    this.startMonitoring();

    // Start processing
    this.startProcessing();

    console.log('Application started with 110% protocol');
  }

  private startMonitoring() {
    setInterval(() => {
      const health = this.protocol.getHealthCheck();
      const metrics = this.protocol.getMetrics();

      // Send metrics to external system
      const metricsAdapter = this.integrations.getAdapter('metrics');
      metricsAdapter?.send({
        timestamp: new Date(),
        health,
        metrics,
      }).catch(console.error);

      // Generate learning insights
      const insights = this.learning.generateInsights();
      if (insights.length > 0) {
        console.log('New insights:', insights);
      }
    }, 60000);
  }

  private async startProcessing() {
    // Example processing loop
    while (true) {
      try {
        const result = await this.protocol.execute(async () => {
          // Business logic
          const data = await this.processData();
          
          // Record pattern
          this.learning.recordPattern('data-processing', true, { size: data.length });
          
          return data;
        }, 'process-data');

        console.log('Processed:', result.data);

        // Check recommendations
        const topRecommendations = this.protocol.getTopRecommendations(5);
        if (topRecommendations.some(r => r.priority === Priority.CRITICAL)) {
          console.warn('Critical recommendations:', topRecommendations);
        }
      } catch (error) {
        console.error('Processing error:', error);
        this.learning.recordPattern('data-processing', false);
      }

      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  private async processData() {
    // Simulate data processing
    return Array.from({ length: 100 }, (_, i) => ({ id: i, value: Math.random() }));
  }

  async shutdown() {
    console.log('Shutting down...');
    await this.integrations.disconnectAll();
    console.log('Shutdown complete');
  }
}

// Run application
const app = new Application();
app.start().catch(console.error);

// Graceful shutdown
process.on('SIGTERM', () => app.shutdown());
process.on('SIGINT', () => app.shutdown());
```
