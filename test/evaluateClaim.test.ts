import evaluateClaim from '../src/evaluateClaim';
import { examplePolicies } from '../data/mockPolicies';
import { Claim, EvaluationResult, ReasonCode } from '../src/types';

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
      reasonCode: ReasonCode.POLICY_INACTIVE,
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
      reasonCode: ReasonCode.NOT_COVERED,
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
      reasonCode: ReasonCode.COVERAGE_LIMIT_REACHED,
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
      reasonCode: ReasonCode.ZERO_PAYOUT,
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
      payout: 2500,
      reasonCode: ReasonCode.APPROVED,
    });

    const claim2: Claim = {
      policyId: 'POL456',
      incidentType: 'theft',
      incidentDate: new Date('2023-06-15'),
      amountClaimed: 10000,
    };

    const result2: EvaluationResult = evaluateClaim(claim2, examplePolicies);

    expect(result2).toEqual({
      approved: true,
      payout: 9750,
      reasonCode: ReasonCode.APPROVED,
    });

    const claim3: Claim = {
      policyId: 'POL456',
      incidentType: 'water damage',
      incidentDate: new Date('2024-12-01'),
      amountClaimed: 2000,
    };
    const result3: EvaluationResult = evaluateClaim(claim3, examplePolicies);

    expect(result3).toEqual({
      approved: true,
      payout: 1750,
      reasonCode: ReasonCode.APPROVED,
    });
  });

  it('rejects claim if policy is not found', () => {
    const claim: Claim = {
      policyId: 'POL999',
      incidentType: 'fire',
      incidentDate: new Date('2023-06-15'),
      amountClaimed: 3000,
    };

    const result: EvaluationResult = evaluateClaim(claim, examplePolicies);

    expect(result).toEqual({
      approved: false,
      payout: 0,
      reasonCode: ReasonCode.POLICY_NOT_FOUND,
    });
  });

  it('approves claim on the exact startDate of the policy', () => {
    const claim: Claim = {
      policyId: 'POL123',
      incidentType: 'fire',
      incidentDate: new Date('2023-01-01'),
      amountClaimed: 3000,
    };

    const result = evaluateClaim(claim, examplePolicies);

    expect(result).toEqual({
      approved: true,
      payout: 2500,
      reasonCode: ReasonCode.APPROVED,
    });
  });

  it('approves claim on the exact endDate of the policy', () => {
    const claim: Claim = {
      policyId: 'POL456',
      incidentType: 'fire',
      incidentDate: new Date('2025-06-01'),
      amountClaimed: 3000,
    };

    const result = evaluateClaim(claim, examplePolicies);

    expect(result).toEqual({
      approved: true,
      payout: 2750,
      reasonCode: ReasonCode.APPROVED,
    });
  });

  it('returns zero payout when amountClaimed equals deductible', () => {
    const claim: Claim = {
      policyId: 'POL123',
      incidentType: 'fire',
      incidentDate: new Date('2023-06-15'),
      amountClaimed: 500,
    };

    const result = evaluateClaim(claim, examplePolicies);

    expect(result).toEqual({
      approved: false,
      payout: 0,
      reasonCode: ReasonCode.ZERO_PAYOUT,
    });
  });

  it('approves claim when payout equals coverage limit', () => {
    const claim: Claim = {
      policyId: 'POL123',
      incidentType: 'fire',
      incidentDate: new Date('2023-06-15'),
      amountClaimed: 10500, 
    };

    const result = evaluateClaim(claim, examplePolicies);

    expect(result).toEqual({
      approved: true,
      payout: 10000,
      reasonCode: ReasonCode.APPROVED,
    });
  });
});
