// lib/auth.js — MVP (без bcrypt, с обходом кэша)
window.auth = {
  login: async function(password) {
    try {
      // ?t= — чтобы обойти кэш GitHub Pages / браузера
      const res = await fetch('../config.json?t=' + Date.now());
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      const config = await res.json();

      // Приоритет: admin_password → fallback
      const expected = config.admin_password || 'wellway';
      return password === expected;
    } catch (e) {
      console.error('[auth] Ошибка:', e);
      alert('Ошибка загрузки настроек. Проверьте config.json.');
      return false;
    }
  }
};
