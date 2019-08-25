var memMoverCamera = null;
var memMoverOffset = new THREE.Vector3();
var memMoverRaycaster = new THREE.Raycaster();
var memMoverPlane = new THREE.Mesh(new THREE.PlaneBufferGeometry(500, 500, 8, 8), new THREE.MeshBasicMaterial({color: 0xffffff}));
var memMoverSelection = null; 
var memMoverControls= null;
var memMoverObjects= null;

var memMover = {
    init: function(sceneIn, cameraIn, objectsIn, controlsIn = null) {
      document.addEventListener('mousedown', this.onDocumentMouseDown, false);
      document.addEventListener('mousemove', this.onDocumentMouseMove, false);
      document.addEventListener('mouseup', this.onDocumentMouseUp, false);
  
      memMoverPlane.visible = false;
      memMoverCamera = cameraIn;
      memMoverObjects = objectsIn;
      memMoverControls = controlsIn;
      sceneIn.add(memMoverPlane);
    },
      
    onDocumentMouseDown: function (event) {
      var mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      var mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  
      // Get 3D vector from 3D mouse position using 'unproject' function
      var vector = new THREE.Vector3(mouseX, mouseY, 1);
      vector.unproject(memMoverCamera);
      memMoverRaycaster.set( memMoverCamera.position, vector.sub( memMoverCamera.position ).normalize() );
      var intersects = memMoverRaycaster.intersectObjects(memMoverObjects);
  
      if (intersects.length > 0) {
        if (memMoverControls)  
            memMoverControls.enabled = false;
        memMoverSelection = intersects[0].object;
  
        var intersects = memMoverRaycaster.intersectObject(memMoverPlane);
        memMoverOffset.copy(intersects[0].point).sub(memMoverPlane.position);
      }
    },
  
    onDocumentMouseMove: function (event) {
      event.preventDefault();
  
      var mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      var mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  
      // Get 3D vector from 3D mouse position using 'unproject' function
      var vector = new THREE.Vector3(mouseX, mouseY, 1);
      vector.unproject(memMoverCamera);
  
      memMoverRaycaster.set( memMoverCamera.position, vector.sub( memMoverCamera.position ).normalize() );
  
      if (memMoverSelection) {
        var intersects = memMoverRaycaster.intersectObject(memMoverPlane);
        // Reposition the object based on the intersection point with the plane
        memMoverSelection.position.copy(intersects[0].point.sub(memMoverOffset));
      } else {
        // Update position of the plane if need
        var intersects = memMoverRaycaster.intersectObjects(memMoverObjects);
        if (intersects.length > 0) {
          memMoverPlane.position.copy(intersects[0].object.position);
          memMoverPlane.lookAt(memMoverCamera.position);
        }
      }
    },
    
    onDocumentMouseUp: function (event) {
      if (memMoverControls)
        memMoverControls.enabled = true;
      memMoverSelection = null;
    }
  };
  