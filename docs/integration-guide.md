# Integration Guide

## Overview

The 110% Protocol System provides flexible integration capabilities through adapters. This guide covers how to integrate with external systems.

## Built-in Adapters

### HTTP Integration

```typescript
import { HttpIntegrationAdapter } from '110-protocol-system';

const httpAdapter = new HttpIntegrationAdapter(
  'my-api',
  'https://api.example.com'
);

await httpAdapter.connect();

// Send data
await httpAdapter.send({
  method: 'POST',
  endpoint: '/events',
  data: { event: 'user-login' },
});

// Receive data
const response = await httpAdapter.receive();
```

### WebSocket Integration

```typescript
import { WebSocketIntegrationAdapter } from '110-protocol-system';

const wsAdapter = new WebSocketIntegrationAdapter(
  'my-websocket',
  'wss://ws.example.com'
);

await wsAdapter.connect();

// Send message
await wsAdapter.send({ type: 'ping' });

// Listen for messages
const message = await wsAdapter.receive();
```

## Custom Adapters

Create custom adapters by extending `BaseIntegrationAdapter`:

```typescript
import { BaseIntegrationAdapter } from '110-protocol-system';

class DatabaseAdapter extends BaseIntegrationAdapter {
  private db: any;

  constructor(name: string, connectionString: string) {
    super(name);
    // Initialize database connection
  }

  async connect(): Promise<boolean> {
    try {
      // Connect to database
      this.connected = true;
      return true;
    } catch (error) {
      return false;
    }
  }

  async disconnect(): Promise<boolean> {
    try {
      // Close database connection
      this.connected = false;
      return true;
    } catch (error) {
      return false;
    }
  }

  async send(data: unknown): Promise<boolean> {
    if (!this.connected) {
      throw new Error('Not connected');
    }
    // Insert data into database
    return true;
  }

  async receive(): Promise<unknown> {
    if (!this.connected) {
      throw new Error('Not connected');
    }
    // Query data from database
    return {};
  }
}
```

## Message Queue Integration

### RabbitMQ Example

```typescript
class RabbitMQAdapter extends BaseIntegrationAdapter {
  private connection: any;
  private channel: any;
  private queue: string;

  constructor(name: string, url: string, queue: string) {
    super(name);
    this.queue = queue;
    // Initialize RabbitMQ connection
  }

  async connect(): Promise<boolean> {
    // Connect to RabbitMQ
    // this.connection = await amqp.connect(url);
    // this.channel = await this.connection.createChannel();
    // await this.channel.assertQueue(this.queue);
    this.connected = true;
    return true;
  }

  async send(data: unknown): Promise<boolean> {
    // await this.channel.sendToQueue(this.queue, Buffer.from(JSON.stringify(data)));
    return true;
  }

  async receive(): Promise<unknown> {
    // const message = await this.channel.get(this.queue);
    // return JSON.parse(message.content.toString());
    return {};
  }

  async disconnect(): Promise<boolean> {
    // await this.channel.close();
    // await this.connection.close();
    this.connected = false;
    return true;
  }
}
```

## Cloud Services Integration

### AWS Integration

```typescript
class AWSAdapter extends BaseIntegrationAdapter {
  private s3: any;
  private sqs: any;

  constructor(name: string, region: string) {
    super(name);
    // Initialize AWS SDK
  }

  async connect(): Promise<boolean> {
    this.connected = true;
    return true;
  }

  async disconnect(): Promise<boolean> {
    this.connected = false;
    return true;
  }

  async send(data: unknown): Promise<boolean> {
    // Send to SQS or store in S3
    return true;
  }

  async receive(): Promise<unknown> {
    // Receive from SQS or retrieve from S3
    return {};
  }
}
```

### Azure Integration

```typescript
class AzureAdapter extends BaseIntegrationAdapter {
  private serviceBus: any;

  constructor(name: string, connectionString: string) {
    super(name);
    // Initialize Azure SDK
  }

  async connect(): Promise<boolean> {
    this.connected = true;
    return true;
  }

  async disconnect(): Promise<boolean> {
    this.connected = false;
    return true;
  }

  async send(data: unknown): Promise<boolean> {
    // Send to Service Bus
    return true;
  }

  async receive(): Promise<unknown> {
    // Receive from Service Bus
    return {};
  }
}
```

## Integration Manager Usage

### Managing Multiple Integrations

```typescript
import { IntegrationManager } from '110-protocol-system';

const manager = new IntegrationManager();

// Register multiple adapters
manager.registerAdapter(new HttpIntegrationAdapter('api1', 'https://api1.com'));
manager.registerAdapter(new HttpIntegrationAdapter('api2', 'https://api2.com'));
manager.registerAdapter(new DatabaseAdapter('db', 'postgresql://...'));
manager.registerAdapter(new RabbitMQAdapter('mq', 'amqp://...', 'events'));

// Connect all
await manager.connectAll();

// Use specific adapter
const api1 = manager.getAdapter('api1');
await api1?.send({ action: 'sync' });

// Check connected adapters
const connected = manager.getConnectedAdapters();
console.log('Connected:', connected.map(a => a.name));

// Disconnect all
await manager.disconnectAll();
```

### Error Handling

```typescript
async function robustIntegration() {
  const manager = new IntegrationManager();
  
  try {
    manager.registerAdapter(httpAdapter);
    
    const connected = await manager.connectAll();
    if (!connected) {
      throw new Error('Failed to connect all adapters');
    }
    
    const adapter = manager.getAdapter('api1');
    if (!adapter || !adapter.isConnected()) {
      throw new Error('Adapter not available');
    }
    
    await adapter.send({ data: 'test' });
  } catch (error) {
    console.error('Integration error:', error);
    // Implement retry logic
  } finally {
    await manager.disconnectAll();
  }
}
```

## Best Practices

1. **Connection Pooling**: Reuse connections when possible
2. **Retry Logic**: Implement exponential backoff for failures
3. **Circuit Breaker**: Prevent cascading failures
4. **Health Checks**: Monitor adapter health regularly
5. **Graceful Degradation**: Continue operation if non-critical integrations fail
6. **Timeouts**: Set appropriate timeouts for all operations
7. **Logging**: Log all integration events for debugging

## Example: Complete Integration Setup

```typescript
import {
  Protocol110System,
  IntegrationManager,
  HttpIntegrationAdapter,
} from '110-protocol-system';

async function setupSystem() {
  // Initialize protocol
  const protocol = new Protocol110System({
    enableSelfHealing: true,
    enableContinuousImprovement: true,
  });

  // Initialize integrations
  const integrationManager = new IntegrationManager();
  
  // Add adapters
  const apiAdapter = new HttpIntegrationAdapter('main-api', process.env.API_URL!);
  const metricsAdapter = new HttpIntegrationAdapter('metrics', process.env.METRICS_URL!);
  
  integrationManager.registerAdapter(apiAdapter);
  integrationManager.registerAdapter(metricsAdapter);

  // Connect all
  await integrationManager.connectAll();

  // Use protocol with integration
  const result = await protocol.execute(async () => {
    const api = integrationManager.getAdapter('main-api');
    await api?.send({ event: 'operation-start' });
    
    const data = await performBusinessLogic();
    
    const metrics = integrationManager.getAdapter('metrics');
    await metrics?.send({ metric: 'operation-complete', value: 1 });
    
    return data;
  }, 'integrated-operation');

  return { protocol, integrationManager };
}
```
