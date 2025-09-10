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

export enum ReasonCode {
  APPROVED = 'APPROVED',
  POLICY_INACTIVE = 'POLICY_INACTIVE',
  NOT_COVERED = 'NOT_COVERED',
  ZERO_PAYOUT = 'ZERO_PAYOUT',
  COVERAGE_LIMIT_REACHED = 'COVERAGE_LIMIT_REACHED',
  POLICY_NOT_FOUND = 'POLICY_NOT_FOUND',
}

export interface EvaluationResult {
  approved: boolean;
  payout: number;
  reasonCode: ReasonCode;
}