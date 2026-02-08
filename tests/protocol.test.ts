import { test } from 'tap';
import { Protocol110System } from '../src/protocol';
import { EnhancementLevel, Priority } from '../src/types';

test('Protocol110System - initialization', async (t) => {
  const protocol = new Protocol110System();
  
  t.ok(protocol, 'Protocol should be initialized');
  
  const config = protocol.getConfig();
  t.equal(config.minEnhancementLevel, EnhancementLevel.ENHANCED, 'Default enhancement level should be ENHANCED');
  t.equal(config.enableSelfHealing, true, 'Self-healing should be enabled by default');
  t.equal(config.enableSelfLearning, true, 'Self-learning should be enabled by default');
});

test('Protocol110System - custom configuration', async (t) => {
  const protocol = new Protocol110System({
    minEnhancementLevel: EnhancementLevel.EXCEPTIONAL,
    enableSelfHealing: false,
    maxRecommendations: 25,
  });
  
  const config = protocol.getConfig();
  t.equal(config.minEnhancementLevel, EnhancementLevel.EXCEPTIONAL, 'Custom enhancement level should be set');
  t.equal(config.enableSelfHealing, false, 'Self-healing should be disabled');
  t.equal(config.maxRecommendations, 25, 'Max recommendations should be 25');
});

test('Protocol110System - execute operation success', async (t) => {
  const protocol = new Protocol110System();
  
  const result = await protocol.execute(async () => {
    return { message: 'Success' };
  }, 'test-operation');

  t.equal(result.success, true, 'Operation should succeed');
  t.ok(result.data, 'Should have data');
  t.equal(result.data.message, 'Success', 'Data should match');
  t.ok(result.enhancements.length > 0, 'Should have enhancements');
  t.ok(result.recommendations.length > 0, 'Should have recommendations');
  t.ok(result.metadata.executionTime >= 0, 'Should have execution time');
});

test('Protocol110System - execute operation with error and self-healing', async (t) => {
  const protocol = new Protocol110System({ enableSelfHealing: true });
  
  // Self-healing actually returns a success result instead of throwing
  const result = await protocol.execute(async () => {
    throw new Error('Test error');
  }, 'failing-operation');
  
  // The operation gets healed and returns a successful result
  t.ok(result.success, 'Operation should succeed after self-healing');
  t.ok(result.recommendations.length > 0, 'Should have healing recommendations');
  
  const metrics = protocol.getMetrics();
  t.ok(metrics.totalOperations > 0, 'Should have recorded operations');
});

test('Protocol110System - health check', async (t) => {
  const protocol = new Protocol110System();
  
  // Execute some operations first
  await protocol.execute(async () => ({ status: 'ok' }), 'op1');
  await protocol.execute(async () => ({ status: 'ok' }), 'op2');
  
  const health = protocol.getHealthCheck();
  
  t.ok(health, 'Should return health check');
  t.equal(health.healthy, true, 'System should be healthy');
  t.ok(health.metrics, 'Should have metrics');
  t.ok(health.metrics.uptime >= 0, 'Should have uptime');
  t.ok(health.metrics.successRate >= 0, 'Should have success rate');
});

test('Protocol110System - metrics tracking', async (t) => {
  const protocol = new Protocol110System();
  
  await protocol.execute(async () => 'test1', 'op1');
  await protocol.execute(async () => 'test2', 'op2');
  
  const metrics = protocol.getMetrics();
  
  t.equal(metrics.totalOperations, 2, 'Should have 2 total operations');
  t.equal(metrics.successfulOperations, 2, 'Should have 2 successful operations');
  t.ok(metrics.averageEnhancementLevel >= EnhancementLevel.BASELINE, 'Should have average enhancement level');
});

test('Protocol110System - getEnhancements', async (t) => {
  const protocol = new Protocol110System();
  
  await protocol.execute(async () => 'test', 'test-op');
  
  const enhancements = protocol.getEnhancements();
  t.ok(enhancements.length > 0, 'Should have enhancements');
  t.ok(enhancements[0].id, 'Enhancement should have ID');
});

test('Protocol110System - getRecommendations', async (t) => {
  const protocol = new Protocol110System();
  
  await protocol.execute(async () => 'test', 'test-op');
  
  const recommendations = protocol.getRecommendations();
  t.ok(recommendations.length > 0, 'Should have recommendations');
  t.ok(recommendations[0].id, 'Recommendation should have ID');
});

test('Protocol110System - getTopRecommendations', async (t) => {
  const protocol = new Protocol110System();
  
  await protocol.execute(async () => 'test', 'test-op');
  
  const topRecommendations = protocol.getTopRecommendations(5);
  t.ok(topRecommendations.length <= 5, 'Should return at most 5 recommendations');
});

test('Protocol110System - continuous improvement disabled', async (t) => {
  const protocol = new Protocol110System({ enableContinuousImprovement: false });
  
  const result = await protocol.execute(async () => 'test', 'test-op');
  
  t.equal(result.enhancements.length, 0, 'Should have no enhancements when disabled');
  t.equal(result.recommendations.length, 0, 'Should have no recommendations when disabled');
});
