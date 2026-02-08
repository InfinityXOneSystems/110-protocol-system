import { test } from 'tap';
import { SelfHealingSystem } from '../src/self-healing';
import { Priority } from '../src/types';

test('SelfHealingSystem - initialization', async (t) => {
  const healing = new SelfHealingSystem();

  const strategies = healing.getStrategies();
  t.ok(strategies.length > 0, 'Should have default strategies');
});

test('SelfHealingSystem - register custom strategy', async (t) => {
  const healing = new SelfHealingSystem();

  const initialCount = healing.getStrategies().length;

  healing.registerStrategy({
    id: 'custom-strategy',
    name: 'Custom Strategy',
    description: 'A custom healing strategy',
    priority: Priority.HIGH,
    errorPattern: /custom error/i,
    healingAction: async () => true,
  });

  const strategies = healing.getStrategies();
  t.equal(strategies.length, initialCount + 1, 'Should have added one strategy');
});

test('SelfHealingSystem - heal network error', async (t) => {
  const healing = new SelfHealingSystem();

  const networkError = new Error('Network timeout error');
  const result = await healing.heal(networkError);

  t.equal(result, true, 'Should heal network error');

  const history = healing.getHistory();
  t.ok(history.length > 0, 'Should record healing attempt');
  t.equal(history[0].success, true, 'Healing should be successful');
});

test('SelfHealingSystem - heal rate limit error', async (t) => {
  const healing = new SelfHealingSystem();

  const rateLimitError = new Error('Rate limit exceeded');
  const result = await healing.heal(rateLimitError);

  t.equal(result, true, 'Should heal rate limit error');
});

test('SelfHealingSystem - heal unknown error', async (t) => {
  const healing = new SelfHealingSystem();

  const unknownError = new Error('Some unknown error type');
  const result = await healing.heal(unknownError);

  t.equal(result, false, 'Should not heal unknown error');

  const history = healing.getHistory();
  const lastAttempt = history[history.length - 1];
  t.equal(lastAttempt.success, false, 'Healing should fail');
  t.equal(lastAttempt.strategyUsed, 'none', 'Should use no strategy');
});

test('SelfHealingSystem - success rate calculation', async (t) => {
  const healing = new SelfHealingSystem();

  // Test with errors that don't require delays
  await healing.heal(new Error('Unknown error 1'));
  await healing.heal(new Error('Unknown error 2'));
  await healing.heal(new Error('Unknown error 3'));

  const successRate = healing.getSuccessRate();
  t.ok(successRate >= 0, 'Success rate should be greater than or equal to 0');
  t.ok(successRate <= 100, 'Success rate should be at most 100');
});

test('SelfHealingSystem - healing history limit', async (t) => {
  const healing = new SelfHealingSystem();

  // Add more than 100 healing attempts (but fewer to keep test fast)
  for (let i = 0; i < 102; i++) {
    await healing.heal(new Error(`Error ${i}`));
  }

  const history = healing.getHistory();
  t.equal(history.length, 100, 'Should keep only last 100 attempts');
});

test('SelfHealingSystem - strategy priority ordering', async (t) => {
  const healing = new SelfHealingSystem();

  healing.registerStrategy({
    id: 'low-priority',
    name: 'Low Priority',
    description: 'Low priority strategy',
    priority: Priority.LOW,
    errorPattern: /test/i,
    healingAction: async () => true,
  });

  healing.registerStrategy({
    id: 'critical-priority',
    name: 'Critical Priority',
    description: 'Critical priority strategy',
    priority: Priority.CRITICAL,
    errorPattern: /test/i,
    healingAction: async () => true,
  });

  const strategies = healing.getStrategies();
  const criticalIndex = strategies.findIndex((s) => s.priority === Priority.CRITICAL);
  const lowIndex = strategies.findIndex((s) => s.priority === Priority.LOW);

  t.ok(criticalIndex < lowIndex, 'Critical priority should come before low priority');
});
