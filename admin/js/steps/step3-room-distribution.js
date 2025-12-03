// steps/step3-room-distribution.js
import { toSnakeCase } from '../utils.js';

export function renderStep3(container, data, onUpdate) {
  container.innerHTML = `<h2>Шаг 3: Распределение кабинетов</h2>`;
  const corpsContainer = document.createElement('div');

  data.corpora.forEach((corp, ci) => {
    const corpDiv = document.createElement('details');
    corpDiv.className = 'corp-section';
    corpDiv.style.cssText = `
      border: 1px solid #eee; border-radius: 8px; margin-bottom: 1rem; background: #fafafa;
    `;

    const summary = document.createElement('summary');
    summary.innerHTML = `<strong>${corp.name}</strong> — ${corp.floors} этаж(а/ей)`;
    corpDiv.appendChild(summary);

    const content = document.createElement('div');
    content.style.padding = '1rem';

    const floorSelect = document.createElement('select');
    floorSelect.className = 'floor-selector';
    floorSelect.dataset.corpIndex = ci;
    for (let f = 1; f <= corp.floors; f++) {
      const opt = document.createElement('option');
      opt.value = f;
      opt.textContent = `Этаж ${f}`;
      if (f === 1) opt.selected = true;
      floorSelect.appendChild(opt);
    }

    content.appendChild(document.createTextNode('Этаж: '));
    content.appendChild(floorSelect);

    const zonesContainer = document.createElement('div');
    zonesContainer.className = 'floor-zones';
    content.appendChild(zonesContainer);
    corpDiv.appendChild(content);
    corpsContainer.appendChild(corpDiv);

    // Рендер первого этажа
    renderZonesForFloor(zonesContainer, ci, 1, corp, data, onUpdate);

    floorSelect.addEventListener('change', (e) => {
      const floorNum = parseInt(e.target.value);
      renderZonesForFloor(zonesContainer, ci, floorNum, corp, data, onUpdate);
    });
  });

  container.appendChild(corpsContainer);
}

function renderZonesForFloor(container, corpIdx, floorNum, corp, data, onUpdate) {
  container.innerHTML = `<h4>Этаж ${floorNum}</h4>`;
  const corpData = data.corpora[corpIdx];

  corp.zones.forEach((zoneName, zi) => {
    const key = `${floorNum}-${zi}`;
    const saved = corpData.floorZones?.[key] || {};

    const zoneDiv = document.createElement('div');
    zoneDiv.className = 'zone-config';
    zoneDiv.style.cssText = `
      padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px;
      margin-top: 0.5rem; background: #fff;
    `;
    zoneDiv.innerHTML = `
      <strong>${zoneName}</strong>
      <div><label>Диапазон кабинетов:</label>
        <input type="text" class="range-input" 
          data-corp="${corpIdx}" data-floor="${floorNum}" data-zone="${zi}"
          placeholder="101–110" value="${saved.range || ''}">
      </div>
      <div><label>Тип кабинетов:</label>
        <input type="text" class="type-input"
          data-corp="${corpIdx}" data-floor="${floorNum}" data-zone="${zi}"
          placeholder="Основные приёмы" value="${saved.type || ''}">
      </div>
      <div><label>ID узла входа:</label>
        <input type="text" class="node-input"
          data-corp="${corpIdx}" data-floor="${floorNum}" data-zone="${zi}"
          placeholder="node_1f_right_entrance" 
          value="${saved.node || `node_${corp.id}_${floorNum}f_${toSnakeCase(zoneName)}_entrance`}">
      </div>
    `;
    container.appendChild(zoneDiv);
  });

  // Обработчики
  container.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', (e) => {
      const { corp, floor, zone } = e.target.dataset;
      const field = e.target.classList.contains('range-input') ? 'range' :
                    e.target.classList.contains('type-input') ? 'type' :
                    e.target.classList.contains('node-input') ? 'node' : null;
      if (!field) return;

      const corpIdx = parseInt(corp);
      const floorNum = parseInt(floor);
      const zoneIdx = parseInt(zone);
      const key = `${floorNum}-${zoneIdx}`;

      if (!data.corpora[corpIdx].floorZones) {
        data.corpora[corpIdx].floorZones = {};
      }

      const zoneData = data.corpora[corpIdx].floorZones[key] || {};
      zoneData[field] = e.target.value.trim();
      data.corpora[corpIdx].floorZones[key] = zoneData;

      onUpdate({ corpora: [...data.corpora] });
    });
  });
}
