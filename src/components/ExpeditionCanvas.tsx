/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { ExpeditionRunState, InventoryItem } from '../types';
import { ITEM_DEFINITIONS } from '../services/gameStore';
import { soundService } from '../services/soundService';

interface ExpeditionCanvasProps {
  runState: ExpeditionRunState;
  satchelCapacity: number;
  flashlightOn: boolean;
  onCollectItem: (item: InventoryItem) => void;
  onReachExtraction: () => void;
  onUpdatePlayerPos: (pos: { x: number; z: number }) => void;
}

export const ExpeditionCanvas: React.FC<ExpeditionCanvasProps> = ({
  runState,
  satchelCapacity,
  flashlightOn,
  onCollectItem,
  onReachExtraction,
  onUpdatePlayerPos
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Software WebGL Guard detection
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Scene & Fog
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x090d16);
    scene.fog = new THREE.FogExp2(0x090d16, 0.025);

    // Studio Environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Camera
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 8, 15);

    // Lighting
    const ambientLight = new THREE.HemisphereLight(0x38bdf8, 0x1e1b4b, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xf59e0b, 1.5);
    dirLight.position.set(20, 40, 20);
    dirLight.castShadow = !isSoftwareGl;
    if (dirLight.castShadow) {
      dirLight.shadow.mapSize.width = 1024;
      dirLight.shadow.mapSize.height = 1024;
      dirLight.shadow.camera.near = 0.5;
      dirLight.shadow.camera.far = 100;
      const d = 30;
      dirLight.shadow.camera.left = -d;
      dirLight.shadow.camera.right = d;
      dirLight.shadow.camera.top = d;
      dirLight.shadow.camera.bottom = -d;
    }
    scene.add(dirLight);

    // Flashlight Spot attached to camera
    const spotLight = new THREE.SpotLight(0xffedd5, 8, 45, Math.PI / 6, 0.5, 1);
    spotLight.position.set(0, 0, 0);
    spotLight.target.position.set(0, 0, -20);
    camera.add(spotLight);
    camera.add(spotLight.target);
    scene.add(camera);

    // --- PROCEDURAL DISTRICT GEOMETRY (Old Market District) ---
    // Ground plane
    const groundGeo = new THREE.PlaneGeometry(120, 120, 32, 32);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.85,
      metalness: 0.1
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // District Grid Streets & Composite Buildings (3-12 parts per group)
    const buildingsGroup = new THREE.Group();
    const buildingPositions = [
      { x: -20, z: -20, w: 12, h: 10, d: 12, color: 0x1f2937 },
      { x: 20, z: -20, w: 14, h: 14, d: 10, color: 0x1e293b },
      { x: -20, z: 20, w: 10, h: 8, d: 14, color: 0x0f172a },
      { x: 20, z: 20, w: 12, h: 12, d: 12, color: 0x111827 },
      { x: 0, z: -35, w: 25, h: 6, d: 8, color: 0x1e293b }, // Substation Market
    ];

    buildingPositions.forEach(b => {
      const bGroup = new THREE.Group();
      // Primary Hull
      const hullGeo = new THREE.BoxGeometry(b.w, b.h, b.d);
      const hullMat = new THREE.MeshStandardMaterial({ color: b.color, roughness: 0.7, metalness: 0.3 });
      const hull = new THREE.Mesh(hullGeo, hullMat);
      hull.position.y = b.h / 2;
      hull.castShadow = true;
      hull.receiveShadow = true;
      bGroup.add(hull);

      // Secondary trim / roof equipment
      const roofGeo = new THREE.BoxGeometry(b.w * 0.8, 1, b.d * 0.8);
      const roofMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5, metalness: 0.6 });
      const roof = new THREE.Mesh(roofGeo, roofMat);
      roof.position.y = b.h + 0.5;
      bGroup.add(roof);

      bGroup.position.set(b.x, 0, b.z);
      buildingsGroup.add(bGroup);
    });
    scene.add(buildingsGroup);

    // Extraction Beacon (Glowing Green Cylinder)
    const extractionGroup = new THREE.Group();
    const beaconBaseGeo = new THREE.CylinderGeometry(2, 2.5, 1, 16);
    const beaconBaseMat = new THREE.MeshStandardMaterial({ color: 0x065f46, metalness: 0.8, roughness: 0.2 });
    const beaconBase = new THREE.Mesh(beaconBaseGeo, beaconBaseMat);
    beaconBase.position.y = 0.5;
    extractionGroup.add(beaconBase);

    const beaconLightGeo = new THREE.CylinderGeometry(0.8, 0.8, 8, 16);
    const beaconLightMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x10b981,
      emissiveIntensity: 2,
      transparent: true,
      opacity: 0.8
    });
    const beaconLight = new THREE.Mesh(beaconLightGeo, beaconLightMat);
    beaconLight.position.y = 4.5;
    extractionGroup.add(beaconLight);
    extractionGroup.position.set(0, 0, -45);
    scene.add(extractionGroup);

    // Loot Crates & Artifacts in District
    interface LootNode {
      id: string;
      mesh: THREE.Group;
      itemId: string;
      collected: boolean;
      x: number;
      z: number;
    }

    const lootNodes: LootNode[] = [];
    const lootSpawns = [
      { x: -10, z: -10, itemId: 'scrap_metal' },
      { x: 12, z: -15, itemId: 'copper_wire' },
      { x: -15, z: 12, itemId: 'battery_cell' },
      { x: 15, z: 18, itemId: 'circuit_board' },
      { x: 0, z: -25, itemId: 'relic_compass' },
      { x: -25, z: 0, itemId: 'signal_lens' },
    ];

    lootSpawns.forEach((spawn, idx) => {
      const lGroup = new THREE.Group();
      const isArtifact = ITEM_DEFINITIONS[spawn.itemId]?.isArtifact;

      const crateGeo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
      const crateMat = new THREE.MeshStandardMaterial({
        color: isArtifact ? 0xf59e0b : 0x3b82f6,
        metalness: isArtifact ? 0.8 : 0.4,
        roughness: 0.3,
        emissive: isArtifact ? 0xd97706 : 0x1d4ed8,
        emissiveIntensity: 0.4
      });
      const crate = new THREE.Mesh(crateGeo, crateMat);
      crate.position.y = 0.6;
      crate.castShadow = true;
      lGroup.add(crate);

      lGroup.position.set(spawn.x, 0, spawn.z);
      scene.add(lGroup);
      lootNodes.push({
        id: `loot_${idx}`,
        mesh: lGroup,
        itemId: spawn.itemId,
        collected: false,
        x: spawn.x,
        z: spawn.z
      });
    });

    // Warden Enemy Robot (Composite procedural model)
    const wardenGroup = new THREE.Group();
    const wBodyGeo = new THREE.BoxGeometry(1.6, 2.2, 1);
    const wBodyMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, metalness: 0.7, roughness: 0.3 });
    const wBody = new THREE.Mesh(wBodyGeo, wBodyMat);
    wBody.position.y = 1.5;
    wardenGroup.add(wBody);

    const wVisorGeo = new THREE.BoxGeometry(1.2, 0.4, 0.4);
    const wVisorMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xef4444, emissiveIntensity: 3 });
    const wVisor = new THREE.Mesh(wVisorGeo, wVisorMat);
    wVisor.position.set(0, 2.2, 0.4);
    wardenGroup.add(wVisor);
    wardenGroup.position.set(0, 0, 25);
    scene.add(wardenGroup);

    // --- PLAYER STATE & CONTROLS ---
    const playerPos = new THREE.Vector3(0, 1.7, 35);
    const playerVel = new THREE.Vector3(0, 0, 0);
    const keysPressed: Record<string, boolean> = {};

    const handleKeyDown = (e: KeyboardEvent) => { keysPressed[e.code] = true; };
    const handleKeyUp = (e: KeyboardEvent) => { keysPressed[e.code] = false; };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Animation & Game Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);

      // Flashlight intensity
      spotLight.intensity = flashlightOn ? 12 : 0;

      // Player Movement (WASD)
      const moveSpeed = 10 * dt;
      const forward = new THREE.Vector3(0, 0, -1);
      const right = new THREE.Vector3(1, 0, 0);

      if (keysPressed['KeyW'] || keysPressed['ArrowUp']) playerPos.addScaledVector(forward, moveSpeed);
      if (keysPressed['KeyS'] || keysPressed['ArrowDown']) playerPos.addScaledVector(forward, -moveSpeed);
      if (keysPressed['KeyA'] || keysPressed['ArrowLeft']) playerPos.addScaledVector(right, -moveSpeed);
      if (keysPressed['KeyD'] || keysPressed['ArrowRight']) playerPos.addScaledVector(right, moveSpeed);

      // Clamp within map bounds
      playerPos.x = THREE.MathUtils.clamp(playerPos.x, -50, 50);
      playerPos.z = THREE.MathUtils.clamp(playerPos.z, -50, 50);

      // Camera follows player
      camera.position.x = playerPos.x;
      camera.position.z = playerPos.z + 8;
      camera.position.y = 5;
      camera.lookAt(playerPos.x, 1.5, playerPos.z - 5);

      onUpdatePlayerPos({ x: playerPos.x, z: playerPos.z });

      // Warden Patrol & Chase AI
      const wardenTargetX = Math.sin(clock.getElapsedTime() * 0.5) * 20;
      const wardenTargetZ = Math.cos(clock.getElapsedTime() * 0.3) * 20;
      wardenGroup.position.x += (wardenTargetX - wardenGroup.position.x) * dt * 2;
      wardenGroup.position.z += (wardenTargetZ - wardenGroup.position.z) * dt * 2;
      wardenGroup.lookAt(playerPos.x, wardenGroup.position.y, playerPos.z);

      // Check Loot Proximity (Auto-collect or E prompt)
      lootNodes.forEach(node => {
        if (!node.collected) {
          const dist = Math.hypot(playerPos.x - node.x, playerPos.z - node.z);
          if (dist < 2.5) {
            node.collected = true;
            node.mesh.visible = false;
            const def = ITEM_DEFINITIONS[node.itemId];
            soundService.playPickup(def?.isArtifact);
            onCollectItem({
              instanceId: `inst_${Math.random().toString(36).substring(2, 9)}`,
              itemId: node.itemId,
              quantity: 1
            });
          }
        }
      });

      // Check Extraction Proximity
      const distToExtraction = Math.hypot(playerPos.x - 0, playerPos.z - (-45));
      if (distToExtraction < 5) {
        onReachExtraction();
      }

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />;
};
