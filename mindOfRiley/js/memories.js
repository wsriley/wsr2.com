var memMover = {
    plane: null, 
    selection: null, 
    offset: null, 
    raycaster: null,
    scene: null,
    camera: null,
    objects: null,
    controls: null,
  
    init: function(sceneIn, cameraIn, objectsIn, controlsIn = null) {
      document.addEventListener('mousedown', this.onDocumentMouseDown, false);
      document.addEventListener('mousemove', this.onDocumentMouseMove, false);
      document.addEventListener('mouseup', this.onDocumentMouseUp, false);
  
      this.plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(500, 500, 8, 8), new THREE.MeshBasicMaterial({color: 0xffffff}));
      this.plane.visible = false;
      this.camera = cameraIn;
      this.scene = sceneIn;
      this.objects = objectsIn;
      this.controls = controlsIn;
      this.offset = new THREE.Vector3();
      this.raycaster = new THREE.Raycaster();
      this.scene.add(this.plane);
    },
      
    onDocumentMouseDown: function (event) {
      var mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      var mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  
      // Get 3D vector from 3D mouse position using 'unproject' function
      var vector = new THREE.Vector3(mouseX, mouseY, 1);
      vector.unproject(this.camera);
      this.raycaster.set( this.camera.position, vector.sub( this.camera.position ).normalize() );
      var intersects = this.raycaster.intersectObjects(this.objects);
  
      if (intersects.length > 0) {
        if (this.controls)  
            this.controls.enabled = false;
        this.selection = intersects[0].object;
  
        var intersects = this.raycaster.intersectObject(this.plane);
        this.offset.copy(intersects[0].point).sub(this.plane.position);
      }
    },
  
    onDocumentMouseMove: function (event) {
      event.preventDefault();
  
      var mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      var mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  
      // Get 3D vector from 3D mouse position using 'unproject' function
      var vector = new THREE.Vector3(mouseX, mouseY, 1);
      vector.unproject(this.camera);
  
      this.raycaster.set( this.camera.position, vector.sub( this.camera.position ).normalize() );
  
      if (this.selection) {
        var intersects = this.raycaster.intersectObject(this.plane);
        // Reposition the object based on the intersection point with the plane
        this.selection.position.copy(intersects[0].point.sub(this.offset));
      } else {
        // Update position of the plane if need
        var intersects = this.raycaster.intersectObjects(this.objects);
        if (intersects.length > 0) {
          this.plane.position.copy(intersects[0].object.position);
          this.plane.lookAt(this.camera.position);
        }
      }
    },
    
    onDocumentMouseUp: function (event) {
      if (this.controls)
        this.controls.enabled = true;
      this.selection = null;
    }
  };
  