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

// void main()
// {
//     //  float t = time * 1.25;
//     // vec2 screenUv = ((gl_FragCoord / iResolution.xy) - 0.5) * 2.0;
//       // Normalized pixel coordinates (from 0 to 1)
//   //  vec2 uv = vec2(vTextureCoord.x, 1.-vTextureCoord.y);

//   //   // Time varying pixel color
//   //   vec3 col = 0.5 + 0.5*cos(time+uv.xyx+vec3(0,2,4));

//   //   // Output to screen
//   //   gl_FragColor = vec4(col,0.1);


//     // gl_FragColor = vec4(1,1,1,1.0);


//     	float s = 0.0, v = 0.0;
// 	vec2 uv = (vec2(vTextureCoord.x, 1.-vTextureCoord.y)) * 2.0 - 1.;
//     float time = (time-2.0)*58.0;
// 	vec3 col = vec3(0);
//     vec3 init = vec3(sin(time * .0032)*.3, .35 - cos(time * .005)*.3, time * 0.002);
// 	for (int r = 0; r < 100; r++) 
// 	{
// 		vec3 p = init + s * vec3(uv, 0.05);
// 		p.z = fract(p.z);
//         // Thanks to Kali's little chaotic loop...
// 		for (int i=0; i < 10; i++)	p = abs(p * 2.04) / dot(p, p) - .9;
// 		v += pow(dot(p, p), .7) * .06;
// 		col +=  vec3(v * 0.2+.4, 12.-s*2., .1 + v * 1.) * v * 0.00003;
// 		s += .025;
// 	}
// 	gl_FragColor = vec4(clamp(col, 0.0, 1.0), .1);

// }


#define tau 6.2831853

mat2 makem2(in float theta){float c = cos(theta);float s = sin(theta);return mat2(c,-s,s,c);}
float noise( in vec2 x ){return texture2D(uSampler, x*.01).x;}

float fbm(in vec2 p)
{	
	float z=2.;
	float rz = 0.;
	vec2 bp = p;
	for (float i= 1.;i < 6.;i++)
	{
		rz+= abs((noise(p)-0.5)*2.)/z;
		z = z*2.;
		p = p*2.;
	}
	return rz;
}

float dualfbm(in vec2 p)
{
    //get two rotated fbm calls and displace the domain
	vec2 p2 = p*.7;
	vec2 basis = vec2(fbm(p2-time*1.6),fbm(p2+time*1.7));
	basis = (basis-.5)*.2;
	p += basis;
	
	//coloring
	return fbm(p*makem2(time*0.2));
}

float circ(vec2 p) 
{
	float r = length(p);
	r = log(sqrt(r));
	return abs(mod(r*4.,tau)-3.14)*3.+.2;

}

void main(  )
{
	//setup system
	vec2 p =vec2(vTextureCoord.x, 1.-vTextureCoord.y)-0.5;
	p.x *= vec2(vTextureCoord.x, 1.-vTextureCoord.y);
	p*=4.;
	
    float rz = dualfbm(p);
	
	//rings
	p /= exp(mod(time*10.,3.14159));
	rz *= pow(abs((0.1-circ(p))),.9);
	
	//final color
	vec3 col = vec3(.2,0.1,0.4)/rz;
	col=pow(abs(col),vec3(.99));
	gl_FragColor = vec4(col,1.);
}