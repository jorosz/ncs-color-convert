'use strict';
var DeltaE = require('delta-e');


var rgb2lab = function (rgb) {
	let [R,G,B] = rgb.map( v => { 
    v /= 255;
  	v = v > 0.04045 ? Math.pow(((v + 0.055) / 1.055), 2.4) : (v / 12.92);
    return v*100;
   });
  
	let x = ((R * 0.4124) + (G * 0.3576) + (B * 0.1805));
	let y = ((R * 0.2126) + (G * 0.7152) + (B * 0.0722));
	let z = ((R * 0.0193) + (G * 0.1192) + (B * 0.9505));

  [x,y,z] = [x/ 95.047, y/100, z/108.883]; // Divide by reference values
	[x,y,z] = [x,y,z].map( v => v > 0.008856 ? Math.pow(v, 1 / 3) : (7.787 * v) + (16 / 116));

	let L = (116 * y) - 16;
	let a = 500 * (x - y);
	let b = 200 * (y - z);
  
  return [L,a,b];
}

var delta_e = function (rgb1,rgb2) {
  let lab1 = rgb2lab(rgb1);
  let lab2 = rgb2lab(rgb2);
  
  let color1 = {L: lab1[0], A: lab1[1], B: lab1[2]};
  let color2 = {L: lab2[0], A: lab2[1], B: lab2[2]};

  return DeltaE.getDeltaE00(color1, color2);  
}

var ncs2rgb = function(black,croma,color) {
  
  var ra,ga,ba,rb,gb,bb,mx,cr,sw,r,g,b;
  
  sw=Math.round(255/100*(100-black));  
  cr=croma/100;
  
  switch (color.slice(0,1)) {
  	case 'Y': ra=255; ga=255; ba=0; break;
    case 'R': ra=255; ga=0;   ba=0; break;
    case 'G': ra=0;   ga=255; ba=0; break;
    case 'B': ra=0;   ga=0;   ba=255; break;
    case 'N': ra=255; ga=255; ba=255; break;
  }
  
  switch (color.slice(-1)) {
  	case 'Y': rb=255; gb=255; bb=0; break;
    case 'R': rb=255; gb=0;   bb=0; break;
    case 'G': rb=0;   gb=255; bb=0; break;
    case 'B': rb=0;   gb=0;   bb=255; break;
    case 'N': rb=255; gb=255; bb=255; break;    
  } 
  
  if (color.length == 1) {
    mx = 1;
  } else {
    mx =  color.slice(1,-1) / 100;
  }
    
	r = Math.round( ((sw*(1-cr)) + (( ra*(1-mx) + rb*mx )*(cr))) )
	g = Math.round( ((sw*(1-cr)) + (( ga*(1-mx) + gb*mx )*(cr))) )
	b = Math.round( ((sw*(1-cr)) + (( ba*(1-mx) + bb*mx )*(cr))) )
  
  return [r,g,b];

};

var delta = function (rgb1, rgb2) {
  // Quicker delta function
  let lab1 = rgb2lab(rgb1);
  let lab2 = rgb2lab(rgb2);
  
  return Math.sqrt(Math.pow(lab1[0]-lab2[0],2)+Math.pow(lab1[1]-lab2[1],2)+Math.pow(lab1[2]-lab2[2],2));
  
}

var rgb2hex = function(rgb) {
    rgb = rgb[2] | (rgb[1] << 8) | (rgb[0] << 16);
    rgb = rgb.toString(16);
    while (rgb.length < 6) {rgb = '0' + rgb;}
    return '#' + rgb;
};

var rgb2ncs = function(base_color) {
  let mindiff=Infinity, winner=[];
  var compute = function(ncs) {
    // Computation callback function
    let rgb = ncs2rgb.apply(this,ncs);
    let diff = delta(rgb,base_color);      
    if (diff < mindiff) {
//        console.log("New value "+diff.toFixed(2)+" "+ncs+" = "+rgb2hex(rgb)+" vs "+rgb2hex(base_color));
        mindiff = diff;
        winner = ncs;        
      }
  }
  
  // Brute force iterator to find best matching value
  for (let black=0; black<=99; black+=1) {
    for (let croma=0; croma<=99; croma+=1) {
      for (let shade=0; shade<=99; shade+=1) {
        for (let combo of ['YR','RB','BG','GY']) {
          let color = combo.slice(0,1)+shade+combo.slice(-1);
          compute([black,croma,color]);
        }
        for (let color of ['Y','R','B','G','N']) {
          compute([black,croma,color]);
        }
      }
    }
  }
  
  return winner;     
}

var compare_ncs_rgb = function(ncs,rgb) {
  let ncs_rgb = ncs2rgb.apply(this,ncs);
  return delta_e(ncs_rgb,rgb);
}

var compare_ncs_ncs = function(ncs,ncs2) {
  let ncs_rgb = ncs2rgb.apply(this,ncs);
  let ncs_rgb2 = ncs2rgb.apply(this,ncs2);
  return delta_e(ncs_rgb,ncs_rgb2);
}

module.exports = {
  compare_ncs_rgb: compare_ncs_rgb,
  compare_ncs_ncs: compare_ncs_ncs,
  rgb2ncs: rgb2ncs,
  ncs2rgb: ncs2rgb,
  rgb2hex: rgb2hex
}


