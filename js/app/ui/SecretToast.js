export class SecretToast {
  constructor(element) {
    this.element = element;
    this.hideTimerId = null;
  }

  show(message, timeout = 1300) {
    if (!this.element) return;

    window.clearTimeout(this.hideTimerId);
    this.element.textContent = message;
    this.element.classList.add('is-visible');

    this.hideTimerId = window.setTimeout(() => {
      this.hide();
    }, timeout);
  }

  hide() {
    if (!this.element) return;
    this.element.classList.remove('is-visible');
  }
}
