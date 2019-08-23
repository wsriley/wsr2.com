sbVertexShader = [
    "varying vec3 vWorldPosition;",
    "void main() {",
    "  vec4 worldPosition = modelMatrix * vec4( position, 1.0 );",
    "  vWorldPosition = worldPosition.xyz;",
    "  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
    "}",
    ].join("\n");
    
sbFragmentShader = [
    "uniform vec3 topColor;",
    "uniform vec3 bottomColor;",
    "uniform float offset;",
    "uniform float exponent;",
    "varying vec3 vWorldPosition;",
    "void main() {",
    "  float h = normalize( vWorldPosition + offset ).y;",
    "  gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( h, exponent ), 0.0 ) ), 1.0 );",
    "}",
    ].join("\n");
    

var skybox = {
  addSkybox: function() {
    var iSBrsize = 500;
    var uniforms = {
      topColor: {type: "c", value: new THREE.Color(0x0077ff)}, bottomColor: {type: "c", value: new THREE.Color(0xffffff)},
      offset: {type: "f", value: iSBrsize}, exponent: {type: "f", value: 1.5}
    }

    var skyGeo = new THREE.SphereGeometry(iSBrsize, 32, 32);
    skyMat = new THREE.ShaderMaterial({vertexShader: sbVertexShader, fragmentShader: sbFragmentShader, uniforms: uniforms, side: THREE.DoubleSide, fog: false});
    skyMesh = new THREE.Mesh(skyGeo, skyMat);
    this.scene.add(skyMesh);
  }
}