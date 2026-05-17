export interface AttackContext {
  // Raw damage before any ability modifies it
  rawDamage: number;
}

export interface DefendContext {
  // Net damage after the defenders armor is applied
  netDamage: number;
}

export interface AfterDamageContext {
  // Health after damage has already been applied
  newHealth: number;
}

export interface AbilityResult {
  activated: boolean;
  value: number;
  description: string;
  // Some abilities heal based on the final damage dealt
  healFraction?: number;
}

export interface Ability {
  readonly name: string;

  // Attack hooks can increase or leave damage unchanged
  onAttack?(ctx: AttackContext): AbilityResult;

  // Defend hooks can reduce damage after armor is considered
  onDefend?(ctx: DefendContext): AbilityResult;

  // After damage hooks can trigger follow up effects like healing
  onAfterDamage?(ctx: AfterDamageContext): AbilityResult;
}