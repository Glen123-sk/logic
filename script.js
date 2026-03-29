const shape = document.getElementById('shape');
const shapeSelect = document.getElementById('shapeSelect');
const sizeRange = document.getElementById('sizeRange');
const sizeValue = document.getElementById('sizeValue');
const fillColor = document.getElementById('fillColor');
const borderColor = document.getElementById('borderColor');
const borderWidth = document.getElementById('borderWidth');
const borderValue = document.getElementById('borderValue');
const gradientToggle = document.getElementById('gradientToggle');
const animationType = document.getElementById('animationType');
const animDuration = document.getElementById('animDuration');
const animDurationValue = document.getElementById('animDurationValue');
const animDelay = document.getElementById('animDelay');
const animDelayValue = document.getElementById('animDelayValue');
const animIteration = document.getElementById('animIteration');
const allShapesBtn = document.getElementById('allShapesBtn');
const cssCode = document.getElementById('cssCode');
const cssEditor = cssCode;
const shareState = document.getElementById('shareState');
const shareUrl = document.getElementById('shareUrl');
const copyCss = document.getElementById('copyCss');
const downloadCss = document.getElementById('downloadCss');
const liveApply = document.getElementById('liveApply');
const savePresetBtn = document.getElementById('savePresetBtn');
const presetName = document.getElementById('presetName');
const presetsList = document.getElementById('presetsList');
const allShapesGrid = document.getElementById('allShapesGrid');

const shapeConfigs = {
  square: { clipPath: 'none', borderRadius: '0' },
  circle: { clipPath: 'circle(50% at 50% 50%)', borderRadius: '50%' },
  ellipse: { clipPath: 'ellipse(45% 38% at 50% 50%)', borderRadius: '50%' },
  rounded: { clipPath: 'none', borderRadius: '22%' },
  triangle: { clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', borderRadius: '0' },
  star: { clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)', borderRadius: '0' },
  cloud: { clipPath: 'none', borderRadius: '60% 45% 55% 50% / 55% 40% 65% 40%' },
};

let showAllMode = false;

function shadeColor(color, percent) {
  const num = parseInt(color.replace('#', ''), 16);
  let r = (num >> 16) + percent;
  let g = ((num >> 8) & 0x00FF) + percent;
  let b = (num & 0x0000FF) + percent;

  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));

  const rr = r.toString(16).padStart(2, '0');
  const gg = g.toString(16).padStart(2, '0');
  const bb = b.toString(16).padStart(2, '0');
  return `#${rr}${gg}${bb}`;
}

function getFillStyle() {
  if (gradientToggle.checked) {
    return `linear-gradient(135deg, ${fillColor.value} 0%, ${shadeColor(fillColor.value, -18)} 55%, ${shadeColor(fillColor.value, -30)} 100%)`;
  }
  return fillColor.value;
}

function getAnimationStyles() {
  const type = animationType.value;
  const duration = Number(animDuration.value);
  const delay = Number(animDelay.value);
  const iter = animIteration.value || 'infinite';

  if (type === 'none') return { classNames: [], css: '' };

  const classNames = [type];
  const css = [
    `animation-name: ${type};`,
    `animation-duration: ${duration}s;`,
    `animation-delay: ${delay}s;`,
    `animation-iteration-count: ${iter};`,
    `animation-timing-function: ease-in-out;`,
    `animation-fill-mode: both;`,
  ].join(' ');

  return { classNames, css };
}

function makeShapeCSS(config) {
  const animation = getAnimationStyles();
  return [
    '.demo-shape {',
    `  width: ${config.width}px;`,
    `  height: ${config.height}px;`,
    `  background: ${config.background};`,
    `  border: ${config.borderWidth}px solid ${config.borderColor};`,
    config.clipPath !== 'none' ? `  clip-path: ${config.clipPath};` : '',
    config.borderRadius ? `  border-radius: ${config.borderRadius};` : '',
    animation.css,
    '}',
  ].filter(Boolean).join('\n');
}

function getCurrentConfig() {
  const shapeType = shapeSelect.value;
  const size = Number(sizeRange.value);
  const borderW = Number(borderWidth.value);
  const anim = getAnimationStyles();

  return {
    shapeType,
    width: shapeType === 'triangle' ? size + 20 : size,
    height: size,
    background: getFillStyle(),
    borderColor: borderColor.value,
    borderWidth: borderW,
    clipPath: shapeConfigs[shapeType].clipPath,
    borderRadius: shapeConfigs[shapeType].borderRadius,
    animationClass: anim.classNames.join(' '),
    animationCSS: anim.css,
    animDuration: Number(animDuration.value),
    animDelay: Number(animDelay.value),
    animIteration: animIteration.value || 'infinite',
  };
}

function applyConfig(config) {
  shapeSelect.value = config.shapeType;
  sizeRange.value = config.width && config.height ? config.height : sizeRange.value;
  sizeValue.textContent = config.height;
  fillColor.value = config.fillColor || fillColor.value;
  borderColor.value = config.borderColor || borderColor.value;
  borderWidth.value = config.borderWidth;
  borderValue.textContent = config.borderWidth;
  gradientToggle.checked = config.gradient || gradientToggle.checked;
  animationType.value = config.animationType || 'none';
  animDuration.value = config.animDuration || 1.2;
  animDurationValue.textContent = animDuration.value;
  animDelay.value = config.animDelay || 0;
  animDelayValue.textContent = animDelay.value;
  animIteration.value = config.animIteration || 'infinite';
  renderShape();
}

function renderShape() {
  const cfg = getCurrentConfig();
  if (showAllMode) {
    allShapesGrid.classList.remove('hidden');
    shape.parentElement.classList.add('hidden');
    allShapesGrid.innerHTML = '';

    Object.entries(shapeConfigs).forEach(([name, info]) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'shape-item';
      wrapper.style.textAlign = 'center';

      const itemBox = document.createElement('div');
      itemBox.className = `shape ${name}`;
      itemBox.style.width = '80px';
      itemBox.style.height = '80px';
      itemBox.style.margin = '0 auto 8px';
      itemBox.style.background = cfg.background;
      itemBox.style.border = `${cfg.borderWidth}px solid ${cfg.borderColor}`;
      itemBox.style.clipPath = info.clipPath;
      itemBox.style.borderRadius = info.borderRadius;
      if (cfg.animationClass) itemBox.classList.add(cfg.animationClass);

      const label = document.createElement('div');
      label.textContent = name;
      label.style.fontSize = '0.82rem';

      wrapper.appendChild(itemBox);
      wrapper.appendChild(label);
      allShapesGrid.appendChild(wrapper);
    });
  } else {
    allShapesGrid.classList.add('hidden');
    shape.parentElement.classList.remove('hidden');

    shape.className = `shape ${cfg.shapeType}`;
    shape.style.width = `${cfg.width}px`;
    shape.style.height = `${cfg.height}px`;
    shape.style.background = cfg.background;
    shape.style.border = `${cfg.borderWidth}px solid ${cfg.borderColor}`;
    shape.style.clipPath = cfg.clipPath;
    shape.style.borderRadius = cfg.borderRadius;
    shape.classList.remove('pulse', 'spin', 'bounce', 'float');
    if (cfg.animationClass) shape.classList.add(cfg.animationClass);
    if (cfg.animDuration) shape.style.animationDuration = `${cfg.animDuration}s`;
    if (cfg.animDelay) shape.style.animationDelay = `${cfg.animDelay}s`;
    if (cfg.animIteration) shape.style.animationIterationCount = cfg.animIteration;
  }

  cssEditor.value = makeShapeCSS({
    width: cfg.width,
    height: cfg.height,
    background: cfg.background,
    borderColor: cfg.borderColor,
    borderWidth: cfg.borderWidth,
    clipPath: cfg.clipPath,
    borderRadius: cfg.borderRadius,
  });
}

function updateStateUrl() {
  const cfg = getCurrentConfig();
  const params = new URLSearchParams();
  params.set('shape', cfg.shapeType);
  params.set('size', sizeRange.value);
  params.set('fill', fillColor.value);
  params.set('border', borderColor.value);
  params.set('bwidth', borderWidth.value);
  params.set('gradient', gradientToggle.checked);
  params.set('anim', animationType.value);
  params.set('duration', animDuration.value);
  params.set('delay', animDelay.value);
  params.set('iter', animIteration.value);

  const url = `${location.origin}${location.pathname}?${params.toString()}`;
  shareUrl.textContent = url;
}

function makePresetKey() {
  return 'css-shape-visualizer-presets';
}

function loadPresets() {
  try {
    const raw = localStorage.getItem(makePresetKey());
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function savePresets(presets) {
  localStorage.setItem(makePresetKey(), JSON.stringify(presets));
}

function renderPresets() {
  const presets = loadPresets();
  presetsList.innerHTML = '';
  if (!presets.length) {
    presetsList.innerHTML = '<p>No presets yet.</p>';
    return;
  }

  presets.forEach((preset, index) => {
    const row = document.createElement('div');
    row.className = 'preset';

    const name = document.createElement('span');
    name.textContent = preset.name;

    const loadBtn = document.createElement('button');
    loadBtn.textContent = 'Load';
    loadBtn.addEventListener('click', () => {
      applyConfig(preset.config);
      showAllMode = false;
      allShapesBtn.textContent = 'Show All Shapes';
      renderShape();
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => {
      const next = presets.filter((_, i) => i !== index);
      savePresets(next);
      renderPresets();
    });

    row.append(name, loadBtn, deleteBtn);
    presetsList.appendChild(row);
  });
}

function loadFromUrl() {
  const params = new URLSearchParams(location.search);
  if (!params.has('shape')) return;

  shapeSelect.value = params.get('shape');
  sizeRange.value = params.get('size') || sizeRange.value;
  sizeValue.textContent = sizeRange.value;
  fillColor.value = params.get('fill') || fillColor.value;
  borderColor.value = params.get('border') || borderColor.value;
  borderWidth.value = params.get('bwidth') || borderWidth.value;
  borderValue.textContent = borderWidth.value;
  gradientToggle.checked = params.get('gradient') === 'true';
  animationType.value = params.get('anim') || 'none';
  animDuration.value = params.get('duration') || animDuration.value;
  animDurationValue.textContent = animDuration.value;
  animDelay.value = params.get('delay') || animDelay.value;
  animDelayValue.textContent = animDelay.value;
  animIteration.value = params.get('iter') || animIteration.value;
}

function applyCSSFromEditor() {
  const text = cssEditor.value;
  const style = document.getElementById('runtimeStyle') || document.createElement('style');
  style.id = 'runtimeStyle';
  style.textContent = text;
  document.head.appendChild(style);
}

function init() {
  animDurationValue.textContent = animDuration.value;
  animDelayValue.textContent = animDelay.value;

  const controlElements = [shapeSelect, sizeRange, fillColor, borderColor, borderWidth, gradientToggle, animationType, animDuration, animDelay, animIteration];
  controlElements.forEach(el => {
    el.addEventListener('input', () => {
      sizeValue.textContent = sizeRange.value;
      borderValue.textContent = borderWidth.value;
      animDurationValue.textContent = animDuration.value;
      animDelayValue.textContent = animDelay.value;
      showAllMode = false;
      allShapesBtn.textContent = 'Show All Shapes';
      renderShape();
      updateStateUrl();
    });
  });

  allShapesBtn.addEventListener('click', () => {
    showAllMode = !showAllMode;
    allShapesBtn.textContent = showAllMode ? 'Back to single shape' : 'Show All Shapes';
    renderShape();
  });

  savePresetBtn.addEventListener('click', () => {
    const name = presetName.value.trim();
    if (!name) return alert('Enter preset name');

    const presets = loadPresets();
    presets.push({ name, config: {
      shapeType: shapeSelect.value,
      fillColor: fillColor.value,
      borderColor: borderColor.value,
      borderWidth: borderWidth.value,
      gradient: gradientToggle.checked,
      animationType: animationType.value,
      animDuration: animDuration.value,
      animDelay: animDelay.value,
      animIteration: animIteration.value,
    }});
    savePresets(presets);
    renderPresets();
    presetName.value = '';
  });

  copyCss.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(cssEditor.value);
      window.alert('CSS copied to clipboard');
    } catch (err) {
      window.alert('Copy failed');
    }
  });

  downloadCss.addEventListener('click', () => {
    const blob = new Blob([cssEditor.value], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shape.css';
    a.click();
    URL.revokeObjectURL(url);
  });

  liveApply.addEventListener('click', () => {
    applyCSSFromEditor();
  });

  shareState.addEventListener('click', () => {
    updateStateUrl();
    shareUrl.scrollIntoView({ behavior: 'smooth' });
  });

  cssEditor.addEventListener('input', () => {
    // update code as live text while editing; don't apply automatically to shape due to potential bad CSS
  });

  loadFromUrl();
  renderShape();
  renderPresets();
  updateStateUrl();
}

init();
