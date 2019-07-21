var e3d = function() {
 var Memory = function ( id ) {
    var div = document.createElement( 'div' );
    div.style.backgroundColor = '#000';
    var e3dPage = document.createElement( 'div' );
    div.appendChild(e3dPage);
    e3dPage.id = id;
    e3dPage.style.width = '480px';
    e3dPage.style.height = '400px';
    e3dPage.style.backgroundColor = '#00f';
    e3dPage.selected = false;
    var e3d = new CSS3DObject( div );
    e3dPage.E3DParent = e3d; 
    e3dPage.E3DParent.position.editing=false;
    var editor = document.createElement('div');
    e3dPage.E3DParent.position.edit = function()
    {
            editor.hidden = !e3dPage.E3DParent.position.editing;
            e3dPage.hidden = !editor.hidden;
    }
    e3dPage.addEventListener('click', function()
    {
        var bc;
        e3dPage.selected = !e3dPage.selected;
        if(e3dPage.selected) {
            bc = '#f0f';
            mover = e3dPage.E3DParent.position;
        } else {
            bc = '#00f';
            mover = camPos;
        }
        e3dPage.style.backgroundColor = bc;
    });

    var iframe = document.createElement( 'iframe' );
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
    var edits = [{
		name: "Source",
		field: iframe.src,
		type: "text",
        value: iframe.src
    }];
    
    
    e3dPage.appendChild( iframe );

    editor.appendChild(MakeEditable(edits));
    editor.style.width = '480px';
    editor.style.height = '360px';
    editor.style.border = '10px';
    editor.hidden = true;
 
    div.appendChild(editor);
    return e3d;
};

var Element = function ( id, x, y, z) {

    let object = new Memory( id );
    object.target = new THREE.Group();
    object.position.set( x, y, z );
    object.target.position.setX(object.position.x);
    object.target.position.setY(object.position.y);
    object.target.position.setZ(object.position.z);

    return object;
}

module.exports = {
    e3d:e3d
}

module.exports = e3d; 
}
export default e3d;

