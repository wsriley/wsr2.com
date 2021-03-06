import * as THREE from './three.module.js';
import { CSS3DRenderer, CSS3DObject } from './CSS3DRenderer.js';

var memMoverCamera = null;
var memMoverOffset = new THREE.Vector3();
var memMoverRaycaster = new THREE.Raycaster();
var memMoverPlane = new THREE.Mesh(new THREE.PlaneBufferGeometry(10000, 10000, 8, 8), new THREE.MeshBasicMaterial({color: 0xffffff}));
var memMoverSelection = null; 
var memMoverControls= null;
var memMoverObjects= null;

var memMover = {
    init: function(sceneIn, cameraIn, objectsIn, controlsIn = null) {
      container.addEventListener('mousedown', this.onDocumentMouseDown, false);
      container.addEventListener('mousemove', this.onDocumentMouseMove, false);
      container.addEventListener('mouseup', this.onDocumentMouseUp, false);
  
      memMoverPlane.visible = true;
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
  




let camera, scene, renderer;

let dancingMemories = true;
let editing = false;
let camPos = {x:500,y:350,z:1750,edit:function(){}};
camPos.target = new THREE.Group();
let mover = camPos;
let selection = new THREE.Group();
let pagesGroup = new THREE.Group();

let e3dPageSelected = false;
let selectionPage = document.createElement( 'div' );

let danceThemMemories = function(memories) {
   memories.children.forEach(function(m){
        let tp = m.target.position;
        let p = m.position;
        m.position.setX(p.x + (tp.x - p.x)/16);
        m.position.setY(p.y + (tp.y - p.y)/16);
        m.position.setZ(p.z + (tp.z - p.z)/16);
    });
}

let MakeEditable = function(edits) {
    let editorDiv = document.createElement( 'div' );
	editorDiv.style.backgroundColor = '#000';
	editorDiv.style.position = 'absolute';
	editorDiv.style.left ='5px';

    let textURLElement = document.createElement('input');
    textURLElement.type = 'text';
    textURLElement.value = edits;
    textURLElement.onchange = function(e) {
        edits = textURLElement.value;
    }
    editorDiv.appendChild(textURLElement);
    return editorDiv;
}

let pagesObjects= [];

let Element = function ( id, x, y, z) {
    let div = document.createElement( 'div' );
    div.style.backgroundColor = '#000';

    let e3d = new CSS3DObject( div );
    let geometry = new THREE.Geometry();

    geometry.vertices.push(
        new THREE.Vector3( 0,  0, -1 ),
        new THREE.Vector3( 0, 400, -1 ),
        new THREE.Vector3(  480, 400, -1 ),
        new THREE.Vector3(  480, 0, -1 )
    );
    
    geometry.faces.push( new THREE.Face4( 0, 1, 2, 3 ) );    
    geometry.computeBoundingSphere();
    let material = new THREE.MeshPhongMaterial({color: Math.random() * 0xffffff});
    material.transparent = true;

    let hitMesh = new THREE.Mesh(geometry.clone(), material);
    e3d.add(hitMesh);
    e3d.target = new THREE.Group();
    e3d.position.set( x, y, z );
    e3d.target.position.set(x, y, z);

    let e3dPageDiv = document.createElement( 'div' );
    div.appendChild(e3dPageDiv);
    e3dPageDiv.id = id;
    e3dPageDiv.style.width = '480px';
    e3dPageDiv.style.height = '400px';
    e3dPageDiv.style.backgroundColor = '#00f';
    e3dPageDiv.E3DParent = e3d; 
    editing=false;

    let editor = document.createElement('div');
    e3dPageDiv.E3DParent.position.edit = function()
    {
        editing = !editing;
        editor.hidden = !editing;
        e3dPageDiv.hidden = !editor.hidden;
    }
    e3dPageDiv.addEventListener('click', function()
    {
        e3dPageSelected = true;
        mover = e3dPageDiv.position;
        selectionPage.style.backgroundColor = '#00f';
        selection = e3d;
        selectionPage = e3dPageDiv;
        selectionPage.style.backgroundColor = '#f0f';
    });

    let iframe = document.createElement( 'iframe' );
    iframe.style.width = '480px';
    iframe.style.height = '360px';
    iframe.style.border = '0px';
    iframe.style.top = '40px';
    iframe.style.position = 'absolute';
    if (id[0]=='$') {
        iframe.src = [ 'https://www.youtube.com/embed/', id.slice(1,id.length), '?rel=0' ].join( '' );
    } else {
        iframe.src = id;
    }

    e3dPageDiv.appendChild( iframe );
    editor.appendChild(MakeEditable(iframe.src));
    editor.style.width = '480px';
    editor.style.height = '360px';
    editor.style.border = '10px';
    editor.hidden = true;
 
    div.appendChild(editor);
    return e3d;
};

let packBox = function (box, deck) {
    let z = 0;
    deck.children.forEach(card => {
        card.target.position.x = 0;
        card.target.position.y = 0;
        card.target.position.z = z;
        card.position.x = 0;
        card.position.y = 0;
        card.position.z = z;
        z += 10;
    });
}

let packDeck = function (deck) {
    let z = 0;
    deck.children.forEach(card => {
        card.target.position.x = 0;
        card.target.position.y = 0;
        card.target.position.z = z;
        z += 50;
    });
}

let platDeck = function (deck) {
    let z = 0;
    deck.children.forEach(card => {
        card.target.position.x = z;
        card.target.position.y = z;
        card.target.position.z = z;
        z += 50;
    });
}

let rockDeck = function (deck) {
    deck.children.forEach(card => {
        card.rotation.x = 0;
        card.rotation.y = 0;
        card.rotation.z = 0;
    });
}

let shrinkDeck = function (deck) {
    deck.children.forEach(card => {
        card.scale.x = 0.1;
        card.scale.y = 0.1;
        card.scale.z = 0.1;
    });
}

let squareDeck = function (deck) {
    deck.children.forEach(card => {
        card.scale.x = 1.0;
        card.scale.y = 1.0;
        card.scale.z = 1.0;
    });
}

let rollDeck = function (deck) {
    deck.children.forEach(card => {
        card.rotation.x = Math.PI * Math.random();
        card.rotation.y = Math.PI * Math.random();
        card.rotation.z = Math.PI * Math.random();
    });
}

let platterDeck = function (deck) {
    deck.children.forEach(card => {
        card.target.position.x = Math.floor(Math.random() * 1000);
        card.target.position.y = Math.floor(Math.random() * 1000);
        card.target.position.z = Math.floor(Math.random() * 1000);
    });
}

let pushDeck = function (deck) {
    let x = 0;
    let y = 0;
    let z = 0;
    deck.children.forEach(card => {
        card.target.position.x = x;
        card.target.position.y = y;
        card.target.position.z = z;
        x += 500;
        if ( x > 2000 ) {
            x = 0;
            y += 500;
        }
        z += 5;
    });
}

init();
animate();

function init() {
    let container = document.getElementById( 'container' );

    camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 5000 );
    camera.position.set( mover.x, mover.y, mover.z );

    scene = new THREE.Scene();

    renderer = new CSS3DRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    let memories = [
        '$DjupjNoYRPo',
        '$z4Rp4595Akc',
        '$7ArWV8b0Y4g',
        '$pDYcIdq4OXY',
        '$DI291paS1TU',
        //'$WJtXpufm2eg',
        //'$cEgc8cOQiwc',
        './atari.html?rom=2600/1.bin',
        //'./atari.html?rom=2600/2.bin',
        //'./atari.html?rom=2600/3.bin',
        //'./atari.html?rom=2600/4.bin',
        //'./atari.html?rom=2600/5.bin',
        //'./atari.html?rom=2600/6.bin',
        //'./atari.html?rom=2600/7.bin',
        //'./atari.html?rom=2600/8.bin',
        'https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d39.23424334265292!2d-77.25284953259909!3d38.7779409859827!2m3!1f86.75000000000031!2f63.69097109342335!3f0!3m2!1i1024!2i768!4f35!5e1!3m2!1sen!2sus!4v1563782668838!5m2!1sen!2sus"'
    ];

    memories.forEach(element => {
        let e = new Element( element, Math.floor(Math.random() * 1000), Math.floor(Math.random() * 1000), Math.floor(Math.random() * 1000));
        pagesGroup.add( e );
        pagesObjects.push(e);        
    });

    scene.add( pagesGroup );

    window.addEventListener( 'keydown', onKeyDown)
    window.addEventListener( 'resize', onWindowResize, false );

    // Block iframe events when dragging camera
    let blocker = document.getElementById( 'blocker' );
    blocker.style.display = 'none';
    memMover.init(scene, camera, pagesObjects);
}

let showKeyPressCodes = false;

function onKeyDown(ev)
{
	if(!editing) {
		switch(ev.code) {
            case 'Space':pagesGroup.add( new Element( './command.html', camPos.x, camPos.y, camPos.z - 800) ); break;
            case 'Delete':
                if (e3dPageSelected) {
                    e3dPageSelected = false;
                    pagesGroup.remove(selection);
                    scene.remove(selection);
                    mover = camPos;
                }        
                break;
            case 'F2':mover.edit(); break;
			case 'ArrowLeft':mover.target.x -= 10; mover.x = mover.target.x; break;
			case 'ArrowRight':mover.target.x += 10; mover.x = mover.target.x; break;
            case 'ArrowUp':mover.target.y += 10; mover.x = mover.target.y; break;
			case 'ArrowDown':mover.target.y -= 10; mover.x = mover.target.y; break;
			case 'PageUp':mover.target.z += 10; mover.x = mover.target.z; break;
			case 'PageDown':mover.target.z -= 10; mover.x = mover.target.z; break;        

            case 'F3':dancingMemories = !dancingMemories; break;

            case 'BackQuote':packBox(pagesGroup); break;

            case 'Digit1':packDeck(pagesGroup); break;
            case 'Digit2':pushDeck(pagesGroup); break;
            case 'Digit3':platterDeck(pagesGroup); break;
            case 'Digit4':platDeck(pagesGroup); break;

            case 'KeyQ':rockDeck(pagesGroup); break;
            case 'KeyW':rollDeck(pagesGroup); break;
            case 'KeyA':shrinkDeck(pagesGroup); break;
            case 'KeyS':squareDeck(pagesGroup); break;
            case 'KeyK':showKeyPressCodes = !showKeyPressCodes; break;

            case 'Escape':window.show("http://wsr2.com://index.html"); break;
			default:if(showKeyPressCodes==true) { alert(ev.code);} break;
		}
	} else {
	switch(ev.code) {
	 		case 'F2': mover.edit(); break;
	 		case 'F3':dancingMemories = !dancingMemories; break;
	    }
	}
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
    camera.position.set( camPos.x, camPos.y, camPos.z );
    if(dancingMemories){
        //danceThemMemories(pagesGroup);
    }
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
}
