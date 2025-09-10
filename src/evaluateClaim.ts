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
}