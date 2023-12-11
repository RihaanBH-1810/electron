import React, { useState, useMemo, useRef, useEffect } from 'react';
import SidebarItem from './sidebarItem';
import * as htmlToImage from 'html-to-image';
import Slider from './slider';

const Home = () => {
    const getDefaultOptions = () => [
        {
          name: 'Brightness',
          property: 'brightness',
          value: 100,
          range: {
            min: 0,
            max: 200
          },
          unit: '%'
        },
        {
          name: 'Contrast',
          property: 'contrast',
          value: 100,
          range: {
            min: 0,
            max: 200
          },
          unit: '%'
        },
        {
          name: 'Saturation',
          property: 'saturate',
          value: 100,
          range: {
            min: 0,
            max: 200
          },
          unit: '%'
        },
        {
          name: 'Grayscale',
          property: 'grayscale',
          value: 0,
          range: {
            min: 0,
            max: 100
          },
          unit: '%'
        },
        {
          name: 'Sepia',
          property: 'sepia',
          value: 0,
          range: {
            min: 0,
            max: 100
          },
          unit: '%'
        },
        {
          name: 'Hue Rotate',
          property: 'hue-rotate',
          value: 0,
          range: {
            min: 0,
            max: 360
          },
          unit: 'deg'
        },
        {
          name: 'Blur',
          property: 'blur',
          value: 0,
          range: {
            min: 0,
            max: 20
          },
          unit: 'px'
        }
      ];
  const [fileList, setFileList] = useState([]);
  const [currentImage, setCurrentImage] = useState('');
  const elementRef = useRef(null);

  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const [options, setOptions] = useState(getDefaultOptions());
  const selectedOption = options[selectedOptionIndex];
    
  function handleChange(e) {
        const file = e.target.files[0];
        const imageUrl = URL.createObjectURL(file);
        setCurrentImage(imageUrl);
        setFileList([...fileList, { original: imageUrl, filtered: imageUrl }]);
      }
    
      const handleSliderChange = ({ target }) => {
        setOptions((prevOptions) =>
          prevOptions.map((option, index) =>
            index !== selectedOptionIndex ? option : { ...option, value: target.value }
          )
        );
      };
    
      const handleReset = () => {
        setOptions(getDefaultOptions());
      };
    
      const getImageStyle = useMemo(() => {
        const filters = options.map((option) => `${option.property}(${option.value}${option.unit})`);
        return { filter: filters.join(' ') };
      }, [options]);
    
      const downloadImage = async () => {
        try {
          if (elementRef.current) {
            const dataUrl = await htmlToImage.toPng(elementRef.current);
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = 'filtered_image.png';
            link.click();
            setFileList((prevFileList) => [...prevFileList, { original: currentImage, filtered: dataUrl }]);
          }
        } catch (error) {
          console.error('Error generating image:', error);
        }
      };
    
      const handleNext = () => {
      const currentIndex = fileList.findIndex((item) => item.original === currentImage);
      if (currentIndex < fileList.length - 1) {
          setCurrentImage(fileList[currentIndex + 1].original);
        }
      };
    
      const handlePrev = () => {
      const currentIndex = fileList.findIndex((item) => item.original === currentImage);
        if (currentIndex > 0) {
          setCurrentImage(fileList[currentIndex - 1].original);
        }
};
    
      useEffect(() => {
        if (elementRef.current) {
          elementRef.current.src = currentImage;
        }
      }, [currentImage]);
    
      useEffect(() => {
        console.log('FileList updated:', fileList);
      }, [fileList]);
    
      return (
    <>
          <div className="leftpane">
                <center>Gallery view</center>
            <div className="gallery">
              {fileList.map((file, index) => (
                <img
                  key={index}
                  src={getImageStyle.filter ? file.filtered : file.original}
                  className="gallery_img"
                  alt={`Gallery ${index}`}
              />
              ))}
            </div>
          </div>
          <div className="rightpane">
            <h1 align="center">PixPerfect</h1>
            <div>
              <input type="file" accept="image/x-png,image/jpeg" onChange={handleChange} />
                <div className="top-buttons">
                <button className="btn" onClick={handlePrev}>
                     Prev
                </button>
                <button className="btn" onClick={handleNext}>
                     Next
                </button>
              </div>
                  </div>
          <div className="current">
                  <div className="image-view">
                    <img
                      src={getImageStyle.filter ? currentImage : fileList.find((item) => item.original === currentImage)?.filtered}
                      className="current-img"
                      style={getImageStyle}
                      ref={elementRef}
                      alt="Load an image"
                    />
                <Slider
                  min={selectedOption.range.min}
                  max={selectedOption.range.max}
                  value={selectedOption.value}
                  handleChange={handleSliderChange}
                />
                    </div>
              
            </div>
            <div className="buttons">
                <button className="btn" onClick={handleReset}>
                       Reset
                  </button>
                  <button className="btn" onClick={downloadImage}>
                    Download
                  </button>
                </div>
          </div>
            <div className="sidebar">
            <div>Choose a Filter : </div>
            {options.map((option, index) => (
                <SidebarItem
                    key={index}
                   name={option.name}
                   active={index === selectedOptionIndex}
                handleClick={() => setSelectedOptionIndex(index)}
              />))}
    </div>
        </>
      );
    };
    
    export default Home;