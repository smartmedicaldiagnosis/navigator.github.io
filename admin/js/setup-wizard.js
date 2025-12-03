// admin/js/setup-wizard.js — использует ES6 modules

import { renderStep1 } from './steps/step1-corpus.js';
import { renderStep2 } from './steps/step2-floors-zones.js';
import { renderStep3 } from './steps/step3-room-distribution.js';
import { renderStep4, addSpecialty, removeSpecialty } from './steps/step4-specialties.js';
import { renderStep5, buildFinalConfig, downloadConfig } from './steps/step5-qr-export.js';

export class SetupWizard {
  constructor({ container, onFinish }) {
    this.container = container;
    this.onFinish = onFinish;
    this.step = 1;
    this.data = {
      corpora: [
        {
          id: 'corp-1',
          name: 'Корпус 1',
          floors: 1,
          zones: ['Центр'],
          floorZones: {},
        },
      ],
      specialties: [],
      mainEntrance: 'corp-1',
      currentCorpusIndex: 0,
    };
    window.__wizard = this; // для inline-обработчиков (пока)
  }

  updateData(updates) {
    Object.assign(this.data, updates);
  }

  render() {
    this.container.innerHTML = '';
    const renderers = [null, renderStep1, renderStep2, renderStep3, renderStep4, renderStep5];
    const renderer = renderers[this.step];
    if (renderer) {
      switch (this.step) {
        case 1:
          renderer(this.container, this.data, (updates) => this.updateData(updates));
          break;
        case 2:
          renderer(this.container, this.data, (updates) => this.updateData(updates), (idx) => this.switchCorpus(idx));
          break;
        case 3:
          renderer(this.container, this.data, (updates) => this.updateData(updates));
          break;
        case 4:
          renderer(this.container, this.data, (updates) => this.updateData(updates));
          break;
        case 5:
          renderer(this.container, this.data, () => this.exportConfig());
          break;
      }
    }

    const prevBtn = document.getElementById('btn-prev');
    const nextBtn = document.getElementById('btn-next');
    if (prevBtn) prevBtn.disabled = this.step === 1;
    if (nextBtn) nextBtn.textContent = this.step === 5 ? '✅ Завершить' : 'Далее →';
  }

  switchCorpus(index) {
    this.data.currentCorpusIndex = index;
    this.render();
  }

  addSpecialty() {
    addSpecialty(this.data, (updates) => this.updateData(updates));
    this.render();
  }

  removeSpecialty(index) {
    removeSpecialty(index, this.data, (updates) => this.updateData(updates));
    this.render();
  }

  exportConfig() {
    const config = buildFinalConfig(this.data);
    downloadConfig(config);
    if (this.onFinish) this.onFinish(config);
  }

  next() {
    if (this.step < 5) {
      this.step++;
    } else {
      this.exportConfig();
      return;
    }
    this.render();
  }

  prev() {
    if (this.step > 1) {
      this.step--;
      this.render();
    }
  }

  start() {
    this.render();
    this.bindButtons();
  }

  bindButtons() {
    const nextBtn = document.getElementById('btn-next');
    const prevBtn = document.getElementById('btn-prev');
    if (nextBtn) nextBtn.onclick = () => this.next();
    if (prevBtn) prevBtn.onclick = () => this.prev();
  }
}

// Инициализация (в setup-wizard.html нужно заменить скрипт)
export function initWizard() {
  const container = document.getElementById('wizard');
  if (!container) return;

  const wizard = new SetupWizard({
    container,
    onFinish: (cfg) => console.log('✅ Конфигурация сохранена', cfg),
  });
  wizard.start();
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWizard);
  } else {
    initWizard();
  }
}
