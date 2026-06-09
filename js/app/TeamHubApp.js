import { StorageService } from './services/StorageService.js';
import { ThemeController } from './controllers/ThemeController.js';
import { EyeEasterEgg } from './controllers/EyeEasterEgg.js';
import { NavigationController } from './controllers/NavigationController.js';

export class TeamHubApp {
  constructor(document) {
    this.document = document;
    this.storage = new StorageService('ornnhub');
  }

  init() {
    const themeController = new ThemeController({
      rootElement: this.document.body,
      storage: this.storage,
    });

    const navigation = new NavigationController({
      links: this.document.querySelectorAll('a[href]'),
    });

    themeController.init();
    navigation.init();

    const triggers = [
      {
        element: this.document.querySelector('[data-eye-unlock]'),
        action: EyeEasterEgg.ACTION.enableDark,
      },
      {
        element: this.document.querySelector('[data-eye-reset]'),
        action: EyeEasterEgg.ACTION.reset,
      },
    ].filter(({ element }) => Boolean(element));

    if (!triggers.length) {
      return;
    }

    const easterEgg = new EyeEasterEgg({
      triggers,
      clicksToUnlock: 5,
      themeController,
    });

    easterEgg.init();
  }
}
