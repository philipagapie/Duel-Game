import { Ability } from './Ability';
import { DamageReduction } from './DamageReduction';
import { PowerStrike } from './PowerStrike';
import { SecondWind } from './SecondWind';
import { VampireStrike } from './VampireStrike';

class AbilityRegistry {
  private readonly abilities: Ability[] = [
    new DamageReduction(),
    new PowerStrike(),
    new SecondWind(),
    new VampireStrike(),
  ];

  register(ability: Ability): void {
    this.abilities.push(ability);
  }

  getRandom(): Ability {
    const index = Math.floor(Math.random() * this.abilities.length);
    return this.abilities[index]!;
  }
}

export const abilityRegistry = new AbilityRegistry();