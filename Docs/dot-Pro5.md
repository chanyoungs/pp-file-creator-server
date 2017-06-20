## Slide Container
```xml
<slides containerClass="NSMutableArray">
```

## Single Slide
```xml
<RVDisplaySlide backgroundColor="0 0 0 1" enabled="1" highlightColor=""
  hotKey="" label="" notes="" slideType="1" sort_index="0" 
  UUID="E764A61B-9CA3-481E-9CD1-482D0E9A1D76" drawingBackgroundColor="0" 
  chordChartPath="" serialization-array-index="0"
>
```

## Text
```xml
<RVTextElement displayDelay="0" displayName="" locked="0" persistent="0"
  typeID="0" fromTemplate="1" bezelRadius="0" drawingFill="0" drawingShadow="1"
 drawingStroke="0" fillColor="0 0 0 0" rotation="0" 
 source="" adjustsHeightToFit="0" verticalAlignment="0" 
 RTFData="BASE64 ENCODED RTF" revealType="0" serialization-array-index="1"
 >
  <_-RVRect3D-_position x="61.22652" y="462.0856" z="0" 
    width="1797.547" height="803.8289">
  </_-RVRect3D-_position>
  <_-D-_serializedShadow containerClass="NSMutableDictionary">
      <NSMutableString serialization-native-value="{5, -5}" 
        serialization-dictionary-key="shadowOffset">
      </NSMutableString>
      <NSNumber serialization-native-value="0" 
        serialization-dictionary-key="shadowBlurRadius">
      </NSNumber>
      <NSColor serialization-native-value="0 0 0 0.3333333432674408" 
        serialization-dictionary-key="shadowColor">
      </NSColor>
  </_-D-_serializedShadow>
  <stroke containerClass="NSMutableDictionary">
      <NSColor serialization-native-value="0 0 0 1" 
        serialization-dictionary-key="RVShapeElementStrokeColorKey">
      </NSColor>
      <NSNumber serialization-native-value="1" 
        serialization-dictionary-key="RVShapeElementStrokeWidthKey">
      </NSNumber>
  </stroke>
</RVTextElement>
```
* RTFDate is base64 encoded RTF data (http://www.pindari.com/rtf1.html), all formatting happens in here
* _-RVRect3d-_position is the position of the textbox
* verticalAlignment
    * 0 = Centered
    * 1 = Top (probably, havent tested)
    * 2 = Bottom
    
## Images
```xml
<RVMediaCue displayName="Screen Shot 2017-04-02 at 2.42.29 pm" 
  delayTime="0" timeStamp="0" enabled="1" 
  UUID="89A86D4D-B956-48D6-B4E4-0E950A48E9BF" 
  parentUUID="89A86D4D-B956-48D6-B4E4-0E950A48E9BF" 
  elementClassName="RVImageElement" 
  behavior="1" alignment="4" serialization-array-index="0">
    <element displayDelay="0" 
      displayName="Screen Shot 2017-04-02 at 2.42.29 pm" 
      locked="0" persistent="0" typeID="0" fromTemplate="0" 
      bezelRadius="0" drawingFill="0" drawingShadow="0" drawingStroke="0" 
      fillColor="1 1 1 1" rotation="0" 
      source="file://localhost/Users/kevindoveton/Desktop/Screen%20Shot%202017-04-02%20at%202.42.29%20pm.png" 
      flippedHorizontally="0" flippedVertically="0" scaleFactor="1" serializedImageOffset="0.000000@0.000000" serializedFilters="YnBsaXN0MDDUAQIDBAUIFhdUJHRvcFgkb2JqZWN0c1gkdmVyc2lvblkkYXJjaGl2ZXLRBgdUcm9vdIABowkKD1UkbnVsbNILDA0OViRjbGFzc1pOUy5vYmplY3RzgAKg0hAREhNYJGNsYXNzZXNaJGNsYXNzbmFtZaMTFBVeTlNNdXRhYmxlQXJyYXlXTlNBcnJheVhOU09iamVjdBIAAYagXxAPTlNLZXllZEFyY2hpdmVyCBEWHygyNTo8QEZLUl1fYGVueX2MlJ2iAAAAAAAAAQEAAAAAAAAAGAAAAAAAAAAAAAAAAAAAALQ=" 
      scaleBehavior="3" brightness="0" contrast="1" saturation="1" hue="0" 
      manufactureURL="" manufactureName="" 
      format="Portable Network Graphics image" enableColorFilter="0" 
      colorFilter="1 0 0 1" enableBlur="0" blurRadius="0" enableEdgeBlur="0" 
      edgeBlurRadius="0" edgeBlurArea="0" enableSepia="0" enableColorInvert="0" enableGrayInvert="0" enableHeatSignature="0">
        <_-RVRect3D-_position x="0" y="0" z="0" width="1920" height="1080">
        </_-RVRect3D-_position>
        <_-D-_serializedShadow containerClass="NSMutableDictionary">
            <NSMutableString serialization-native-value="{5, -5}" serialization-dictionary-key="shadowOffset">
            </NSMutableString>
            <NSNumber serialization-native-value="0" 
              serialization-dictionary-key="shadowBlurRadius">
            </NSNumber>
            <NSColor serialization-native-value="0 0 0 0.3333333432674408" 
              serialization-dictionary-key="shadowColor">
            </NSColor>
        </_-D-_serializedShadow>
        <stroke containerClass="NSMutableDictionary">
            <NSColor serialization-native-value="0 0 0 1" 
              serialization-dictionary-key="RVShapeElementStrokeColorKey">
            </NSColor>
            <NSNumber serialization-native-value="1" 
              serialization-dictionary-key="RVShapeElementStrokeWidthKey">
            </NSNumber>
        </stroke>
    </element>
    <_-RVProTransitionObject-_transitionObject>
    </_-RVProTransitionObject-_transitionObject>
</RVMediaCue>
```


### another way is 
```xml
<RVImageElement displayDelay="0" displayName="" locked="0" persistent="0" 
  typeID="0" fromTemplate="0" bezelRadius="0" drawingFill="0" drawingShadow="0" drawingStroke="0" fillColor="1 1 1 1" rotation="0" 
  source="file://localhost/Users/kevindoveton/Desktop/Screen%20Shot%202017-04-02%20at%202.42.29%20pm.png" 
  flippedHorizontally="0" flippedVertically="0" scaleFactor="0.8894941" 
  serializedImageOffset="0.000000@0.000000"  serializedFilters="YnBsaXN0MDDUAQIDBAUIFhdUJHRvcFgkb2JqZWN0c1gkdmVyc2lvblkkYXJjaGl2ZXLRBgdUcm9vdIABowkKD1UkbnVsbNILDA0OViRjbGFzc1pOUy5vYmplY3RzgAKg0hAREhNYJGNsYXNzZXNaJGNsYXNzbmFtZaMTFBVeTlNNdXRhYmxlQXJyYXlXTlNBcnJheVhOU09iamVjdBIAAYagXxAPTlNLZXllZEFyY2hpdmVyCBEWHygyNTo8QEZLUl1fYGVueX2MlJ2iAAAAAAAAAQEAAAAAAAAAGAAAAAAAAAAAAAAAAAAAALQ=" scaleBehavior="0" brightness="0" contrast="1" 
  saturation="1" hue="0" manufactureURL="" manufactureName="" 
  format="Portable Network Graphics image" enableColorFilter="0" 
  colorFilter="1 0 0 1" enableBlur="0" blurRadius="0" enableEdgeBlur="0" 
  edgeBlurRadius="0" edgeBlurArea="0" enableSepia="0" enableColorInvert="0" 
  enableGrayInvert="0" enableHeatSignature="0" serialization-array-index="0">
    <_-RVRect3D-_position x="106.0856" y="0" z="0" width="1707.829" 
      height="1080">
    </_-RVRect3D-_position>
    <_-D-_serializedShadow containerClass="NSMutableDictionary">
        <NSMutableString serialization-native-value="{5, -5}" 
          serialization-dictionary-key="shadowOffset">
        </NSMutableString>
        <NSNumber serialization-native-value="0" 
          serialization-dictionary-key="shadowBlurRadius">
        </NSNumber>
        <NSColor serialization-native-value="0 0 0 0.3333333432674408" 
          serialization-dictionary-key="shadowColor">
        </NSColor>
    </_-D-_serializedShadow>
    <stroke containerClass="NSMutableDictionary">
        <NSColor serialization-native-value="0 0 0 1" 
          serialization-dictionary-key="RVShapeElementStrokeColorKey">
        </NSColor>
        <NSNumber serialization-native-value="1" 
          serialization-dictionary-key="RVShapeElementStrokeWidthKey">
        </NSNumber>
    </stroke>
</RVImageElement>
```
* fillColor = rgba (from 0 to 1)
* source, file source - in form file://localhost/ + directory (can we use web images??)

## General start of document stuff
```xml
<RVPresentationDocument height="1080" width="1920" versionNumber="500" 
  docType="0" creatorCode="1349676880" 
  lastDateUsed="2017-05-08T02:54:29" usedCount="0" category="Presentation" 
  resourcesDirectory="" backgroundColor="0 0 0 1" drawingBackgroundColor="0" 
  notes="" artist="" author="" album="" CCLIDisplay="0" CCLIArtistCredits="" 
  CCLISongTitle="" CCLIPublisher="" CCLICopyrightInfo="" CCLILicenseNumber="" 
  chordChartPath="">
    <timeline timeOffSet="0" selectedMediaTrackIndex="0" unitOfMeasure="60" 
      duration="0" loop="0">
        <timeCues containerClass="NSMutableArray">
        </timeCues>
        <mediaTracks containerClass="NSMutableArray">
        </mediaTracks>
    </timeline>
    <bibleReference containerClass="NSMutableDictionary"></bibleReference>
    <_-RVProTransitionObject-_transitionObject transitionType="-1" 
      transitionDuration="1" motionEnabled="0" motionDuration="20" 
      motionSpeed="100">
    </_-RVProTransitionObject-_transitionObject>
    <groups containerClass="NSMutableArray">
        <RVSlideGrouping name="" uuid="59C8F542-5919-4D71-BCB8-56CEFD328DFE" 
          color="0 0 0 0" serialization-array-index="0">
            <slides containerClass="NSMutableArray">
```
Notes: 
* height = document height
* width = document width
* backgroundColor rgba (red, green, blue, alpha), from 0 to 1
* uuid (from tests it doesnt really have to be unique)

## General end of document stuff
```xml
            </slides>
        </RVSlideGrouping>
    </groups>
    <arrangements containerClass="NSMutableArray">
        <RVSongArrangement name="New Arrangement" 
          uuid="7A92E60C-537C-46BD-A8C0-2046EE83DBD2" color="0 0 0 0" 
          serialization-array-index="0">
            <groupIDs containerClass="NSMutableArray">
                <NSMutableString 
                serialization-native-value="59C8F542-5919-4D71-BCB8-56CEFD328DFE" 
                serialization-array-index="0">
                </NSMutableString>
            </groupIDs>
        </RVSongArrangement>
    </arrangements>
</RVPresentationDocument>
```
* uuid (from tests it doesnt really have to be unique)