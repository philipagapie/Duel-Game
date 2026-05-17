import { Character } from './Character';
import { MAX_ROUNDS } from './constants';
import { Logger } from './Logger';

export type AbilityMode = 'per-round' | 'fixed';

export interface CombatResult {
  winner: Character | null;
  rounds: number;
  timedOut: boolean;
}

export class Combat {
  constructor(
    private readonly logger: Logger,
    private readonly abilityMode: AbilityMode = 'per-round',
  ) { }

  run(char1: Character, char2: Character): CombatResult {
    // Start each fight by logging the two fighters stats
    this.logger.log(`${char1.name}: attack = ${char1.attack}, defense = ${char1.defense}`);
    this.logger.log(`${char2.name}: attack = ${char2.attack}, defense = ${char2.defense}`);
    this.logger.log('');

    let [attacker, defender] = Math.random() < 0.5
      ? [char1, char2]
      : [char2, char1];

    let round = 0;

    while (char1.isAlive && char2.isAlive && round < MAX_ROUNDS) {
      round++;

      // Refresh abilities each round when the mode allows it
      if (this.abilityMode === 'per-round') {
        attacker.refreshAbility();
        defender.refreshAbility();
      }

      // Resolve one attack and swap roles if the defender survives
      this.logger.log(`Round ${round}: ${attacker.name} attacks`);
      this.resolveAttack(attacker, defender);

      if (defender.isAlive) {
        [attacker, defender] = [defender, attacker];
      }

      this.logger.log('');
    }

    const timedOut = round >= MAX_ROUNDS;
    const winner = timedOut
      ? (char1.health > char2.health
          ? char1
          : char2.health > char1.health
            ? char2
            : null)
      : (char1.isAlive ? char1 : char2);

    if (timedOut) {
      if (winner) {
        this.logger.log(`Round limit reached — ${winner.name} wins with more remaining HP!`);
      } else {
        this.logger.log(`Round limit reached — Draw with both at ${char1.health} HP!`);
      }
    } else {
      this.logger.log(`${winner!.name} won!`);
    }

    return { winner, rounds: round, timedOut };
  }

  private resolveAttack(attacker: Character, defender: Character): void {
    const rawAttack = attacker.attack;
    let anyActivated = false;

    // Attack abilities can boost the base damage
    const attackResult = attacker.ability.onAttack?.({ rawDamage: rawAttack });
    const attackActivated = attackResult?.activated ?? false;

    let boostedAttack = rawAttack;
    if (attackActivated) {
      boostedAttack = attackResult!.value;
      this.logger.log(`  ${attacker.name} activates ${attacker.ability.name}: ${attackResult!.description}`);
      anyActivated = true;
    }

    // Defend abilities react to damage after armor is applied
    const netDamageBeforeDefend = Math.max(0, boostedAttack - defender.defense);
    const defendResult = defender.ability.onDefend?.({ netDamage: netDamageBeforeDefend });
    const defendActivated = defendResult?.activated ?? false;

    let finalDamage = netDamageBeforeDefend;
    if (defendActivated) {
      finalDamage = defendResult!.value;
      this.logger.log(`  ${defender.name} activates ${defender.ability.name}: ${defendResult!.description}`);
      anyActivated = true;
    }

    if (!anyActivated) {
      this.logger.log('  No ability activated');
    }

    // Apply the final damage after both ability hooks have run
    defender.health = Math.max(0, defender.health - finalDamage);
    this.logger.log(`  ${defender.name} has ${defender.health} health`);

    // Vampire Strike heals based on the damage that actually landed
    const healFraction = attackResult?.healFraction;
    if (healFraction && finalDamage > 0) {
      const heal = Math.floor(finalDamage * healFraction);
      if (heal > 0) {
        attacker.health += heal;
        this.logger.log(`  ${attacker.name} heals for ${heal} HP → ${attacker.health} HP`);
      }
    }

    // Second Wind can heal the defender after surviving the hit
    if (defender.isAlive) {
      const swResult = defender.ability.onAfterDamage?.({ newHealth: defender.health });
      if (swResult?.activated) {
        defender.health += swResult.value;
        this.logger.log(
          `  ${defender.name} activates ${defender.ability.name}: ${swResult.description} → ${defender.health} HP`,
        );
      }
    }
  }
}