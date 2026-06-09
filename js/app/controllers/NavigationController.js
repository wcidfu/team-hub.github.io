export class NavigationController {
  constructor({ links }) {
    this.links = Array.from(links);
  }

  init() {
    const currentPath = this.#normalizePath(window.location.pathname);

    this.links.forEach((link) => {
      const linkPath = this.#normalizePath(new URL(link.href).pathname);
      const isCurrent = linkPath === currentPath;

      if (isCurrent) {
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  #normalizePath(path) {
    return path.replace(/\/index\.html$/, '/').replace(/\/+$/, '/');
  }
}
