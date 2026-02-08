import { test } from 'tap';
import { SelfLearningSystem } from '../src/self-learning';

test('SelfLearningSystem - record pattern', async (t) => {
  const learning = new SelfLearningSystem();

  const pattern = learning.recordPattern('test-pattern', true);

  t.ok(pattern.id, 'Pattern should have an ID');
  t.equal(pattern.pattern, 'test-pattern', 'Pattern name should match');
  t.equal(pattern.frequency, 1, 'Frequency should be 1');
  t.equal(pattern.successRate, 1, 'Success rate should be 1');
});

test('SelfLearningSystem - update existing pattern', async (t) => {
  const learning = new SelfLearningSystem();

  learning.recordPattern('repeat-pattern', true);
  learning.recordPattern('repeat-pattern', true);
  const pattern = learning.recordPattern('repeat-pattern', false);

  t.equal(pattern.frequency, 3, 'Frequency should be 3');
  t.ok(pattern.successRate < 1, 'Success rate should be less than 1');
  t.ok(pattern.successRate > 0, 'Success rate should be greater than 0');
});

test('SelfLearningSystem - calculate success rate correctly', async (t) => {
  const learning = new SelfLearningSystem();

  // 3 successes, 1 failure = 0.75 success rate
  learning.recordPattern('calc-pattern', true);
  learning.recordPattern('calc-pattern', true);
  learning.recordPattern('calc-pattern', true);
  const pattern = learning.recordPattern('calc-pattern', false);

  t.equal(pattern.frequency, 4, 'Frequency should be 4');
  t.equal(pattern.successRate, 0.75, 'Success rate should be 0.75');
});

test('SelfLearningSystem - getPatterns', async (t) => {
  const learning = new SelfLearningSystem();

  learning.recordPattern('pattern1', true);
  learning.recordPattern('pattern2', false);

  const patterns = learning.getPatterns();
  t.equal(patterns.length, 2, 'Should have 2 patterns');
});

test('SelfLearningSystem - getSuccessfulPatterns', async (t) => {
  const learning = new SelfLearningSystem();

  // High success pattern
  for (let i = 0; i < 9; i++) {
    learning.recordPattern('high-success', true);
  }
  learning.recordPattern('high-success', false);

  // Low success pattern
  for (let i = 0; i < 5; i++) {
    learning.recordPattern('low-success', false);
  }
  learning.recordPattern('low-success', true);

  const successful = learning.getSuccessfulPatterns(0.8);
  t.equal(successful.length, 1, 'Should have 1 successful pattern');
  t.equal(successful[0].pattern, 'high-success', 'Should be the high-success pattern');
});

test('SelfLearningSystem - generateInsights for high performers', async (t) => {
  const learning = new SelfLearningSystem();

  // Create a high-performing pattern
  for (let i = 0; i < 10; i++) {
    learning.recordPattern('high-performer', true);
  }

  const insights = learning.generateInsights();

  t.ok(insights.length > 0, 'Should generate insights');
  const highPerformerInsight = insights.find((i) => i.category === 'high-performer');
  t.ok(highPerformerInsight, 'Should have high-performer insight');
  t.ok(highPerformerInsight.confidence >= 0.9, 'Confidence should be high');
});

test('SelfLearningSystem - generateInsights for low performers', async (t) => {
  const learning = new SelfLearningSystem();

  // Create a low-performing pattern
  for (let i = 0; i < 10; i++) {
    learning.recordPattern('low-performer', false);
  }

  const insights = learning.generateInsights();

  const lowPerformerInsight = insights.find((i) => i.category === 'needs-improvement');
  t.ok(lowPerformerInsight, 'Should have needs-improvement insight');
});

test('SelfLearningSystem - no insights for insufficient data', async (t) => {
  const learning = new SelfLearningSystem();

  // Only 3 observations (below threshold of 5)
  learning.recordPattern('insufficient', true);
  learning.recordPattern('insufficient', true);
  learning.recordPattern('insufficient', true);

  const insights = learning.generateInsights();

  t.equal(insights.length, 0, 'Should not generate insights with insufficient data');
});

test('SelfLearningSystem - pattern metadata', async (t) => {
  const learning = new SelfLearningSystem();

  const metadata = { source: 'test', version: '1.0' };
  const pattern = learning.recordPattern('meta-pattern', true, metadata);

  t.ok(pattern.metadata, 'Pattern should have metadata');
  t.equal(pattern.metadata.source, 'test', 'Metadata should be preserved');
});

test('SelfLearningSystem - clear data', async (t) => {
  const learning = new SelfLearningSystem();

  learning.recordPattern('pattern1', true);
  learning.generateInsights();

  learning.clear();

  t.equal(learning.getPatterns().length, 0, 'Patterns should be cleared');
  t.equal(learning.getInsights().length, 0, 'Insights should be cleared');
});
