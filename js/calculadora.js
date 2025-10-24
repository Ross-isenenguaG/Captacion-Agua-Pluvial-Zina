"use strict";

const materiales = [
  { id: 'teja', nombre: 'Teja de barro', coef: 0.90 },
  { id: 'lamina', nombre: 'Lámina metálica', coef: 0.85 },
  { id: 'concreto', nombre: 'Concreto', coef: 0.60 }
];

const LITROS_POR_MM_M2 = 1;

const materialSelect = document.getElementById('material');
materiales.forEach(m => {
  const opt = document.createElement('option');
  opt.value = m.id;
  opt.textContent = `${m.nombre} (coef ${m.coef})`;
  materialSelect.appendChild(opt);
});

function validatePositiveNumber(value) {
  const n = Number(value);
  return !Number.isNaN(n) && n > 0;
}

function showError(msg) {
  const el = document.getElementById('errors');
  el.textContent = msg;
}

function clearError() {
  document.getElementById('errors').textContent = '';
}

function calcularVolumen({ area, precipitacion, coef, eficiencia }) {
  const eficienciaFrac = eficiencia / 100;
  return area * precipitacion * coef * eficienciaFrac * LITROS_POR_MM_M2;
}

function renderResultados(volumenLitros) {
  const panel = document.getElementById('result-panel');
  if (!volumenLitros || volumenLitros <= 0) {
    panel.innerHTML = `<p style="color:var(--muted)">No hay resultados válidos. Ajusta los valores e intenta de nuevo.</p>`;
    return;
  }

  const litrosDiarios = volumenLitros.toFixed(1);
  const recomendado = Math.ceil(volumenLitros / 500) * 500;

  panel.innerHTML = `
    <div style="background:var(--card);padding:.75rem;border-radius:8px;border:1px solid rgba(15,23,42,0.03)">
      <div><strong>Volumen estimado:</strong> ${litrosDiarios} L</div>
      <div style="color:var(--muted);margin-top:.35rem">(Estimación para el periodo de precipitación ingresado)</div>
      <div style="margin-top:.6rem"><strong>Tanque recomendado:</strong> ${recomendado} L</div>
    </div>
  `;
}

const form = document.getElementById('calc-form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  clearError();

  const area = document.getElementById('area').value;
  const precip = document.getElementById('precipitacion').value;
  const mat = document.getElementById('material').value;
  const eficiencia = document.getElementById('eficiencia').value;

  if (!validatePositiveNumber(area)) {
    showError('Ingresa un área válida mayor que 0.');
    return;
  }

  if (!validatePositiveNumber(precip)) {
    showError('Ingresa una precipitación válida mayor que 0.');
    return;
  }

  if (!eficiencia || Number(eficiencia) <= 0 || Number(eficiencia) > 100) {
    showError('La eficiencia debe estar entre 0 y 100.');
    return;
  }

  const materialObj = materiales.find(m => m.id === mat);
  if (!materialObj) {
    showError('Selecciona un material de techo válido.');
    return;
  }

  const volumen = calcularVolumen({
    area: Number(area),
    precipitacion: Number(precip),
    coef: materialObj.coef,
    eficiencia: Number(eficiencia)
  });

  renderResultados(volumen);
});

document.getElementById('limpiar').addEventListener('click', () => {
  form.reset();
  clearError();
  document.getElementById('result-panel').innerHTML =
    `<p style="color:var(--muted)">Aquí se mostrarán los resultados una vez que completes el formulario.</p>`;
});
