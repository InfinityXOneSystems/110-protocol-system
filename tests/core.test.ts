import { test } from 'tap';
import { EnhancementTracker, RecommendationEngine } from '../src/core';
import { EnhancementLevel, Priority } from '../src/types';

test('EnhancementTracker - createEnhancement', async (t) => {
  const tracker = new EnhancementTracker();

  const enhancement = tracker.createEnhancement(
    'Test enhancement',
    EnhancementLevel.ENHANCED,
    Priority.HIGH
  );

  t.ok(enhancement.id, 'Enhancement should have an ID');
  t.equal(enhancement.description, 'Test enhancement', 'Description should match');
  t.equal(enhancement.impact, EnhancementLevel.ENHANCED, 'Impact should match');
  t.equal(enhancement.priority, Priority.HIGH, 'Priority should match');
  t.ok(enhancement.timestamp instanceof Date, 'Timestamp should be a Date');
});

test('EnhancementTracker - getEnhancements', async (t) => {
  const tracker = new EnhancementTracker();

  tracker.createEnhancement('Enhancement 1', EnhancementLevel.ENHANCED, Priority.HIGH);
  tracker.createEnhancement('Enhancement 2', EnhancementLevel.EXCEPTIONAL, Priority.MEDIUM);

  const enhancements = tracker.getEnhancements();
  t.equal(enhancements.length, 2, 'Should have 2 enhancements');
});

test('EnhancementTracker - getEnhancementsByPriority', async (t) => {
  const tracker = new EnhancementTracker();

  tracker.createEnhancement('High 1', EnhancementLevel.ENHANCED, Priority.HIGH);
  tracker.createEnhancement('Medium 1', EnhancementLevel.ENHANCED, Priority.MEDIUM);
  tracker.createEnhancement('High 2', EnhancementLevel.ENHANCED, Priority.HIGH);

  const highPriority = tracker.getEnhancementsByPriority(Priority.HIGH);
  t.equal(highPriority.length, 2, 'Should have 2 high priority enhancements');
});

test('EnhancementTracker - getEnhancementsByImpact', async (t) => {
  const tracker = new EnhancementTracker();

  tracker.createEnhancement('Enhanced', EnhancementLevel.ENHANCED, Priority.HIGH);
  tracker.createEnhancement('Exceptional', EnhancementLevel.EXCEPTIONAL, Priority.HIGH);
  tracker.createEnhancement('Transformative', EnhancementLevel.TRANSFORMATIVE, Priority.HIGH);

  const highImpact = tracker.getEnhancementsByImpact(EnhancementLevel.EXCEPTIONAL);
  t.equal(highImpact.length, 2, 'Should have 2 enhancements with exceptional or higher impact');
});

test('EnhancementTracker - getAverageEnhancementLevel', async (t) => {
  const tracker = new EnhancementTracker();

  tracker.createEnhancement('Enhanced', EnhancementLevel.ENHANCED, Priority.HIGH);
  tracker.createEnhancement('Exceptional', EnhancementLevel.EXCEPTIONAL, Priority.HIGH);

  const average = tracker.getAverageEnhancementLevel();
  t.equal(average, 115, 'Average should be 115');
});

test('RecommendationEngine - createRecommendation', async (t) => {
  const engine = new RecommendationEngine();

  const recommendation = engine.createRecommendation(
    'Test Recommendation',
    'This is a test',
    Priority.HIGH,
    85,
    'testing'
  );

  t.ok(recommendation.id, 'Recommendation should have an ID');
  t.equal(recommendation.title, 'Test Recommendation', 'Title should match');
  t.equal(recommendation.priority, Priority.HIGH, 'Priority should match');
  t.equal(recommendation.estimatedImpact, 85, 'Impact should match');
  t.equal(recommendation.category, 'testing', 'Category should match');
  t.equal(recommendation.actionable, true, 'Should be actionable by default');
});

test('RecommendationEngine - getRecommendationsByPriority', async (t) => {
  const engine = new RecommendationEngine();

  engine.createRecommendation('High 1', 'Test', Priority.HIGH, 80, 'test');
  engine.createRecommendation('Medium 1', 'Test', Priority.MEDIUM, 60, 'test');
  engine.createRecommendation('High 2', 'Test', Priority.HIGH, 90, 'test');

  const highPriority = engine.getRecommendationsByPriority(Priority.HIGH);
  t.equal(highPriority.length, 2, 'Should have 2 high priority recommendations');
});

test('RecommendationEngine - getTopRecommendations', async (t) => {
  const engine = new RecommendationEngine();

  engine.createRecommendation('Low Impact', 'Test', Priority.LOW, 30, 'test');
  engine.createRecommendation('High Impact', 'Test', Priority.HIGH, 95, 'test');
  engine.createRecommendation('Medium Impact', 'Test', Priority.MEDIUM, 60, 'test');

  const top = engine.getTopRecommendations(2);
  t.equal(top.length, 2, 'Should return top 2 recommendations');
  t.equal(top[0].estimatedImpact, 95, 'First should be highest impact');
  t.equal(top[1].estimatedImpact, 60, 'Second should be second highest impact');
});

test('RecommendationEngine - getActionableRecommendations', async (t) => {
  const engine = new RecommendationEngine();

  engine.createRecommendation('Actionable', 'Test', Priority.HIGH, 80, 'test', true);
  engine.createRecommendation('Not Actionable', 'Test', Priority.HIGH, 80, 'test', false);

  const actionable = engine.getActionableRecommendations();
  t.equal(actionable.length, 1, 'Should have 1 actionable recommendation');
  t.equal(actionable[0].title, 'Actionable', 'Should be the actionable one');
});
