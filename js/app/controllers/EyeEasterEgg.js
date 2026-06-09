export class EyeEasterEgg {
  static ACTION = {
    enableDark: 'enableDark',
    reset: 'reset',
  };

  constructor({ triggers, clicksToUnlock, themeController }) {
    this.triggers = triggers.filter(({ element }) => Boolean(element));
    this.clicksToUnlock = clicksToUnlock;
    this.themeController = themeController;
    this.clickCounts = new WeakMap();
  }

  init() {
    this.triggers.forEach((trigger) => {
      trigger.element.addEventListener('click', () => this.#handleTrigger(trigger));
      trigger.element.addEventListener('keydown', (event) => this.#handleKeyboard(event, trigger));
    });
  }

  #handleTrigger(trigger) {
    if (!this.#canRunAction(trigger)) return;

    const currentClicks = this.#getClickCount(trigger.element) + 1;

    this.#setClickCount(trigger.element, currentClicks);

    if (currentClicks < this.clicksToUnlock) {
      return;
    }

    this.#runAction(trigger.action);
    this.#setClickCount(trigger.element, 0);
  }

  #canRunAction(trigger) {
    const isDarkTheme = this.themeController.isDark();

    if (trigger.action === EyeEasterEgg.ACTION.enableDark && isDarkTheme) {
      this.#setClickCount(trigger.element, 0);
      return false;
    }

    if (trigger.action === EyeEasterEgg.ACTION.reset && !isDarkTheme) {
      this.#setClickCount(trigger.element, 0);
      return false;
    }

    return true;
  }

  #runAction(action) {
    const actions = {
      [EyeEasterEgg.ACTION.enableDark]: () => this.themeController.enableDark(),
      [EyeEasterEgg.ACTION.reset]: () => this.themeController.reset(),
    };

    actions[action]?.();
  }

  #handleKeyboard(event, trigger) {
    if (event.key !== 'Enter' && event.key !== ' ') return;

    event.preventDefault();
    this.#handleTrigger(trigger);
  }

  #getClickCount(element) {
    return this.clickCounts.get(element) ?? 0;
  }

  #setClickCount(element, value) {
    this.clickCounts.set(element, value);
  }
}
