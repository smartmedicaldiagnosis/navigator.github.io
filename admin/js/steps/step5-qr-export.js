// steps/step5-qr-export.js
import { toSnakeCase } from '../utils.js';

export function renderStep5(container, data, onExport) {
  const points = [
    `• Главный вход (${data.corpora[0]?.name || 'Корпус 1'}, 1 этаж)`,
    ...data.corpora.flatMap(corp =>
      corp.zones.slice(0, 2).map(zone =>
        `• Вход в «${zone}», ${Math.min(2, corp.floors)} этаж (${corp.name})`
      )
    )
  ];

  container.innerHTML = `
    <h2>Шаг 5: Генерация QR-кодов</h2>
    <p>Рекомендуемые точки размещения QR-кодов:</p>
    <ul>${points.map(p => `<li>${p}</li>`).join('')}</ul>
    <p><em>Точную настройку узлов можно выполнить в редакторе позже.</em></p>
    <button class="btn btn-primary" onclick="window.__wizard.exportConfig()">✅ Сохранить и скачать config.json</button>
  `;
}

export function buildFinalConfig(data) {
  return {
    version: '1.1',
    admin_password: 'wellway',
    corpora: data.corpora.map(corp => ({
      id: corp.id,
      name: corp.name,
      entrance: corp.id === data.mainEntrance ? 'node_main_entrance' : null,
      floors: Array.from({ length: corp.floors }, (_, fi) => {
        const floorNum = fi + 1;
        return {
          id: `${floorNum}`,
          zones: corp.zones.map((zoneName, zi) => {
            const key = `${floorNum}-${zi}`;
            const zoneData = corp.floorZones?.[key] || {};
            return {
              name: zoneName,
              range: zoneData.range || '',
              node: zoneData.node || `node_${corp.id}_${floorNum}f_${toSnakeCase(zoneName)}_entrance`,
            };
          }),
        };
      }),
    })),

    specialties: data.specialties.map(spec => ({
      id: spec.id,
      name: spec.name,
      synonyms: spec.synonyms || [],
      rooms: (spec.rooms || []).map(room => ({
        number: room.number,
        name: spec.roomName || spec.name,
        building: data.corpora[0]?.id || 'main',
        floor: '2',
        node: `node_${room.number}`,
      })),
      doctor: spec.doctor || 'Иванова А.П.',
      schedule: spec.schedule || 'Пн–Пт 9:00–15:00',
      status: spec.status || 'работает',
      show_details: !!(spec.showDoctor || spec.showSchedule),
    })),

    qr_nodes: [
      {
        id: 'node_main_entrance',
        name: 'Главный вход',
        building: data.corpora[0]?.id || 'main',
        floor: '1',
      },
      ...data.corpora.flatMap(corp =>
        Array.from({ length: corp.floors }, (_, fi) =>
          corp.zones.map((_, zi) => {
            const key = `${fi + 1}-${zi}`;
            const zoneData = corp.floorZones?.[key];
            if (zoneData?.node) {
              return {
                id: zoneData.node,
                name: `Вход в ${corp.zones[zi]} (${corp.name}, ${fi + 1} этаж)`,
                building: corp.id,
                floor: `${fi + 1}`,
              };
            }
            return null;
          })
        ).flat().filter(Boolean)
      ),
    ],
  };
}

export function downloadConfig(config) {
  const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'config.json';
  a.click();
  URL.revokeObjectURL(url);
}
