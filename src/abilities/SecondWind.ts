import { Ability, AbilityResult, AfterDamageContext } from './Ability';
import { ACTIVATION_CHANCE, SECOND_WIND_HEAL, SECOND_WIND_THRESHOLD } from '../constants';

export class SecondWind implements Ability {
  readonly name = 'Second Wind';

  onAfterDamage({ newHealth }: AfterDamageContext): AbilityResult {
    // The heal only matters when the fighter is still alive and below the threshold
    const conditionMet = newHealth > 0 && newHealth < SECOND_WIND_THRESHOLD;
    const activated = conditionMet && Math.random() < ACTIVATION_CHANCE;
    return {
      activated,
      value: activated ? SECOND_WIND_HEAL : 0,
      description: `heals for ${SECOND_WIND_HEAL} HP`,
    };
  }
}
