# Duel Game

Turn-based duel simulation in TypeScript.

## Setup

```bash
npm install
```

## Run

```bash
# Single fight (per-round abilities)
npm start

# Single fight (fixed abilities — assigned once at start)
npm run start:fixed

# 1000-fight simulation
npm run simulate

# 1000-fight simulation with fixed abilities
npm run simulate:fixed
```

## Adding a New Ability

1. Create a class in `src/abilities/` implementing the `Ability` interface.
2. Add one instance to `abilityRegistry.ts` — no other files need to change.

```typescript
// src/abilities/Thorns.ts
export class Thorns implements Ability {
  readonly name = 'Thorns';

  onDefend({ netDamage }: DefendContext): AbilityResult {
    const activated = Math.random() < ACTIVATION_CHANCE;
    return {
      activated,
      value: netDamage,                          // defender still takes full damage
      description: 'reflects damage back',       // Combat logs this
    };
    // (actual reflect logic would need a hook in Combat — see note below)
  }
}
```

> Note: abilities that need entirely new game phases (e.g. reflect damage back to attacker)
> would require adding a new hook to the `Ability` interface and a corresponding call in
> `Combat.resolveAttack`. Existing abilities are unaffected since all hooks are optional.

## Architecture

```
src/
├── constants.ts              Game-wide numeric constants
├── index.ts                  Entry point + CLI flag parsing
├── Character.ts              Character state (health, stats, ability)
├── Combat.ts                 Turn loop + damage resolution
├── Logger.ts                 ConsoleLogger / SilentLogger
├── simulation.ts             1000-run bulk simulator
└── abilities/
    ├── Ability.ts            Strategy interface + context types
    ├── abilityRegistry.ts    Central registry
    ├── DamageReduction.ts
    ├── PowerStrike.ts
    ├── SecondWind.ts
    └── Vampiretrike.ts
```
