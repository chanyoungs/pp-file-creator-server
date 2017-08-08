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
const mkdirp = require('../../../../utils/MkdirP');
const Mimetypes = require('../../../../utils/Mimetypes');
const fs = require('fs');
const request = require('request');
const Zip = require('zip-dir');

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
      
      BuildPro5Document(presentation, template).then((data) => {
        let file = XmlParser.build(data['doc']);
        console.log(data['images']);
        BuildPro5Package({data: file, title: presentation.title}, data['images']).then((path) => {
          res.set({
            'Content-Disposition': 'attachment; filename="'+presentation.title+'.pro5x"',
            'Content-Type': 'text/octet-stream' // TODO: maybe pro5 has its own type
          });
          return res.status(STATUS.OK).sendFile(path);
        });
      });
    })
  });
});

/**
 * save a single presentation to db
*/
router.post('/', (req, res) => {

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
  return res.status(STATUS.NO_CONTENT).send();
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
 * ensure a folder exists - https://github.com/substack/node-mkdirp
 * @param path {String} - path to folder
 * @returns {Promise} - null if no error, otherwise error
*/
function ensureExists(path) {
  return new Promise((resolve, reject) => {
    mkdirp(path, (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  }) // end promise
}

/**
 * get all the images
*/
function downloadImage(path, url) {
  return new Promise((resolve, reject) => {
    request(url, (err, res, body) => {
    })
    .pipe(fs.createWriteStream(path).on('close', () => {
      resolve();
    }))
  });
}

function writeFile(path, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    })
  });
}

/**
 * build a pro5X zip
*/
function BuildPro5Package(doc, files) {
  const DOWNLOAD_URL = 'http://localhost:3000/api/v1/s3/';
  const BASE_PATH = '/tmp/' + Guid();
  const BUILD_PATH = (BASE_PATH + '/' + doc.title);
  const IMAGE_PATH = BUILD_PATH + '/media/files/'
  const FILE_PATH = BUILD_PATH+'.pro5x';
  const DOC_PATH = BUILD_PATH + '/' + doc.title + '.pro5';
  
  return new Promise((resolve, reject) => {
    ensureExists(IMAGE_PATH).then(() => {
      var allFiles = [];
      for (var i = 0; i < files.length; i++) {
        let file = files[i];
        let filePath = IMAGE_PATH + '/' + file.filename + (Mimetypes[file.mimetype] || '.jpg');
        let url = DOWNLOAD_URL + file._id;
        allFiles.push(downloadImage(filePath, url));
      }
      allFiles.push(writeFile(DOC_PATH, doc.data));
      
      Promise.all(allFiles).then(() => {
        Zip(BASE_PATH, { saveTo: FILE_PATH }, (err, buffer) => {
          if (err) {
            reject(err);
          }
          resolve(FILE_PATH)
        });
      })
    })
  });
}


/**
 * build a propresenter document and save in mongo
 * @param file {Object} - the sermon to build
 * @param template {Object} - the template to use
 * @returns Promise
*/
function BuildPro5Document(file, template) {
  return new Promise((resolve, reject) => {
    var images = [];
    var doc = undefined;

    fs.readFile('./src/tempPP/Document.json', "utf-8", (err, data) => {
      var doc = JSON.parse(data);
      var d = doc['RVPresentationDocument'];
      
      // format the document from template
      d['$'].height = (template.preview.container.height).slice(0,-2);
      d['$'].width = (template.preview.container.width).slice(0,-2);
      
      const BASE_SLIDE = JSON.parse(template.slide);
      
      fs.readFile('./src/tempPP/ImageSlide.json', 'utf-8', (err, data) => {
        const BASE_IMAGE_SLIDE = JSON.parse(data);
        slidesGroup = [];
        var slidePos = 0;
        for (var i = 0; i < file.slides.length; i++) {
          const slide = file.slides[i];
          let proSlide = undefined;
          
          if (slide.type == 'TEXT_SLIDE') {
            proSlide = createTextSlide(slide, slidePos, BASE_SLIDE);
          } else if (slide.type == 'IMAGE_SLIDE') {
            images.push(slide.image)
            proSlide = createImageSlide(slide, slidePos, BASE_IMAGE_SLIDE);
          } else {
            continue;
          }
          slidePos++;
          slidesGroup.push(proSlide);
          
        }

        d['groups'][0]['RVSlideGrouping'][0]['slides'][0]['RVDisplaySlide'] = slidesGroup;
        resolve({doc: doc, images: images});
        
      }) // end imageslide.json
    }); // end doc.json
  }) // end promise
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
  // console.log(slide);
  let proSlide = copyObj(baseSlide);
  
  proSlide['$']['sort_index'] = position;
  proSlide['$']['serialization-array-index'] = position;
  proSlide['$']['label'] = 'slide ' + position;
  proSlide['$']['UUID'] = Guid();
  
  let element = proSlide['cues'][0]['RVMediaCue'][0]['element'][0];
  element['$']['source'] = 'file://localhost/files/' + slide.image.filename + (Mimetypes[slide.image.mimetype] || '.jpg');
  
  return proSlide;
}



module.exports = router;
