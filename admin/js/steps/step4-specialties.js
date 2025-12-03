// steps/step4-specialties.js
import { generateId } from '../utils.js';

export function renderStep4(container, data, onUpdate) {
  container.innerHTML = `
    <h2>Шаг 4: Специальности</h2>
    <div id="specs"></div>
    <button class="btn btn-primary" onclick="window.__wizard.addSpecialty()">➕ Добавить специальность</button>
  `;

  const specsContainer = container.querySelector('#specs');
  specsContainer.innerHTML = '';

  data.specialties.forEach((spec, i) => {
    renderSpecialty(specsContainer, spec, i, data, onUpdate);
  });

  if (data.specialties.length === 0) {
    addSpecialty(data, onUpdate);
  }
}

function renderSpecialty(container, spec, index, data, onUpdate) {
  const div = document.createElement('div');
  div.className = 'spec-item';
  div.innerHTML = `
    <hr>
    <label>Название:</label>
    <input type="text" data-index="${index}" data-field="name" value="${spec.name || ''}">
    <label>Синонимы (через запятую):</label>
    <input type="text" data-index="${index}" data-field="synonyms" value="${(spec.synonyms || []).join(', ')}">
    <label>Кабинеты (номера через запятую):</label>
    <input type="text" data-index="${index}" data-field="rooms" value="${(spec.rooms || []).map(r => r.number).join(', ')}">
    <label>Название помещения:</label>
    <input type="text" data-index="${index}" data-field="roomName" value="${spec.roomName || ''}">
    <label><input type="checkbox" data-index="${index}" data-field="showDoctor" ${spec.showDoctor ? 'checked' : ''}> Показывать фамилию врача (скрыто)</label>
    <label><input type="checkbox" data-index="${index}" data-field="showSchedule" ${spec.showSchedule ? 'checked' : ''}> Показывать расписание (скрыто)</label>
    <button type="button" class="btn" style="background:#f44336;color:white;" 
      onclick="window.__wizard.removeSpecialty(${index})">Удалить</button>
  `;
  container.appendChild(div);

  div.querySelectorAll('input').forEach(el => {
    el.onchange = () => {
      const idx = parseInt(el.dataset.index);
      const field = el.dataset.field;
      const value = el.type === 'checkbox' ? el.checked : el.value.trim();

      if (!data.specialties[idx]) return;

      switch (field) {
        case 'name': data.specialties[idx].name = value; break;
        case 'synonyms':
          data.specialties[idx].synonyms = value
            .split(',')
            .map(s => s.trim())
            .filter(Boolean);
          break;
        case 'rooms':
          data.specialties[idx].rooms = value
            .split(',')
            .map(num => num.trim())
            .filter(Boolean)
            .map(num => ({ number: num }));
          break;
        case 'roomName': data.specialties[idx].roomName = value; break;
        case 'showDoctor': data.specialties[idx].showDoctor = value; break;
        case 'showSchedule': data.specialties[idx].showSchedule = value; break;
      }

      onUpdate({ specialties: [...data.specialties] });
    };
  });
}

export function addSpecialty(data, onUpdate) {
  const spec = {
    id: generateId('spec'),
    name: '',
    synonyms: [],
    rooms: [],
    roomName: '',
    doctor: 'Иванова А.П.',
    schedule: 'Пн–Пт 9:00–15:00',
    status: 'работает',
    showDoctor: false,
    showSchedule: false,
  };
  data.specialties.push(spec);
  onUpdate({ specialties: [...data.specialties] });
}

export function removeSpecialty(index, data, onUpdate) {
  data.specialties.splice(index, 1);
  onUpdate({ specialties: [...data.specialties] });
}
