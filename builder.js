const state = {
  file: null,
  hdriSource: "default",
  offsetTarget: "end",
  parts: [],
  selectedPartId: null,
  selectedPartIds: [],
  selectionAnchorId: null,
  autoArrangeActive: false,
  autoArrangeSnapshot: null,
  partOverrides: {},
  preview: null,
};

const DEFAULT_HDRI_PATH = "./assets/default-studio-small-08.hdr";
const HDRI_PRESETS = {
  none: { label: "无 HDRI", path: "" },
  default: { label: "默认棚拍 HDRI", path: DEFAULT_HDRI_PATH, b64Key: "default" },
  brownStudio: { label: "暖调摄影棚", path: "./assets/brown-photostudio-02-1k.hdr", b64Key: "brownStudio" },
  whiteStudio: { label: "白色柔光棚", path: "./assets/white-studio-02-1k.hdr", b64Key: "whiteStudio" },
  sunset: { label: "威尼斯日落", path: "./assets/venice-sunset-1k.hdr", b64Key: "sunset" },
};

const MATERIAL_PRESETS = {
  mattePlastic: { color: "#6f7f8f", metalness: 0.05, roughness: 0.72, clearcoat: 0.05, clearcoatRoughness: 0.65 },
  glossPlastic: { color: "#24546c", metalness: 0.08, roughness: 0.22, clearcoat: 0.7, clearcoatRoughness: 0.16 },
  brushedMetal: { color: "#9aa3ad", metalness: 0.92, roughness: 0.34, clearcoat: 0.18, clearcoatRoughness: 0.42 },
  blackTitanium: { color: "#20252d", metalness: 0.86, roughness: 0.28, clearcoat: 0.34, clearcoatRoughness: 0.2 },
  rubber: { color: "#171a1f", metalness: 0.02, roughness: 0.86, clearcoat: 0.02, clearcoatRoughness: 0.9 },
  ceramic: { color: "#e3e2de", metalness: 0.02, roughness: 0.18, clearcoat: 0.78, clearcoatRoughness: 0.12 },
  transparent: { color: "#dcecff", metalness: 0.0, roughness: 0.04, clearcoat: 1.0, clearcoatRoughness: 0.03, transparent: true, opacity: 0.34, transmission: 0.72, thickness: 0.28, ior: 1.45 },
  champagneMetal: { color: "#d8bc82", metalness: 0.88, roughness: 0.18, clearcoat: 0.42, clearcoatRoughness: 0.12, opacity: 1, transparent: false },
  anodizedBlue: { color: "#2d5f8f", metalness: 0.74, roughness: 0.26, clearcoat: 0.62, clearcoatRoughness: 0.18, opacity: 1, transparent: false },
};

const MATERIAL_PRESET_LABELS = {
  mattePlastic: "磨砂塑料",
  glossPlastic: "亮面塑料",
  brushedMetal: "拉丝金属",
  blackTitanium: "黑钛金属",
  rubber: "橡胶",
  ceramic: "陶瓷",
  transparent: "透明",
  champagneMetal: "香槟金属",
  anodizedBlue: "阳极蓝",
};

const LIGHT_PRESETS = {
  none: null,
  studioSoft: { hemi: ["#ffffff", "#bcc8d0", 1.8], key: ["#ffffff", 3.8, [3.4, 5.6, 4.2]], rim: ["#8ee7df", 1.7, [-4.4, 2.6, -3.6]], warm: ["#ff8068", 20, [2.6, 1.2, 2.4]] },
  metalShowcase: { hemi: ["#eef6ff", "#66717c", 1.2], key: ["#ffffff", 5.2, [2.4, 5.8, 3.6]], rim: ["#b7fff6", 3.4, [-3.8, 3.2, -4.2]], warm: ["#ff6a4d", 34, [2.8, 1.4, 2.2]] },
  coolTech: { hemi: ["#e9fbff", "#7c8792", 1.45], key: ["#d8f7ff", 4.4, [3.8, 4.8, 4.4]], rim: ["#5be6ff", 2.8, [-4.2, 2.8, -3.8]], warm: ["#7aa7ff", 18, [2.2, 1.3, 2.8]] },
  warmInterior: { hemi: ["#fff6ea", "#b5aaa0", 1.55], key: ["#fff2dc", 4.0, [3.4, 5.2, 4.6]], rim: ["#ffd2a2", 2.0, [-4.2, 2.3, -3.8]], warm: ["#ff9a5c", 30, [2.5, 1.2, 2.3]] },
  highContrast: { hemi: ["#ffffff", "#58616b", 0.9], key: ["#ffffff", 6.0, [2.8, 6.2, 3.2]], rim: ["#65fff1", 4.0, [-4.6, 2.8, -4.3]], warm: ["#ff5738", 36, [2.8, 1.6, 2.8]] },
};

const elements = {
  dropzone: document.querySelector("#dropzone"),
  modelInput: document.querySelector("#model-input"),
  fileTitle: document.querySelector("#file-title"),
  fileMeta: document.querySelector("#file-meta"),
  productName: document.querySelector("#product-name"),
  productSummary: document.querySelector("#product-summary"),
  outputName: document.querySelector("#output-name"),
  modelSize: document.querySelector("#model-size"),
  buildButton: document.querySelector("#build-button"),
  previewResult: document.querySelector("#preview-result"),
  status: document.querySelector("#status"),
  autoRotate: document.querySelector("#auto-rotate"),
  smoothShading: document.querySelector("#smooth-shading"),
  editorPanel: document.querySelector("#editor-panel"),
  previewCanvas: document.querySelector("#preview-canvas"),
  axisCanvas: document.querySelector("#axis-canvas"),
  partList: document.querySelector("#part-list"),
  partEditor: document.querySelector(".part-editor"),
  reimportModel: document.querySelector("#reimport-model"),
  selectedPartName: document.querySelector("#selected-part-name"),
  materialMode: document.querySelector("#material-mode"),
  materialPreset: document.querySelector("#material-preset"),
  materialNote: document.querySelector("#material-note"),
  materialControls: document.querySelector("#material-controls"),
  presetGrid: document.querySelector("#preset-grid"),
  presetTuneRow: document.querySelector("#preset-tune-row"),
  presetTuneEnabled: document.querySelector("#preset-tune-enabled"),
  partColor: document.querySelector("#part-color"),
  partVisible: document.querySelector("#part-visible"),
  metalness: document.querySelector("#metalness"),
  roughness: document.querySelector("#roughness"),
  opacity: document.querySelector("#opacity"),
  metalnessValue: document.querySelector("#metalness-value"),
  roughnessValue: document.querySelector("#roughness-value"),
  opacityValue: document.querySelector("#opacity-value"),
  offsetX: document.querySelector("#offset-x"),
  offsetY: document.querySelector("#offset-y"),
  offsetZ: document.querySelector("#offset-z"),
  offsetNormal: document.querySelector("#offset-normal"),
  offsetXValue: document.querySelector("#offset-x-value"),
  offsetYValue: document.querySelector("#offset-y-value"),
  offsetZValue: document.querySelector("#offset-z-value"),
  offsetNormalValue: document.querySelector("#offset-normal-value"),
  autoExplodeTools: document.querySelector("#auto-explode-tools"),
  autoExplodeDetail: document.querySelector("#auto-explode-detail"),
  autoArrangeExplode: document.querySelector("#auto-arrange-explode"),
  applyAutoExplode: document.querySelector("#apply-auto-explode"),
  cancelAutoExplode: document.querySelector("#cancel-auto-explode"),
  autoExplodeStrength: document.querySelector("#auto-explode-strength"),
  autoExplodeStrengthValue: document.querySelector("#auto-explode-strength-value"),
  lightPreset: document.querySelector("#light-preset"),
  lightIntensity: document.querySelector("#light-intensity"),
  lightIntensityValue: document.querySelector("#light-intensity-value"),
  hdriSource: document.querySelector("#hdri-source"),
  hdriBackgroundEnabled: document.querySelector("#hdri-background-enabled"),
  hdriBackgroundBlur: document.querySelector("#hdri-background-blur"),
  hdriBackgroundBlurValue: document.querySelector("#hdri-background-blur-value"),
  hdriIntensity: document.querySelector("#hdri-intensity"),
  hdriIntensityValue: document.querySelector("#hdri-intensity-value"),
  hdriStatus: document.querySelector("#hdri-status"),
  offsetTarget: document.querySelector("#offset-target"),
  explodeEnabled: document.querySelector("#explode-enabled"),
  explodeInitial: document.querySelector("#explode-initial"),
};

function setStatus(message) {
  elements.status.textContent = message;
}

function bytesToBase64(bytes) {
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

function base64ToBytes(value) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function base64ToBytesSource() {
  return String.raw`
function base64ToBytes(value) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
`;
}

function randomBytes(length) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytes;
}

async function importAesKey(rawKey) {
  return crypto.subtle.importKey("raw", rawKey, "AES-GCM", false, ["encrypt", "decrypt"]);
}

async function encryptBytes(bytes, rawKey) {
  const iv = randomBytes(12);
  const key = await importAesKey(rawKey);
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, bytes);
  return {
    iv: bytesToBase64(iv),
    cipher: new Uint8Array(encrypted),
  };
}

function sanitizeName(value) {
  return value
    .trim()
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase() || "product-viewer";
}

function getModelFormat(filename) {
  const extension = filename.split(".").pop().toLowerCase();
  if (!["obj", "glb", "gltf"].includes(extension)) {
    throw new Error("只支持 OBJ / GLB / GLTF");
  }
  return extension;
}

function formatFileSize(size) {
  if (size > 1024 * 1024) return `${(size / 1024 / 1024).toFixed(2)} MB`;
  if (size > 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${size} B`;
}

async function loadThreeModules() {
  if (state.preview?.THREE) return state.preview;

  const [threeModule, controlsModule, gltfModule, objModule, utilsModule, rgbeModule, envModule] = await Promise.all([
    import("https://cdn.jsdelivr.net/npm/three@0.166.1/build/three.module.js"),
    import("https://cdn.jsdelivr.net/npm/three@0.166.1/examples/jsm/controls/OrbitControls.js"),
    import("https://cdn.jsdelivr.net/npm/three@0.166.1/examples/jsm/loaders/GLTFLoader.js"),
    import("https://cdn.jsdelivr.net/npm/three@0.166.1/examples/jsm/loaders/OBJLoader.js"),
    import("https://cdn.jsdelivr.net/npm/three@0.166.1/examples/jsm/utils/BufferGeometryUtils.js"),
    import("https://cdn.jsdelivr.net/npm/three@0.166.1/examples/jsm/loaders/RGBELoader.js"),
    import("https://cdn.jsdelivr.net/npm/three@0.166.1/examples/jsm/environments/RoomEnvironment.js"),
  ]);

  const THREE = threeModule;
  const renderer = new THREE.WebGLRenderer({
    canvas: elements.previewCanvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.04;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const axisRenderer = new THREE.WebGLRenderer({
    canvas: elements.axisCanvas,
    antialias: true,
    alpha: true,
  });
  axisRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  axisRenderer.setClearColor(0x000000, 0);
  const axisScene = new THREE.Scene();
  const axisCamera = new THREE.PerspectiveCamera(35, 1, 0.1, 30);
  const axisRoot = new THREE.Group();
  axisRoot.add(new THREE.AxesHelper(1.25));
  axisScene.add(axisRoot);
  function addAxisLabel(text, color, position) {
    const labelCanvas = document.createElement("canvas");
    labelCanvas.width = 64;
    labelCanvas.height = 64;
    const context = labelCanvas.getContext("2d");
    context.fillStyle = color;
    context.font = "700 30px Inter, sans-serif";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text, 32, 32);
    const texture = new THREE.CanvasTexture(labelCanvas);
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false }));
    sprite.position.copy(position);
    sprite.scale.set(0.42, 0.42, 1);
    axisRoot.add(sprite);
  }
  addAxisLabel("X", "#d94b3a", new THREE.Vector3(1.55, 0, 0));
  addAxisLabel("Y", "#1f8f62", new THREE.Vector3(0, 1.55, 0));
  addAxisLabel("Z", "#2d6cdf", new THREE.Vector3(0, 0, 1.55));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 500);
  camera.position.set(4.2, 2.4, 6.2);
  const controls = new controlsModule.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.minDistance = 0.5;
  controls.maxDistance = 80;
  controls.target.set(0, 0.3, 0);
  elements.previewCanvas.addEventListener("pointerdown", handlePreviewPointerDown);
  elements.previewCanvas.addEventListener("pointerup", handlePreviewPointerUp);
  elements.previewCanvas.addEventListener("contextmenu", (event) => event.preventDefault());

  const root = new THREE.Group();
  const lightRoot = new THREE.Group();
  scene.add(root, lightRoot);

  state.preview = {
    THREE,
    OrbitControls: controlsModule.OrbitControls,
    GLTFLoader: gltfModule.GLTFLoader,
    OBJLoader: objModule.OBJLoader,
    RGBELoader: rgbeModule.RGBELoader,
    RoomEnvironment: envModule.RoomEnvironment,
    mergeVertices: utilsModule.mergeVertices,
    renderer,
    axisRenderer,
    scene,
    axisScene,
    axisRoot,
    camera,
    axisCamera,
    controls,
    root,
    lightRoot,
    raycaster: new THREE.Raycaster(),
    pointer: new THREE.Vector2(),
    pendingSelection: null,
    modelRoot: null,
    fitGroup: null,
    selectedHighlight: null,
    environmentMap: null,
    environmentBackground: null,
    animationStarted: false,
  };

  applyLightPresetToPreview();
  await applyEnvironmentToPreview();
  startPreviewLoop();
  return state.preview;
}

function startPreviewLoop() {
  if (state.preview.animationStarted) return;
  state.preview.animationStarted = true;

  function animate() {
    requestAnimationFrame(animate);
    const { renderer, axisRenderer, axisRoot, camera, axisCamera, axisScene, controls } = state.preview;
    const rect = elements.previewCanvas.getBoundingClientRect();
    const width = Math.max(320, Math.floor(rect.width));
    const height = Math.max(320, Math.floor(rect.height));

    if (elements.previewCanvas.width !== Math.floor(width * Math.min(window.devicePixelRatio, 2))) {
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    controls.update();
    if (state.preview.selectedHighlight) {
      const helpers = Array.isArray(state.preview.selectedHighlight)
        ? state.preview.selectedHighlight
        : [state.preview.selectedHighlight];
      helpers.forEach((helper) => helper.update());
    }
    const axisRect = elements.axisCanvas.getBoundingClientRect();
    axisRenderer.setSize(Math.max(1, Math.floor(axisRect.width)), Math.max(1, Math.floor(axisRect.height)), false);
    if (axisRoot) {
      const axisSource = state.preview.fitGroup || state.preview.root;
      axisSource.getWorldQuaternion(axisRoot.quaternion);
    }
    axisCamera.position.copy(camera.position).sub(controls.target).setLength(5.6);
    axisCamera.lookAt(axisScene.position);
    axisRenderer.render(axisScene, axisCamera);
    renderer.render(state.preview.scene, camera);
  }

  animate();
}

function applyLightPresetToPreview() {
  if (!state.preview) return;
  const { THREE, lightRoot } = state.preview;
  const preset = Object.prototype.hasOwnProperty.call(LIGHT_PRESETS, elements.lightPreset.value)
    ? LIGHT_PRESETS[elements.lightPreset.value]
    : LIGHT_PRESETS.studioSoft;
  lightRoot.clear();
  if (!preset) return;
  const intensity = Number(elements.lightIntensity.value) || 0;
  if (preset.ambient) {
    lightRoot.add(new THREE.AmbientLight(preset.ambient[0], preset.ambient[1] * intensity));
    return;
  }

  const hemi = new THREE.HemisphereLight(preset.hemi[0], preset.hemi[1], preset.hemi[2] * intensity);
  const key = new THREE.DirectionalLight(preset.key[0], preset.key[1] * intensity);
  key.position.set(...preset.key[2]);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  const rim = new THREE.DirectionalLight(preset.rim[0], preset.rim[1] * intensity);
  rim.position.set(...preset.rim[2]);
  const warm = new THREE.PointLight(preset.warm[0], preset.warm[1] * intensity, 8, 2);
  warm.position.set(...preset.warm[2]);
  lightRoot.add(hemi, key, rim, warm);
}

async function getEnvironmentBytes() {
  const source = elements.hdriSource?.value || state.hdriSource || "default";
  if (source === "none") return null;
  const preset = HDRI_PRESETS[source] || HDRI_PRESETS.default;
  const embeddedValue = preset.b64Key ? window.BUILTIN_HDRI_B64?.[preset.b64Key] : null;
  if (embeddedValue) return base64ToBytes(embeddedValue);
  const url = new URL(preset.path, window.location.href);
  try {
    const response = await fetch(url.href, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status} ${response.statusText}`);
    return new Uint8Array(await response.arrayBuffer());
  } catch (error) {
    console.warn(error);
    throw new Error(`${preset.label} 加载失败：${error.message || error} (${url.href})`);
  }
}

function applyEnvironmentToMaterial(material, scene) {
  const materials = Array.isArray(material) ? material : [material].filter(Boolean);
  const hdriIntensity = Number(elements.hdriIntensity?.value || 0);
  materials.forEach((item) => {
    if (item.isMeshStandardMaterial || item.isMeshPhysicalMaterial) {
      item.envMap = scene.environment || null;
      item.envMapIntensity = scene.environment ? hdriIntensity : 0;
    }
    item.needsUpdate = true;
  });
}

function refreshEnvironmentMaterials(scene) {
  scene.traverse((node) => {
    applyEnvironmentToMaterial(node.material, scene);
  });
}

function normalizeMaterialForEnvironment(material, THREE) {
  if (Array.isArray(material)) return material.map((item) => normalizeMaterialForEnvironment(item, THREE));
  if (material?.isMeshStandardMaterial || material?.isMeshPhysicalMaterial) {
    material.envMapIntensity = Number(elements.hdriIntensity?.value || 2.2);
    return material;
  }
  const fallback = MATERIAL_PRESETS.mattePlastic;
  const opacity = material?.opacity ?? 1;
  const converted = new THREE.MeshPhysicalMaterial({
    color: material?.color?.clone?.() || new THREE.Color(fallback.color),
    map: material?.map || null,
    normalMap: material?.normalMap || null,
    roughnessMap: material?.roughnessMap || null,
    metalnessMap: material?.metalnessMap || null,
    alphaMap: material?.alphaMap || null,
    metalness: 0.04,
    envMapIntensity: 2.2,
    roughness: material?.shininess ? Math.max(0.08, 1 - Math.min(material.shininess, 100) / 100) : fallback.roughness,
    clearcoat: 0.12,
    clearcoatRoughness: 0.35,
    opacity,
    transparent: Boolean(material?.transparent || opacity < 1),
    side: material?.side ?? THREE.FrontSide,
  });
  converted.name = material?.name || "";
  converted.depthWrite = !(converted.transparent && converted.opacity < 1);
  return converted;
}

function createHdrTexture(bytes, THREE, RGBELoader) {
  const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
  const textureData = new RGBELoader().parse(buffer);
  const texture = new THREE.DataTexture(textureData.data, textureData.width, textureData.height, THREE.RGBAFormat, textureData.type);
  texture.colorSpace = THREE.LinearSRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.flipY = true;
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.needsUpdate = true;
  return texture;
}

async function applyEnvironmentToPreview() {
  if (!state.preview) return;
  const { THREE, renderer, scene, RGBELoader, RoomEnvironment } = state.preview;
  const source = elements.hdriSource?.value || state.hdriSource || "default";
  const pmrem = new THREE.PMREMGenerator(renderer);

  if (state.preview.environmentMap) {
    state.preview.environmentMap.dispose();
    state.preview.environmentMap = null;
  }
  if (state.preview.environmentBackground) {
    state.preview.environmentBackground.dispose();
    state.preview.environmentBackground = null;
  }

  if (source === "none") {
    scene.environment = null;
    scene.background = null;
    scene.environmentIntensity = 0;
    pmrem.dispose();
    refreshEnvironmentMaterials(scene);
    return;
  }

  let environmentError = null;
  try {
    const bytes = await getEnvironmentBytes();
    if (!bytes) throw new Error("无可用 HDRI，使用内置环境。");
    const texture = createHdrTexture(bytes, THREE, RGBELoader);
    const environmentMap = pmrem.fromEquirectangular(texture).texture;
    scene.environment = environmentMap;
    if (elements.hdriBackgroundEnabled.checked) {
      scene.background = texture;
      scene.backgroundBlurriness = Number(elements.hdriBackgroundBlur.value) || 0;
      scene.backgroundIntensity = 0.42;
      state.preview.environmentBackground = texture;
    } else {
      scene.background = null;
      texture.dispose();
    }
    scene.environmentIntensity = Number(elements.hdriIntensity.value) || 0;
    state.preview.environmentMap = environmentMap;
  } catch (error) {
    console.warn(error);
    environmentError = error;
    const environmentMap = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;
    scene.environment = environmentMap;
    scene.background = null;
    scene.environmentIntensity = 1.0;
    state.preview.environmentMap = environmentMap;
  } finally {
    pmrem.dispose();
  }
  refreshEnvironmentMaterials(scene);
  if (environmentError && source !== "default") {
    throw new Error(`HDRI 预设无法解析或加载失败：${environmentError.message || environmentError}`);
  }
}

function getDefaultPartOverride() {
  return {
    visible: true,
    offsets: {
      start: { x: 0, y: 0, z: 0, normal: 0 },
      end: { x: 0, y: 0, z: 0, normal: 0 },
    },
    materialMode: "original",
    preset: "mattePlastic",
    presetTuning: false,
    material: { color: "#6f7f8f", metalness: 0.38, roughness: 0.48, opacity: 1, transparent: false, clearcoat: 0.32, clearcoatRoughness: 0.3 },
  };
}

function normalizePartOverride(override = getDefaultPartOverride()) {
  const fallback = getDefaultPartOverride();
  const legacyOffset = override.offset || fallback.offsets.end;
  return {
    ...fallback,
    ...override,
    offsets: {
      start: { ...fallback.offsets.start, ...(override.offsets?.start || { x: 0, y: 0, z: 0 }) },
      end: { ...fallback.offsets.end, ...(override.offsets?.end || legacyOffset) },
    },
    material: { ...fallback.material, ...override.material },
  };
}

function getActiveOffset(override) {
  const normalized = normalizePartOverride(override);
  const target = elements.offsetTarget.value || state.offsetTarget || "end";
  return normalized.offsets[target] || normalized.offsets.end;
}

function prepareGeometryForDisplay(mesh, preview, smoothEnabled) {
  if (!mesh.geometry) return;
  const hadSourceNormals = Boolean(mesh.geometry.attributes.normal);
  if (smoothEnabled && !hadSourceNormals) {
    mesh.geometry.deleteAttribute("normal");
    mesh.geometry = preview.mergeVertices(mesh.geometry, 0.001);
  }
  if (!hadSourceNormals) mesh.geometry.computeVertexNormals();
  mesh.geometry.computeBoundingBox();
}

async function loadPreviewModel(file) {
  setStatus("正在加载预览...");
  const preview = await loadThreeModules();
  const { THREE, GLTFLoader, OBJLoader } = preview;
  const format = getModelFormat(file.name);
  const buffer = await file.arrayBuffer();
  let object;

  if (format === "obj") {
    object = new OBJLoader().parse(new TextDecoder().decode(buffer));
  } else {
    const gltf = await new Promise((resolve, reject) => new GLTFLoader().parse(buffer, "", resolve, reject));
    object = gltf.scene;
  }

  preview.root.clear();
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const maxAxis = Math.max(size.x, size.y, size.z) || 1;
  object.position.sub(center);

  const fitGroup = new THREE.Group();
  fitGroup.scale.setScalar((Number(elements.modelSize.value) || 3.25) / maxAxis);
  fitGroup.rotation.x = -Math.PI / 2;
  fitGroup.add(object);
  preview.root.add(fitGroup);

  const normalizedBox = new THREE.Box3().setFromObject(preview.root);
  const normalizedSize = normalizedBox.getSize(new THREE.Vector3());
  preview.root.position.y = -normalizedBox.min.y - normalizedSize.y * 0.48;
  preview.modelRoot = object;
  preview.fitGroup = fitGroup;

  state.parts = [];
  state.selectedPartId = null;
  state.selectedPartIds = [];
  state.selectionAnchorId = null;
  state.autoArrangeActive = false;
  state.autoArrangeSnapshot = null;
  state.partOverrides = {};

  let index = 0;
  object.traverse((child) => {
    if (!child.isMesh) return;
    prepareGeometryForDisplay(child, preview, elements.smoothShading.checked);
    child.material = normalizeMaterialForEnvironment(child.material, THREE);
    const id = `part-${index}`;
    const label = child.name?.trim() || `部件 ${index + 1}`;
    const originalMaterial = Array.isArray(child.material)
      ? child.material.map((item) => item.clone())
      : child.material?.clone();
    child.userData.partId = id;
    child.castShadow = true;
    child.receiveShadow = true;
    const partBox = new THREE.Box3().setFromObject(child);
    const partCenter = partBox.getCenter(new THREE.Vector3());
    const normalDirection = partCenter.lengthSq() > 0.0001 ? partCenter.normalize() : new THREE.Vector3(0, 1, 0);
    state.partOverrides[id] = getDefaultPartOverride();
    state.parts.push({
      id,
      label,
      mesh: child,
      basePosition: child.position.clone(),
      normalDirection,
      originalMaterial,
    });
    index += 1;
  });

  elements.editorPanel.classList.remove("is-hidden");
  elements.dropzone.classList.add("is-hidden");
  renderPartList();
  elements.selectedPartName.value = "未选择";
  updateSelectedHelper();
  refreshEnvironmentMaterials(preview.scene);
  setStatus(`预览已加载：${state.parts.length || 1} 个部件。`);
}

function renderPartList() {
  elements.partList.innerHTML = `<div class="part-list-title">模型部件列表</div>`;
  if (state.parts.length === 0) {
    const empty = document.createElement("div");
    empty.className = "part-list-empty";
    empty.innerHTML = "<strong>模型部件列表</strong><small>未识别到可编辑部件</small>";
    elements.partList.append(empty);
    return;
  }

  state.parts.forEach((part) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = part.label;
    button.className = state.selectedPartIds.includes(part.id) ? "is-active" : "";
    button.dataset.partId = part.id;
    elements.partList.append(button);
  });
}

function getSelectedPart() {
  return state.parts.find((part) => part.id === state.selectedPartId);
}

function getSelectedParts() {
  const ids = state.selectedPartIds.length > 0
    ? state.selectedPartIds
    : (state.selectedPartId ? [state.selectedPartId] : []);
  return ids
    .map((id) => state.parts.find((part) => part.id === id))
    .filter(Boolean);
}

function clearPartSelection() {
  const listScrollTop = elements.partList.scrollTop;
  const editorScrollTop = elements.partEditor.scrollTop;
  state.selectedPartId = null;
  state.selectedPartIds = [];
  state.selectionAnchorId = null;
  elements.selectedPartName.value = "未选择";
  renderPartList();
  elements.partList.scrollTop = listScrollTop;
  elements.partEditor.scrollTop = editorScrollTop;
  updateSelectedHelper();
}

function updateSelectedHelper() {
  if (!state.preview) return;
  const { THREE, scene } = state.preview;
  if (state.preview.selectedHighlight) {
    const helpers = Array.isArray(state.preview.selectedHighlight)
      ? state.preview.selectedHighlight
      : [state.preview.selectedHighlight];
    helpers.forEach((helper) => {
      scene.remove(helper);
      helper.geometry.dispose();
      helper.material.dispose();
    });
    state.preview.selectedHighlight = null;
  }
  const helpers = getSelectedParts()
    .filter((part) => part.mesh.visible)
    .map((part) => {
      const helper = new THREE.BoxHelper(part.mesh, 0x1f8f8b);
      helper.material.depthTest = false;
      helper.renderOrder = 100;
      scene.add(helper);
      return helper;
    });
  state.preview.selectedHighlight = helpers.length > 0 ? helpers : null;
}

function handlePreviewPointerDown(event) {
  if (!state.preview?.modelRoot || state.parts.length === 0) return;
  if (event.button === 2) {
    clearPartSelection();
    return;
  }
  if (event.button !== 0) return;
  state.preview.pendingSelection = {
    x: event.clientX,
    y: event.clientY,
    time: event.timeStamp,
    shiftKey: event.shiftKey,
  };
}

function handlePreviewPointerUp(event) {
  const pending = state.preview?.pendingSelection;
  if (!pending) return;
  state.preview.pendingSelection = null;
  if (event.button !== 0) return;
  const distance = Math.hypot(event.clientX - pending.x, event.clientY - pending.y);
  const duration = event.timeStamp - pending.time;
  if (distance > 5 || duration > 450) return;
  selectPartFromPointer(event, pending.shiftKey || event.shiftKey);
}

function selectPartFromPointer(event, rangeSelect = false) {
  if (!state.preview?.modelRoot || state.parts.length === 0) return;
  const { camera, raycaster, pointer } = state.preview;
  const rect = elements.previewCanvas.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const meshes = state.parts.map((part) => part.mesh).filter((mesh) => mesh.visible);
  const hit = raycaster.intersectObjects(meshes, true)[0];
  if (!hit) return;
  let node = hit.object;
  while (node && !node.userData.partId) node = node.parent;
  if (node?.userData.partId) selectPart(node.userData.partId, { range: rangeSelect });
}

function selectPart(partId, options = {}) {
  const listScrollTop = elements.partList.scrollTop;
  const editorScrollTop = elements.partEditor.scrollTop;
  const partExists = state.parts.some((part) => part.id === partId);
  if (!partExists) return;
  if (options.range) {
    const anchorId = state.selectionAnchorId || state.selectedPartId || partId;
    let anchorIndex = state.parts.findIndex((part) => part.id === anchorId);
    const targetIndex = state.parts.findIndex((part) => part.id === partId);
    if (anchorIndex < 0) anchorIndex = targetIndex;
    const startIndex = Math.min(anchorIndex, targetIndex);
    const endIndex = Math.max(anchorIndex, targetIndex);
    state.selectedPartIds = state.parts.slice(startIndex, endIndex + 1).map((part) => part.id);
    state.selectedPartId = partId;
  } else {
    state.selectedPartId = partId;
    state.selectedPartIds = [partId];
    state.selectionAnchorId = partId;
  }
  const part = getSelectedPart();
  if (!part) return;
  const override = normalizePartOverride(state.partOverrides[part.id]);
  const activeOffset = getActiveOffset(override);
  elements.selectedPartName.value = state.selectedPartIds.length > 1
    ? `${part.label} 等 ${state.selectedPartIds.length} 个`
    : part.label;
  elements.materialMode.value = override.materialMode;
  elements.materialPreset.value = override.preset;
  elements.presetTuneEnabled.checked = override.presetTuning === true;
  elements.partColor.value = override.material.color;
  elements.partVisible.checked = override.visible;
  elements.metalness.value = override.material.metalness;
  elements.roughness.value = override.material.roughness;
  elements.opacity.value = override.material.opacity ?? 1;
  elements.offsetX.value = activeOffset.x;
  elements.offsetY.value = activeOffset.y;
  elements.offsetZ.value = activeOffset.z;
  elements.offsetNormal.value = activeOffset.normal || 0;
  syncPartLabels();
  syncMaterialUi();
  renderPartList();
  elements.partList.scrollTop = listScrollTop;
  elements.partEditor.scrollTop = editorScrollTop;
  applyPartOverride(part);
  updateSelectedHelper();
}

function syncPartLabels() {
  elements.metalnessValue.textContent = Number(elements.metalness.value).toFixed(2);
  elements.roughnessValue.textContent = Number(elements.roughness.value).toFixed(2);
  elements.opacityValue.textContent = Number(elements.opacity.value).toFixed(2);
  elements.offsetXValue.textContent = Number(elements.offsetX.value).toFixed(2);
  elements.offsetYValue.textContent = Number(elements.offsetY.value).toFixed(2);
  elements.offsetZValue.textContent = Number(elements.offsetZ.value).toFixed(2);
  elements.offsetNormalValue.textContent = Number(elements.offsetNormal.value).toFixed(2);
  elements.autoExplodeStrengthValue.textContent = Number(elements.autoExplodeStrength.value).toFixed(2);
}

function syncAutoExplodeTools() {
  elements.autoExplodeTools.classList.toggle("is-hidden", elements.offsetTarget.value !== "end");
}

function syncHdriBackgroundUi() {
  elements.hdriBackgroundBlurValue.textContent = Number(elements.hdriBackgroundBlur.value).toFixed(2);
  elements.hdriIntensityValue.textContent = Number(elements.hdriIntensity.value).toFixed(2);
  elements.lightIntensityValue.textContent = Number(elements.lightIntensity.value).toFixed(2);
  elements.hdriBackgroundBlur.disabled = !elements.hdriBackgroundEnabled.checked || elements.hdriSource.value === "none";
}

function renderPresetGrid() {
  elements.presetGrid.innerHTML = "";
  Object.entries(MATERIAL_PRESETS).forEach(([id, preset]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `preset-card${elements.materialPreset.value === id ? " is-active" : ""}`;
    button.dataset.presetId = id;
    button.innerHTML = `
      <span class="preset-swatch" style="--swatch-color:${preset.color}; --swatch-metal:${preset.metalness}; --swatch-rough:${preset.roughness};"></span>
      <span class="preset-copy">
        <strong>${MATERIAL_PRESET_LABELS[id]}</strong>
        <small>金属 ${preset.metalness.toFixed(2)} · 粗糙 ${preset.roughness.toFixed(2)}</small>
      </span>
    `;
    elements.presetGrid.append(button);
  });
}

function applyPresetDefaultsToControls(presetId) {
  const preset = MATERIAL_PRESETS[presetId] || MATERIAL_PRESETS.mattePlastic;
  elements.partColor.value = preset.color;
  elements.metalness.value = preset.metalness;
  elements.roughness.value = preset.roughness;
  elements.opacity.value = preset.opacity ?? 1;
  syncPartLabels();
}

function syncMaterialUi() {
  const mode = elements.materialMode.value;
  const isPreset = mode === "preset";
  const showMaterialControls = mode === "custom" || (isPreset && elements.presetTuneEnabled.checked);
  elements.presetGrid.classList.toggle("is-hidden", !isPreset);
  elements.presetTuneRow.classList.toggle("is-hidden", !isPreset);
  elements.materialControls.classList.toggle("is-hidden", !showMaterialControls);
  if (mode === "original") {
    elements.materialNote.textContent = "使用模型文件自带材质。";
  } else if (mode === "custom") {
    elements.materialNote.textContent = "自定义颜色、金属度和粗糙度。";
  } else {
    elements.materialNote.textContent = "选择预设作为当前部件材质，需要时再打开微调。";
  }
  renderPresetGrid();
}

function updateSelectedPartFromControls() {
  const selectedParts = getSelectedParts();
  if (selectedParts.length === 0) return;
  const mode = elements.materialMode.value;
  const preset = MATERIAL_PRESETS[elements.materialPreset.value] || MATERIAL_PRESETS.mattePlastic;
  const usePresetDefaults = mode === "preset" && !elements.presetTuneEnabled.checked;
  const target = elements.offsetTarget.value || "end";
  selectedParts.forEach((part) => {
    const currentOverride = normalizePartOverride(state.partOverrides[part.id]);
    const offsets = {
      start: { ...currentOverride.offsets.start },
      end: { ...currentOverride.offsets.end },
    };
    offsets[target] = {
      x: Number(elements.offsetX.value),
      y: Number(elements.offsetY.value),
      z: Number(elements.offsetZ.value),
      normal: Number(elements.offsetNormal.value),
    };
    state.partOverrides[part.id] = {
      visible: elements.partVisible.checked,
      offsets,
      materialMode: mode,
      preset: elements.materialPreset.value,
      presetTuning: mode === "preset" && elements.presetTuneEnabled.checked,
      material: mode === "preset"
        ? {
          ...preset,
          color: usePresetDefaults ? preset.color : elements.partColor.value,
          metalness: usePresetDefaults ? preset.metalness : Number(elements.metalness.value),
          roughness: usePresetDefaults ? preset.roughness : Number(elements.roughness.value),
          opacity: usePresetDefaults ? (preset.opacity ?? 1) : Number(elements.opacity.value),
          transparent: usePresetDefaults ? Boolean(preset.transparent) : Number(elements.opacity.value) < 1,
        }
        : {
          color: elements.partColor.value,
          metalness: Number(elements.metalness.value),
          roughness: Number(elements.roughness.value),
          opacity: Number(elements.opacity.value),
          transparent: Number(elements.opacity.value) < 1,
          clearcoat: 0.32,
          clearcoatRoughness: 0.3,
        },
    };
    applyPartOverride(part);
  });
  syncPartLabels();
  syncMaterialUi();
  updateSelectedHelper();
}

function applyPartOverride(part) {
  const override = normalizePartOverride(state.partOverrides[part.id]);
  const { THREE } = state.preview;
  const activeOffset = getActiveOffset(override);
  if (state.preview.selectedHighlight?.mesh === part.mesh) {
    const materials = Array.isArray(part.mesh.material) ? part.mesh.material : [part.mesh.material];
    materials.forEach((item) => item.dispose?.());
    state.preview.selectedHighlight = null;
  }
  part.mesh.visible = override.visible;
  part.mesh.position.set(
    part.basePosition.x + activeOffset.x + part.normalDirection.x * Number(activeOffset.normal || 0),
    part.basePosition.y + activeOffset.y + part.normalDirection.y * Number(activeOffset.normal || 0),
    part.basePosition.z + activeOffset.z + part.normalDirection.z * Number(activeOffset.normal || 0),
  );

  if (override.materialMode === "original") {
    part.mesh.material = Array.isArray(part.originalMaterial)
      ? part.originalMaterial.map((item) => item.clone())
      : part.originalMaterial?.clone() || new THREE.MeshPhysicalMaterial(override.material);
    applyEnvironmentToMaterial(part.mesh.material, state.preview.scene);
    return;
  }

  part.mesh.material = new THREE.MeshPhysicalMaterial(override.material);
  part.mesh.material.envMapIntensity = Number(elements.hdriIntensity?.value || 2.2);
  part.mesh.material.depthWrite = !(part.mesh.material.transparent && part.mesh.material.opacity < 1);
  applyEnvironmentToMaterial(part.mesh.material, state.preview.scene);
}

function applyAllPartOverrides() {
  state.parts.forEach((part) => applyPartOverride(part));
  updateSelectedHelper();
}

function clampExplodeOffset(value) {
  return Math.max(-20, Math.min(20, Number(value) || 0));
}

function syncActiveOffsetControls() {
  const activePart = getSelectedPart();
  if (!activePart) return;
  const activeOffset = getActiveOffset(state.partOverrides[activePart.id]);
  elements.offsetX.value = activeOffset.x;
  elements.offsetY.value = activeOffset.y;
  elements.offsetZ.value = activeOffset.z;
  elements.offsetNormal.value = activeOffset.normal || 0;
  syncPartLabels();
}

function syncAutoArrangeMode() {
  const lockManualOffsets = state.autoArrangeActive && elements.offsetTarget.value === "end";
  [elements.offsetX, elements.offsetY, elements.offsetZ, elements.offsetNormal].forEach((control) => {
    control.disabled = lockManualOffsets;
  });
  elements.partEditor.querySelectorAll("[data-reset-axis]").forEach((button) => {
    button.disabled = lockManualOffsets;
  });
  elements.autoExplodeTools.classList.toggle("is-active", state.autoArrangeActive);
  elements.autoExplodeDetail.classList.toggle("is-hidden", !state.autoArrangeActive);
  elements.applyAutoExplode.classList.toggle("is-hidden", !state.autoArrangeActive);
  elements.cancelAutoExplode.classList.toggle("is-hidden", !state.autoArrangeActive);
  elements.autoArrangeExplode.textContent = state.autoArrangeActive ? "重新自动展开" : "自动展开位置";
}

function snapshotAutoArrangeOffsets() {
  const snapshot = {};
  state.parts.forEach((part) => {
    const override = normalizePartOverride(state.partOverrides[part.id]);
    snapshot[part.id] = {
      start: { ...override.offsets.start },
      end: { ...override.offsets.end },
    };
  });
  return snapshot;
}

function autoArrangeExplodePositions() {
  if (!state.preview?.modelRoot || state.parts.length === 0) {
    setStatus("请先导入模型。");
    return;
  }
  if (!state.autoArrangeActive) state.autoArrangeSnapshot = snapshotAutoArrangeOffsets();
  state.autoArrangeActive = true;
  const { THREE } = state.preview;
  const modelCenterWorld = new THREE.Box3().setFromObject(state.preview.modelRoot).getCenter(new THREE.Vector3());
  const entries = state.parts.map((part, index) => {
    const parent = part.mesh.parent || state.preview.modelRoot;
    const partCenterWorld = new THREE.Box3().setFromObject(part.mesh).getCenter(new THREE.Vector3());
    const modelCenterLocal = parent.worldToLocal(modelCenterWorld.clone());
    const partCenterLocal = parent.worldToLocal(partCenterWorld.clone());
    const direction = partCenterLocal.sub(modelCenterLocal);
    const distance = direction.length();
    if (distance > 0.0001) {
      direction.normalize();
    } else {
      const angle = (index / Math.max(1, state.parts.length)) * Math.PI * 2;
      direction.set(Math.cos(angle), 0, Math.sin(angle));
    }
    return { part, direction, distance };
  });
  const maxDistance = Math.max(...entries.map((entry) => entry.distance), 1);
  const strength = Math.max(0, Math.min(1, Number(elements.autoExplodeStrength.value) || 0));
  const spread = clampExplodeOffset(maxDistance * 0.55);

  entries.forEach(({ part, direction }) => {
    const override = normalizePartOverride(state.partOverrides[part.id]);
    const savedEnd = state.autoArrangeSnapshot?.[part.id]?.end || override.offsets.end;
    const autoEnd = {
      x: clampExplodeOffset(direction.x * spread),
      y: clampExplodeOffset(direction.y * spread),
      z: clampExplodeOffset(direction.z * spread),
      normal: 0,
    };
    state.partOverrides[part.id] = {
      ...override,
      offsets: {
        start: { ...override.offsets.start },
        end: {
          x: clampExplodeOffset(savedEnd.x + (autoEnd.x - savedEnd.x) * strength),
          y: clampExplodeOffset(savedEnd.y + (autoEnd.y - savedEnd.y) * strength),
          z: clampExplodeOffset(savedEnd.z + (autoEnd.z - savedEnd.z) * strength),
          normal: clampExplodeOffset((savedEnd.normal || 0) * (1 - strength)),
        },
      },
    };
  });

  state.offsetTarget = "end";
  elements.offsetTarget.value = "end";
  syncAutoExplodeTools();
  applyAllPartOverrides();
  syncActiveOffsetControls();
  syncAutoArrangeMode();
  setStatus(`已自动生成 ${state.parts.length} 个部件的最终展开位置。`);
}

function cancelAutoArrangeExplode() {
  if (!state.autoArrangeSnapshot) return;
  state.parts.forEach((part) => {
    const override = normalizePartOverride(state.partOverrides[part.id]);
    const savedOffsets = state.autoArrangeSnapshot[part.id];
    if (!savedOffsets) return;
    state.partOverrides[part.id] = {
      ...override,
      offsets: {
        start: { ...savedOffsets.start },
        end: { ...savedOffsets.end },
      },
    };
  });
  state.autoArrangeActive = false;
  state.autoArrangeSnapshot = null;
  applyAllPartOverrides();
  syncActiveOffsetControls();
  syncAutoArrangeMode();
  setStatus("已取消自动展开，恢复到自动展开前的位置。");
}

function applyAutoArrangeAsManual() {
  if (!state.autoArrangeActive) return;
  state.autoArrangeActive = false;
  state.autoArrangeSnapshot = null;
  syncAutoArrangeMode();
  syncActiveOffsetControls();
  setStatus("已应用为手动位置，可以继续用 X/Y/Z/沿法线微调。");
}

function resetSelectedPart() {
  const part = getSelectedPart();
  if (!part) return;
  state.partOverrides[part.id] = getDefaultPartOverride();
  selectPart(part.id);
}

function getSerializedPartOverrides() {
  const result = {};
  for (const part of state.parts) {
    const override = state.partOverrides[part.id];
    if (!override) continue;
    result[part.id] = {
      label: part.label,
      visible: override.visible,
      offsets: normalizePartOverride(override).offsets,
      materialMode: override.materialMode,
      preset: override.preset,
      presetTuning: override.presetTuning,
      material: override.material,
    };
  }
  return result;
}

function handleFile(file) {
  if (!file) return;
  getModelFormat(file.name);
  state.file = file;
  elements.fileTitle.textContent = file.name;
  elements.fileMeta.textContent = `${formatFileSize(file.size)} · ${getModelFormat(file.name).toUpperCase()}`;
  if (elements.productName.value === "Product 3D") {
    elements.productName.value = file.name.replace(/\.[^.]+$/, "");
  }
  setStatus("模型已载入，可以生成。");
  loadPreviewModel(file).catch((error) => {
    console.error(error);
    setStatus(`预览加载失败：${error.message}`);
  });
}

function collectConfig() {
  const productName = elements.productName.value.trim() || "Product 3D";
  const summary = elements.productSummary.value.trim() || "加密模型展示网页。";
  return {
    productName,
    summary,
    modelSize: Number(elements.modelSize.value) || 3.25,
    autoRotate: elements.autoRotate.checked,
    smoothShading: elements.smoothShading.checked,
    lightPreset: elements.lightPreset.value,
    lightIntensity: Number(elements.lightIntensity.value) || 0,
    explodeEnabled: elements.explodeEnabled.checked,
    explodeInitial: elements.explodeInitial.value,
    environmentEnabled: elements.hdriSource.value !== "none",
    environmentPath: elements.hdriSource.value === "none" ? "" : "./assets/environment.hdr",
    environmentBackground: elements.hdriBackgroundEnabled.checked,
    environmentBackgroundBlur: Number(elements.hdriBackgroundBlur.value) || 0,
    environmentIntensity: Number(elements.hdriIntensity.value) || 0,
    partOverrides: getSerializedPartOverrides(),
    materialPresets: MATERIAL_PRESETS,
    lightPresets: LIGHT_PRESETS,
    baseColor: MATERIAL_PRESETS.mattePlastic.color,
  };
}

async function buildPackage() {
  if (!state.file) {
    setStatus("请先选择模型文件。");
    return;
  }

  elements.buildButton.disabled = true;
  setStatus("正在读取模型...");

  try {
    const modelBytes = new Uint8Array(await state.file.arrayBuffer());
    const contentKey = randomBytes(32);
    const encryptedModel = await encryptBytes(modelBytes, contentKey);
    const environmentBytes = await getEnvironmentBytes();
    const modelFormat = getModelFormat(state.file.name);
    const viewerConfig = collectConfig();
    if (!environmentBytes) viewerConfig.environmentPath = "";

    setStatus("正在生成加密配置...");

    const security = {
      mode: "open",
      modelFormat,
      packagePath: "./assets/product.pkg",
      modelIv: encryptedModel.iv,
      embeddedKey: bytesToBase64(contentKey),
    };

    const zip = new JSZip();
    zip.file("index.html", makeViewerHtml(viewerConfig.productName));
    zip.file("open-directly.html", makeStandaloneHtml(viewerConfig, security, encryptedModel.cipher, environmentBytes, modelBytes));
    zip.file("styles.css", makeViewerCss());
    zip.file("viewer.js", makeViewerJs());
    zip.file("config.js", `window.VIEWER_CONFIG = ${JSON.stringify(viewerConfig, null, 2)};\nwindow.VIEWER_SECURITY = ${JSON.stringify(security, null, 2)};\n`);
    zip.file("README.txt", makeReadme());
    zip.folder("assets").file("product.pkg", encryptedModel.cipher);
    if (environmentBytes) zip.folder("assets").file("environment.hdr", environmentBytes);

    setStatus("正在压缩 zip...");
    const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } });
    const outputName = sanitizeName(elements.outputName.value || viewerConfig.productName);
    downloadBlob(blob, `${outputName}.zip`);
    setStatus(`已生成 ${outputName}.zip。`);
  } catch (error) {
    console.error(error);
    setStatus(error.message || "生成失败。");
  } finally {
    elements.buildButton.disabled = false;
  }
}

async function previewResult() {
  if (!state.file) {
    setStatus("请先选择模型文件。");
    return;
  }

  elements.previewResult.disabled = true;
  setStatus("正在生成结果预览...");
  const previewWindow = window.open("about:blank", "_blank");

  try {
    const modelBytes = new Uint8Array(await state.file.arrayBuffer());
    const contentKey = randomBytes(32);
    const encryptedModel = await encryptBytes(modelBytes, contentKey);
    const environmentBytes = await getEnvironmentBytes();
    const viewerConfig = collectConfig();
    if (!environmentBytes) viewerConfig.environmentPath = "";
    const security = {
      mode: "open",
      modelFormat: getModelFormat(state.file.name),
      packagePath: "./assets/product.pkg",
      modelIv: encryptedModel.iv,
      embeddedKey: bytesToBase64(contentKey),
    };
    const html = makeStandaloneHtml(viewerConfig, security, encryptedModel.cipher, environmentBytes, modelBytes);
    const url = URL.createObjectURL(new Blob([html], { type: "text/html" }));
    if (previewWindow) {
      previewWindow.location.href = url;
    } else {
      window.open(url, "_blank");
    }
    setStatus("结果预览已打开。");
  } catch (error) {
    console.error(error);
    setStatus(error.message || "预览失败。");
  } finally {
    elements.previewResult.disabled = false;
  }
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function makeViewerHtml(title) {
  return String.raw`<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)} | 3D Viewer</title>
    <link rel="icon" href="data:," />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Noto+Sans+SC:wght@400;500;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="./styles.css" />
    <script type="importmap">
      {
        "imports": {
          "three": "https://cdn.jsdelivr.net/npm/three@0.166.1/build/three.module.js",
          "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.166.1/examples/jsm/"
        }
      }
    </script>
  </head>
  <body>
    <main class="shell">
      <canvas id="product-canvas" aria-label="3D product preview"></canvas>
      <section class="brand-panel">
        <p class="kicker">Encrypted Product Viewer</p>
        <h1 id="product-title"></h1>
        <p class="summary" id="product-summary"></p>
      </section>
      <aside class="control-dock">
        <div class="control-group motion-controls">
          <span class="label">View</span>
          <button class="icon-button" type="button" id="explode-toggle" aria-label="Toggle explode view">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5"/><path d="M3 3l7 7M21 3l-7 7M3 21l7-7M21 21l-7-7"/></svg>
          </button>
          <button class="icon-button is-active" type="button" id="spin-toggle" aria-label="Toggle auto rotate">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12a8 8 0 0 1-13.7 5.7M4 12A8 8 0 0 1 17.7 6.3"/><path d="M20 5v7h-7M4 19v-7h7"/></svg>
          </button>
        </div>
      </aside>
      <div class="loading" id="loading-state"><span></span><small id="loading-message"></small></div>
    </main>
    <script src="./config.js"></script>
    <script type="module" src="./viewer.js"></script>
  </body>
</html>`;
}

function makeStandaloneHtml(viewerConfig, security, cipherBytes, environmentBytes, modelBytes) {
  return String.raw`<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(viewerConfig.productName)} | 3D Viewer</title>
    <link rel="icon" href="data:," />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Noto+Sans+SC:wght@400;500;700&display=swap" rel="stylesheet" />
    <style>${makeViewerCss()}</style>
    <script type="importmap">
      {
        "imports": {
          "three": "https://cdn.jsdelivr.net/npm/three@0.166.1/build/three.module.js",
          "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.166.1/examples/jsm/"
        }
      }
    </script>
  </head>
  <body>
    <main class="shell">
      <canvas id="product-canvas" aria-label="3D product preview"></canvas>
      <section class="brand-panel">
        <p class="kicker">Encrypted Product Viewer</p>
        <h1 id="product-title"></h1>
        <p class="summary" id="product-summary"></p>
      </section>
      <aside class="control-dock">
        <div class="control-group motion-controls">
          <span class="label">View</span>
          <button class="icon-button" type="button" id="explode-toggle" aria-label="Toggle explode view">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5"/><path d="M3 3l7 7M21 3l-7 7M3 21l7-7M21 21l-7-7"/></svg>
          </button>
          <button class="icon-button is-active" type="button" id="spin-toggle" aria-label="Toggle auto rotate">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12a8 8 0 0 1-13.7 5.7M4 12A8 8 0 0 1 17.7 6.3"/><path d="M20 5v7h-7M4 19v-7h7"/></svg>
          </button>
        </div>
      </aside>
      <div class="loading" id="loading-state"><span></span><small id="loading-message"></small></div>
    </main>
    <script>
      window.VIEWER_CONFIG = ${scriptSafeJson(viewerConfig)};
      window.VIEWER_SECURITY = ${scriptSafeJson(security)};
      window.VIEWER_PACKAGE_B64 = "${bytesToBase64(cipherBytes)}";
      window.VIEWER_MODEL_B64 = "${bytesToBase64(modelBytes)}";
      window.VIEWER_ENVIRONMENT_B64 = "${environmentBytes ? bytesToBase64(environmentBytes) : ""}";
    </script>
    <script type="module">${makeViewerJs()}</script>
  </body>
</html>`;
}

function makeStandaloneJs() {
  return String.raw`
(async function () {
  const config = window.VIEWER_CONFIG;
  const security = window.VIEWER_SECURITY;

  function base64ToBytes(value) {
    const binary = atob(value);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
    return bytes;
  }

  async function importAesKey(rawKey) {
    return crypto.subtle.importKey("raw", rawKey, "AES-GCM", false, ["decrypt"]);
  }

  async function decryptBytes(cipher, rawKey, iv) {
    const key = await importAesKey(rawKey);
    return crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, cipher);
  }

  document.querySelector("#product-title").textContent = config.productName;
  document.querySelector("#product-summary").textContent = config.summary;

  const canvas = document.querySelector("#product-canvas");
  const loading = document.querySelector("#loading-state");
  const loadingMessage = document.querySelector("#loading-message");
  const canDecrypt = Boolean(window.crypto && crypto.subtle);

  if (!canDecrypt && !window.VIEWER_MODEL_B64) {
    loading.classList.add("is-error");
    loadingMessage.textContent = "当前浏览器不支持本地解密，请换 Edge/Chrome。";
    window.__MODEL_STATUS = "error";
    return;
  }

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance", precision: "highp" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.04;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  function createHdrTexture(bytes) {
    const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
    const textureData = new THREE.RGBELoader().parse(buffer);
    const texture = new THREE.DataTexture(textureData.data, textureData.width, textureData.height, THREE.RGBAFormat, textureData.type);
    texture.colorSpace = THREE.LinearSRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    texture.flipY = true;
    texture.mapping = THREE.EquirectangularReflectionMapping;
    texture.needsUpdate = true;
    return texture;
  }

  async function applyEnvironment() {
    if (config.environmentEnabled === false) {
      scene.environment = null;
      scene.environmentIntensity = 0;
      return;
    }
    const pmrem = new THREE.PMREMGenerator(renderer);
    try {
      const bytes = window.VIEWER_ENVIRONMENT_B64
        ? base64ToBytes(window.VIEWER_ENVIRONMENT_B64)
        : (config.environmentPath ? new Uint8Array(await fetch(config.environmentPath).then((response) => response.arrayBuffer())) : null);
      if (!bytes) throw new Error("No HDRI environment.");
      const texture = createHdrTexture(bytes);
      const envMap = pmrem.fromEquirectangular(texture).texture;
      scene.environment = envMap;
      if (config.environmentBackground) {
        scene.background = texture;
        scene.backgroundBlurriness = Number(config.environmentBackgroundBlur || 0);
        scene.backgroundIntensity = 0.42;
      } else {
        scene.background = null;
        texture.dispose();
      }
      scene.environmentIntensity = Number(config.environmentIntensity ?? 2.2);
    } catch (error) {
      console.warn(error);
      scene.environment = pmrem.fromScene(new THREE.RoomEnvironment(), 0.04).texture;
      scene.environmentIntensity = 1.0;
    } finally {
      pmrem.dispose();
    }
  }
  await applyEnvironment();

  const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 500);
  camera.position.set(4.2, 2.4, 6.2);
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.enablePan = false;
  controls.minDistance = 0.5;
  controls.maxDistance = 80;
  controls.target.set(0, 0.3, 0);

  const productPivot = new THREE.Group();
  productPivot.rotation.set(0, 0, 0);
  scene.add(productPivot);
  const modelRoot = new THREE.Group();
  productPivot.add(modelRoot);
  const baseMaterial = new THREE.MeshPhysicalMaterial({ color: config.baseColor || "#6f7f8f", metalness: 0.38, roughness: 0.48, clearcoat: 0.32, clearcoatRoughness: 0.3 });
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let selectedHighlight = null;

  const fallbackLightPreset = {
    hemi: ["#ffffff", "#bcc8d0", 1.8],
    key: ["#ffffff", 3.8, [3.4, 5.6, 4.2]],
    rim: ["#8ee7df", 1.7, [-4.4, 2.6, -3.6]],
    warm: ["#ff8068", 20, [2.6, 1.2, 2.4]],
  };
  const activeLightPreset = config.lightPresets && Object.prototype.hasOwnProperty.call(config.lightPresets, config.lightPreset)
    ? config.lightPresets[config.lightPreset]
    : fallbackLightPreset;
  if (activeLightPreset) {
    const lightIntensity = Number(config.lightIntensity ?? 1);
    if (activeLightPreset.ambient) {
      scene.add(new THREE.AmbientLight(activeLightPreset.ambient[0], activeLightPreset.ambient[1] * lightIntensity));
    } else {
      scene.add(new THREE.HemisphereLight(activeLightPreset.hemi[0], activeLightPreset.hemi[1], activeLightPreset.hemi[2] * lightIntensity));
      const keyLight = new THREE.DirectionalLight(activeLightPreset.key[0], activeLightPreset.key[1] * lightIntensity);
      keyLight.position.set(...activeLightPreset.key[2]);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(2048, 2048);
      scene.add(keyLight);
      const rimLight = new THREE.DirectionalLight(activeLightPreset.rim[0], activeLightPreset.rim[1] * lightIntensity);
      rimLight.position.set(...activeLightPreset.rim[2]);
      scene.add(rimLight);
      const warmLight = new THREE.PointLight(activeLightPreset.warm[0], activeLightPreset.warm[1] * lightIntensity, 8, 2);
      warmLight.position.set(...activeLightPreset.warm[2]);
      scene.add(warmLight);
    }
  }

  let autoRotate = config.autoRotate;
  let modelLoaded = false;
  const explodableMeshes = [];
  let explodeProgress = config.explodeInitial === "expanded" ? 1 : 0;
  let explodeTarget = explodeProgress;
  window.__MODEL_STATUS = "loading";

  function getPartOffsets(override) {
    const zero = { x: 0, y: 0, z: 0, normal: 0 };
    return {
      start: override?.offsets?.start || zero,
      end: override?.offsets?.end || override?.offset || zero,
    };
  }

  function updateExplodePositions() {
    explodableMeshes.forEach((mesh) => {
      const { basePosition, offsetStart, offsetEnd, normalDirection } = mesh.userData;
      mesh.position.set(
        basePosition.x + offsetStart.x + (offsetEnd.x - offsetStart.x) * explodeProgress + normalDirection.x * (offsetStart.normal + (offsetEnd.normal - offsetStart.normal) * explodeProgress),
        basePosition.y + offsetStart.y + (offsetEnd.y - offsetStart.y) * explodeProgress + normalDirection.y * (offsetStart.normal + (offsetEnd.normal - offsetStart.normal) * explodeProgress),
        basePosition.z + offsetStart.z + (offsetEnd.z - offsetStart.z) * explodeProgress + normalDirection.z * (offsetStart.normal + (offsetEnd.normal - offsetStart.normal) * explodeProgress),
      );
    });
  }

  function setSelectedMesh(mesh) {
    if (selectedHighlight) {
      scene.remove(selectedHighlight);
      selectedHighlight.geometry.dispose();
      selectedHighlight.material.dispose();
      selectedHighlight = null;
    }
  }

  canvas.addEventListener("pointerdown", (event) => {
    if (!modelLoaded || explodableMeshes.length === 0) return;
    if (event.button === 2) {
      setSelectedMesh(null);
      return;
    }
    if (event.button !== 0) return;
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(explodableMeshes.filter((mesh) => mesh.visible), true)[0];
    if (hit) setSelectedMesh(hit.object);
  });
  canvas.addEventListener("contextmenu", (event) => event.preventDefault());

  function normalizeMaterialForEnvironment(material) {
    if (Array.isArray(material)) return material.map((item) => normalizeMaterialForEnvironment(item));
    if (material?.isMeshStandardMaterial || material?.isMeshPhysicalMaterial) {
      material.envMapIntensity = Number(config.environmentIntensity ?? 2.2);
      return material;
    }
    const fallback = (config.materialPresets && config.materialPresets.mattePlastic) || { color: "#6f7f8f", roughness: 0.72 };
    const opacity = material?.opacity ?? 1;
    const converted = new THREE.MeshPhysicalMaterial({
      color: material?.color?.clone?.() || new THREE.Color(fallback.color),
      map: material?.map || null,
      normalMap: material?.normalMap || null,
      roughnessMap: material?.roughnessMap || null,
      metalnessMap: material?.metalnessMap || null,
      alphaMap: material?.alphaMap || null,
      metalness: 0.04,
      envMapIntensity: 2.2,
      roughness: material?.shininess ? Math.max(0.08, 1 - Math.min(material.shininess, 100) / 100) : fallback.roughness,
      clearcoat: 0.12,
      clearcoatRoughness: 0.35,
      opacity,
      transparent: Boolean(material?.transparent || opacity < 1),
      side: material?.side ?? THREE.FrontSide,
    });
    converted.name = material?.name || "";
    converted.depthWrite = !(converted.transparent && converted.opacity < 1);
    return converted;
  }

  function prepareMesh(mesh) {
    mesh.material = normalizeMaterialForEnvironment(mesh.material || baseMaterial.clone());
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    if (mesh.geometry) {
      const hadSourceNormals = Boolean(mesh.geometry.attributes.normal);
      if (config.smoothShading && !hadSourceNormals) {
        mesh.geometry.deleteAttribute("normal");
        mesh.geometry = THREE.BufferGeometryUtils.mergeVertices(mesh.geometry, 0.001);
      }
      if (!hadSourceNormals) mesh.geometry.computeVertexNormals();
      mesh.geometry.computeBoundingBox();
    }
  }

  function applyPartConfig(mesh, partId) {
    const override = config.partOverrides && config.partOverrides[partId];
    const offsets = getPartOffsets(override);
    mesh.userData.basePosition = mesh.position.clone();
    mesh.userData.offsetStart = {
      x: Number(offsets.start.x || 0),
      y: Number(offsets.start.y || 0),
      z: Number(offsets.start.z || 0),
      normal: Number(offsets.start.normal || 0),
    };
    mesh.userData.offsetEnd = {
      x: Number(offsets.end.x || 0),
      y: Number(offsets.end.y || 0),
      z: Number(offsets.end.z || 0),
      normal: Number(offsets.end.normal || 0),
    };
    const center = new THREE.Box3().setFromObject(mesh).getCenter(new THREE.Vector3());
    mesh.userData.normalDirection = center.lengthSq() > 0.0001 ? center.normalize() : new THREE.Vector3(0, 1, 0);
    explodableMeshes.push(mesh);
    mesh.visible = !override || override.visible !== false;
    updateExplodePositions();
    if (!override) return;
    if (override.materialMode === "custom" || override.materialMode === "preset") {
      mesh.material = new THREE.MeshPhysicalMaterial(override.material);
      mesh.material.envMapIntensity = Number(config.environmentIntensity ?? 2.2);
      mesh.material.depthWrite = !(mesh.material.transparent && mesh.material.opacity < 1);
    }
  }

  function normalizeModel(object) {
    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxAxis = Math.max(size.x, size.y, size.z) || 1;
    object.position.sub(center);
    const fitGroup = new THREE.Group();
    fitGroup.scale.setScalar(config.modelSize / maxAxis);
    fitGroup.rotation.x = -Math.PI / 2;
    fitGroup.add(object);
    modelRoot.add(fitGroup);
    const normalizedBox = new THREE.Box3().setFromObject(modelRoot);
    const normalizedSize = normalizedBox.getSize(new THREE.Vector3());
    modelRoot.position.y = -normalizedBox.min.y - normalizedSize.y * 0.48;
  }

  async function loadModelBytes(modelBytes) {
    let object;
    if (security.modelFormat === "obj") {
      object = new THREE.OBJLoader().parse(new TextDecoder().decode(modelBytes));
    } else {
      const gltf = await new Promise((resolve, reject) => new THREE.GLTFLoader().parse(modelBytes, "", resolve, reject));
      object = gltf.scene;
    }
    let meshIndex = 0;
    object.traverse((child) => {
      if (!child.isMesh) return;
      const partId = "part-" + meshIndex;
      prepareMesh(child);
      applyPartConfig(child, partId);
      meshIndex += 1;
    });
    normalizeModel(object);
    loading.classList.add("is-hidden");
    modelLoaded = true;
    window.__MODEL_STATUS = "ready";
  }

  async function loadEncryptedModel(rawKey) {
    try {
      window.__MODEL_STATUS = "loading";
      const decrypted = await decryptBytes(base64ToBytes(window.VIEWER_PACKAGE_B64), rawKey, base64ToBytes(security.modelIv));
      await loadModelBytes(decrypted);
    } catch (error) {
      console.error(error);
      window.__MODEL_STATUS = "error";
      loading.classList.add("is-error");
      loadingMessage.textContent = error.message || "模型加载失败。";
    }
  }

  if (canDecrypt) {
    loadEncryptedModel(base64ToBytes(security.embeddedKey));
  } else {
    loadModelBytes(base64ToBytes(window.VIEWER_MODEL_B64)).catch((error) => {
      console.error(error);
      window.__MODEL_STATUS = "error";
      loading.classList.add("is-error");
      loadingMessage.textContent = error.message || "模型加载失败。";
    });
  }

  document.querySelector("#spin-toggle").classList.toggle("is-active", autoRotate);
  document.querySelector("#spin-toggle").addEventListener("click", (event) => {
    autoRotate = !autoRotate;
    event.currentTarget.classList.toggle("is-active", autoRotate);
  });

  const explodeToggle = document.querySelector("#explode-toggle");
  if (!config.explodeEnabled) {
    explodeToggle.style.display = "none";
  } else {
    explodeToggle.classList.toggle("is-active", explodeTarget === 1);
    explodeToggle.addEventListener("click", () => {
      explodeTarget = explodeTarget === 1 ? 0 : 1;
      explodeToggle.classList.toggle("is-active", explodeTarget === 1);
    });
  }

  function resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.aspect = width / height;
    camera.position.x = width < 740 ? 4.0 : 4.2;
    camera.position.y = width < 740 ? 2.15 : 2.4;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
  window.addEventListener("resize", resize);
  resize();

  function animate() {
    requestAnimationFrame(animate);
    if (autoRotate) productPivot.rotation.y += 0.0045;
    if (Math.abs(explodeProgress - explodeTarget) > 0.001) {
      explodeProgress += (explodeTarget - explodeProgress) * 0.12;
      if (Math.abs(explodeProgress - explodeTarget) < 0.001) explodeProgress = explodeTarget;
      updateExplodePositions();
    }
    if (selectedHighlight) selectedHighlight.update();
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
})();`;
}

function scriptSafeJson(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
}

function makeViewerCss() {
  return String.raw`:root{--ink:#12151b;--muted:#5d6674;--paper:#edf1f4;--panel:rgba(248,250,252,.78);--line:rgba(18,21,27,.14);--accent:#e14f3d;--aqua:#2ba8a1;--shadow:rgba(18,21,27,.18)}*{box-sizing:border-box}html,body{width:100%;height:100%;margin:0}body{overflow:hidden;color:var(--ink);background:linear-gradient(120deg,rgba(43,168,161,.16),transparent 34%),linear-gradient(300deg,rgba(225,79,61,.14),transparent 36%),radial-gradient(circle at 50% 110%,rgba(18,21,27,.18),transparent 34%),var(--paper);font-family:"Noto Sans SC",sans-serif}body:before{position:fixed;inset:0;pointer-events:none;content:"";background-image:linear-gradient(rgba(18,21,27,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(18,21,27,.045) 1px,transparent 1px);background-size:48px 48px;mask-image:linear-gradient(to bottom,rgba(0,0,0,.4),transparent 78%)}.shell{position:relative;width:100vw;height:100svh;min-height:560px}#product-canvas{position:absolute;inset:0;display:block;width:100%;height:100%}.brand-panel{position:absolute;top:clamp(20px,4vw,44px);left:clamp(18px,5vw,56px);max-width:min(360px,calc(100vw - 36px));pointer-events:none}.kicker{margin:0 0 8px;color:var(--accent);font-family:"Space Grotesk",sans-serif;font-size:.76rem;font-weight:700;text-transform:uppercase}h1{margin:0;font-family:"Space Grotesk",sans-serif;font-size:clamp(2.2rem,5vw,4.2rem);line-height:1;letter-spacing:0}.summary{max-width:300px;margin:12px 0 0;color:var(--muted);font-size:.94rem;line-height:1.65}.control-dock{position:absolute;right:clamp(16px,4vw,54px);bottom:clamp(28px,5vw,54px);display:flex;flex-direction:column;gap:10px;padding:12px;border:1px solid var(--line);border-radius:8px;background:var(--panel);box-shadow:0 20px 70px var(--shadow);backdrop-filter:blur(18px)}.control-group{display:grid;grid-template-columns:58px repeat(var(--count,4),34px);align-items:center;gap:8px;min-height:38px}.motion-controls{grid-template-columns:58px 34px 34px}.label{color:var(--muted);font-family:"Space Grotesk",sans-serif;font-size:.72rem;font-weight:700;text-transform:uppercase}button{display:grid;place-items:center;min-height:34px;border:1px solid rgba(18,21,27,.18);border-radius:8px;background:rgba(255,255,255,.62);cursor:pointer;font:inherit;font-weight:700}.control-dock button{width:34px;height:34px;border-radius:50%;padding:0}.icon-button.is-active{border-color:var(--ink);background:#fff}.icon-button svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.8}.loading{position:absolute;inset:0;display:grid;place-items:center;align-content:center;gap:12px;pointer-events:none;transition:opacity .24s ease}.loading.is-hidden{opacity:0}.loading span{width:38px;height:38px;border:3px solid rgba(18,21,27,.12);border-top-color:var(--accent);border-radius:50%;animation:spin .85s linear infinite}.loading small{max-width:min(360px,calc(100vw - 32px));color:var(--muted);font-size:.92rem;text-align:center}.loading.is-error{pointer-events:auto;background:rgba(238,242,245,.78);backdrop-filter:blur(14px)}.loading.is-error span{display:none}@keyframes spin{to{transform:rotate(360deg)}}@media(max-width:740px){.shell{min-height:620px}.brand-panel{top:18px;left:16px}h1{font-size:clamp(2rem,14vw,3.2rem)}.summary{max-width:260px;margin-top:10px;font-size:.88rem}.control-dock{right:14px;bottom:14px;padding:10px}.control-group{grid-template-columns:1fr repeat(var(--count,4),32px);gap:7px}.motion-controls{grid-template-columns:1fr 32px 32px}.control-dock button{width:32px;height:32px}}`;
}

function makeViewerJs() {
  return String.raw`import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js";

const config = window.VIEWER_CONFIG;
const security = window.VIEWER_SECURITY;
${base64ToBytesSource()}

async function importAesKey(rawKey) {
  return crypto.subtle.importKey("raw", rawKey, "AES-GCM", false, ["decrypt"]);
}

async function decryptBytes(cipher, rawKey, iv) {
  const key = await importAesKey(rawKey);
  return crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, cipher);
}

document.querySelector("#product-title").textContent = config.productName;
document.querySelector("#product-summary").textContent = config.summary;

const canvas = document.querySelector("#product-canvas");
const loading = document.querySelector("#loading-state");
const loadingMessage = document.querySelector("#loading-message");
const canDecrypt = Boolean(window.crypto && crypto.subtle);

if (!canDecrypt && !window.VIEWER_MODEL_B64) {
  loading.classList.add("is-error");
  loadingMessage.textContent = "当前浏览器不支持本地解密，请换 Edge/Chrome。";
  window.__MODEL_STATUS = "error";
  throw new Error("Web Crypto is unavailable.");
}

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance", precision: "highp" });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.04;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
function createHdrTexture(bytes) {
  const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
  const textureData = new RGBELoader().parse(buffer);
  const texture = new THREE.DataTexture(textureData.data, textureData.width, textureData.height, THREE.RGBAFormat, textureData.type);
  texture.colorSpace = THREE.LinearSRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.flipY = true;
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.needsUpdate = true;
  return texture;
}

const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 500);
camera.position.set(4.2, 2.4, 6.2);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.enablePan = false;
controls.minDistance = 0.5;
controls.maxDistance = 80;
controls.target.set(0, 0.3, 0);

async function applyEnvironment() {
  if (config.environmentEnabled === false) {
    scene.environment = null;
    scene.environmentIntensity = 0;
    return;
  }
  const pmrem = new THREE.PMREMGenerator(renderer);
  try {
    const bytes = window.VIEWER_ENVIRONMENT_B64
      ? base64ToBytes(window.VIEWER_ENVIRONMENT_B64)
      : (config.environmentPath ? new Uint8Array(await fetch(config.environmentPath).then((response) => response.arrayBuffer())) : null);
    if (!bytes) throw new Error("No HDRI environment.");
    const texture = createHdrTexture(bytes);
    const envMap = pmrem.fromEquirectangular(texture).texture;
    scene.environment = envMap;
    if (config.environmentBackground) {
      scene.background = texture;
      scene.backgroundBlurriness = Number(config.environmentBackgroundBlur || 0);
      scene.backgroundIntensity = 0.42;
    } else {
      scene.background = null;
      texture.dispose();
    }
    scene.environmentIntensity = Number(config.environmentIntensity ?? 2.2);
  } catch (error) {
    console.warn(error);
    scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;
    scene.environmentIntensity = 1.0;
  } finally {
    pmrem.dispose();
  }
}
await applyEnvironment();

const productPivot = new THREE.Group();
productPivot.rotation.set(0, 0, 0);
scene.add(productPivot);
const modelRoot = new THREE.Group();
productPivot.add(modelRoot);
const baseMaterial = new THREE.MeshPhysicalMaterial({ color: config.baseColor || "#6f7f8f", metalness: 0.38, roughness: 0.48, clearcoat: 0.32, clearcoatRoughness: 0.3 });
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let selectedHighlight = null;

const fallbackLightPreset = {
  hemi: ["#ffffff", "#bcc8d0", 1.8],
  key: ["#ffffff", 3.8, [3.4, 5.6, 4.2]],
  rim: ["#8ee7df", 1.7, [-4.4, 2.6, -3.6]],
  warm: ["#ff8068", 20, [2.6, 1.2, 2.4]],
};
const activeLightPreset = config.lightPresets && Object.prototype.hasOwnProperty.call(config.lightPresets, config.lightPreset)
  ? config.lightPresets[config.lightPreset]
  : fallbackLightPreset;
if (activeLightPreset) {
  const lightIntensity = Number(config.lightIntensity ?? 1);
  if (activeLightPreset.ambient) {
    scene.add(new THREE.AmbientLight(activeLightPreset.ambient[0], activeLightPreset.ambient[1] * lightIntensity));
  } else {
    scene.add(new THREE.HemisphereLight(activeLightPreset.hemi[0], activeLightPreset.hemi[1], activeLightPreset.hemi[2] * lightIntensity));
    const keyLight = new THREE.DirectionalLight(activeLightPreset.key[0], activeLightPreset.key[1] * lightIntensity);
    keyLight.position.set(...activeLightPreset.key[2]);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(activeLightPreset.rim[0], activeLightPreset.rim[1] * lightIntensity);
    rimLight.position.set(...activeLightPreset.rim[2]);
    scene.add(rimLight);
    const warmLight = new THREE.PointLight(activeLightPreset.warm[0], activeLightPreset.warm[1] * lightIntensity, 8, 2);
    warmLight.position.set(...activeLightPreset.warm[2]);
    scene.add(warmLight);
  }
}

let autoRotate = config.autoRotate;
let modelLoaded = false;
const explodableMeshes = [];
let explodeProgress = config.explodeInitial === "expanded" ? 1 : 0;
let explodeTarget = explodeProgress;
window.__MODEL_STATUS = "loading";

function getPartOffsets(override) {
  const zero = { x: 0, y: 0, z: 0, normal: 0 };
  return {
    start: override?.offsets?.start || zero,
    end: override?.offsets?.end || override?.offset || zero,
  };
}

function updateExplodePositions() {
  explodableMeshes.forEach((mesh) => {
    const { basePosition, offsetStart, offsetEnd, normalDirection } = mesh.userData;
    mesh.position.set(
      basePosition.x + offsetStart.x + (offsetEnd.x - offsetStart.x) * explodeProgress + normalDirection.x * (offsetStart.normal + (offsetEnd.normal - offsetStart.normal) * explodeProgress),
      basePosition.y + offsetStart.y + (offsetEnd.y - offsetStart.y) * explodeProgress + normalDirection.y * (offsetStart.normal + (offsetEnd.normal - offsetStart.normal) * explodeProgress),
      basePosition.z + offsetStart.z + (offsetEnd.z - offsetStart.z) * explodeProgress + normalDirection.z * (offsetStart.normal + (offsetEnd.normal - offsetStart.normal) * explodeProgress),
    );
  });
}

function setSelectedMesh(mesh) {
  if (selectedHighlight) {
    scene.remove(selectedHighlight);
    selectedHighlight.geometry.dispose();
    selectedHighlight.material.dispose();
    selectedHighlight = null;
  }
}

canvas.addEventListener("pointerdown", (event) => {
  if (!modelLoaded || explodableMeshes.length === 0) return;
  if (event.button === 2) {
    setSelectedMesh(null);
    return;
  }
  if (event.button !== 0) return;
  const rect = canvas.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hit = raycaster.intersectObjects(explodableMeshes.filter((mesh) => mesh.visible), true)[0];
  if (hit) setSelectedMesh(hit.object);
});
canvas.addEventListener("contextmenu", (event) => event.preventDefault());

function normalizeMaterialForEnvironment(material) {
  if (Array.isArray(material)) return material.map((item) => normalizeMaterialForEnvironment(item));
  if (material?.isMeshStandardMaterial || material?.isMeshPhysicalMaterial) {
    material.envMapIntensity = Number(config.environmentIntensity ?? 2.2);
    return material;
  }
  const fallback = (config.materialPresets && config.materialPresets.mattePlastic) || { color: "#6f7f8f", roughness: 0.72 };
  const opacity = material?.opacity ?? 1;
  const converted = new THREE.MeshPhysicalMaterial({
    color: material?.color?.clone?.() || new THREE.Color(fallback.color),
    map: material?.map || null,
    normalMap: material?.normalMap || null,
    roughnessMap: material?.roughnessMap || null,
    metalnessMap: material?.metalnessMap || null,
    alphaMap: material?.alphaMap || null,
    metalness: 0.04,
    envMapIntensity: 2.2,
    roughness: material?.shininess ? Math.max(0.08, 1 - Math.min(material.shininess, 100) / 100) : fallback.roughness,
    clearcoat: 0.12,
    clearcoatRoughness: 0.35,
    opacity,
    transparent: Boolean(material?.transparent || opacity < 1),
    side: material?.side ?? THREE.FrontSide,
  });
  converted.name = material?.name || "";
  converted.depthWrite = !(converted.transparent && converted.opacity < 1);
  return converted;
}

function prepareMesh(mesh) {
  mesh.material = normalizeMaterialForEnvironment(mesh.material || baseMaterial.clone());
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  if (mesh.geometry) {
    const hadSourceNormals = Boolean(mesh.geometry.attributes.normal);
    if (config.smoothShading && !hadSourceNormals) {
      mesh.geometry.deleteAttribute("normal");
      mesh.geometry = mergeVertices(mesh.geometry, 0.001);
    }
    if (!hadSourceNormals) mesh.geometry.computeVertexNormals();
    mesh.geometry.computeBoundingBox();
  }
}

function applyPartConfig(mesh, partId) {
  const override = config.partOverrides && config.partOverrides[partId];
  const offsets = getPartOffsets(override);
  mesh.userData.basePosition = mesh.position.clone();
  mesh.userData.offsetStart = {
    x: Number(offsets.start.x || 0),
    y: Number(offsets.start.y || 0),
    z: Number(offsets.start.z || 0),
    normal: Number(offsets.start.normal || 0),
  };
  mesh.userData.offsetEnd = {
    x: Number(offsets.end.x || 0),
    y: Number(offsets.end.y || 0),
    z: Number(offsets.end.z || 0),
    normal: Number(offsets.end.normal || 0),
  };
  const center = new THREE.Box3().setFromObject(mesh).getCenter(new THREE.Vector3());
  mesh.userData.normalDirection = center.lengthSq() > 0.0001 ? center.normalize() : new THREE.Vector3(0, 1, 0);
  explodableMeshes.push(mesh);
  mesh.visible = !override || override.visible !== false;
  updateExplodePositions();
  if (!override) return;
  if (override.materialMode === "custom" || override.materialMode === "preset") {
    mesh.material = new THREE.MeshPhysicalMaterial(override.material);
    mesh.material.envMapIntensity = Number(config.environmentIntensity ?? 2.2);
    mesh.material.depthWrite = !(mesh.material.transparent && mesh.material.opacity < 1);
  }
}

function normalizeModel(object) {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const maxAxis = Math.max(size.x, size.y, size.z) || 1;
  object.position.sub(center);
  const fitGroup = new THREE.Group();
  fitGroup.scale.setScalar(config.modelSize / maxAxis);
  fitGroup.rotation.x = -Math.PI / 2;
  fitGroup.add(object);
  modelRoot.add(fitGroup);
  const normalizedBox = new THREE.Box3().setFromObject(modelRoot);
  const normalizedSize = normalizedBox.getSize(new THREE.Vector3());
  modelRoot.position.y = -normalizedBox.min.y - normalizedSize.y * 0.48;
}

async function loadModelBytes(modelBytes) {
  let object;
  if (security.modelFormat === "obj") {
    object = new OBJLoader().parse(new TextDecoder().decode(modelBytes));
  } else {
    const gltf = await new Promise((resolve, reject) => new GLTFLoader().parse(modelBytes, "", resolve, reject));
    object = gltf.scene;
  }
  let meshIndex = 0;
  object.traverse((child) => {
    if (!child.isMesh) return;
    const partId = "part-" + meshIndex;
    prepareMesh(child);
    applyPartConfig(child, partId);
    meshIndex += 1;
  });
  normalizeModel(object);
  loading.classList.add("is-hidden");
  modelLoaded = true;
  window.__MODEL_STATUS = "ready";
}

async function loadEncryptedModel(rawKey) {
  try {
    window.__MODEL_STATUS = "loading";
    const cipher = window.VIEWER_PACKAGE_B64
      ? base64ToBytes(window.VIEWER_PACKAGE_B64)
      : await fetch(security.packagePath).then((response) => response.arrayBuffer());
    const decrypted = await decryptBytes(cipher, rawKey, base64ToBytes(security.modelIv));
    await loadModelBytes(decrypted);
  } catch (error) {
    console.error(error);
    window.__MODEL_STATUS = "error";
    loading.classList.add("is-error");
    loadingMessage.textContent = error.message || "模型加载失败。";
  }
}

if (canDecrypt) {
  loadEncryptedModel(base64ToBytes(security.embeddedKey));
} else {
  loadModelBytes(base64ToBytes(window.VIEWER_MODEL_B64)).catch((error) => {
    console.error(error);
    window.__MODEL_STATUS = "error";
    loading.classList.add("is-error");
    loadingMessage.textContent = error.message || "模型加载失败。";
  });
}

document.querySelector("#spin-toggle").classList.toggle("is-active", autoRotate);
document.querySelector("#spin-toggle").addEventListener("click", (event) => {
  autoRotate = !autoRotate;
  event.currentTarget.classList.toggle("is-active", autoRotate);
});

const explodeToggle = document.querySelector("#explode-toggle");
if (!config.explodeEnabled) {
  explodeToggle.style.display = "none";
} else {
  explodeToggle.classList.toggle("is-active", explodeTarget === 1);
  explodeToggle.addEventListener("click", () => {
    explodeTarget = explodeTarget === 1 ? 0 : 1;
    explodeToggle.classList.toggle("is-active", explodeTarget === 1);
  });
}

function resize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.position.x = width < 740 ? 4.0 : 4.2;
  camera.position.y = width < 740 ? 2.15 : 2.4;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}
window.addEventListener("resize", resize);
resize();

function animate() {
  requestAnimationFrame(animate);
  if (autoRotate) productPivot.rotation.y += 0.0045;
  if (Math.abs(explodeProgress - explodeTarget) > 0.001) {
    explodeProgress += (explodeTarget - explodeProgress) * 0.12;
    if (Math.abs(explodeProgress - explodeTarget) < 0.001) explodeProgress = explodeTarget;
    updateExplodePositions();
  }
  if (selectedHighlight) selectedHighlight.update();
  controls.update();
  renderer.render(scene, camera);
}
animate();`;
}

function makeReadme() {
  return `3D 展示网页\n\n使用方式：\n1. 双击 open-directly.html 可以直接查看。\n2. 如果要发布到网站，也可以上传整个文件夹后访问 index.html。\n3. 页面会自动加载展示模型，不需要客户输入额外信息。\n\n安全边界：网页端必须解密模型才能渲染，因此这不是绝对防逆向方案。请只放展示版模型，不要放生产级源模型。\n`;
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => {
    const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
    return map[char];
  });
}

elements.modelInput.addEventListener("change", (event) => handleFile(event.target.files[0]));
elements.reimportModel.addEventListener("click", () => {
  elements.modelInput.value = "";
  elements.modelInput.click();
});
elements.dropzone.addEventListener("dragover", (event) => {
  event.preventDefault();
  elements.dropzone.classList.add("is-dragging");
});
elements.dropzone.addEventListener("dragleave", () => elements.dropzone.classList.remove("is-dragging"));
elements.dropzone.addEventListener("drop", (event) => {
  event.preventDefault();
  elements.dropzone.classList.remove("is-dragging");
  handleFile(event.dataTransfer.files[0]);
});
elements.partList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-part-id]");
  if (!button) return;
  selectPart(button.dataset.partId, { range: event.shiftKey });
});
[
  elements.partColor,
  elements.partVisible,
  elements.metalness,
  elements.roughness,
  elements.opacity,
  elements.offsetX,
  elements.offsetY,
  elements.offsetZ,
  elements.offsetNormal,
].forEach((control) => {
  control.addEventListener("input", updateSelectedPartFromControls);
  control.addEventListener("change", updateSelectedPartFromControls);
});
elements.materialMode.addEventListener("change", () => {
  if (elements.materialMode.value === "preset") {
    elements.presetTuneEnabled.checked = false;
    applyPresetDefaultsToControls(elements.materialPreset.value);
  }
  updateSelectedPartFromControls();
});
elements.presetTuneEnabled.addEventListener("change", () => {
  if (elements.materialMode.value === "preset" && !elements.presetTuneEnabled.checked) {
    applyPresetDefaultsToControls(elements.materialPreset.value);
  }
  updateSelectedPartFromControls();
});
elements.presetGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-preset-id]");
  if (!button) return;
  elements.materialPreset.value = button.dataset.presetId;
  elements.presetTuneEnabled.checked = false;
  applyPresetDefaultsToControls(button.dataset.presetId);
  updateSelectedPartFromControls();
});
elements.partEditor.addEventListener("click", (event) => {
  const button = event.target.closest("[data-reset-axis]");
  if (!button) return;
  const axis = button.dataset.resetAxis;
  const control = axis === "normal" ? elements.offsetNormal : elements[`offset${axis.toUpperCase()}`];
  control.value = 0;
  updateSelectedPartFromControls();
});
elements.offsetTarget.addEventListener("change", () => {
  state.offsetTarget = elements.offsetTarget.value;
  syncAutoExplodeTools();
  syncAutoArrangeMode();
  const part = getSelectedPart();
  if (part) {
    const activeOffset = getActiveOffset(state.partOverrides[part.id]);
    elements.offsetX.value = activeOffset.x;
    elements.offsetY.value = activeOffset.y;
    elements.offsetZ.value = activeOffset.z;
    elements.offsetNormal.value = activeOffset.normal || 0;
    syncPartLabels();
  }
  applyAllPartOverrides();
});
elements.autoExplodeStrength.addEventListener("input", () => {
  syncPartLabels();
  if (state.autoArrangeActive) autoArrangeExplodePositions();
});
elements.autoArrangeExplode.addEventListener("click", autoArrangeExplodePositions);
elements.applyAutoExplode.addEventListener("click", applyAutoArrangeAsManual);
elements.cancelAutoExplode.addEventListener("click", cancelAutoArrangeExplode);
elements.lightPreset.addEventListener("change", applyLightPresetToPreview);
elements.lightIntensity.addEventListener("input", () => {
  syncHdriBackgroundUi();
  applyLightPresetToPreview();
});
function reapplyPreviewEnvironment() {
  syncHdriBackgroundUi();
  return applyEnvironmentToPreview()
    .then(() => {
      applyAllPartOverrides();
      const preset = HDRI_PRESETS[state.hdriSource] || HDRI_PRESETS.default;
      setStatus(`HDRI 已切换：${preset.label}`);
    })
    .catch((error) => {
      console.error(error);
      setStatus(`HDRI 切换失败：${error.message}`);
    });
}

elements.hdriSource.addEventListener("change", () => {
  state.hdriSource = elements.hdriSource.value;
  const preset = HDRI_PRESETS[state.hdriSource] || HDRI_PRESETS.default;
  elements.hdriStatus.textContent = preset.label;
  reapplyPreviewEnvironment();
});
elements.hdriBackgroundEnabled.addEventListener("change", reapplyPreviewEnvironment);
elements.hdriBackgroundBlur.addEventListener("input", () => {
  syncHdriBackgroundUi();
  if (state.preview?.scene) {
    state.preview.scene.backgroundBlurriness = Number(elements.hdriBackgroundBlur.value) || 0;
  }
});
elements.hdriIntensity.addEventListener("input", () => {
  syncHdriBackgroundUi();
  if (state.preview?.scene) {
    state.preview.scene.environmentIntensity = Number(elements.hdriIntensity.value) || 0;
    refreshEnvironmentMaterials(state.preview.scene);
  }
});
elements.buildButton.addEventListener("click", buildPackage);
elements.previewResult.addEventListener("click", previewResult);

renderPresetGrid();
syncMaterialUi();
syncAutoExplodeTools();
syncAutoArrangeMode();
syncHdriBackgroundUi();
syncPartLabels();
setStatus("等待模型文件");
