import { Ability, AbilityResult, AttackContext } from './Ability';
import { ACTIVATION_CHANCE } from '../constants';

export class PowerStrike implements Ability {
  readonly name = 'Power Strike';

  onAttack({ rawDamage }: AttackContext): AbilityResult {
    // A successful roll boosts the attack by 50 percent
    const activated = Math.random() < ACTIVATION_CHANCE;
    return {
      activated,
      value: activated ? Math.floor(rawDamage * 1.5) : rawDamage,
      description: 'attacks with 50% more power',
    };
  }
}
