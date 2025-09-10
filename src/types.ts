export type IncidentType = 'accident' | 'theft' | 'fire' | 'water damage';

export interface Policy {
  policyId: string;
  startDate: Date;
  endDate: Date;
  deductible: number;
  coverageLimit: number;
  coveredIncidents: IncidentType[];
}

export interface Claim {
  policyId: string;
  incidentType: IncidentType;
  incidentDate: Date;
  amountClaimed: number;
}

export interface EvaluationResult {
  approved: boolean;
  payout: number;
  reasonCode: 'APPROVED' | 'POLICY_INACTIVE' | 'NOT_COVERED' | 'ZERO_PAYOUT' | 'COVERAGE_LIMIT_REACHED';
}