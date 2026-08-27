import { describe, expect, it } from 'vitest';
import {
  ACT_ONE_GOAL, ACT_TWO_GOAL, STORM_DURATION, UPGRADES, GameState, advanceAct, buyUpgrade,
  canAdvance, decodeSave, encodeSave, initialState, lightRate, primaryAction, signalRate, startGame, tick
} from './game';

describe('game progression', () => {
  it('starts, produces light and buys only affordable upgrades', () => {
    let state = startGame(initialState(), 100);
    expect(primaryAction(state).light).toBe(5);
    expect(buyUpgrade(state, 'wick').upgrades).toHaveLength(0);
    state = { ...state, light: 30 };
    state = buyUpgrade(state, 'wick');
    expect(lightRate(state)).toBe(0.8);
    expect(tick(state, 1).light).toBeCloseTo(0.8);
  });

  it('moves through all three acts without a reset loop', () => {
    let state = startGame(initialState());
    state = { ...state, light: ACT_ONE_GOAL };
    expect(canAdvance(state)).toBe(true);
    state = advanceAct(state);
    expect(state.act).toBe(2);
    state = { ...state, signals: ACT_TWO_GOAL };
    state = advanceAct(state);
    expect(state.act).toBe(3);
    state = { ...state, stormElapsed: STORM_DURATION };
    state = advanceAct(state);
    expect(state.finished).toBe(true);
    expect(state.act).toBe(4);
  });

  it('balances an attentive keyboard run for one sitting', () => {
    let state = startGame(initialState());
    const transitions: number[] = [];
    for (let second = 0; second < 3600 && !state.finished; second += 1) {
      if (state.act === 1 || state.act === 2 || (state.act === 3 && state.integrity < 76)) state = primaryAction(state);
      const actUpgrades = UPGRADES.filter((item) => item.act === state.act);
      for (const upgrade of actUpgrades) state = buyUpgrade(state, upgrade.id);
      state = tick(state, 1);
      if (canAdvance(state)) {
        transitions.push(second);
        state = advanceAct(state);
        if (state.act === 2) state = { ...state, beamMode: 75 };
      }
    }
    expect(state.finished).toBe(true);
    expect(state.elapsedMs / 60000).toBeGreaterThanOrEqual(34);
    expect(state.elapsedMs / 60000).toBeLessThanOrEqual(55);
    expect(transitions).toHaveLength(3);
    expect(state.integrity).toBeGreaterThan(20);
  });

  it('applies act-two allocation and caps long background ticks', () => {
    let state = startGame(initialState());
    state = { ...state, act: 2, light: 500, upgrades: UPGRADES.filter((item) => item.act === 1).map((item) => item.id), beamMode: 75 };
    expect(signalRate(state)).toBeGreaterThan(1);
    const next = tick(state, 60);
    expect(next.elapsedMs).toBe(2000);
    expect(next.signals).toBeCloseTo(signalRate(state) * 2);
  });

  it('makes storm damage recoverable and never erases progress', () => {
    let state: GameState = { ...startGame(initialState()), act: 3, light: 1000, integrity: 9, stormElapsed: 50 };
    state = tick(state, 2);
    expect(state.integrity).toBeGreaterThanOrEqual(8);
    expect(state.stormElapsed).toBeGreaterThan(50);
    state = primaryAction(state);
    expect(state.integrity).toBeGreaterThan(9);
  });
});

describe('portable saves', () => {
  it('round trips compactly and rejects invalid payloads', () => {
    const state = { ...startGame(initialState(), 123), light: 456.7, elapsedMs: 8000, beamMode: 75 as const };
    const restored = decodeSave(encodeSave(state));
    expect(restored.light).toBe(456.7);
    expect(restored.startedAt).toBe(123);
    expect(encodeSave(state).length).toBeLessThan(300);
    expect(() => decodeSave('not-a-save')).toThrow(/damaged/);
  });
});
