var THREEx	= THREEx || {};

THREEx.WindowResize	= function(renderer, camera){
	var callback	= function(){
		renderer.setSize( window.innerWidth, window.innerHeight );
		camera.aspect	= window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
	}
	window.addEventListener('resize', callback, false);
	return {
		stop	: function(){
			window.removeEventListener('resize', callback);
		}
	};
}

THREEx.WindowResize.bind	= function(renderer, camera){
	return THREEx.WindowResize(renderer, camera);
}

var renderMachine = {
  scene: null, camera: null, renderer: null,
  container: null, controls: null,
  clock: null,
  objects: [],

  init: function() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0xcce0ff, 0.0003);

    var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;

    var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 1, FAR = 1000;
    this.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    this.scene.add(this.camera);
    this.camera.position.set(100, 0, 0);
    this.camera.lookAt(new THREE.Vector3(0,0,0));

    this.renderer = new THREE.WebGLRenderer({ antialias:true });
    this.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    this.renderer.setClearColor(this.scene.fog.color);

    this.container = document.createElement('div');
    document.body.appendChild(this.container);
    this.container.appendChild(this.renderer.domElement);

    THREEx.WindowResize(this.renderer, this.camera);

    this.controls = new THREE.OrbitControls(this.camera);
    this.controls.target = new THREE.Vector3(0, 0, 0);
    this.controls.maxDistance = 150;

    this.clock = new THREE.Clock();

    this.scene.add( new THREE.AmbientLight(0x444444));

    var dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(200, 200, 1000).normalize();
    this.camera.add(dirLight);
    this.camera.add(dirLight.target);

    //this.addSkybox();

    var object, material, radius;
    var objGeometry = new THREE.SphereGeometry(1, 24, 24);
    for (var i = 0; i < 50; i++) {
      material = new THREE.MeshPhongMaterial({color: Math.random() * 0xffffff});
      material.transparent = true;
      object = new THREE.Mesh(objGeometry.clone(), material);
      this.objects.push(object);

      radius = Math.random() * 4 + 2;
      object.scale.x = radius;
      object.scale.y = radius;
      object.scale.z = radius;

      object.position.x = Math.random() * 50 - 25;
      object.position.y = Math.random() * 50 - 25;
      object.position.z = Math.random() * 50 - 25;

      this.scene.add(object);
    }
    return this.scene;
  }
}

function animate() {
  requestAnimationFrame(animate);
  render();
  update();
}

function update() {
  var delta = renderMachine.clock.getDelta();
  renderMachine.controls.update(delta);
}

function render() {
  if (renderMachine.renderer) {
    renderMachine.renderer.render(renderMachine.scene, renderMachine.camera);
  }
}

function initializeMemories() {
  var rScene = renderMachine.init();
  memMover.init(rScene, renderMachine.camera, renderMachine.objects, renderMachine.controls);
  animate();
}

if (window.addEventListener)
  window.addEventListener('load', initializeMemories, false);
else if (window.attachEvent)
  window.attachEvent('onload', initializeMemories);
else window.onload = initializeMemories;
