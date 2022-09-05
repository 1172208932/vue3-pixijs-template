varying vec2 vTextureCoord;
uniform vec3 iResolution;  
uniform sampler2D uSampler;
uniform vec4 filterArea;
uniform vec4 filterClamp;

uniform vec2 center;

uniform float amplitude;
uniform float wavelength;
// uniform float power;
uniform float brightness;
uniform float speed;
uniform float radius;

uniform float time;

const float PI = 3.14159;
const vec2 s = vec2(1, 1.7320508);

void main()
{
    //  float t = time * 1.25;
    // vec2 screenUv = ((gl_FragCoord / iResolution.xy) - 0.5) * 2.0;
      // Normalized pixel coordinates (from 0 to 1)
  //  vec2 uv = vec2(vTextureCoord.x, 1.-vTextureCoord.y);

  //   // Time varying pixel color
  //   vec3 col = 0.5 + 0.5*cos(time+uv.xyx+vec3(0,2,4));

  //   // Output to screen
  //   gl_FragColor = vec4(col,0.1);


    // gl_FragColor = vec4(1,1,1,1.0);


    	float s = 0.0, v = 0.0;
	vec2 uv = (vec2(vTextureCoord.x, 1.-vTextureCoord.y)) * 2.0 - 1.;
    float time = (time-2.0)*58.0;
	vec3 col = vec3(0);
    vec3 init = vec3(sin(time * .0032)*.3, .35 - cos(time * .005)*.3, time * 0.002);
	for (int r = 0; r < 100; r++) 
	{
		vec3 p = init + s * vec3(uv, 0.05);
		p.z = fract(p.z);
        // Thanks to Kali's little chaotic loop...
		for (int i=0; i < 10; i++)	p = abs(p * 2.04) / dot(p, p) - .9;
		v += pow(dot(p, p), .7) * .06;
		col +=  vec3(v * 0.2+.4, 12.-s*2., .1 + v * 1.) * v * 0.00003;
		s += .025;
	}
	gl_FragColor = vec4(clamp(col, 0.0, 1.0), .1);

}