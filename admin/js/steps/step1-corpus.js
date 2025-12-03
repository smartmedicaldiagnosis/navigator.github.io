// steps/step1-corpus.js
import { generateId } from '../utils.js';

export function renderStep1(container, data, onUpdate) {
  const currentCount = data.corpora.length || 1;

  container.innerHTML = `
    <h2>Шаг 1: Основные параметры</h2>
    <label>Сколько корпусов?</label>
    <input type="number" id="num-corpora" min="1" value="${currentCount}">
    <label>Главный вход в корпусе:</label>
    <select id="main-entrance"></select>
  `;

  const numInput = container.querySelector('#num-corpora');
  const entranceSelect = container.querySelector('#main-entrance');

  const updateCorpora = () => {
    let n = Math.max(1, parseInt(numInput.value) || 1);

    // Увеличиваем корпуса
    while (data.corpora.length < n) {
      const idx = data.corpora.length + 1;
      data.corpora.push({
        id: `corp-${idx}`,
        name: `Корпус ${idx}`,
        floors: 1,
        zones: ['Центр'],
        floorZones: {}, // ← объект для сохранения диапазонов по этажам/зонам
      });
    }

    // Уменьшаем
    while (data.corpora.length > n) {
      data.corpora.pop();
    }

    // Обновляем select
    entranceSelect.innerHTML = '';
    data.corpora.forEach((corp) => {
      const opt = document.createElement('option');
      opt.value = corp.id;
      opt.textContent = corp.name;
      entranceSelect.appendChild(opt);
    });

    // Устанавливаем/сохраняем главный вход
    if (!data.mainEntrance && data.corpora.length > 0) {
      data.mainEntrance = data.corpora[0].id;
    }
    entranceSelect.value = data.mainEntrance || '';

    // Обновляем внешнее состояние
    onUpdate({ corpora: [...data.corpora], mainEntrance: entranceSelect.value });
  };

  numInput.onchange = updateCorpora;
  entranceSelect.onchange = () => {
    onUpdate({ mainEntrance: entranceSelect.value });
  };

  updateCorpora(); // инициализация
}
