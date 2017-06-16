const router = require('express').Router();

const fs = require('fs');
const path = require('path');
const unzip = require('unzip');

const multer = require('multer');
const upload = multer({ dest: '/tmp/' });

const XmlParser = require('../../../../utils/XmlParser');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/pp-file-creator');

const TEMPLATE_SCHEMA = mongoose.Schema({
  slide: Object,
  width: Number,
  height: Number,
  backgroundColor: String
});
const Template = mongoose.model('Card', TEMPLATE_SCHEMA)

function streamToString(stream, cb) {
  const chunks = [];
  stream.on('data', (chunk) => {
    chunks.push(chunk.toString());
  });
  stream.on('end', () => {
    cb(chunks.join(''));
  });
}

router.get('/', (req, res) => {
  Template.find((err, templates) => {
    if (err) {
      console.log(err);
      return res.status(500).send();
    }
    
    return res.status(200).json(templates);
  });
});

router.get('/:template_id', (req, res) => {
	Template.findById(req.params.template_id, (err, template) => {
		if (err) {
			console.log(err);
			return res.status(500).send();
		}
		return res.status(200).json(template);
	})
});

router.post('/', upload.single('template'), (req, res) => {
// console.log(req.file, req.body)
  if (typeof(req.file) == 'undefined') {
    return res.status(400).send('send zip, also check content-type');
  }
  
  fs.createReadStream(req.file.path)
    .pipe(unzip.Parse())
    .on('entry', (entry) => {
      const name = entry.path;
      const folder = path.join(req.file.destination, '_'+req.file.filename);
      const p = path.join(folder, name);
      
      // TODO: check we have memory - object isnt huge etc
      streamToString(entry, (data) => {
        XmlParser.parseString(data, (result) => {
          const template = result['RVTemplateDocument'];
          const templateHeight = template['$']['height'];
          const templateWidth = template['$']['width'];
          const slides = template.slides[0]['RVDisplaySlide'];
          for (var i = 0; i < slides.length; i++) {
            let slide = slides[i];
            
            let bg = slide['$']['backgroundColor'].split(' ');
            let bgColor = 'rgba(' + bg.join(',') + ')'
            let t = new Template({
              slide: JSON.stringify(result),
              height: templateHeight,
              width: templateWidth,
              backgroundColor: bgColor
            });
            t.save((err, template) => {
              if (err) {
                console.log(err);
              }
            })
          }
        });
      });

    })
  
    return res.status(200).send();
});


router.delete('/:template_id', (req, res) => {
	Template.findByIdAndRemove(req.params.template_id, (err, result) => {
		if (err) {
			return res.status(500).send();
		}
		return res.status(204).send();
	});
  
});

module.exports = router;
