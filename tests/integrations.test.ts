import { test } from 'tap';
import {
  IntegrationManager,
  HttpIntegrationAdapter,
  WebSocketIntegrationAdapter,
} from '../src/integrations';

test('HttpIntegrationAdapter - initialization', async (t) => {
  const adapter = new HttpIntegrationAdapter('test-http', 'http://example.com/api');

  t.equal(adapter.name, 'test-http', 'Name should match');
  t.equal(adapter.isConnected(), false, 'Should not be connected initially');
});

test('HttpIntegrationAdapter - connect and disconnect', async (t) => {
  const adapter = new HttpIntegrationAdapter('test-http', 'http://example.com/api');

  const connected = await adapter.connect();
  t.equal(connected, true, 'Should connect successfully');
  t.equal(adapter.isConnected(), true, 'Should be connected');

  const disconnected = await adapter.disconnect();
  t.equal(disconnected, true, 'Should disconnect successfully');
  t.equal(adapter.isConnected(), false, 'Should not be connected');
});

test('HttpIntegrationAdapter - send requires connection', async (t) => {
  const adapter = new HttpIntegrationAdapter('test-http', 'http://example.com/api');

  try {
    await adapter.send({ test: 'data' });
    t.fail('Should throw error when not connected');
  } catch (error) {
    t.ok(error, 'Should throw error');
  }
});

test('HttpIntegrationAdapter - send when connected', async (t) => {
  const adapter = new HttpIntegrationAdapter('test-http', 'http://example.com/api');

  await adapter.connect();
  const result = await adapter.send({ test: 'data' });

  t.equal(result, true, 'Send should succeed');
});

test('WebSocketIntegrationAdapter - initialization', async (t) => {
  const adapter = new WebSocketIntegrationAdapter('test-ws', 'ws://example.com');

  t.equal(adapter.name, 'test-ws', 'Name should match');
  t.equal(adapter.isConnected(), false, 'Should not be connected initially');
});

test('WebSocketIntegrationAdapter - connect and disconnect', async (t) => {
  const adapter = new WebSocketIntegrationAdapter('test-ws', 'ws://example.com');

  const connected = await adapter.connect();
  t.equal(connected, true, 'Should connect successfully');
  t.equal(adapter.isConnected(), true, 'Should be connected');

  const disconnected = await adapter.disconnect();
  t.equal(disconnected, true, 'Should disconnect successfully');
  t.equal(adapter.isConnected(), false, 'Should not be connected');
});

test('IntegrationManager - register adapter', async (t) => {
  const manager = new IntegrationManager();
  const adapter = new HttpIntegrationAdapter('test', 'http://example.com');

  manager.registerAdapter(adapter);

  const retrieved = manager.getAdapter('test');
  t.ok(retrieved, 'Should retrieve adapter');
  t.equal(retrieved?.name, 'test', 'Adapter name should match');
});

test('IntegrationManager - get all adapters', async (t) => {
  const manager = new IntegrationManager();

  manager.registerAdapter(new HttpIntegrationAdapter('http1', 'http://example1.com'));
  manager.registerAdapter(new HttpIntegrationAdapter('http2', 'http://example2.com'));

  const adapters = manager.getAdapters();
  t.equal(adapters.length, 2, 'Should have 2 adapters');
});

test('IntegrationManager - connect all adapters', async (t) => {
  const manager = new IntegrationManager();

  manager.registerAdapter(new HttpIntegrationAdapter('http1', 'http://example1.com'));
  manager.registerAdapter(new WebSocketIntegrationAdapter('ws1', 'ws://example1.com'));

  const result = await manager.connectAll();
  t.equal(result, true, 'Should connect all adapters');

  const connected = manager.getConnectedAdapters();
  t.equal(connected.length, 2, 'All adapters should be connected');
});

test('IntegrationManager - disconnect all adapters', async (t) => {
  const manager = new IntegrationManager();

  manager.registerAdapter(new HttpIntegrationAdapter('http1', 'http://example1.com'));
  manager.registerAdapter(new WebSocketIntegrationAdapter('ws1', 'ws://example1.com'));

  await manager.connectAll();
  const result = await manager.disconnectAll();

  t.equal(result, true, 'Should disconnect all adapters');

  const connected = manager.getConnectedAdapters();
  t.equal(connected.length, 0, 'No adapters should be connected');
});

test('IntegrationManager - get connected adapters', async (t) => {
  const manager = new IntegrationManager();

  const adapter1 = new HttpIntegrationAdapter('http1', 'http://example1.com');
  const adapter2 = new HttpIntegrationAdapter('http2', 'http://example2.com');

  manager.registerAdapter(adapter1);
  manager.registerAdapter(adapter2);

  await adapter1.connect();

  const connected = manager.getConnectedAdapters();
  t.equal(connected.length, 1, 'Should have 1 connected adapter');
  t.equal(connected[0].name, 'http1', 'Connected adapter should be http1');
});
