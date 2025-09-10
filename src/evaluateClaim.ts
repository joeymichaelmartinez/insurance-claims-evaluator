import { EvaluationResult, Claim, Policy, ReasonCode } from './types';

export default function evaluateClaim(claim: Claim, policies: Policy[]): EvaluationResult  {
  const policy = policies.find((policy) => policy.policyId === claim.policyId);

  if (!policy) {
    return {
      approved: false,
      payout: 0,
      reasonCode: ReasonCode.POLICY_NOT_FOUND,
    };
  }

  if (claim.incidentDate < policy.startDate || claim.incidentDate > policy.endDate) {
    return {
      approved: false,
      payout: 0,
      reasonCode: ReasonCode.POLICY_INACTIVE,
    };
  }
  
  if (!policy.coveredIncidents.includes(claim.incidentType)) {
    return {
      approved: false,
      payout: 0,
      reasonCode: ReasonCode.NOT_COVERED,
    };
  }
  const payout = claim.amountClaimed - policy.deductible;

  if (payout < 0) {
    return {
      approved: false,
      payout: 0,
      reasonCode: ReasonCode.ZERO_PAYOUT,
    };
  }

  if (payout > policy.coverageLimit) {
    return {
      approved: false,
      payout: 0,
      reasonCode: ReasonCode.COVERAGE_LIMIT_REACHED,
    };
  }

  return {
    approved: true,
    payout,
    reasonCode: ReasonCode.APPROVED,
  };
}