import { test } from 'tap';
import {
  validateEnhancement,
  validateRecommendation,
  validateOperationResult,
  validateProtocolConfig,
} from '../src/schema';
import { EnhancementLevel, Priority, OperationStatus } from '../src/types';

test('Schema validation - valid enhancement', async (t) => {
  const validEnhancement = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Test enhancement',
    impact: EnhancementLevel.ENHANCED,
    priority: Priority.HIGH,
    timestamp: new Date(),
  };

  const isValid = validateEnhancement(validEnhancement);
  t.equal(isValid, true, 'Valid enhancement should pass validation');
});

test('Schema validation - invalid enhancement (missing required field)', async (t) => {
  const invalidEnhancement = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Test enhancement',
    // missing impact and priority
    timestamp: new Date(),
  };

  const isValid = validateEnhancement(invalidEnhancement);
  t.equal(isValid, false, 'Invalid enhancement should fail validation');
});

test('Schema validation - valid recommendation', async (t) => {
  const validRecommendation = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    title: 'Test Recommendation',
    description: 'This is a test recommendation',
    priority: Priority.MEDIUM,
    estimatedImpact: 75,
    category: 'performance',
    actionable: true,
    timestamp: new Date(),
  };

  const isValid = validateRecommendation(validRecommendation);
  t.equal(isValid, true, 'Valid recommendation should pass validation');
});

test('Schema validation - invalid recommendation (impact out of range)', async (t) => {
  const invalidRecommendation = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    title: 'Test Recommendation',
    description: 'This is a test recommendation',
    priority: Priority.MEDIUM,
    estimatedImpact: 150, // out of range (0-100)
    category: 'performance',
    actionable: true,
    timestamp: new Date(),
  };

  const isValid = validateRecommendation(invalidRecommendation);
  t.equal(isValid, false, 'Invalid recommendation should fail validation');
});

test('Schema validation - valid operation result', async (t) => {
  const validResult = {
    success: true,
    status: OperationStatus.SUCCESS,
    data: { message: 'Success' },
    enhancements: [],
    recommendations: [],
    metadata: {
      executionTime: 100,
      timestamp: new Date(),
      version: '1.0.0',
    },
  };

  const isValid = validateOperationResult(validResult);
  t.equal(isValid, true, 'Valid operation result should pass validation');
});

test('Schema validation - valid protocol config', async (t) => {
  const validConfig = {
    minEnhancementLevel: EnhancementLevel.ENHANCED,
    enableSelfHealing: true,
    enableSelfLearning: true,
    enableContinuousImprovement: true,
    monitoringInterval: 60000,
    maxRecommendations: 50,
  };

  const isValid = validateProtocolConfig(validConfig);
  t.equal(isValid, true, 'Valid config should pass validation');
});

test('Schema validation - invalid protocol config (interval out of range)', async (t) => {
  const invalidConfig = {
    minEnhancementLevel: EnhancementLevel.ENHANCED,
    enableSelfHealing: true,
    enableSelfLearning: true,
    enableContinuousImprovement: true,
    monitoringInterval: 500, // below minimum
    maxRecommendations: 50,
  };

  const isValid = validateProtocolConfig(invalidConfig);
  t.equal(isValid, false, 'Invalid config should fail validation');
});
