import { Ability, AbilityResult, AttackContext } from './Ability';
import { ACTIVATION_CHANCE } from '../constants';

export class VampireStrike implements Ability {
    readonly name = 'Vampire Strike';

    onAttack({ rawDamage }: AttackContext): AbilityResult {
        // The heal is based on the damage dealt not the raw attack value
        const activated = Math.random() < ACTIVATION_CHANCE;
        return {
            activated,
            value: rawDamage,
            description: 'heals for 50% of damage dealt',
            healFraction: activated ? 0.5 : undefined,
        };
    }
}