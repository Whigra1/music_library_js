<template>
  <div id="three-container"></div>
</template>

<script>
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import urlProvider from "@/providers/UrlProvider.js";

let scene = null
let camera = null
let renderer = null
let mixer = null
let clock = null

let gltfModel = null

export default {
  name: 'AIModel',
  props: {
    animation: {
      type: Number,
      required: true,
      default: 1,
    }
  },

  watch: {
    animation (newVal) {
      mixer = new THREE.AnimationMixer(gltfModel.scene);
      const action = mixer.clipAction(gltfModel.animations[newVal]);
      action.play();
    }
  },

  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
      mixer: null,
      clock: null
    }
  },
  mounted() {
    this.init()
    this.animate()
  },
  methods: {
    init() {
      const { width, height } = { width: 500, height: 800 }
      const container = document.getElementById('three-container');
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 500);

      camera.position.set(3, 1, 2)

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      container.appendChild(renderer.domElement);

      // Add lighting
      // const light = new THREE.DirectionalLight(0x00FF00, 1);
      // light.position.set(3, 8, 1).normalize();
      // scene.add(light);

      const ambientLight = new THREE.AmbientLight(undefined, 100);
      const pointLight = new THREE.PointLight(undefined, 100, 100);
      const spotLight = new THREE.SpotLight(undefined, 100);

      spotLight.position.set(0, 3, -10);
      spotLight.angle = 0.3

      pointLight.position.set(50,50,50).normalize();
      pointLight.distance = 10;

      ambientLight.position.set(0, 5, -10);

      scene.add(spotLight);
      scene.add(pointLight);
      scene.add(ambientLight);

      console.dir({
        spotLightPos: spotLight.position,
        pointLightPos: pointLight.position,
        ambientLightPos: ambientLight.position
      })

      const path = urlProvider.getFullUrlForEndpoint('Alfred/model');
      // Load GLB model
      const loader = new GLTFLoader();
      loader.withCredentials = true;
      loader.load(
        path.toString(),
        gltf => {
          gltfModel = gltf;
          const model = gltf.scene;
          scene.add(model);

          if (gltf.animations.length > 0) {
            console.log(gltf.animations)
            mixer = new THREE.AnimationMixer(model);
            const action = mixer.clipAction(gltf.animations[this.animation]);
            action.play();
          }
        },
        (e) => {
          // console.log(e)
        },
        (error) => console.error(error)
      );

      clock = new THREE.Clock();
    },
    animate() {
      requestAnimationFrame(this.animate);

      if (mixer) {
        mixer.update(clock.getDelta());
      }

      renderer.render(scene, camera);
    }
  }
}
</script>

<style>
#three-container {
  width: 100%;
  height: 100vh;
}
</style>
