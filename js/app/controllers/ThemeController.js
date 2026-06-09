export class ThemeController {
  static THEME = {
    light: 'light',
    dark: 'dark',
  };

  constructor({ rootElement, storage }) {
    this.rootElement = rootElement;
    this.storage = storage;
    this.storageKey = 'theme';
  }

  init() {
    const defaultTheme = this.rootElement.dataset.theme || ThemeController.THEME.light;
    const savedTheme = this.storage.get(this.storageKey, defaultTheme);
    this.apply(savedTheme);
  }

  apply(theme) {
    const safeTheme = this.#isValidTheme(theme) ? theme : ThemeController.THEME.light;
    this.rootElement.dataset.theme = safeTheme;
    this.storage.set(this.storageKey, safeTheme);
  }

  enableDark() {
    this.apply(ThemeController.THEME.dark);
  }

  reset() {
    this.apply(ThemeController.THEME.light);
  }

  isDark() {
    return this.rootElement.dataset.theme === ThemeController.THEME.dark;
  }

  #isValidTheme(theme) {
    return Object.values(ThemeController.THEME).includes(theme);
  }
}
