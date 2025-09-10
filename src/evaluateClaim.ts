export default function evaluateClaim(claim: any, policies: any[]): any {
  const policy = policies.find((policy) => policy.policyId === claim.policyId);

  if (!policy) {
    throw new Error('Policy not found');
  }

  if (claim.incidentDate < policy.startDate || claim.incidentDate > policy.endDate) {
    return {
      approved: false,
      payout: 0,
      reasonCode: 'POLICY_INACTIVE',
    };
  }
  
  if (!policy.coveredIncidents.includes(claim.incidentType)) {
    return {
      approved: false,
      payout: 0,
      reasonCode: 'NOT_COVERED',
    };
  }
  const payout = claim.amountClaimed - policy.deductible;

  if (payout < 0) {
    return {
      approved: false,
      payout: 0,
      reasonCode: 'ZERO_PAYOUT',
    };
  }

  if (payout > policy.coverageLimit) {
    return {
      approved: false,
      payout: 0,
      reasonCode: 'COVERAGE_LIMIT_REACHED',
    };
  }

  return {
    approved: true,
    payout,
    reasonCode: 'APPROVED',
  };
}