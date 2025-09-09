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
});
