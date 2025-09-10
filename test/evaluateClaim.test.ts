import evaluateClaim from '../src/evaluateClaim';

type IncidentType = 'accident' | 'theft' | 'fire' | 'water damage';

interface Policy {
  policyId: string;
  startDate: Date;
  endDate: Date;
  deductible: number;
  coverageLimit: number;
  coveredIncidents: IncidentType[];
}

const examplePolicies: Policy[] = [
  {
    policyId: 'POL123',
    startDate: new Date('2023-01-01'),
    endDate: new Date('2024-01-01'),
    deductible: 500,
    coverageLimit: 10000,
    coveredIncidents: ['accident', 'fire'],
  },
  {
    policyId: 'POL456',
    startDate: new Date('2022-06-01'),
    endDate: new Date('2025-06-01'),
    deductible: 250,
    coverageLimit: 50000,
    coveredIncidents: ['accident', 'theft', 'fire', 'water damage'],
  },
];

describe('evaluateClaim', () => {
  it('rejects claim if policy is not active on incident date', () => {
    const claim = {
      policyId: 'POL123',
      incidentType: 'fire',
      incidentDate: new Date('2025-01-01'),
      amountClaimed: 3000,
    };

    const result = evaluateClaim(claim, examplePolicies);

    expect(result).toEqual({
      approved: false,
      payout: 0,
      reasonCode: 'POLICY_INACTIVE',
    });
  });

  it('rejects claim if incident type is not covered', () => {
    const claim = {
      policyId: 'POL123',
      incidentType: 'water damage',
      incidentDate: new Date('2023-06-15'),
      amountClaimed: 3000,
    };

    const result = evaluateClaim(claim, examplePolicies);

    expect(result).toEqual({
      approved: false,
      payout: 0,
      reasonCode: 'NOT_COVERED',
    });
  });

  it('coverage limit has been reached', () => {
    const claim = {
      policyId: 'POL456',
      incidentType: 'fire',
      incidentDate: new Date('2023-06-15'),
      amountClaimed: 60000,
    };

    const result = evaluateClaim(claim, examplePolicies);

    expect(result).toEqual({
      approved: false,
      payout: 0,
      reasonCode: 'COVERAGE_LIMIT_REACHED',
    });
  });

  it('returns zero payout if amountClaimed is less than deductible', () => {
    const claim = {
      policyId: 'POL456',
      incidentType: 'fire',
      incidentDate: new Date('2023-06-15'),
      amountClaimed: 150,
    };

    const result = evaluateClaim(claim, examplePolicies);

    expect(result).toEqual({
      approved: false,
      payout: 0,
      reasonCode: 'ZERO_PAYOUT',
    });
  });

  it('approves claim when policy is active and incident is covered', () => {
    const claim = {
      policyId: 'POL123',
      incidentType: 'fire',
      incidentDate: new Date('2023-06-15'),
      amountClaimed: 3000,
    };

    const result = evaluateClaim(claim, examplePolicies);

    expect(result).toEqual({
      approved: true,
      payout: 2500, // 3000 - 500
      reasonCode: 'APPROVED',
    });
  });
});
