import { Character } from './Character';
import { AbilityMode, Combat } from './Combat';
import { ConsoleLogger } from './Logger';
import { runSimulation } from './simulation';

// These flags switch between a single fight and the bulk simulation mode
const args = process.argv.slice(2);
const simulationMode = args.includes('--simulate');
const abilityMode: AbilityMode = args.includes('--fixed-abilities') ? 'fixed' : 'per-round';

const char1 = new Character('Character 1');
const char2 = new Character('Character 2');

if (simulationMode) {
  runSimulation(char1, char2, 1000, abilityMode);
} else {
  const combat = new Combat(new ConsoleLogger(), abilityMode);
  combat.run(char1, char2);
}
