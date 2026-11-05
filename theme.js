/*
 * Light / dark / system theme switcher.
 *
 * Each page sets the saved theme before first paint with a one-line inline
 * script in <head>, then loads this file with `defer`. This file renders the
 * switch into every element with a `data-theme-switch` attribute.
 *
 * "system" (the default) removes the data-theme attribute so the page follows
 * prefers-color-scheme. "light" and "dark" set it, and the CSS honors it.
 */
(function () {
  var KEY = 'theme';
  var root = document.documentElement;

  function saved() {
    try {
      var t = localStorage.getItem(KEY);
      return t === 'light' || t === 'dark' ? t : 'system';
    } catch (e) {
      return 'system';
    }
  }

  function apply(t) {
    if (t === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', t);
    try {
      if (t === 'system') localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, t);
    } catch (e) {}
    var buttons = document.querySelectorAll('.theme-switch button');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute('aria-pressed', buttons[i].getAttribute('data-value') === t);
    }
  }

  var icons = {
    system: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/></svg>',
    light: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    dark: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>'
  };
  var labels = { system: 'Match system theme', light: 'Light theme', dark: 'Dark theme' };

  var css =
    '.theme-switch{display:inline-flex;gap:2px;padding:3px;border:1px solid var(--line);border-radius:999px;background:var(--surface)}' +
    '.theme-switch button{display:grid;place-items:center;width:30px;height:26px;padding:0;border:0;border-radius:999px;background:transparent;color:var(--muted);cursor:pointer}' +
    '.theme-switch button:hover{color:var(--ink)}' +
    '.theme-switch button[aria-pressed="true"]{background:var(--accent-soft);color:var(--accent)}' +
    '.theme-switch button:focus-visible{outline:2px solid var(--accent);outline-offset:1px}' +
    '.theme-switch svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}' +
    '@media print{.theme-switch{display:none}}';

  function mount() {
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    var current = saved();
    var hosts = document.querySelectorAll('[data-theme-switch]');
    for (var h = 0; h < hosts.length; h++) {
      var group = document.createElement('div');
      group.className = 'theme-switch';
      group.setAttribute('role', 'group');
      group.setAttribute('aria-label', 'Color theme');
      ['system', 'light', 'dark'].forEach(function (t) {
        var b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('data-value', t);
        b.setAttribute('aria-label', labels[t]);
        b.title = labels[t];
        b.setAttribute('aria-pressed', t === current);
        b.innerHTML = icons[t];
        b.addEventListener('click', function () { apply(t); });
        group.appendChild(b);
      });
      hosts[h].appendChild(group);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
