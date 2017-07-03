'use strict';

var deltae=require('deltae');

var hues = {
    'r':   0,
    'y':  60,
    'g': 120,
    'b': 240
};

var ncsRgx = /^(.* )?\d{4}-[rgby](\d{2}[rgby])?$/;

var ncs2hsv = function(ncs) {
    ncs = ncs.toLowerCase();
    var h, s, v, p1, p2, frac, lastSpace;
    
    if (!ncsRgx.test(ncs)) {
        throw 'NCS color should be in the form\n####-(RGBY)[##(RGBY)]';
    }
    
    // strip irrelevant part
    lastSpace = ncs.lastIndexOf(' ');
    if (lastSpace !== -1) {
        ncs = ncs.substring(lastSpace + 1);
    }
    
    // extract darkness (opposite of value, in 0-100)
    v = parseInt(ncs.substring(0, 2), 10);
    v = (100 - v);
    
    // saturation, in 0-100
    s = parseInt(ncs.substring(2, 4), 10);
    
    // hue from primitive color(s)
    h = ncs.substring(5);
    if (h.length === 1) {
        h = hues[h];
    }
    else {
        p1 = h.charAt(0);
        p2 = h.charAt(3);
        p1 = hues[p1];
        p2 = hues[p2];
        frac = h.substring(1, 3);
        frac = parseInt(frac, 10) * 0.01;
        h = p1*frac + p2*(1-frac);
        h = Math.round(h);
    }
    return [h, s, v]; // 0-360, 0-100, 0-100
};
    
var hsv2rgb = function (h, s, v) {// here s and v are 0-1
    var r, g, b;
    h = h % 360;
    if (s === 0) {    // achromatic
        r = v; g = v; b = v;
    }
    else {            // chromatic color
        var hTemp = h / 60;               // h is now in [0,6]
        var i = Math.floor(hTemp);        // largest integer <= h
        var f = hTemp - i;                // fractional part of h
        var p = v * (1 - s);
        var q = v * (1 - (s * f));
        var t = v * (1 - (s * (1 - f)));
        switch (i) {
            case 0: r = v; g = t; b = p; break;
            case 1: r = q; g = v; b = p; break;
            case 2: r = p; g = v; b = t; break;
            case 3: r = p; g = q; b = v; break;
            case 4: r = t; g = p; b = v; break;
            case 5: r = v; g = p; b = q; break;
        }
    }
    return [
        Math.round(r * 255),
        Math.round(g * 255),
        Math.round(b * 255)
    ]; // channels in [0, 1]->[0, 255]
};
                   
var rgb2hex = function(rgb) {
    rgb = rgb[2] | (rgb[1] << 8) | (rgb[0] << 16);
    rgb = rgb.toString(16);
    while (rgb.length < 6) {rgb = '0' + rgb;}
    return '#' + rgb;
};

var convert = function() {
  
  // var c1 = ['08','09','10','11','12','13','14','15','16','17','18','19','20'];
  // var c2 = ['01','02','03','04','05','06','07','08','09','10'];
  // var c3 = ['Y','Y10R','Y20R','Y30R','Y40R','Y50R','Y60R','Y70R','Y80R','Y90R',
  //           'R','R10B','R20B','R30B','R40B','R50B','R60B','R70B','R80B','R90B',
  //           'B','B10G','B20G','B30G','B40G','B50G','B60G','B70G','B80G','B90G',
  //           'G','G10Y','G20Y','G30Y','G40Y','G50Y','G60Y','G70Y','G80Y','G90Y',
  //           ];

  var c1 = ['05','10','15','20','17'];
  var c2 = ['02','05','10','15','06'];
  var c3 = ['Y','Y10R','Y20R','Y30R','Y40R','Y50R','Y60R','Y70R','Y80R','Y90R',
             'R','R10B','R20B','R30B','R40B','R50B','R60B','R70B','R80B','R90B',
             'B','B10G','B20G','B30G','B40G','B50G','B60G','B70G','B80G','B90G',
             'G','G10Y','G20Y','G30Y','G40Y','G50Y','G60Y','G70Y','G80Y','G90Y',
              'Y27R'
             ];

  
  for (let s1 of c1) {
    for (let s2 of c2) {
      for (let s3 of c3) {
        let ncs = ""+s1+s2+"-"+s3;
          let hsv = ncs2hsv(ncs);   
          let rgb = hsv2rgb(hsv[0], hsv[1]*0.01, hsv[2]*0.01);
//          let dist = Math.abs(rgb[0] - 216) + Math.abs(rgb[1] - 209) + Math.abs(rgb[2] - 197);
          let dist = hsv[0];
          let hex = rgb2hex(rgb).toUpperCase();
          deltae.delta(hex,"#D8D1C5",function (diff) {
            console.log(diff+" "+ncs+" = "+hex);                    
          });
      }
    }
  }
   
}

convert();
