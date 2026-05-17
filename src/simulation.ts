import { Character } from './Character';
import { AbilityMode, Combat } from './Combat';
import { SilentLogger } from './Logger';
import { SIMULATION_RUNS } from './constants';

export function runSimulation(
  char1: Character,
  char2: Character,
  runs = SIMULATION_RUNS,
  abilityMode: AbilityMode = 'per-round',
): void {
  // Track wins by name so the results print cleanly at the end
  const wins: Record<string, number> = {
    [char1.name]: 0,
    [char2.name]: 0,
  };
  let timeouts = 0;
  let draws = 0;

  // SilentLogger keeps the repeated runs focused on the final summary
  const combat = new Combat(new SilentLogger(), abilityMode);

  for (let i = 0; i < runs; i++) {
    char1.resetHealth();
    char2.resetHealth();

    const result = combat.run(char1, char2);

    if (result.timedOut) {
      timeouts++;
    }

    if (result.winner) {
      wins[result.winner.name] = (wins[result.winner.name] ?? 0) + 1;
    } else {
      draws++;
    }
  }

  const pct = (n: number): string => ((n / runs) * 100).toFixed(1);
  const w1 = wins[char1.name] ?? 0;
  const w2 = wins[char2.name] ?? 0;

  console.log('');
  console.log(`=== Simulation Results (${runs} runs, mode: ${abilityMode}) ===`);
  console.log(`${char1.name}: attack=${char1.attack}, defense=${char1.defense}`);
  console.log(`${char2.name}: attack=${char2.attack}, defense=${char2.defense}`);
  console.log('');
  console.log(`${char1.name} wins: ${w1} (${pct(w1)}%)`);
  console.log(`${char2.name} wins: ${w2} (${pct(w2)}%)`);
  if (timeouts > 0) {
    console.log(`Draws (round limit): ${draws} (${pct(draws)}%)`);
  }
}