const router = require('express').Router();

const fs = require('fs');
const path = require('path');
const unzip = require('unzip');
const rtf = require('rtf-parser');
const multer = require('multer');
const upload = multer({ dest: '/tmp/' });
const ProPresenter = require('../../../../utils/ProPresenter');
const XmlParser = require('../../../../utils/XmlParser');


const mongoose = require('mongoose');
const Template = mongoose.model('Template');

/**
 * convert propresenter align to a flex type
 * @param d {int} - the propresenter align int
 * @returns {string} - the flex postition
*/
function AlignToFlex(d) {
  switch(d) {
    case '1':
    case 1:
    case 'left':
      return 'flex-start';
    case 'center':
    case '0':
    case 0:
      return 'center';
    case '2':
    case 2:
    case 'right':
      return 'flex-end';
    default:
      break;
  }
  return 'center';
}

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
      if (entry.type == 'File') {
        streamToString(entry, (data) => {
          XmlParser.parseString(data, (result) => {
            const template = result['RVTemplateDocument'];
            const templateHeight = template['$']['height'];
            const templateWidth = template['$']['width'];
            const slides = template.slides[0]['RVDisplaySlide'];
            for (let i = 0; i < slides.length; i++) {
              console.log(i);
              let slide = slides[i];
              let title = slide['$']['label'] || 'Template ' + (i+1);
              let text = slide['displayElements'][0]['RVTextElement'][0];
              let textBox = text['_-RVRect3D-_position'][0]['$'];
              let bg = slide['$']['backgroundColor'].split(' ');
              for (let i = 0; i < bg.length; i++) {
                bg[i] = parseInt(bg[i]*255);
              }
              console.log(slide);

              rtf.string(ProPresenter.decode(text['$'].RTFData), (err, rtfText) => {
                let c = rtfText.content[0].style.foreground; // color
                let t = new Template({
                  title: title,
                  htmlContent: '<p>Line 1</p><p>Kevin should implement this</p>',
                  slide: JSON.stringify(slide),
                  preview: {
                    container: {
                      background: 'rgba(' + bg.join(',') + ')',
                      width: templateWidth+'px',
                      height: templateHeight+'px'
                    },
                    
                    box: {
                      top: textBox.y + 'px',
                      left: textBox.x + 'px',
                      width: textBox.width + 'px',
                      height: textBox.height + 'px'
                    },
                    
                    innerbox: {
                      'font-family': rtfText.content[0].style.font.name,// rtfText.fonts[0].name,
                      'font-size': rtfText.content[0].style.fontSize/2+'px',
                      'text-align': rtfText.content[0].style.align || 'left', // left, center, right, default to left
                      'align-items': AlignToFlex(text['$'].verticalAlignment), // flex-start, center, flex-end
                      'justify-content': AlignToFlex(rtfText.content[0].style.align), // flex-start, center, flex-end
                      color: 'rgb('+c.red+','+c.green+','+c.blue+')'
                    }
                  }
                });
                t.save((err, template) => {
                  if (err) {
                    console.log(err);
                  }
                })
              });
              
            }
          });
        });
      } // end type directory
///
    })
  
    return res.status(200).send();
});

router.delete('/all', (req, res) => {
  Template.find().remove().exec();
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
