const STYLES = {
  BOLD: {
    START: '<b>',
    END: '</b>'
  },
  ITALIC: {
    START: '<i>',
    END: '</i>'
  },
  UNDERLINE: {
    START: '<u>',
    END: '</u>'
  },
}

const router = require('express').Router();

const AuthMiddleware = require('./auth/AuthMiddleware');
router.use(AuthMiddleware);

const bodyParser = require('body-parser');
router.use(bodyParser.json());


const auth = require('./auth/auth');
router.use('/auth', auth);

router.get('/', (req, res) => {
  res.send('api v1')
});

router.post('/parse', (req, res) => {

  var data = [];

  if (typeof(req.body.state.blocks) !== 'undefined') {
    const d = req.body.state.blocks; 
    for (var i = 0; i < d.length; i++) {
      var output = d[i].text;
      var extraPos = 0;
      for (var j = 0; j < d[i].inlineStyleRanges.length; j++) {
        const styleRange = d[i].inlineStyleRanges[j];
        
        var position = d[i].inlineStyleRanges[j].offset + extraPos;
        var insertText = '';
        
        // TODO: make this one switch
        switch(styleRange.style) {
          case "BOLD":
            insertText = STYLES.BOLD.START;
            extraPos += insertText.length;
            break;
          
          case "ITALIC":
            insertText = STYLES.ITALIC.START;
            extraPos += insertText.length;
            break;
            
          case "UNDERLINE":
            insertText = STYLES.UNDERLINE.START;
            extraPos += insertText.length;
            break;
          
          default:
            break;
        }
        
        output = [output.slice(0, position), insertText, output.slice(position)].join('');
        
        position += d[i].inlineStyleRanges[j].length + extraPos;
        switch(styleRange.style) {
          case "BOLD":
            insertText = STYLES.BOLD.END;
            extraPos += insertText.length;
            break;
          
          case "ITALIC":
            insertText = STYLES.ITALIC.END;
            extraPos += insertText.length;
            break;
          
          case "UNDERLINE":
            insertText = STYLES.UNDERLINE.END;
            extraPos += insertText.length;
            break;
          
          default:
            break;
        }
        
        output = [output.slice(0, position), insertText, output.slice(position)].join('');
      }
      data.push(output);
    }
  }

  res.status(201).send(data);
});

module.exports = router;
