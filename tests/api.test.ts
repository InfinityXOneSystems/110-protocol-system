import { test } from 'tap';
import { Protocol110System } from '../src/protocol';
import { ProtocolApiController } from '../src/api';

test('ProtocolApiController - health check', async (t) => {
  const protocol = new Protocol110System();
  const api = new ProtocolApiController(protocol);
  
  const response = await api.healthCheck();
  
  t.equal(response.success, true, 'Response should be successful');
  t.ok(response.data, 'Should have data');
  t.ok(response.data.healthy !== undefined, 'Should have healthy status');
  t.ok(response.timestamp, 'Should have timestamp');
});

test('ProtocolApiController - get metrics', async (t) => {
  const protocol = new Protocol110System();
  const api = new ProtocolApiController(protocol);
  
  const response = await api.getMetrics();
  
  t.equal(response.success, true, 'Response should be successful');
  t.ok(response.data, 'Should have metrics data');
  t.ok(response.data.totalOperations !== undefined, 'Should have total operations');
});

test('ProtocolApiController - get enhancements', async (t) => {
  const protocol = new Protocol110System();
  const api = new ProtocolApiController(protocol);
  
  // Execute an operation to create enhancements
  await protocol.execute(async () => 'test', 'test-op');
  
  const response = await api.getEnhancements();
  
  t.equal(response.success, true, 'Response should be successful');
  t.ok(Array.isArray(response.data), 'Data should be an array');
});

test('ProtocolApiController - get recommendations', async (t) => {
  const protocol = new Protocol110System();
  const api = new ProtocolApiController(protocol);
  
  // Execute an operation to create recommendations
  await protocol.execute(async () => 'test', 'test-op');
  
  const response = await api.getRecommendations();
  
  t.equal(response.success, true, 'Response should be successful');
  t.ok(Array.isArray(response.data), 'Data should be an array');
});

test('ProtocolApiController - get recommendations with limit', async (t) => {
  const protocol = new Protocol110System();
  const api = new ProtocolApiController(protocol);
  
  await protocol.execute(async () => 'test', 'test-op');
  
  const response = await api.getRecommendations(5);
  
  t.equal(response.success, true, 'Response should be successful');
  t.ok(Array.isArray(response.data), 'Data should be an array');
  t.ok((response.data as unknown[]).length <= 5, 'Should respect limit');
});

test('ProtocolApiController - execute operation', async (t) => {
  const protocol = new Protocol110System();
  const api = new ProtocolApiController(protocol);
  
  const request = {
    operation: 'test-operation',
    params: { key: 'value' },
  };
  
  const response = await api.executeOperation(request);
  
  t.equal(response.success, true, 'Response should be successful');
  t.ok(response.data, 'Should have result data');
  t.equal(response.data.success, true, 'Operation should succeed');
});

test('ProtocolApiController - get configuration', async (t) => {
  const protocol = new Protocol110System();
  const api = new ProtocolApiController(protocol);
  
  const response = await api.getConfig();
  
  t.equal(response.success, true, 'Response should be successful');
  t.ok(response.data, 'Should have config data');
});
