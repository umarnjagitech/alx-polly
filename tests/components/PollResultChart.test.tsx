import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PollResultChart from '@/components/PollResultChart';
import React from 'react';

const buildProps = (overrides: Partial<React.ComponentProps<typeof PollResultChart>> = {}) => {
  const options = [
    { id: 'o1', option_text: 'Alpha', position: 1 },
    { id: 'o2', option_text: 'Beta', position: 2 },
    { id: 'o3', option_text: 'Gamma', position: 3 },
  ];
  const votesByOptionId = new Map<string, number>([
    ['o1', 3],
    ['o2', 6],
    ['o3', 1],
  ]);

  return {
    question: 'Which option?',
    options,
    votesByOptionId,
    totalVotes: 10,
    showTitle: true,
    className: undefined,
    chartType: 'bar' as const,
    showToggle: true,
    ...overrides,
  };
};

describe('PollResultChart', () => {
  it('renders title, question and totals', () => {
    render(<PollResultChart {...buildProps()} />);
    expect(screen.getByText('Poll Results')).toBeInTheDocument();
    expect(screen.getByText('Which option?')).toBeInTheDocument();
    expect(screen.getByText(/10 total votes/)).toBeInTheDocument();
  });

  it('renders bar chart by default and shows percentages', () => {
    render(<PollResultChart {...buildProps()} />);

    // Option labels exist
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
    expect(screen.getByText('Gamma')).toBeInTheDocument();

    // Percentages (rounded) should appear; 3/10=30, 6/10=60, 1/10=10
    expect(screen.getAllByText('(30%)').length).toBeGreaterThan(0);
    expect(screen.getAllByText('(60%)').length).toBeGreaterThan(0);
    expect(screen.getAllByText('(10%)').length).toBeGreaterThan(0);
  });

  it('toggles to pie chart when clicking Pie and back to bar', async () => {
    const user = userEvent.setup();
    render(<PollResultChart {...buildProps()} />);

    await user.click(screen.getByRole('button', { name: 'Pie' }));

    // In pie chart mode, the SVG is present and the legend rows appear
    expect(document.querySelector('svg')).toBeInTheDocument();
    expect(screen.getByText('Alpha')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Bar' }));

    // Back to bar: bars visible again via text still present
    expect(screen.getByText('Beta')).toBeInTheDocument();
  });

  it('shows empty state when totalVotes is zero', () => {
    render(
      <PollResultChart
        {...buildProps({ totalVotes: 0, votesByOptionId: new Map() })}
      />
    );

    expect(screen.getByText('No votes yet')).toBeInTheDocument();
    expect(screen.getByText('Be the first to vote on this poll')).toBeInTheDocument();
  });
});
