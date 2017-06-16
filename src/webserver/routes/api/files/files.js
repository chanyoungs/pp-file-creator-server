String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g,"");
}
String.prototype.ltrim = function() {
	return this.replace(/^\s+/,"");
}
String.prototype.rtrim = function() {
	return this.replace(/\s+$/,"");
}

function copyObj(obj) {
  return JSON.parse(JSON.stringify(obj));
}

const router = require('express').Router();
const ProPresenter = require('../../../../utils/ProPresenter');
const XmlParser = require('../../../../utils/XmlParser');
const fs = require('fs');

const mongoose = require('mongoose');

const Presentation = mongoose.model('Presentation');

router.post('/', (req, res) => {
  console.log(req.body)
  if (!req.body || typeof(req.body.slides) == 'undefined') {
    return res.status(400).send('request format invalid');
  }
  
  var template = undefined, doc = undefined;
  
  template = JSON.parse(fs.readFileSync('./src/tempPP/Template.json', "utf-8"));
  t = template['RVTemplateDocument'];
  doc = JSON.parse(fs.readFileSync('./src/tempPP/Document.json', "utf-8"));
  d = doc['RVPresentationDocument'];
  
  // format the document from template
  d['$'].height = t['$'].height;
  d['$'].width = t['$'].width;
  
  
  
  // TODO: get this dynamically depending on template
  var rtfStart = ProPresenter.decode(t['slides'][0]['RVDisplaySlide'][0]['displayElements'][0]['RVTextElement'][0]['$']['RTFData']);
  var pos = rtfStart.lastIndexOf('\\cf1');
  if (pos == -1) {
    pos = rtfStart.lastIndexOf('\\cf0');
  }
  rtfStart = rtfStart.substring(0, pos+5);
  
  // get a starting point
  // const BASE_SLIDE = d['groups'][0]['RVSlideGrouping'][0]['slides'][0]['RVDisplaySlide'][0];
  const BASE_SLIDE = t['slides'][0]['RVDisplaySlide'][0];
  // TODO: remove all other slides properly
  slidesGroup = [];
  
  for (var i = 0; i < req.body.slides.length; i++) {
    console.log(i);
    const slide = req.body.slides[i];
    let rtfData = ProPresenter.ConvertHtmlToRtf(slide.htmlContent);

    let proSlide = copyObj(BASE_SLIDE);
    rtfData = rtfStart + rtfData + '}';
    rtfEncoded = ProPresenter.encode(rtfData);
    console.log(rtfData);
    proSlide['$']['sort_index'] = i;
    proSlide['$']['serialization-array-index'] = i;
    proSlide['$']['label'] = 'slide ' + i;
    proSlide['$']['UUID'] = '5657B2D7-7DA3-0640-2069-6644056432C' + i;
    proSlide['displayElements'][0]['RVTextElement'][0]['$']['RTFData'] = rtfEncoded;
    
    slidesGroup.push(proSlide);
  }
  
  d['groups'][0]['RVSlideGrouping'][0]['slides'][0]['RVDisplaySlide'] = slidesGroup;
  // console.log(d['groups'][0]['RVSlideGrouping'][0]['slides'])
  

  res.set({
    'Content-Disposition': 'attachment; filename="download.pro5"',
    'Content-Type': 'text/xml'
  });
  return res.send(XmlParser.build(doc));
})

module.exports = router;
