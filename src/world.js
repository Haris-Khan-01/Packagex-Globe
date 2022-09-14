import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import Globe from "react-globe.gl";
import ThreeGlobe from "three-globe";
import { WebGLRenderer, Scene, ShaderMaterial, Vector2 } from "three";
import {
  PerspectiveCamera,
  AmbientLight,
  DirectionalLight,
  Color,
  Fog,
  // AxesHelper,
  // DirectionalLightHelper,
  // CameraHelper,
  PointLight,
  SphereGeometry,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const World = () => {
  var renderer, camera, scene, controls;
  let mouseX = 0;
  let mouseY = 0;
  let windowHalfX = window.innerWidth / 2;
  let windowHalfY = window.innerHeight / 2;
  var CustomGlobe;

  useEffect(() => {
    init();
  }, []);

  const init = () => {
    renderer = new WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    // renderer.outputEncoding = THREE.sRGBEncoding;
    document.body.appendChild(renderer.domElement);

    // Initialize scene, light
    scene = new Scene();
    scene.add(new AmbientLight(0xbbbbbb, 0.3));
    scene.background = new Color(0x040d21);

    // Initialize camera, light
    camera = new PerspectiveCamera();
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    var dLight = new DirectionalLight(0xfcf003, 1);
    dLight.position.set(-800, 2000, 400);
    camera.add(dLight);

    var dLight1 = new DirectionalLight(0x231773, 1);
    dLight1.position.set(-200, 500, 200);
    camera.add(dLight1);

    var dLight2 = new PointLight(0x231773, 0.5);
    dLight2.position.set(-200, 500, 200);
    camera.add(dLight2);

    camera.position.z = 400;
    camera.position.x = 0;
    camera.position.y = 0;

    scene.add(camera);

    // Additional effects
    scene.fog = new Fog(0x231773, 400, 2000);

    // Helpers
    // const axesHelper = new AxesHelper(800);
    // scene.add(axesHelper);
    // var helper = new DirectionalLightHelper(dLight);
    // scene.add(helper);
    // var helperCamera = new CameraHelper(dLight.shadow.camera);
    // scene.add(helperCamera);

    // Initialize controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dynamicDampingFactor = 0.01;
    controls.enablePan = false;
    controls.minDistance = 200;
    controls.maxDistance = 500;
    controls.rotateSpeed = 0.8;
    controls.zoomSpeed = 1;
    controls.autoRotate = false;

    controls.minPolarAngle = Math.PI / 3.5;
    controls.maxPolarAngle = Math.PI - Math.PI / 3;

    window.addEventListener("resize", onWindowResize, false);
    document.addEventListener("mousemove", onMouseMove);
  };

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    windowHalfX = window.innerWidth / 1.5;
    windowHalfY = window.innerHeight / 1.5;
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function onMouseMove(event) {
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
    // console.log("x: " + mouseX + " y: " + mouseY);
  }
  CustomGlobe = new ThreeGlobe({
    waitForGlobeReady: true,
    animateIn: true,
  });

  // custom globe material
  const globeMaterial = new THREE.MeshPhongMaterial();
  globeMaterial.bumpScale = 10;
  new THREE.TextureLoader().load(
    "//unpkg.com/three-globe/example/img/earth-water.png",
    (texture) => {
      globeMaterial.specularMap = texture;
      globeMaterial.specular = new THREE.Color("grey");
      globeMaterial.shininess = 15;
    }
  );

  const globeEl = useRef();

  useEffect(() => {
    setTimeout(() => {
      // wait for scene to be populated (asynchronously)
      const directionalLight = globeEl.current
        .scene()
        .children.find((obj3d) => obj3d.type === "DirectionalLight");
      directionalLight && directionalLight.position.set(1, 1, 1); // change light position to see the specularMap's effect
    });
  }, []);

  return (
    <Globe
      ref={globeEl}
      globeMaterial={globeMaterial}
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
      bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
      backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
    />
  );
};

export default World;
