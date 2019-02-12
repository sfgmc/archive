import { useState, useEffect, Fragment, useRef } from 'react';
import { Block, Col, Row } from 'jsxstyle';
import TesseractLib from 'tesseract.js';
import { Spacer } from '../components/Spacer';


const downloadImage = (imgSrc) => new Promise((resolve, reject) => {
  var newImg = new Image();

  newImg.crossOrigin = "Anonymous";
  newImg.onload = function () {
    var height = newImg.height;
    var width = newImg.width;
    resolve({ img: newImg, height, width })
  }

  newImg.src = imgSrc; // this must be done AFTER setting onload
});

function getRenderedSize(contains, cWidth, cHeight, width, height, pos) {
  var oRatio = width / height,
    cRatio = cWidth / cHeight;
  return function () {
    if (contains ? (oRatio > cRatio) : (oRatio < cRatio)) {
      this.width = cWidth;
      this.height = cWidth / oRatio;
    } else {
      this.width = cHeight * oRatio;
      this.height = cHeight;
    }
    this.left = (cWidth - this.width) * (pos / 100);
    this.right = this.width + this.left;
    return this;
  }.call({});
}

const getImgSizeInfo = (img) => {
  var pos = window.getComputedStyle(img).getPropertyValue('object-position').split(' ');
  return getRenderedSize(
    true,
    img.width,
    img.height,
    img.naturalWidth,
    img.naturalHeight,
    parseInt(pos[0])
  );
}

export const OCR = (props) => {
  const Image = 'https://images.ctfassets.net/mj8q5gk08usa/72oG2FL91wDzJ6zoa0iCCU/7feddc0697c5b1d75003b1bd27f79c95/20100427_SF_Chronicle.jpg'
  const altImage = 'http://images.ctfassets.net/mj8q5gk08usa/65F0WWXAlMTPOledu8kAQ9/105adf40f16c212c8577be8ae1eda84b/20120105_001.jpg'
  const [imageUrl, setImageUrl] = useState(altImage);
  const [ocrProgress, setOcrProgress] = useState(null);
  const [ocrResults, setOcrResults] = useState(null);
  const [isDragging, setisDragging] = useState(false);
  const [originalImageDimensions, setOriginalImageDimensions] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragLocation, setDragLocation] = useState({ x: 0, y: 0 });

  const imageEl = useRef(null);
  const canvasEl = useRef(null);

  const dragWidth = dragLocation.x - dragStart.x;
  const dragHeight = dragLocation.y - dragStart.y;


  return (
    <Col width="100vw" height="100vh"
      props={{
        onMouseUp: (e) => {
          if (!isDragging) { return; }
          e.preventDefault();
          e.stopPropagation();
          const imageDimensions = imageEl.current.getBoundingClientRect();
          const left = (dragWidth < 0 ? (dragStart.x + dragWidth) : dragStart.x) - imageDimensions.x;
          const top = (dragHeight < 0 ? (dragStart.y + dragHeight) : dragStart.y) - imageDimensions.y;
          const width = dragWidth < 0 ? (0 - dragWidth) : dragWidth;
          const height = dragHeight < 0 ? (0 - dragHeight) : dragHeight;
          if (!width || !height) {
            setisDragging(false);
            return;
          }
          downloadImage(imageUrl)
            .then((results) => {
              const originalImageDimensions = { height: results.height, width: results.width };
              const downloadedImage = results.img
              canvasEl.current.height = 0;
              canvasEl.current.width = 0;
              const context = canvasEl.current.getContext('2d');
              const containDimensions = getImgSizeInfo(imageEl.current);
              const { width: imgwidth, height: imgheight, left: containLeft } = containDimensions;
              // const imgwidth = imageEl.current.offsetWidth;
              // const imgheight = imageEl.current.offsetHeight;
              const imageRatios = {
                width: imgwidth / originalImageDimensions.width,
                height: imgheight / originalImageDimensions.height
              };
              canvasEl.current.width = width / imageRatios.width;
              canvasEl.current.height = height / imageRatios.height;
              context.drawImage(
                downloadedImage, // source
                (left - containLeft) / imageRatios.width, top / imageRatios.height, // source starting x/y
                width / imageRatios.width, height / imageRatios.height, // source ending w/h
                0, 0, // destination x/y
                width / imageRatios.width, height / imageRatios.height, // destination w/h
              );
              console.log('starting tesseract', Tesseract)
              const Tesseract = TesseractLib.create({
                ...TesseractLib.workerOptions,
                workerPath: window.location.origin + '/static/js/tesseract-worker.js',
              })
              Tesseract.recognize(context)
                .progress((message) => {
                  console.log('progress:', message.progress)
                  setOcrProgress(message.progress * 100)
                })
                .finally((resultOrError) => {
                  console.log(resultOrError.text)
                  setOcrProgress(null)
                  setOcrResults(resultOrError.text)
                });
            })
          setisDragging(false);
          setDragStart({ x: 0, y: 0 });
          setDragLocation({ x: 0, y: 0 });
          setOriginalImageDimensions({ x: 0, y: 0, width: 0, height: 0 });
        }
      }}
    >
      <Row flex={2}>
        <Col flex={1}>
          <Row width="100%">
            Image URL:
            <Spacer />
            <Block component="input" flex={1} props={{
              value: imageUrl,
              onChange: (e) => setImageUrl(e.target.value)
            }} />
          </Row>
          <Row width="100%">
            Select and drag over the region you would like to transcribe:
          </Row>
          <Row
            position="relative"
            width="100%"
            height="100%"
            props={{
              onMouseDown: (e) => {
                if (!imageEl) { return; }
                e.preventDefault();
                e.stopPropagation();
                setisDragging(true)
                console.log(imageEl);
                const imageBounds = imageEl.current.getBoundingClientRect();
                console.log(imageBounds);
                setOriginalImageDimensions(imageBounds);
                const { pageX, pageY } = e;
                setDragStart({ x: pageX, y: pageY })
                setDragLocation({ x: pageX, y: pageY })
              },
              onMouseMove: (e) => {
                if (!isDragging) { return; }
                e.preventDefault();
                e.stopPropagation();
                console.log('dragging')
                const { pageX, pageY } = e;
                setDragLocation({ x: pageX, y: pageY })
              },
            }}
          >
            {!!dragStart.x && <Block
              border="dashed 1px #bbb"
              background="rgba(0,200,0, 0.1)"
              position="fixed"
              left={dragWidth < 0 ? (dragStart.x + dragWidth) : dragStart.x}
              top={dragHeight < 0 ? (dragStart.y + dragHeight) : dragStart.y}
              width={dragWidth < 0 ? (0 - dragWidth) : dragWidth}
              height={dragHeight < 0 ? (0 - dragHeight) : dragHeight}
            />}
            <Block component="img" width="100%" height="auto" height="100%" objectFit="contain" props={{
              src: imageUrl,
              ref: imageEl
            }} />
          </Row>
        </Col>
        <Block flex={1} overflow="hidden">
          {/* <pre><code>
            {JSON.stringify(originalImageDimensions, null, '  ')}
            {JSON.stringify(dragLocation, null, '  ')}
          </code></pre> */}

          <Row width="100%">
            Selected Region:
          </Row>
          <Block component="canvas" props={{
            ref: canvasEl
          }} />
        </Block>
      </Row>
      <Col flex={1} position="relative">
        {ocrProgress !== null && <Fragment>OCR processing, please wait. {ocrProgress} %</Fragment>}
        <Row height="90%" width="100%" position="absolute" bottom={0} left={0}>
          <Col flex={1} height="100%">
            OCR Results:
            <Block component="textarea" width="100%" height="100%"
              props={{
                value: ocrResults || '',
              }} />
          </Col>
          <Col flex={1} height="100%">
            Notes Area:
            <Block component="textarea" width="100%" height="100%" />
          </Col>
        </Row>
      </Col>
    </Col>
  )
};

export default OCR;