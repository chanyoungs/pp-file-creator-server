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
const STATUS = require('../../../status');
const mongoose = require('mongoose');

const Presentation = mongoose.model('Presentation');
const Template = mongoose.model('Template')

/**
 * get a list of all presentations
*/
router.get('/', (req, res) => {
  Presentation.find((err, templates) => {
    if (err) {
      console.log(err);
      return res.status(STATUS.SERVER_ERROR).send();
    }
    
    return res.status(STATUS.OK).json(templates);
  });
});

/**
 * download a single presentation
*/
router.get('/:presentation_id', (req, res) => {

  Presentation.findById(req.params.presentation_id, (err, presentation) => {
    if (err) {
      console.log(err);
      return res.status(STATUS.SERVER_ERROR).send();
    }

    Template.findById(presentation.template, (err, template) => {
      if (err) {
        console.log(err);
        return res.status(STATUS.SERVER_ERROR).send();
      }
      
      res.set({
        'Content-Disposition': 'attachment; filename="'+presentation.title+'.pro5"',
        'Content-Type': 'text/octet-stream' // TODO: maybe pro5 has its own type
      });
      
      BuildPro5Document(presentation, template).then((doc) => {
        return res.status(STATUS.OK).send(XmlParser.build(doc));
      });
    })
  });
});

/**
 * save a single presentation to db
*/
router.post('/', (req, res) => {
  console.log(req.body)
  // TODO: *better* error checking
  let sermon = {
    slides: req.body.slides || [],
    title: req.body.title || 'No Title',
    date: req.body.date || new Date(),
    template: req.body.template || undefined
  };
  
  if (!req.body || typeof(req.body.slides) == 'undefined') {
    return res.status(STATUS.BAD_REQUEST).send('request format invalid');
  }
  
  let p = new Presentation({
    slides: sermon.slides,
    title: sermon.title,
    date: sermon.date,
    template: sermon.template
  });
  
  p.save((err) => {
    if (err) {
      res.status(STATUS.SERVER_ERROR).send({
        success: false
      })
    }
    res.status(STATUS.CREATED).send({
      success: true
    })
  });
})



/**
 * delete all presentations (debug)
*/
router.delete('/all', (req, res) => {
  Presentation.find().remove().exec();
  return res.status(STATUS.OK).send();
});

/**
 * delete a single presentation
*/
router.delete('/:template_id', (req, res) => {
	Presentation.findByIdAndRemove(req.params.presentation_id, (err, result) => {
		if (err) {
			return res.status(STATUS.SERVER_ERROR).send();
		}
		return res.status(STATUS.NO_CONTENT).send();
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
    fs.readFile('./src/tempPP/Document.json', "utf-8", (err, data) => {
      var doc = JSON.parse(data);
      
      var d = doc['RVPresentationDocument'];
      
      // format the document from template
      d['$'].height = (template.preview.container.height).slice(0,-2);
      d['$'].width = (template.preview.container.width).slice(0,-2);
      
      const BASE_SLIDE = JSON.parse(template.slide);

      slidesGroup = [];
      
      for (var i = 0; i < file.slides.length; i++) {
        const slide = file.slides[i];
        let proSlide = undefined;
        
        if (slide.type == 'TEXT_SLIDE') {
          proSlide = createTextSlide(slide, i, BASE_SLIDE);
        } else if (slide.type == 'IMAGE_SLIDE') {
          proSlide = createImageSlide(slide, i, BASE_SLIDE);
        } else {
          continue;
        }
        
        slidesGroup.push(proSlide);
        
      }
      
      d['groups'][0]['RVSlideGrouping'][0]['slides'][0]['RVDisplaySlide'] = slidesGroup;

      resolve(doc);
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
  var rtfStart = ProPresenter.decode(baseSlide['displayElements'][0]['RVTextElement'][0]['$']['RTFData']);
  var lastControlStart = rtfStart.lastIndexOf('\\cf');
  var pos = rtfStart.indexOf(' ', lastControlStart);

  rtfStart = rtfStart.substring(0, pos);
  
  let rtfData = ProPresenter.ConvertHtmlToRtf(slide.htmlContent);

  let proSlide = copyObj(baseSlide);
  rtfData = rtfStart + rtfData + '}';
  rtfEncoded = ProPresenter.encode(rtfData);

  proSlide['$']['sort_index'] = position;
  proSlide['$']['serialization-array-index'] = position;
  proSlide['$']['label'] = 'slide ' + position;
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
  // S3.findOne({_id: slide.image._id}, (err, doc) => {
  //   // request(slide.image.path)
  //   //   .pipe(
  //   //     fs.createWriteStream()
  //   //   )
  // })
  
  
  let proSlide = copyObj(baseSlide);
  
  return proSlide;
}



module.exports = router;
