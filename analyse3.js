'use strict';

var deltae=require('deltae');
var request = require('request-json');
var client = request.createClient('https://www.fargtorget.se/');
var async = require('async');

var main = function() {

  var c1 = ['05','10','15','20'];
  var c2 = ['02','05','10','15'];
  var c3 = ['Y','Y10R','Y20R','Y30R','Y40R','Y50R','Y60R','Y70R','Y80R','Y90R',
             'R','R10B','R20B','R30B','R40B','R50B','R60B','R70B','R80B','R90B',
             'B','B10G','B20G','B30G','B40G','B50G','B60G','B70G','B80G','B90G',
             'G','G10Y','G20Y','G30Y','G40Y','G50Y','G60Y','G70Y','G80Y','G90Y',
              'N'];

  var ncs_codes=[];
  
  for (let s1 of c1) 
    for (let s2 of c2) 
      for (let s3 of c3) 
        ncs_codes.push(""+s1+s2+"-"+s3);

  async.eachLimit(ncs_codes,10,function(ncs, next) {
        client.get('/colorsearch/IN2/'+ncs, function(err,res,body) {
          if (body.rgb) {
            deltae.delta(body.rgb,"#D8D1C5",function (diff) {
              console.log(diff+" "+ncs+" = "+body.rgb);
            });
          }
          next();
        });
  }, function (err) {
    if (err) throw err;
  });         
}

main();
