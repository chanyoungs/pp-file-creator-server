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
const Template = mongoose.model('Template')

var template = {};

Template.findOne({}, (err, t) => {
  template = t;
})

router.get('/', (req, res) => {
  Presentation.find((err, templates) => {
    if (err) {
      console.log(err);
      return res.status(500).send();
    }
    
    return res.status(200).json(templates);
  });
});

router.get('/:presentation_id', (req, res) => {
  Presentation.findById(req.params.presentation_id, (err, presentation) => {
    if (err) {
      console.log(err);
      return res.status(500).send();
    }
    
    res.set({
      'Content-Disposition': 'attachment; filename="'+presentation.title+'"',
      'Content-Type': 'text/octet-stream' // TODO: maybe pro5 has its own type
    });
    
    return res.status(200).send(presentation);
  });
});

router.post('/', (req, res) => {
  // console.log(req.body)
  if (!req.body || typeof(req.body.slides) == 'undefined') {
    return res.status(400).send('request format invalid');
  }
  
  var doc = undefined;
  
  doc = JSON.parse(fs.readFileSync('./src/tempPP/Document.json', "utf-8"));
  d = doc['RVPresentationDocument'];
  
  // format the document from template
  d['$'].height = (template.preview.container.height).slice(0,-2);
  d['$'].width = (template.preview.container.width).slice(0,-2);
  
  const BASE_SLIDE = JSON.parse(template.slide);

  var rtfStart = ProPresenter.decode(BASE_SLIDE['displayElements'][0]['RVTextElement'][0]['$']['RTFData']);
  var lastControlStart = rtfStart.lastIndexOf('\\cf');
  var pos = rtfStart.indexOf(' ', lastControlStart);

  rtfStart = rtfStart.substring(0, pos);
  
  slidesGroup = [];
  
  for (var i = 0; i < req.body.slides.length; i++) {

    const slide = req.body.slides[i];
    let rtfData = ProPresenter.ConvertHtmlToRtf(slide.htmlContent);

    let proSlide = copyObj(BASE_SLIDE);
    rtfData = rtfStart + rtfData + '}';
    rtfEncoded = ProPresenter.encode(rtfData);

    proSlide['$']['sort_index'] = i;
    proSlide['$']['serialization-array-index'] = i;
    proSlide['$']['label'] = 'slide ' + i;
    proSlide['$']['UUID'] = '5657B2D7-7DA3-0640-2069-6644056432C' + i;
    proSlide['displayElements'][0]['RVTextElement'][0]['$']['RTFData'] = rtfEncoded;
    
    slidesGroup.push(proSlide);
  }
  
  d['groups'][0]['RVSlideGrouping'][0]['slides'][0]['RVDisplaySlide'] = slidesGroup;

  let p = new Presentation({
    slide: XmlParser.build(doc),
    title: req.body.title,
    date: req.body.date
  });
  p.save((err) => {
    if (err) {
      return res.status(500).send({
        success: false
      });
    }
    return res.status(201).json({
      success: true
    });
  });

})

router.delete('/all', (req, res) => {
  Presentation.find().remove().exec();
  return res.status(200).send();
});

router.delete('/:template_id', (req, res) => {
	Presentation.findByIdAndRemove(req.params.presentation_id, (err, result) => {
		if (err) {
			return res.status(500).send();
		}
		return res.status(204).send();
	});
  
});

module.exports = router;
