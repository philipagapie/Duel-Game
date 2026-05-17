import { Ability, AbilityResult, DefendContext } from './Ability';
import { ACTIVATION_CHANCE } from '../constants';

export class DamageReduction implements Ability {
  readonly name = 'Damage Reduction';

  onDefend({ netDamage }: DefendContext): AbilityResult {
    // A successful roll cuts the incoming damage in half
    const activated = Math.random() < ACTIVATION_CHANCE;
    return {
      activated,
      value: activated ? Math.floor(netDamage / 2) : netDamage,
      description: 'takes only half damage',
    };
  }
}
