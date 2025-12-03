// steps/step2-floors-zones.js

export function renderStep2(container, data, onUpdate, onSwitchCorpus) {
  if (!data.corpora.length) {
    onSwitchCorpus(0);
    return;
  }

  const idx = data.currentCorpusIndex ?? 0;
  const corp = data.corpora[idx];
  if (!corp) return;

  const corpsButtons = data.corpora.map((c, i) => {
    const activeClass = i === idx ? ' btn-primary' : '';
    return `<button type="button" class="btn${activeClass}" 
      onclick="window.__wizard.switchCorpus(${i})">${c.name}</button>`;
  }).join(' ');

  container.innerHTML = `
    <h2>Шаг 2: Настройка ${corp.name}</h2>
    <label>Этажей:</label>
    <input type="number" id="floors" min="1" value="${corp.floors}">
    <label>Зоны на этаже (через запятую):</label>
    <input type="text" id="zones" value="${corp.zones.join(', ')}">
    <div style="margin-top: 1rem;">
      <label>Корпус:</label><br>
      ${corpsButtons}
    </div>
  `;

  const floorsInput = container.querySelector('#floors');
  const zonesInput = container.querySelector('#zones');

  floorsInput.onchange = () => {
    const newVal = Math.max(1, parseInt(floorsInput.value) || 1);
    corp.floors = newVal;
    onUpdate({ corpora: [...data.corpora] });
  };

  zonesInput.onchange = () => {
    const zones = zonesInput.value
      .split(',')
      .map(z => z.trim())
      .filter(Boolean);
    corp.zones = zones;
    onUpdate({ corpora: [...data.corpora] });
  };
}
