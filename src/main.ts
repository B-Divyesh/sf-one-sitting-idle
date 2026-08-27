import {
  ACT_ONE_GOAL, ACT_TWO_GOAL, STORM_DURATION, UPGRADES, GameState, Upgrade, actProgress,
  advanceAct, buyUpgrade, canAdvance, decodeSave, encodeSave, formatDuration, initialState,
  lightRate, primaryAction, signalRate, startGame, tick
} from './game';

const STORAGE_KEY = 'last-light-save-v1';
const game = document.querySelector<HTMLDivElement>('#game')!;
const toast = document.querySelector<HTMLDivElement>('#toast')!;
const offlineNote = document.querySelector<HTMLDivElement>('#offline-note')!;
const helpDialog = document.querySelector<HTMLDialogElement>('#help-dialog')!;
const restartDialog = document.querySelector<HTMLDialogElement>('#restart-dialog')!;
const soundButton = document.querySelector<HTMLButtonElement>('#sound-button')!;
let errorMessage = '';
let state = loadState();
let stillWaters = localStorage.getItem('last-light-still') === 'true' || matchMedia('(prefers-reduced-motion: reduce)').matches;
let lastFrame = performance.now();
let lastRender = 0;
let lastSave = 0;
let actionLockedUntil = 0;
let uiSignature = '';

function loadState(): GameState {
  const hashSave = new URLSearchParams(location.hash.slice(1)).get('save');
  if (hashSave) {
    try {
      const loaded = decodeSave(hashSave);
      history.replaceState(null, '', location.pathname + location.search);
      localStorage.setItem(STORAGE_KEY, encodeSave(loaded));
      return loaded;
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : 'That save link could not be read.';
      history.replaceState(null, '', location.pathname + location.search);
    }
  }
  try {
    const local = localStorage.getItem(STORAGE_KEY);
    if (local) return decodeSave(local);
  } catch {
    errorMessage = 'Local saving is unavailable. You can still play and copy a save link.';
  }
  return initialState();
}

function saveState(): void {
  if (!state.started) return;
  try {
    localStorage.setItem(STORAGE_KEY, encodeSave(state));
  } catch {
    showToast('Could not write a local save. Copy a save link instead.', true);
  }
}

function showToast(message: string, isError = false): void {
  toast.textContent = message;
  toast.classList.toggle('is-error', isError);
  toast.classList.add('is-visible');
  window.setTimeout(() => toast.classList.remove('is-visible'), 3600);
}

function formatNumber(value: number): string {
  if (value >= 1000) return Math.floor(value).toLocaleString('en-US');
  if (value >= 100) return Math.floor(value).toString();
  return value.toFixed(value < 10 ? 1 : 0);
}

function render(): void {
  game.setAttribute('aria-busy', 'false');
  soundButton.textContent = `Still waters: ${stillWaters ? 'on' : 'off'}`;
  soundButton.setAttribute('aria-pressed', String(stillWaters));
  document.body.classList.toggle('still-waters', stillWaters);
  uiSignature = getUiSignature();

  if (!state.started) {
    game.innerHTML = renderCover();
    bindCover();
    return;
  }
  if (state.finished) {
    game.innerHTML = renderEnding();
    bindCommon();
    return;
  }
  game.innerHTML = renderGame();
  bindGame();
}

function getUiSignature(): string {
  return [state.started, state.finished, state.act, canAdvance(state), primaryDisabled(), state.beamMode,
    ...UPGRADES.map((item) => `${state.upgrades.includes(item.id)}:${state[item.currency] >= item.cost}`)].join('|');
}

function paintLiveValues(): void {
  const set = (selector: string, value: string) => { const node = document.querySelector(selector); if (node) node.textContent = value; };
  set('[data-resource="light"]', formatNumber(state.light));
  set('[data-resource="signals"]', formatNumber(state.signals));
  set('[data-resource="integrity"]', state.act >= 3 ? `${Math.ceil(state.integrity)}%` : '—');
  set('[data-resource="supplies"]', state.act >= 3 ? formatNumber(state.supplies) : '—');
  set('.session-meta strong', formatDuration(state.elapsedMs));
  const progress = document.querySelector<HTMLElement>('.progress-track > span');
  const track = document.querySelector<HTMLElement>('.progress-track');
  if (progress && track) {
    const value = Math.floor(actProgress(state) * 100);
    progress.style.width = `${value}%`;
    track.setAttribute('aria-valuenow', String(value));
  }
}

function renderCover(): string {
  return `
    <section class="cover" aria-labelledby="cover-title">
      ${errorMessage ? `<p class="error-note" role="alert"><strong>Save not loaded.</strong> ${escapeHtml(errorMessage)} Start a fresh log below.</p>` : ''}
      <div class="cover-art">
        <picture>
          <source srcset="/assets/lighthouse-notebook-960.avif 960w, /assets/lighthouse-notebook.avif 1536w" sizes="(max-width: 820px) calc(100vw - 60px), 700px" type="image/avif">
          <source srcset="/assets/lighthouse-notebook-960.webp 960w, /assets/lighthouse-notebook.webp 1536w" sizes="(max-width: 820px) calc(100vw - 60px), 700px" type="image/webp">
          <img src="/assets/lighthouse-notebook.jpg" width="960" height="640" fetchpriority="high" decoding="async" alt="Ink-and-gouache study of a lighthouse casting a warm beam toward a distant harbor across a dark, rough sea.">
        </picture>
        <span class="cover-stamp">LOG 7B · NORTH REACH</span>
      </div>
      <div class="cover-copy">
        <p class="eyebrow">A one-sitting idle story · 35–50 min</p>
        <h2 id="cover-title">The last keeper left the lamp in pieces.</h2>
        <p>Tonight, three cutters are due through the shoals. Restore the light, teach it to speak, and keep it burning until dawn.</p>
        <blockquote>“A proper mechanism should know when its work is done.”<br><cite>— margin note, unsigned</cite></blockquote>
        <button class="button button-primary button-large" id="begin-button">Open the keeper's log <span aria-hidden="true">→</span></button>
        <p class="fine-print"><span aria-hidden="true">✓</span> Saves on this device · No account · No ads · No offline earnings</p>
      </div>
    </section>`;
}

function renderGame(): string {
  const act = state.act as 1 | 2 | 3;
  const actInfo = {
    1: { roman: 'I', title: 'Kindle', subtitle: 'Make the old light steady.', goal: `${formatNumber(state.light)} / ${ACT_ONE_GOAL.toLocaleString()} light`, prompt: 'The lamp is cold. Give it a beginning.' },
    2: { roman: 'II', title: 'Bearing', subtitle: 'Call the three cutters through.', goal: `${formatNumber(state.signals)} / ${ACT_TWO_GOAL.toLocaleString()} bearings`, prompt: 'The light is strong. Now teach it where to look.' },
    3: { roman: 'III', title: 'Weather', subtitle: 'Keep the tower standing until dawn.', goal: `${formatDuration(state.stormElapsed * 1000)} / ${formatDuration(STORM_DURATION * 1000)} storm`, prompt: 'The boats are safe. The storm has come for the lamp.' }
  }[act];
  const progress = actProgress(state) * 100;
  const upgrades = UPGRADES.filter((item) => item.act === act);
  const recentLog = [...state.log].reverse();

  return `
    <section class="session-head" aria-label="Session progress">
      <ol class="act-track">
        ${[1, 2, 3].map((number) => `<li class="${number === act ? 'active' : ''} ${number < act ? 'done' : ''}" ${number === act ? 'aria-current="step"' : ''}><span>${number < act ? '✓' : number}</span> ${['Kindle', 'Bearing', 'Weather'][number - 1]}</li>`).join('')}
      </ol>
      <div class="session-meta"><span>Elapsed <strong class="tabular">${formatDuration(state.elapsedMs)}</strong></span><button class="link-button" id="restart-button">Restart</button></div>
    </section>

    <section class="instrument-strip" aria-label="Current resources">
      <div><span class="instrument-label">Light</span><strong class="resource-value" data-resource="light">${formatNumber(state.light)}</strong><small>+${formatNumber(lightIncome())}/s</small></div>
      <div class="${act < 2 ? 'muted-instrument' : ''}"><span class="instrument-label">Bearings</span><strong class="resource-value" data-resource="signals">${formatNumber(state.signals)}</strong><small>${act >= 2 ? `+${formatNumber(signalRate(state) * (act === 3 ? 0.35 : 1))}/s` : 'Act II'}</small></div>
      <div class="${act < 3 ? 'muted-instrument' : ''}"><span class="instrument-label">Tower</span><strong class="resource-value" data-resource="integrity">${act >= 3 ? `${Math.ceil(state.integrity)}%` : '—'}</strong><small>${act >= 3 ? integrityStatus() : 'Act III'}</small></div>
      <div class="${act < 3 ? 'muted-instrument' : ''}"><span class="instrument-label">Supplies</span><strong class="resource-value" data-resource="supplies">${act >= 3 ? formatNumber(state.supplies) : '—'}</strong><small>${act >= 3 ? '+0.03/s' : 'Act III'}</small></div>
    </section>

    <div class="notebook-grid">
      <section class="workbench" aria-labelledby="act-title">
        <header class="act-heading">
          <p class="eyebrow">Act ${actInfo.roman} of III</p>
          <h2 id="act-title">${actInfo.title}</h2>
          <p>${actInfo.subtitle}</p>
        </header>

        <div class="goal-block">
          <div class="goal-copy"><span>${actInfo.prompt}</span><strong>${actInfo.goal}</strong></div>
          <div class="progress-track" role="progressbar" aria-label="Act progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.floor(progress)}"><span style="width:${progress.toFixed(2)}%"></span></div>
        </div>

        ${act === 2 ? renderBeamControl() : ''}
        ${act === 3 ? renderStormGauge() : ''}

        <div class="primary-work">
          <button class="button button-primary action-button" id="action-button" ${primaryDisabled() ? 'disabled' : ''}>
            <span>${primaryLabel()}</span><small>${primaryNote()}</small><kbd>1</kbd>
          </button>
          <p class="action-hint">${primaryHint()}</p>
        </div>

        ${canAdvance(state) ? `<div class="chapter-ready"><p><span aria-hidden="true">✦</span> The next page is ready.</p><button class="button button-ink" id="advance-button">${advanceLabel()} <span aria-hidden="true">→</span></button></div>` : ''}

        <section class="repairs" aria-labelledby="repairs-title">
          <div class="section-heading"><div><p class="eyebrow">Automation notes</p><h3 id="repairs-title">Repairs & arrangements</h3></div><span class="pencil-note">Keys 2–4</span></div>
          <ul class="upgrade-list">${upgrades.map((upgrade, index) => renderUpgrade(upgrade, index)).join('')}</ul>
        </section>
      </section>

      <aside class="field-log" aria-labelledby="log-title">
        <div class="log-heading"><div><p class="eyebrow">Observations</p><h2 id="log-title">Field log</h2></div><span aria-hidden="true" class="compass">N<br>✦</span></div>
        <ol>${recentLog.map((entry, index) => `<li class="${index === 0 ? 'latest' : ''}"><time>${formatDuration(entry.at)}</time><p>${escapeHtml(entry.text)}</p></li>`).join('')}</ol>
        <p class="margin-note">The sea keeps no ledger.<br>That is why we do.</p>
      </aside>
    </div>`;
}

function renderBeamControl(): string {
  return `<fieldset class="beam-control">
    <legend>Beam allocation</legend>
    <p>More seaward light finds the fleet faster; more lamp power earns light for repairs.</p>
    <div class="beam-options">
      ${([25, 50, 75] as const).map((value) => `<label><input type="radio" name="beam" value="${value}" ${state.beamMode === value ? 'checked' : ''}><span>${value}% to sea<small>${100 - value}% to lamp</small></span></label>`).join('')}
    </div>
  </fieldset>`;
}

function renderStormGauge(): string {
  const condition = state.integrity > 70 ? 'Holding' : state.integrity > 40 ? 'Strained' : 'Critical, but recoverable';
  return `<div class="storm-gauge" aria-label="Storm status">
    <div><span>Storm passage</span><strong>${formatDuration(Math.max(0, STORM_DURATION - state.stormElapsed) * 1000)} remaining</strong></div>
    <div><span>Tower condition</span><strong>${condition}</strong></div>
  </div>`;
}

function renderUpgrade(upgrade: Upgrade, index: number): string {
  const bought = state.upgrades.includes(upgrade.id);
  const affordable = state[upgrade.currency] >= upgrade.cost;
  const key = index < 3 ? index + 2 : '';
  return `<li class="${bought ? 'is-bought' : ''}">
    <button type="button" class="upgrade-button" data-upgrade="${upgrade.id}" ${bought || !affordable ? 'disabled' : ''}>
      <span class="check" aria-hidden="true">${bought ? '✓' : '□'}</span>
      <span class="upgrade-copy"><strong>${upgrade.name}</strong><small>${upgrade.note}</small></span>
      <span class="upgrade-cost">${bought ? 'Done' : `${upgrade.cost.toLocaleString()} ${upgrade.currency}`} ${key && !bought ? `<kbd>${key}</kbd>` : ''}</span>
    </button>
  </li>`;
}

function renderEnding(): string {
  const minutes = Math.max(1, Math.round(state.elapsedMs / 60000));
  const condition = state.integrity >= 70 ? 'steadfast' : state.integrity >= 40 ? 'weathered' : 'scarred but standing';
  return `<section class="ending" aria-labelledby="ending-title">
    <div class="ending-mark" aria-hidden="true"><span></span>☀<span></span></div>
    <p class="eyebrow">Log complete · Dawn</p>
    <h2 id="ending-title">The horizon answers.</h2>
    <div class="ending-story">
      <p>Morning comes quietly after all that weather.</p>
      <p>Three cutters lie against the harbor wall. Windows open along the quay, one by one, and the last lamp in the tower clicks itself off.</p>
      <p>For nineteen years the North Reach had been a blank place on every chart. Today, someone writes its name back in.</p>
    </div>
    <dl class="finish-stats">
      <div><dt>Time to finish</dt><dd>${formatDuration(state.elapsedMs)}</dd></div>
      <div><dt>Hands-on actions</dt><dd>${state.clicks}</dd></div>
      <div><dt>Tower at dawn</dt><dd>${Math.ceil(state.integrity)}% · ${condition}</dd></div>
      <div><dt>Ending</dt><dd>Harbor awake</dd></div>
    </dl>
    <p class="signed-note">A finite machine is not a failed infinite one.<br><strong>It is a promise kept.</strong></p>
    <div class="ending-actions">
      <button class="button button-primary" id="ending-share">Copy my ending</button>
      <button class="button button-quiet" id="restart-button">Play this night again</button>
    </div>
    <p class="fine-print">Finished in ${minutes} minute${minutes === 1 ? '' : 's'}. This is the complete first episode. No prestige waits behind it.</p>
  </section>`;
}

function lightIncome(): number {
  const rate = lightRate(state);
  if (state.act === 2) return rate * (1 - state.beamMode / 100);
  if (state.act === 3) return rate * 0.6;
  return rate;
}

function integrityStatus(): string {
  const damage = Math.max(0.025, 0.14 - UPGRADES.filter((item) => state.upgrades.includes(item.id)).reduce((sum, item) => sum + (item.defence ?? 0), 0));
  return `−${damage.toFixed(2)}/s`;
}

function primaryLabel(): string {
  if (state.act === 1) return 'Trim the wick';
  if (state.act === 2) return 'Send a signal';
  return 'Brace the light';
}

function primaryNote(): string {
  if (state.act === 1) return '+5 light';
  if (state.act === 2) return '−30 light · +7 bearings';
  return '−35 light · +4% tower';
}

function primaryHint(): string {
  if (state.act === 1) return 'Hold nothing back: automation soon takes over.';
  if (state.act === 2) return state.light < 30 ? 'The signal needs 30 light. Let the mechanism gather it.' : 'A deliberate flash between the automatic sweeps.';
  return state.light < 35 ? 'A repair needs 35 light. The lamp is still producing it.' : 'Repairs can always recover the tower. No failure resets this night.';
}

function primaryDisabled(): boolean {
  return (state.act === 2 && state.light < 30) || (state.act === 3 && state.light < 35);
}

function advanceLabel(): string {
  if (state.act === 1) return 'Open the seaward shutters';
  if (state.act === 2) return 'Guide the cutters home';
  return 'Open the dawn shutters';
}

function bindCover(): void {
  document.querySelector('#begin-button')?.addEventListener('click', () => {
    state = startGame(state);
    errorMessage = '';
    saveState();
    render();
    document.querySelector('#act-title')?.scrollIntoView({ block: 'start' });
  });
}

function bindGame(): void {
  document.querySelector('#action-button')?.addEventListener('click', doPrimary);
  document.querySelectorAll<HTMLButtonElement>('[data-upgrade]').forEach((button) => button.addEventListener('click', () => {
    state = buyUpgrade(state, button.dataset.upgrade!);
    saveState();
    render();
    showToast('Repair entered in the log.');
  }));
  document.querySelectorAll<HTMLInputElement>('input[name="beam"]').forEach((input) => input.addEventListener('change', () => {
    state = { ...state, beamMode: Number(input.value) as 25 | 50 | 75 };
    saveState();
    render();
    showToast(`${input.value}% of the beam now searches the sea.`);
  }));
  document.querySelector('#advance-button')?.addEventListener('click', () => {
    state = advanceAct(state);
    saveState();
    render();
    document.querySelector('#act-title')?.scrollIntoView({ behavior: stillWaters ? 'auto' : 'smooth', block: 'start' });
    showToast(state.finished ? 'The log is complete.' : `Act ${state.act} has begun.`);
  });
  bindCommon();
}

function bindCommon(): void {
  document.querySelector('#restart-button')?.addEventListener('click', () => restartDialog.showModal());
  document.querySelector('#ending-share')?.addEventListener('click', shareEnding);
}

function doPrimary(): void {
  const now = performance.now();
  if (now < actionLockedUntil || primaryDisabled()) return;
  actionLockedUntil = now + 650;
  state = primaryAction(state);
  saveState();
  render();
  const button = document.querySelector<HTMLButtonElement>('#action-button');
  button?.classList.add('just-pressed');
}

async function copySave(): Promise<void> {
  if (!state.started) {
    showToast('Begin the log before copying a save.', true);
    return;
  }
  const url = new URL(location.href);
  url.hash = `save=${encodeSave(state)}`;
  try {
    await navigator.clipboard.writeText(url.toString());
    showToast('Save link copied. It contains your progress, not personal data.');
  } catch {
    history.replaceState(null, '', url);
    showToast('Clipboard unavailable. The save is now in this page address.');
  }
}

async function shareEnding(): Promise<void> {
  const text = `I kept The Last Light burning to dawn in ${formatDuration(state.elapsedMs)} with ${Math.ceil(state.integrity)}% of the tower standing. A complete one-sitting idle story.`;
  try {
    await navigator.clipboard.writeText(`${text} ${location.origin}`);
    showToast('Ending copied.');
  } catch {
    showToast(text);
  }
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]!);
}

document.querySelector('#help-button')?.addEventListener('click', () => helpDialog.showModal());
document.querySelector('#save-button')?.addEventListener('click', copySave);
soundButton.addEventListener('click', () => {
  stillWaters = !stillWaters;
  localStorage.setItem('last-light-still', String(stillWaters));
  render();
});
document.querySelector('#confirm-restart')?.addEventListener('click', () => {
  state = initialState();
  localStorage.removeItem(STORAGE_KEY);
  render();
  window.scrollTo({ top: 0, behavior: stillWaters ? 'auto' : 'smooth' });
});

window.addEventListener('keydown', (event) => {
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLButtonElement || document.querySelector('dialog[open]')) return;
  if (event.key === '?') helpDialog.showModal();
  if (event.key.toLowerCase() === 's') { event.preventDefault(); void copySave(); }
  if (event.key === '1') { event.preventDefault(); doPrimary(); }
  const slot = Number(event.key) - 2;
  if (slot >= 0 && slot <= 2) {
    const available = UPGRADES.filter((item) => item.act === state.act);
    const upgrade = available[slot];
    if (upgrade) {
      state = buyUpgrade(state, upgrade.id);
      saveState();
      render();
    }
  }
});

function updateConnection(): void {
  offlineNote.hidden = navigator.onLine;
}
window.addEventListener('online', updateConnection);
window.addEventListener('offline', updateConnection);
document.addEventListener('visibilitychange', () => { lastFrame = performance.now(); });

function loop(now: number): void {
  const elapsed = document.hidden ? 0 : (now - lastFrame) / 1000;
  lastFrame = now;
  if (elapsed > 0 && state.started && !state.finished) state = tick(state, elapsed);
  if (now - lastRender > 250) {
    if (uiSignature !== getUiSignature()) render();
    else paintLiveValues();
    lastRender = now;
  }
  if (now - lastSave > 5000) {
    saveState();
    lastSave = now;
  }
  requestAnimationFrame(loop);
}

updateConnection();
render();
requestAnimationFrame(loop);

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => undefined));
}
