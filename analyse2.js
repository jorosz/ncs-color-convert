var deltae=require('deltae');

function ncsToRgb(ncs){
  var black, chroma, bc, percent, black1, chroma1, red1, factor1, blue1, red1, red2, green2, blue2, max, factor2, grey, r, g, b; 
  ncs = ncs.replace(/^\s+|\s+$/g, '').toUpperCase();
  ncs = ncs.replace("(", "");
  ncs = ncs.replace(")", "");
  ncs = ncs.replace("NCS", "NCS ");
  ncs = ncs.replace(/  /g, " ");  
  if (ncs.indexOf("NCS") == -1) {ncs = "NCS " + ncs;}
  ncs = ncs.match(/^(?:NCS|NCS\sS)\s(\d{2})(\d{2})-(N|[A-Z])(\d{2})?([A-Z])?$/);
  if (ncs === null) return false;
  black = parseInt(ncs[1], 10);
  chroma = parseInt(ncs[2], 10);
  bc = ncs[3];
  if (bc != "N" && bc != "Y" && bc != "R" && bc != "B" && bc != "G") {return false;}
  percent = parseInt(ncs[4], 10) || 0;
  if (bc !== 'N') {
    black1 = (1.05 * black - 5.25);
    chroma1 = chroma;
    if (bc === 'Y' && percent <= 60) {
      red1 = 1;
    } else if (( bc === 'Y' && percent > 60) || ( bc === 'R' && percent <= 80)) {
      if (bc === 'Y') {
        factor1 = percent - 60;
      } else {
        factor1 = percent + 40;
      }
      red1 = ((Math.sqrt(14884 - Math.pow(factor1, 2))) - 22) / 100;
    } else if ((bc === 'R' && percent > 80) || (bc === 'B')) {
      red1 = 0;
    } else if (bc === 'G') {
      factor1 = (percent - 170);
      red1 = ((Math.sqrt(33800 - Math.pow(factor1, 2))) - 70) / 100;
    }
    if (bc === 'Y' && percent <= 80) {
      blue1 = 0;
    } else if (( bc === 'Y' && percent > 80) || ( bc === 'R' && percent <= 60)) {
      if (bc ==='Y') {
        factor1 = (percent - 80) + 20.5;
      } else {
        factor1 = (percent + 20) + 20.5;
      }
      blue1 = (104 - (Math.sqrt(11236 - Math.pow(factor1, 2)))) / 100;
    } else if ((bc === 'R' && percent > 60) || ( bc === 'B' && percent <= 80)) {
      if (bc ==='R') {
        factor1 = (percent - 60) - 60;
      } else {
        factor1 = (percent + 40) - 60;
      }
      blue1 = ((Math.sqrt(10000 - Math.pow(factor1, 2))) - 10) / 100;
    } else if (( bc === 'B' && percent > 80) || ( bc === 'G' && percent <= 40)) {
      if (bc === 'B') {
        factor1 = (percent - 80) - 131;
      } else {
        factor1 = (percent + 20) - 131;
      }
      blue1 = (122 - (Math.sqrt(19881 - Math.pow(factor1, 2)))) / 100;
    } else if (bc === 'G' && percent > 40) {
      blue1 = 0;
    }
    if (bc === 'Y') {
      green1 = (85 - 17/20 * percent) / 100;
    } else if (bc === 'R' && percent <= 60) {
      green1 = 0;
    } else if (bc === 'R' && percent > 60) {
      factor1 = (percent - 60) + 35;
      green1 = (67.5 - (Math.sqrt(5776 - Math.pow(factor1, 2)))) / 100;
    } else if (bc === 'B' && percent <= 60) {
      factor1 = (1*percent - 68.5);
      green1 = (6.5 + (Math.sqrt(7044.5 - Math.pow(factor1, 2)))) / 100;
    } else if ((bc === 'B' && percent > 60) || ( bc === 'G' && percent <= 60)) {
      green1 = 0.9;
    } else if (bc === 'G' && percent > 60) {
      factor1 = (percent - 60);
      green1 = (90 - (1/8 * factor1)) / 100;
    }
    factor1 = (red1 + green1 + blue1)/3;
    red2 = ((factor1 - red1) * (100 - chroma1) / 100) + red1;
    green2 = ((factor1 - green1) * (100 - chroma1) / 100) + green1;
    blue2 = ((factor1 - blue1) * (100 - chroma1) / 100) + blue1;
    if (red2 > green2 && red2 > blue2) {
      max = red2;
    } else if (green2 > red2 && green2 > blue2) {
      max = green2;
    } else if (blue2 > red2 && blue2 > green2) {
      max = blue2;
    } else {
      max = (red2 + green2 + blue2) / 3;
    }
    factor2 = 1 / max;
    r = parseInt((red2 * factor2 * (100 - black1) / 100) * 255, 10);
    g = parseInt((green2 * factor2 * (100 - black1) / 100) * 255, 10);
    b = parseInt((blue2 * factor2 * (100 - black1) / 100) * 255, 10);
    if (r > 255) {r = 255;}
    if (g > 255) {g = 255;}
    if (b > 255) {b = 255;}
    if (r < 0) {r = 0;}
    if (g < 0) {g = 0;}
    if (b < 0) {b = 0;}
  } else {
    grey = parseInt((1 - black / 100) * 255, 10);
    if (grey > 255) {grey = 255;}
    if (grey < 0) {grey = 0;}
    r = grey;
    g = grey;
    b = grey;
  }
  return [ r, g, b ];
}
                   
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
  //
  var c1 = ['10','15','17','20'];
  var c2 = ['02','05','06','10'];
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
          let rgb = ncsToRgb(ncs);
          let hex = rgb2hex(rgb).toUpperCase();
          deltae.delta(hex,"#D8D1C5",function (diff) {
            console.log(diff+" "+ncs+" = "+hex);                    
          });
      }
    }
  }
}

convert();
