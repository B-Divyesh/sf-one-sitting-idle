const focusKey = 'last-light:focus-route';
const returnKey = 'last-light:focus-return';

function focusHeading(): void {
  const heading = document.querySelector<HTMLElement>('main h1');
  if (!heading) return;
  heading.setAttribute('tabindex', '-1');
  heading.focus({ preventScroll: true });
  const announcer = document.querySelector<HTMLElement>('#route-announcer');
  if (announcer) announcer.textContent = `${heading.textContent ?? ''} page loaded`;
}

document.addEventListener('click', (event) => {
  const link = (event.target as Element).closest<HTMLAnchorElement>('a[href]');
  if (!link) return;
  const destination = new URL(link.href, location.href);
  if (destination.origin === location.origin && destination.href !== location.href && !destination.hash) {
    sessionStorage.setItem(focusKey, '1');
    sessionStorage.setItem(returnKey, location.pathname + location.search);
  }
});

window.addEventListener('pageshow', (event) => {
  const isReturn = sessionStorage.getItem(returnKey) === location.pathname + location.search;
  if (event.persisted || isReturn || sessionStorage.getItem(focusKey) === '1') {
    sessionStorage.removeItem(focusKey);
    if (isReturn) sessionStorage.removeItem(returnKey);
    requestAnimationFrame(focusHeading);
  }
});
