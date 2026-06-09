export class ScheduleService {
  constructor(sourceUrl) {
    this.sourceUrl = sourceUrl;
  }

  async getMatches() {
    const response = await fetch(this.sourceUrl);

    if (!response.ok) {
      throw new Error(`Не удалось загрузить расписание: ${response.status}`);
    }

    const text = await response.text();

    return this.parseText(text);
  }

  parseText(text) {
    return text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && !line.startsWith('#'))
      .map((line) => this.parseLine(line))
      .filter(Boolean);
  }

  parseLine(line) {
    const [mainPart, resultPartRaw] = line
      .split('=>')
      .map((part) => part.trim());

    if (!mainPart || !resultPartRaw) {
      console.warn(`Строка расписания пропущена: ${line}`);
      return null;
    }

    const match = mainPart.match(
      /^(\d{1,2}\.\d{1,2})\s+(\d{1,2}:\d{2})\s+(.+)$/
    );

    if (!match) {
      console.warn(`Неверный формат строки: ${line}`);
      return null;
    }

    const [, date, time, opponent] = match;
    const resultData = this.parseResult(resultPartRaw);

    return {
      date,
      time,
      type: 'Матч',
      opponent,
      format: 'BO3',
      side: '-',
      result: resultData.result,
      score: resultData.score,
      notes: resultData.notes,
    };
  }

  parseResult(value) {
    const normalizedValue = value.toLowerCase().replace(/\s+/g, '');

    if (
      normalizedValue === 'planned' ||
      normalizedValue === 'plan' ||
      normalizedValue === '-'
    ) {
      return {
        result: 'planned',
        score: '-',
        notes: 'Запланировано',
      };
    }

    const match = normalizedValue.match(/^(\d+)win\/(\d+)lose$/);

    if (!match) {
      return {
        result: 'planned',
        score: value,
        notes: 'Результат указан вручную',
      };
    }

    const wins = Number(match[1]);
    const loses = Number(match[2]);

    let result = 'draw';

    if (wins > loses) {
      result = 'win';
    }

    if (loses > wins) {
      result = 'lose';
    }

    return {
      result,
      score: `${wins}:${loses}`,
      notes: `${wins} win / ${loses} lose`,
    };
  }
}