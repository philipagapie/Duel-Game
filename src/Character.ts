import { Ability } from './abilities/Ability';
import { abilityRegistry } from './abilities/abilityRegistry';
import {
  ATTACK_MAX,
  ATTACK_MIN,
  DEFENSE_MAX,
  DEFENSE_MIN,
  STARTING_HEALTH,
} from './constants';

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export class Character {
  readonly name: string;
  health: number;
  readonly attack: number;
  readonly defense: number;
  ability: Ability;

  constructor(name: string) {
    this.name = name;
    this.health = STARTING_HEALTH;
    this.attack = randomBetween(ATTACK_MIN, ATTACK_MAX);
    this.defense = randomBetween(DEFENSE_MIN, DEFENSE_MAX);
    this.ability = abilityRegistry.getRandom();
  }

  get isAlive(): boolean {
    return this.health > 0;
  }

  // Per round mode gives each fighter a fresh random ability
  refreshAbility(): void {
    this.ability = abilityRegistry.getRandom();
  }

  // Simulations reuse the same Character objects so health must be reset
  resetHealth(): void {
    this.health = STARTING_HEALTH;
  }
}
