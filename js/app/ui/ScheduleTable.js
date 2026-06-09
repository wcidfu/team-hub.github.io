export class ScheduleTable {
  constructor(rootElement) {
    this.rootElement = rootElement;
  }

  render(matches) {
    if (!this.rootElement) {
      return;
    }

    if (!matches.length) {
      this.rootElement.innerHTML = `
        <tr>
          <td colspan="9">Пока нет запланированных игр.</td>
        </tr>
      `;
      return;
    }

    this.rootElement.innerHTML = matches
      .map((match) => this.createRow(match))
      .join('');
  }

  renderError() {
    if (!this.rootElement) {
      return;
    }

    this.rootElement.innerHTML = `
      <tr>
        <td colspan="9">Не удалось загрузить расписание.</td>
      </tr>
    `;
  }

  createRow(match) {
    return `
      <tr>
        <td>${this.escape(match.date)}</td>
        <td>${this.escape(match.time)}</td>
        <td>${this.escape(match.type)}</td>
        <td>${this.escape(match.opponent)}</td>
        <td>${this.escape(match.format)}</td>
        <td>${this.escape(match.side)}</td>
        <td>
          <span class="match-status match-status--${this.getStatusClass(match.result)}">
            ${this.getStatusText(match.result)}
          </span>
        </td>
        <td>${this.escape(match.score)}</td>
        <td>${this.escape(match.notes)}</td>
      </tr>
    `;
  }

  getStatusText(result) {
    const statuses = {
      planned: 'План',
      win: 'Win',
      lose: 'Lose',
      draw: 'Draw',
    };

    return statuses[result] ?? result;
  }

  getStatusClass(result) {
    const allowedStatuses = ['planned', 'win', 'lose', 'draw'];

    return allowedStatuses.includes(result) ? result : 'planned';
  }

  escape(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }
}