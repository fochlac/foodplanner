import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import ImageUploader from 'UI/ImageUploader/ImageUploader.jsx';
import { File } from 'file-api';
const image = new File('./test/client/resources/testimage.jpg');

describe('ImageUploader', () => {
  it('should render all elements and image placeholder', () => {
    const wrapper = shallow(<ImageUploader opts={{}} callback={console.log} />);

    expect(wrapper.find('.imageContainer')).to.have.lengthOf(1);
    expect(wrapper.find('.imageWrapper')).to.have.lengthOf(1);
    expect(wrapper.find('input[type="file"]')).to.have.lengthOf(1);
    expect(wrapper.find('label.labelButton')).to.have.lengthOf(1);
    expect(wrapper.find('.imageContainer').prop('className')).to.include('fa-picture-o');
  });

  it('should not render no placeholder and image url should be option url', () => {
    const IMAGE_OPTIONS = {imageUrl: '/testimage.jpg'},
        wrapper = shallow(<ImageUploader opts={IMAGE_OPTIONS} callback={console.log} />);

    expect(wrapper.find('.imageWrapper img').prop('src')).to.equal(IMAGE_OPTIONS.imageUrl);
  });

  it('should render image after select and output file', () => {
    let output;

    const wrapper = shallow(<ImageUploader opts={{}} callback={(img,imgUrl) => output = {img, imgUrl}} />);

    expect(wrapper.find('.imageContainer').prop('className')).to.include('fa-picture-o');

    wrapper.find('input[type="file"]').simulate('change', {target: {files: [image]}});
    global.unboundElement.dispatchEvent(new global.window.CustomEvent('load'));
    return new Promise((resolve, reject) => {
        let timer = setInterval( () => {
            if (output !== undefined) {
                wrapper.update();
                expect(wrapper.find('.imageWrapper img').prop('src')).to.equal(output.imgUrl);
                expect(wrapper.find('.imageContainer').prop('className')).to.not.include('fa-picture-o');
                clearTimeout(timeout);
                resolve()
            }
        }, 10);
        let timeout = setInterval(() => {
            clearInterval(timer);
            reject();
        }, 1000);
    })
  });
});