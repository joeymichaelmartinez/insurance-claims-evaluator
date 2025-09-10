import evaluateClaim from '../src/evaluateClaim';
import { examplePolicies } from '../data/mockPolicies';
import { Claim, EvaluationResult } from '../src/types';

describe('evaluateClaim', () => {
  it('rejects claim if policy is not active on incident date', () => {
    const claim: Claim = {
      policyId: 'POL123',
      incidentType: 'fire',
      incidentDate: new Date('2025-01-01'),
      amountClaimed: 3000,
    };

    const result: EvaluationResult = evaluateClaim(claim, examplePolicies);

    expect(result).toEqual({
      approved: false,
      payout: 0,
      reasonCode: 'POLICY_INACTIVE',
    });
  });

  it('rejects claim if incident type is not covered', () => {
    const claim: Claim = {
      policyId: 'POL123',
      incidentType: 'water damage',
      incidentDate: new Date('2023-06-15'),
      amountClaimed: 3000,
    };

    const result: EvaluationResult = evaluateClaim(claim, examplePolicies);

    expect(result).toEqual({
      approved: false,
      payout: 0,
      reasonCode: 'NOT_COVERED',
    });
  });

  it('coverage limit has been reached', () => {
    const claim: Claim = {
      policyId: 'POL456',
      incidentType: 'fire',
      incidentDate: new Date('2023-06-15'),
      amountClaimed: 60000,
    };

    const result: EvaluationResult = evaluateClaim(claim, examplePolicies);

    expect(result).toEqual({
      approved: false,
      payout: 0,
      reasonCode: 'COVERAGE_LIMIT_REACHED',
    });
  });

  it('returns zero payout if amountClaimed is less than deductible', () => {
    const claim: Claim = {
      policyId: 'POL456',
      incidentType: 'fire',
      incidentDate: new Date('2023-06-15'),
      amountClaimed: 150,
    };

    const result: EvaluationResult = evaluateClaim(claim, examplePolicies);

    expect(result).toEqual({
      approved: false,
      payout: 0,
      reasonCode: 'ZERO_PAYOUT',
    });
  });

  it('approves claim when policy is active and incident is covered', () => {
    const claim: Claim = {
      policyId: 'POL123',
      incidentType: 'fire',
      incidentDate: new Date('2023-06-15'),
      amountClaimed: 3000,
    };

    const result: EvaluationResult = evaluateClaim(claim, examplePolicies);

    expect(result).toEqual({
      approved: true,
      payout: 2500, // 3000 - 500
      reasonCode: 'APPROVED',
    });
  });
});
