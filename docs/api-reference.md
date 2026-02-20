# API Reference

## Protocol110System

Main class for the 110% Protocol System.

### Constructor

```typescript
constructor(config?: Partial<ProtocolConfig>)
```

#### Parameters

- `config` (optional): Configuration object
  - `minEnhancementLevel`: Minimum enhancement level (default: ENHANCED)
  - `enableSelfHealing`: Enable self-healing (default: true)
  - `enableSelfLearning`: Enable self-learning (default: true)
  - `enableContinuousImprovement`: Enable continuous improvement (default: true)
  - `monitoringInterval`: Monitoring interval in ms (default: 60000)
  - `maxRecommendations`: Maximum recommendations (default: 50)

### Methods

#### execute<T>(operation, operationName?)

Executes an operation with the 110% protocol.

```typescript
async execute<T>(
  operation: () => Promise<T> | T,
  operationName?: string
): Promise<OperationResult<T>>
```

**Returns**: `OperationResult<T>` with enhancements and recommendations

#### getHealthCheck()

Returns system health status.

```typescript
getHealthCheck(): HealthCheck
```

**Returns**: Health check object with metrics

#### getMetrics()

Returns system metrics.

```typescript
getMetrics(): SystemMetrics
```

**Returns**: Metrics object

#### getEnhancements()

Returns all enhancements.

```typescript
getEnhancements(): Enhancement[]
```

#### getRecommendations()

Returns all recommendations.

```typescript
getRecommendations(): Recommendation[]
```

#### getTopRecommendations(limit)

Returns top recommendations by impact.

```typescript
getTopRecommendations(limit?: number): Recommendation[]
```

#### getConfig()

Returns current configuration.

```typescript
getConfig(): ProtocolConfig
```

## ProtocolApiController

API controller for HTTP/REST endpoints.

### Constructor

```typescript
constructor(protocol: Protocol110System)
```

### Methods

#### healthCheck()

Health check endpoint.

```typescript
async healthCheck(): Promise<ApiResponse<HealthCheck>>
```

#### getMetrics()

Metrics endpoint.

```typescript
async getMetrics(): Promise<ApiResponse<SystemMetrics>>
```

#### getEnhancements()

Enhancements endpoint.

```typescript
async getEnhancements(): Promise<ApiResponse>
```

#### getRecommendations(limit?)

Recommendations endpoint.

```typescript
async getRecommendations(limit?: number): Promise<ApiResponse>
```

#### executeOperation(request)

Execute operation endpoint.

```typescript
async executeOperation(request: ApiRequest): Promise<ApiResponse<OperationResult>>
```

## SelfHealingSystem

Self-healing capabilities.

### Methods

#### heal(error)

Attempts to heal from an error.

```typescript
async heal(error: Error): Promise<boolean>
```

**Returns**: `true` if healing succeeded

#### registerStrategy(strategy)

Registers a healing strategy.

```typescript
registerStrategy(strategy: HealingStrategy): void
```

#### getHistory()

Returns healing history.

```typescript
getHistory(): HealingAttempt[]
```

#### getSuccessRate()

Returns healing success rate.

```typescript
getSuccessRate(): number
```

## SelfLearningSystem

Self-learning capabilities.

### Methods

#### recordPattern(pattern, success, metadata?)

Records a pattern observation.

```typescript
recordPattern(
  pattern: string,
  success: boolean,
  metadata?: Record<string, unknown>
): LearningPattern
```

#### generateInsights()

Generates insights from patterns.

```typescript
generateInsights(): LearningInsight[]
```

#### getPatterns()

Returns all patterns.

```typescript
getPatterns(): LearningPattern[]
```

#### getSuccessfulPatterns(minSuccessRate?)

Returns successful patterns.

```typescript
getSuccessfulPatterns(minSuccessRate?: number): LearningPattern[]
```

## IntegrationManager

Manages integration adapters.

### Methods

#### registerAdapter(adapter)

Registers an adapter.

```typescript
registerAdapter(adapter: IntegrationAdapter): void
```

#### getAdapter(name)

Gets an adapter by name.

```typescript
getAdapter(name: string): IntegrationAdapter | undefined
```

#### connectAll()

Connects all adapters.

```typescript
async connectAll(): Promise<boolean>
```

#### disconnectAll()

Disconnects all adapters.

```typescript
async disconnectAll(): Promise<boolean>
```

## Types

### EnhancementLevel

```typescript
enum EnhancementLevel {
  BASELINE = 100,
  ENHANCED = 110,
  EXCEPTIONAL = 120,
  TRANSFORMATIVE = 150,
}
```

### Priority

```typescript
enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}
```

### OperationStatus

```typescript
enum OperationStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  SUCCESS = 'success',
  FAILED = 'failed',
  ENHANCED = 'enhanced',
}
```

### Enhancement

```typescript
interface Enhancement {
  id: string;
  description: string;
  impact: EnhancementLevel;
  priority: Priority;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}
```

### Recommendation

```typescript
interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  estimatedImpact: number;
  category: string;
  actionable: boolean;
  timestamp: Date;
}
```

### OperationResult<T>

```typescript
interface OperationResult<T = unknown> {
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
```
