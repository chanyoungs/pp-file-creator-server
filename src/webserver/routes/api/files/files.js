// String.prototype.trim = function() {
// 	return this.replace(/^\s+|\s+$/g,"");
// }
// String.prototype.ltrim = function() {
// 	return this.replace(/^\s+/,"");
// }
// String.prototype.rtrim = function() {
// 	return this.replace(/\s+$/,"");
// }

function copyObj(obj) {
  return JSON.parse(JSON.stringify(obj));
}

const router = require('express').Router();
const ProPresenter = require('../../../../utils/ProPresenter');
const XmlParser = require('../../../../utils/XmlParser');
const Guid = require('../../../../utils/Guid');
const fs = require('fs');
const request = require('request');

const mongoose = require('mongoose');

const Presentation = mongoose.model('Presentation');
const Template = mongoose.model('Template')

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
  if (!req.body || typeof(req.body.slides) == 'undefined') {
    return res.status(400).send('request format invalid');
  }
  
  // return res.json(req.body);
  
  Template.find({_id: req.body.template._id}, (err, _template) => {
    BuildPro5Document(req.body, _template[0]).then(() => {
      return res.status(201).send();
    }).catch((err) => {
      console.log(err);
      return res.status(500).send(err);
    })
  })

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


/**
 * build a propresenter document and save in mongo
 * @param file {Object} - the sermon to build
 * @param template {Object} - the template to use
 * @returns Promise
*/
function BuildPro5Document(file, template) {
  return new Promise((resolve, reject) => {
    // TODO: this should probably happen async
    var doc = JSON.parse(fs.readFileSync('./src/tempPP/Document.json', "utf-8"));
    var d = doc['RVPresentationDocument'];
    
    // format the document from template
    d['$'].height = (template.preview.container.height).slice(0,-2);
    d['$'].width = (template.preview.container.width).slice(0,-2);
    
    const BASE_SLIDE = JSON.parse(template.slide);

    var rtfStart = ProPresenter.decode(BASE_SLIDE['displayElements'][0]['RVTextElement'][0]['$']['RTFData']);
    var lastControlStart = rtfStart.lastIndexOf('\\cf');
    var pos = rtfStart.indexOf(' ', lastControlStart);

    rtfStart = rtfStart.substring(0, pos);
    
    slidesGroup = [];
    
    for (var i = 0; i < file.slides.length; i++) {
      const slide = file.slides[i];
      let proSlide = undefined;
      
      if (slide.type == 'TEXT_SLIDE') {
        proSlide = createTextSlide(slide, i, BASE_SLIDE);
      } else if (slide.type == 'IMAGE_SLIDE') {
        proSlide = createImageSlide(slide, i, BASE_SLIDE);
      }
      
      slidesGroup.push(proSlide);
      
    }
    
    d['groups'][0]['RVSlideGrouping'][0]['slides'][0]['RVDisplaySlide'] = slidesGroup;

    let p = new Presentation({
      slide: XmlParser.build(doc),
      title: file.title,
      date: file.date
    });
    
    p.save((err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  })
  
}

/**
 * create a propresenter slide object from a request
 * @param slide {Object} - slide object
 * @param position {Number} - the slides position in the document
 * @returns {Object} propresenter slide
*/
function createTextSlide(slide, position, baseSlide) {
  let rtfData = ProPresenter.ConvertHtmlToRtf(slide.htmlContent);

  let proSlide = copyObj(baseSlide);
  rtfData = rtfStart + rtfData + '}';
  rtfEncoded = ProPresenter.encode(rtfData);

  proSlide['$']['sort_index'] = i;
  proSlide['$']['serialization-array-index'] = i;
  proSlide['$']['label'] = 'slide ' + i;
  proSlide['$']['UUID'] = Guid();
  proSlide['displayElements'][0]['RVTextElement'][0]['$']['RTFData'] = rtfEncoded;
  
  return proSlide;
}

/**
 * @requires request - https://github.com/request/request
 * @param slide {Object} - slide object
 * @param position {Number} - the slides position in the document
 * @returns {Object} propresenter slide
*/
function createImageSlide(slide, position, baseSlide) {
  const S3 = mongoose.model('S3');
  
  // TODO: error check
  S3.findOne({_id: slide.image._id}, (err, doc) => {
    request(slide.image.path)
      .pipe(
        fs.createWriteStream()
      )
  })
  
  
  let proSlide = copyObj(baseSlide);
  
  return proSlide;
}



module.exports = router;
