export const GAME_VERSION = 1;
export const ACT_ONE_GOAL = 9000;
export const ACT_TWO_GOAL = 2000;
export const STORM_DURATION = 900;

export type Act = 0 | 1 | 2 | 3 | 4;
export type BeamMode = 25 | 50 | 75;
export type Currency = 'light' | 'supplies';

export interface Upgrade {
  id: string;
  act: 1 | 2 | 3;
  name: string;
  note: string;
  cost: number;
  currency: Currency;
  rate?: number;
  signal?: number;
  defence?: number;
}

export const UPGRADES: Upgrade[] = [
  { id: 'wick', act: 1, name: 'Set a clean wick', note: '+0.8 light / second', cost: 30, currency: 'light', rate: 0.8 },
  { id: 'weight', act: 1, name: 'Wind the counterweight', note: '+2.4 light / second', cost: 200, currency: 'light', rate: 2.4 },
  { id: 'lens', act: 1, name: 'Align the Fresnel lens', note: '+6 light / second', cost: 900, currency: 'light', rate: 6 },
  { id: 'pump', act: 1, name: 'Prime the oil pump', note: '+15 light / second', cost: 2800, currency: 'light', rate: 15 },
  { id: 'flags', act: 2, name: 'Hang signal flags', note: '+0.4 bearings / second', cost: 350, currency: 'light', signal: 0.4 },
  { id: 'shutter', act: 2, name: 'Fit a timed shutter', note: '+0.9 bearings / second', cost: 1000, currency: 'light', signal: 0.9 },
  { id: 'charts', act: 2, name: 'Mark the harbor charts', note: '+1.8 bearings / second', cost: 2400, currency: 'light', signal: 1.8 },
  { id: 'storm-shutters', act: 3, name: 'Bar the storm shutters', note: 'Slows damage to the tower', cost: 8, currency: 'supplies', defence: 0.035 },
  { id: 'stays', act: 3, name: 'Rig iron stays', note: 'Further slows storm damage', cost: 16, currency: 'supplies', defence: 0.05 },
  { id: 'watch', act: 3, name: 'Set the harbor watch', note: 'Adds steady hands at the lens', cost: 28, currency: 'supplies', defence: 0.045 }
];

export interface GameState {
  version: number;
  started: boolean;
  finished: boolean;
  act: Act;
  light: number;
  signals: number;
  supplies: number;
  integrity: number;
  stormElapsed: number;
  beamMode: BeamMode;
  upgrades: string[];
  elapsedMs: number;
  startedAt: number | null;
  clicks: number;
  repairs: number;
  log: Array<{ at: number; text: string }>;
}

export const initialState = (): GameState => ({
  version: GAME_VERSION,
  started: false,
  finished: false,
  act: 0,
  light: 0,
  signals: 0,
  supplies: 0,
  integrity: 100,
  stormElapsed: 0,
  beamMode: 50,
  upgrades: [],
  elapsedMs: 0,
  startedAt: null,
  clicks: 0,
  repairs: 0,
  log: []
});

export function startGame(state: GameState, now = Date.now()): GameState {
  return {
    ...state,
    started: true,
    act: 1,
    startedAt: now,
    log: [{ at: 0, text: '21:10 — The harbor wire is dead. The old lens is dark.' }]
  };
}

export function lightRate(state: GameState): number {
  return UPGRADES.filter((item) => state.upgrades.includes(item.id)).reduce((sum, item) => sum + (item.rate ?? 0), 0);
}

export function signalRate(state: GameState): number {
  if (state.act < 2) return 0;
  const automation = UPGRADES.filter((item) => state.upgrades.includes(item.id)).reduce((sum, item) => sum + (item.signal ?? 0), 0);
  return 0.2 + lightRate(state) * (state.beamMode / 100) * 0.09 + automation;
}

export function defenceRate(state: GameState): number {
  return UPGRADES.filter((item) => state.upgrades.includes(item.id)).reduce((sum, item) => sum + (item.defence ?? 0), 0);
}

export function tick(state: GameState, seconds: number): GameState {
  if (!state.started || state.finished || seconds <= 0) return state;
  const dt = Math.min(seconds, 2);
  const next = { ...state, elapsedMs: state.elapsedMs + dt * 1000 };
  const rate = lightRate(state);

  if (state.act === 1) {
    next.light += rate * dt;
  } else if (state.act === 2) {
    next.light += rate * (1 - state.beamMode / 100) * dt;
    next.signals += signalRate(state) * dt;
  } else if (state.act === 3) {
    next.light += rate * 0.6 * dt;
    next.signals += signalRate(state) * 0.35 * dt;
    next.supplies += 0.025 * dt;
    next.stormElapsed = Math.min(STORM_DURATION, state.stormElapsed + dt);
    const damage = Math.max(0.025, 0.14 - defenceRate(state));
    next.integrity = Math.max(8, state.integrity - damage * dt);
  }

  return next;
}

export function primaryAction(state: GameState): GameState {
  if (!state.started || state.finished) return state;
  const next = { ...state, clicks: state.clicks + 1 };
  if (state.act === 1) next.light += 5;
  if (state.act === 2 && state.light >= 30) {
    next.light -= 30;
    next.signals += 7;
  }
  if (state.act === 3 && state.light >= 35) {
    next.light -= 35;
    next.integrity = Math.min(100, state.integrity + 4);
    next.repairs += 1;
  }
  return next;
}

export function canBuy(state: GameState, upgrade: Upgrade): boolean {
  return upgrade.act === state.act && !state.upgrades.includes(upgrade.id) && state[upgrade.currency] >= upgrade.cost;
}

export function buyUpgrade(state: GameState, upgradeId: string): GameState {
  const upgrade = UPGRADES.find((item) => item.id === upgradeId);
  if (!upgrade || !canBuy(state, upgrade)) return state;
  const next = { ...state, upgrades: [...state.upgrades, upgrade.id] };
  next[upgrade.currency] -= upgrade.cost;
  next.log = [...state.log, { at: state.elapsedMs, text: upgradeLog(upgrade.id) }];
  return next;
}

function upgradeLog(id: string): string {
  const entries: Record<string, string> = {
    wick: 'The wick takes. A small flame, but a willing one.',
    weight: 'The clockwork turns again after nineteen silent years.',
    lens: 'Each prism finds the next. The light gathers itself.',
    pump: 'Oil climbs the copper line. The beam no longer needs my hand.',
    flags: 'Red over white: lighthouse awake. Is anyone watching?',
    shutter: 'The shutter gives the light a language: long, short, long.',
    charts: 'Three old routes, one safe channel. I mark them in rust.',
    'storm-shutters': 'Oak bars across the glass. The tower exhales.',
    stays: 'Iron from the first cutter now binds stone to stone.',
    watch: 'Across the water, harbor lamps answer in a patient row.'
  };
  return entries[id] ?? 'Another line crossed from the repair list.';
}

export function canAdvance(state: GameState): boolean {
  if (state.act === 1) return state.light >= ACT_ONE_GOAL;
  if (state.act === 2) return state.signals >= ACT_TWO_GOAL;
  if (state.act === 3) return state.stormElapsed >= STORM_DURATION;
  return false;
}

export function advanceAct(state: GameState): GameState {
  if (!canAdvance(state)) return state;
  if (state.act === 1) {
    return {
      ...state,
      act: 2,
      light: Math.max(120, state.light - 8500),
      log: [...state.log, { at: state.elapsedMs, text: '22:02 — Light reaches the shoals. Far out, three bells answer.' }]
    };
  }
  if (state.act === 2) {
    return {
      ...state,
      act: 3,
      signals: Math.max(0, state.signals - 1600),
      supplies: 12,
      integrity: 100,
      log: [...state.log, { at: state.elapsedMs, text: '23:16 — The cutters make harbor. They send rope, iron—and a warning.' }]
    };
  }
  if (state.act === 3) {
    return {
      ...state,
      act: 4,
      finished: true,
      log: [...state.log, { at: state.elapsedMs, text: '00:04 — Dawn finds every window lit. The town has a horizon again.' }]
    };
  }
  return state;
}

type PackedSave = [number, Act, number, number, number, number, number, BeamMode, string[], number, number, number, number | null, boolean];

export function encodeSave(state: GameState): string {
  const packed: PackedSave = [
    state.version, state.act, Math.round(state.light * 10) / 10, Math.round(state.signals * 10) / 10,
    Math.round(state.supplies * 10) / 10, Math.round(state.integrity * 10) / 10, Math.round(state.stormElapsed * 10) / 10,
    state.beamMode, state.upgrades, Math.round(state.elapsedMs), state.clicks, state.repairs, state.startedAt, state.finished
  ];
  const bytes = new TextEncoder().encode(JSON.stringify(packed));
  let binary = '';
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
}

export function decodeSave(encoded: string): GameState {
  try {
    const normalized = encoded.replaceAll('-', '+').replaceAll('_', '/');
    const binary = atob(normalized);
    const packed = JSON.parse(new TextDecoder().decode(Uint8Array.from(binary, (char) => char.charCodeAt(0)))) as PackedSave;
    if (!Array.isArray(packed) || packed[0] !== GAME_VERSION || packed.length !== 14) throw new Error('version');
    const [version, act, light, signals, supplies, integrity, stormElapsed, beamMode, upgrades, elapsedMs, clicks, repairs, startedAt, finished] = packed;
    if (![0, 1, 2, 3, 4].includes(act) || ![25, 50, 75].includes(beamMode) || !Array.isArray(upgrades)) throw new Error('shape');
    const validIds = new Set(UPGRADES.map((item) => item.id));
    if (!upgrades.every((id) => typeof id === 'string' && validIds.has(id)) || new Set(upgrades).size !== upgrades.length) throw new Error('upgrade');
    validateSaveState({ act, light, signals, supplies, integrity, stormElapsed, upgrades, elapsedMs, clicks, repairs, startedAt, finished });
    const decodedStartedAt = startedAt === null ? null : safeNumber(startedAt);
    return {
      ...initialState(), version, act, light: safeNumber(light), signals: safeNumber(signals), supplies: safeNumber(supplies),
      integrity: safeNumber(integrity), stormElapsed: safeNumber(stormElapsed), beamMode,
      upgrades, elapsedMs: safeNumber(elapsedMs), clicks: safeInteger(clicks), repairs: safeInteger(repairs), startedAt: decodedStartedAt,
      started: act > 0, finished: Boolean(finished), log: rebuildLog(act, upgrades, safeNumber(elapsedMs))
    };
  } catch {
    throw new Error('That save link is damaged or belongs to a different version.');
  }
}

/**
 * A save is untrusted input, whether it came from a URL or local storage. These
 * checks describe reachable game states, rather than merely checking JSON
 * types, so rendering can safely treat the act as a known game screen.
 */
function validateSaveState(save: {
  act: Act;
  light: unknown;
  signals: unknown;
  supplies: unknown;
  integrity: unknown;
  stormElapsed: unknown;
  upgrades: string[];
  elapsedMs: unknown;
  clicks: unknown;
  repairs: unknown;
  startedAt: unknown;
  finished: unknown;
}): void {
  const { act, light, signals, supplies, integrity, stormElapsed, upgrades, elapsedMs, clicks, repairs, startedAt, finished } = save;
  const [safeLight, safeSignals, safeSupplies, safeIntegrity, safeStormElapsed, safeElapsedMs] = [light, signals, supplies, integrity, stormElapsed, elapsedMs].map(safeNumber);
  const safeClicks = safeInteger(clicks);
  const safeRepairs = safeInteger(repairs);
  if (safeIntegrity < 8 || safeIntegrity > 100 || safeStormElapsed > STORM_DURATION) throw new Error('bounds');
  if (typeof finished !== 'boolean') throw new Error('finished');

  const isFresh = act === 0;
  if (isFresh) {
    if (finished || upgrades.length || safeLight !== 0 || safeSignals !== 0 || safeSupplies !== 0 || safeIntegrity !== 100 || safeStormElapsed !== 0 || safeElapsedMs !== 0 || safeClicks !== 0 || safeRepairs !== 0 || startedAt !== null) throw new Error('fresh');
    return;
  }

  if (typeof startedAt !== 'number' || !Number.isFinite(startedAt) || startedAt < 0) throw new Error('started');
  if ((act === 4) !== finished) throw new Error('ending');
  if (upgrades.some((id) => (UPGRADES.find((item) => item.id === id)?.act ?? 4) > Math.min(act, 3))) throw new Error('upgrade-act');

  if (act === 1 && (safeSignals !== 0 || safeSupplies !== 0 || safeStormElapsed !== 0 || safeIntegrity !== 100)) throw new Error('act-one');
  if (act === 2 && (safeSupplies !== 0 || safeStormElapsed !== 0 || safeIntegrity !== 100)) throw new Error('act-two');
  if (act === 4 && safeStormElapsed !== STORM_DURATION) throw new Error('act-four');
}

function safeNumber(value: unknown): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) throw new Error('number');
  return value;
}

function safeInteger(value: unknown): number {
  if (!Number.isInteger(value) || (value as number) < 0) throw new Error('integer');
  return value as number;
}

function rebuildLog(act: Act, upgrades: string[], elapsedMs: number): GameState['log'] {
  if (act === 0) return [];
  const log: GameState['log'] = [{ at: 0, text: '21:10 — The harbor wire is dead. The old lens is dark.' }];
  upgrades.forEach((id, index) => log.push({ at: (index + 1) * Math.max(1, elapsedMs / 14), text: upgradeLog(id) }));
  if (act >= 2) log.push({ at: elapsedMs * 0.45, text: '22:02 — Light reaches the shoals. Far out, three bells answer.' });
  if (act >= 3) log.push({ at: elapsedMs * 0.72, text: '23:16 — The cutters make harbor. They send rope, iron—and a warning.' });
  if (act === 4) log.push({ at: elapsedMs, text: '00:04 — Dawn finds every window lit. The town has a horizon again.' });
  return log.sort((a, b) => a.at - b.at);
}

export function formatDuration(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function actProgress(state: GameState): number {
  if (state.act === 1) return Math.min(1, state.light / ACT_ONE_GOAL);
  if (state.act === 2) return Math.min(1, state.signals / ACT_TWO_GOAL);
  if (state.act === 3) return Math.min(1, state.stormElapsed / STORM_DURATION);
  if (state.act === 4) return 1;
  return 0;
}
