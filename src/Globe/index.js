import React, { useState, useEffect, useCallback, useRef } from "react";
import "./globe.css";

import Globe from "react-globe.gl";
import airportHistory from "../data/my-airports.json";
import countries from "../data/globe-data-min.json";
import travelHistory from "../data/my-flights.json";
import ThreeGlobe from "three-globe";
import { WebGLRenderer, Scene, ShaderMaterial, Vector2 } from "three";
import {
  PerspectiveCamera,
  AmbientLight,
  DirectionalLight,
  HemisphereLight,
  Color,
  Fog,
  SpotLight,
  // AxesHelper,
  // DirectionalLightHelper,
  // CameraHelper,
  PointLight,
  SphereGeometry,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import vertexShader from "../shaders/vertex.glsl";
import fragmentShader from "../shaders/fragment.glsl";
import InventoryPoints from "../data/inventory-points.json";
import DispatchPoints from "../data/dispatch-points.json";

const PackgexGlobe = () => {
  const [cities, setCities] = useState();
  const [hexapolygonPoints, setHexaPolygonPoints] = useState();
  const [arcsData, setArcsData] = useState([]);
  const [inventoryPoints, setInventoryPoints] = useState([]);
  const [ringsData, setRingsData] = useState([]);
  const [dispatchPoints, setDispatchPoints] = useState([]);
  const [count, setCount] = useState(0);
  const [data, setData] = useState();

  const globeEl = useRef();
  const MAP_CENTER = { lat: 30.209702, lng: -97.698227, altitude: 2 };
  useEffect(() => {
    globeEl.current.controls().enableZoom = false;
    globeEl.current.controls().autoRotate = true;
    globeEl.current.controls().autoRotateSpeed = 1;
    globeEl.current.pointOfView(MAP_CENTER, 4000);
  }, []);

  //   const FLIGHT_TIME = 1000;
  //   const ARC_REL_LEN = 0.9;
  //   const NUM_RINGS = 3;
  //   const ARC_REL_LEN = 0.4; // relative to whole arc
  //   const FLIGHT_TIME = 1000;
  //   const NUM_RINGS = 3;
  //   const RINGS_MAX_R = 5; // deg
  //   const RING_PROPAGATION_SPEED = 5; // deg/sec

  // const ARC_REL_LEN = 0.5; // relative to whole arc
  // const FLIGHT_TIME = 4000;
  // const NUM_RINGS = 2;
  // const RINGS_MAX_R = 3; // deg
  // const RING_PROPAGATION_SPEED = 5; // deg/sec
  const ARC_REL_LEN = 0.8; // relative to whole arc
  const FLIGHT_TIME = 1000;
  const NUM_RINGS = 1;
  const RINGS_MAX_R = 5; // deg
  const RING_PROPAGATION_SPEED = 5; // deg/sec
  useEffect(() => {
    setCities(airportHistory.airports);
    setHexaPolygonPoints(countries.features);
    setArcsData(travelHistory.flights); //remove it when using emit arc function
    setInventoryPoints(InventoryPoints);
    setDispatchPoints(DispatchPoints.dispatchPoints);
  }, []);

  // const emitArc = () => {
  //   // random lat/lng
  //   const min = Math.ceil(1);
  //   const max = Math.floor(34);
  //   const random1 = Math.floor(Math.random() * (max - min) + min);
  //   // const random2 = Math.floor(Math.random() * (max - min) + min);

  //   const startLat = travelHistory.flights[count].startLat;
  //   const startLng = travelHistory.flights[count].startLng;
  //   const endLat = travelHistory.flights[count].endLat;
  //   const endLng = travelHistory.flights[count].endLng;
  //   const from = travelHistory.flights[count].from;
  //   const to = travelHistory.flights[count].to;
  //   // add and remove arc after 1 cycle
  //   const arc = { startLat, startLng, endLat, endLng, from, to };
  //   setArcsData((arcsData) => [...arcsData, arc]);
  //   setTimeout(
  //     () => setArcsData((arcsData) => arcsData.filter((d) => d !== arc)),
  //     FLIGHT_TIME * 2
  //   );

  //   // add and remove start rings
  //   // const srcRing = { lat: startLat, lng: startLng };
  //   // setRingsData((ringsData) => [...ringsData, srcRing]);
  //   // setTimeout(
  //   //   () => setRingsData((ringsData) => ringsData.filter((r) => r !== srcRing)),
  //   //   FLIGHT_TIME * ARC_REL_LEN
  //   // );

  //   // add and remove target rings
  //   setTimeout(() => {
  //     const targetRing = { lat: endLat, lng: endLng };
  //     setRingsData((ringsData) => [...ringsData, targetRing]);
  //     setTimeout(
  //       () =>
  //         setRingsData((ringsData) =>
  //           ringsData.filter((r) => r !== targetRing)
  //         ),
  //       FLIGHT_TIME * ARC_REL_LEN
  //     );
  //   }, FLIGHT_TIME);

  //   // trigger useEffect
  //   setCount(count + 1);
  // };

  // improved fucntion of emit arc
  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     emitArc();
  //   }, 2000);
  //   return () => {
  //     clearTimeout(timeout);
  //   };
  // }, [count]);
  // const emitArc = () => {
  //   const min = Math.ceil(1);
  //   const max = Math.floor(34);
  //   const random1 = Math.floor(Math.random() * (max - min) + min);
  //   // const random2 = Math.floor(Math.random() * (max - min) + min);

  //   const startLat = travelHistory?.flights[random1]?.startLat;
  //   const startLng = travelHistory?.flights[random1]?.startLng;
  //   const endLat = travelHistory?.flights[random1]?.endLat;
  //   const endLng = travelHistory?.flights[random1]?.endLng;

  //   // add and remove arc after 1 cycle
  //   const arc = { startLat, startLng, endLat, endLng };
  //   setArcsData((curArcsData) => [...curArcsData, arc]);
  //   setTimeout(
  //     () => setArcsData((curArcsData) => curArcsData.filter((d) => d !== arc)),
  //     FLIGHT_TIME * 2
  //   );

  //   // add and remove target rings
  //   setTimeout(() => {
  //     const targetRing = { lat: endLat, lng: endLng };
  //     setRingsData((curRingsData) => [...curRingsData, targetRing]);
  //     setTimeout(
  //       () =>
  //         setRingsData((curRingsData) =>
  //           curRingsData.filter((r) => r !== targetRing)
  //         ),
  //       FLIGHT_TIME * ARC_REL_LEN
  //     );
  //   }, FLIGHT_TIME);

  //   setCount(count + 1);
  // };

  var CustomGlobe = new ThreeGlobe({
    waitForGlobeReady: true,
    animateIn: true,
  });
  const date = new Date();
  const timeZoneOffset = date.getTimezoneOffset() || 0;
  const timeZoneMaxOffset = 60 * 12;
  CustomGlobe.rotateY(-Math.PI * (timeZoneOffset / timeZoneMaxOffset));
  CustomGlobe.rotateZ(-Math.PI / 6);

  // rotationOffset.y = ROTATION_OFFSET.y + Math.PI * (timeZoneOffset / timeZoneMaxOffset);
  var globeMaterial = CustomGlobe.globeMaterial();
  useEffect(() => {
    var renderer, camera, scene, controls;

    globeMaterial.color = new Color(0x231773);
    globeMaterial.emissive = new Color(0x231773);
    globeMaterial.emissiveIntensity = 0.1;
    globeMaterial.shininess = 0.7;

    // globeMaterial.controls().autoRotate = true;
    // globeMaterial.controls().autoRotateSpeed = 1;
    // globeMaterial.controls().enableZoom = false;
    // globeMaterial.controls().minPolarAngle = 1;
    // globeMaterial.controls().maxPolarAngle = 2;
    const globe = globeEl.current;

    // Initialize scene, light
    scene = new Scene();
    scene.add(new AmbientLight(0xbbbbbb, 0.3));
    scene.background = new Color(0x040d21);

    // Initialize camera, light
    camera = new PerspectiveCamera();
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    var dLight = new DirectionalLight(0xfffff, 0.5);
    dLight.position.set(-600, 1500, 200);
    camera.add(dLight);

    // const light = new HemisphereLight(0xffffbb, 0x080820, 0.33);
    // camera.add(light);

    // var dLight1 = new DirectionalLight(0x231773, 1);
    // dLight1.position.set(-200, 800, 200);
    // camera.add(dLight1);

    // var dLight2 = new PointLight(0x231773, 0.5);
    // dLight2.position.set(-200, 500, 200);
    // camera.add(dLight2);

    // const spotLight = new SpotLight(0xffffff);
    // spotLight.position.set(100, 1000, 100);

    // spotLight.castShadow = true;

    // spotLight.shadow.mapSize.width = 1024;
    // spotLight.shadow.mapSize.height = 1024;

    // spotLight.shadow.camera.near = 0;
    // spotLight.shadow.camera.far = 0;
    // spotLight.shadow.camera.fov = 0;

    // camera.add(spotLight);

    globe.scene().add(camera); // add lights to the globe
  }, []);
  const pointOpacity = 0.66;
  const OPACITY = 0.44;

  return (
    <Globe
      pointsData={cities}
      pointLabel={(d) => d.city}
      // pointColor={(d) => d.pointColor || undefined}
      pointColor={(d) => `rgba(255, 255, 255, ${pointOpacity})`}
      labelsData={inventoryPoints.inventoryPoints}
      pointAltitude={0.13}
      labelLat={(d) => d.lat}
      labelLng={(d) => d.lng}
      labelAltitude={0.001}
      // labelText={(d) => d.city}
      pointRadius={0.15}
      labelSize={0}
      labelDotRadius={0.5}
      labelColor={(d) => d.pointColor}
      labelResolution={2} // globeImageUrl="https://unpkg.com/three-globe@2.24.7/example/img/earth-night.jpg"
      hexPolygonsData={useCallback(hexapolygonPoints, [hexapolygonPoints])} //adds dot to the globe
      globeMaterial={useCallback(globeMaterial, [])}
      hexPolygonColor={(d) => `rgba(255, 255, 255, ${OPACITY})`}
      hexPolygonResolution={3}
      ref={globeEl}
      //   onGlobeReady={generatingRings}
      hexPolygonMargin={0.65}
      showAtmosphere={true}
      atmosphereColor={"#101023"}
      atmosphereAltitude={0.25}
      arcsData={arcsData}
      arcColor={useCallback((e) => {
        return (
          [e.arcPrimaryColor, e.arcSecondaryColor, e.arcSupportingColor] ||
          undefined
        );
      }, [])}
      arcAltitude={(e) => {
        return e.arcAlt;
      }}
      arcStroke={(e) => {
        return e.arcStroke;
      }}
      arcDashLength={(e) => {
        return e.arcLength;
      }}
      // arcLabel={(d) =>
      //   `  <div class="arc-label">
      //       ${d.from}: ${d.to} &#8594; ${d.to}
      //     </div>`
      // }
      arcDashGap={2}
      arcDashAnimateTime={2000}
      arcsTransitionDuration={2000}
      arcDashInitialGap={(e) => e.order * 1}
      ringsData={dispatchPoints}
      ringColor={(d) => d.pointColor}
      ringResolution={1000}
      ringMaxRadius={1}
      ringPropagationSpeed={2}
      ringRepeatPeriod={(FLIGHT_TIME * ARC_REL_LEN) / NUM_RINGS}
      onArcClick={(e) => {
        if (e.url) {
          window.open(e.url);
        }
      }}
    />
  );
};

export default PackgexGlobe;
