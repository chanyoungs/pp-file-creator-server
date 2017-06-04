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

class DraftJS {
  constructor() {
    
  }
  
  static toRtfData(draftObj) {
    var data = [];

    
    if (typeof(draftObj) == 'undefined') {
      throw new Error('draftObj must be defined');
    }
    
    const d = draftObj.blocks; 
    
    for (var i = 0; i < d.length; i++) {
      var output = d[i].text;
      var extraPos = 0;
      
      for (var j = 0; j < d[i].inlineStyleRanges.length; j++) {
        const styleRange = d[i].inlineStyleRanges[j];  

        const startPosition = styleRange.offset + extraPos;
        var startText = '';
        var endText = '';
          
        // TODO: make this one switch
        switch(styleRange.style) {
          case "BOLD":
            startText = STYLES.BOLD.START;
            endText = STYLES.BOLD.END;
            break;
          
          case "ITALIC":
            startText = STYLES.ITALIC.START;
            endText = STYLES.ITALIC.END;
            break;
            
          case "UNDERLINE":
            startText = STYLES.UNDERLINE.START;
            endText = STYLES.UNDERLINE.END;
            break;
          
          default:
            break;
        }
        
        extraPos += startText.length;
        const endPosition = startPosition + styleRange.length + extraPos;
        extraPos += endText.length;
        
        // start
        output = [output.slice(0, startPosition), startText, output.slice(startPosition)].join('');
        
        // end
        output = [output.slice(0, endPosition), endText, output.slice(endPosition)].join('');
      }
      data.push(output);
    }
    return data;
  }
}


module.exports = DraftJS
