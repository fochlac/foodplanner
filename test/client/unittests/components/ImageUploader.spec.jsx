import React from 'react';
import { shallow, mount } from 'enzyme';
import ImageUploader from 'RAW/ImageUploader.jsx';
import { File } from 'file-api';
const image = new File('./test/client/resources/testimage.jpg');


describe('ImageUploader', () => {
  test('should render all elements and image placeholder', () => {
    const wrapper = shallow(<ImageUploader opts={{}} callback={console.log} />);

    expect(wrapper.find('.imageContainer')).toHaveLength(1);
    expect(wrapper.find('.imageWrapper')).toHaveLength(1);
    expect(wrapper.find('input[type="file"]')).toHaveLength(1);
    expect(wrapper.find('label.labelButton')).toHaveLength(1);
    expect(wrapper.find('.imageContainer').prop('className')).toContain('fa-picture-o');
  });

  test(
      'should not render no placeholder and image url should be option url',
      () => {
        const IMAGE_OPTIONS = {imageUrl: '/testimage.jpg'},
            wrapper = shallow(<ImageUploader opts={IMAGE_OPTIONS} callback={console.log} />);

        expect(wrapper.find('.imageWrapper img').prop('src')).toBe(IMAGE_OPTIONS.imageUrl);
      }
  );

  test('should render image after select and output file', (done) => {
    let output;

    const wrapper = shallow(<ImageUploader opts={{}} callback={(img,imgUrl) => output = {img, imgUrl}} />);

    expect(wrapper.find('.imageContainer').prop('className')).toContain('fa-picture-o');

    wrapper.find('input[type="file"]').simulate('change', {target: {files: [image]}});
    global.unboundElement.onload();
        let timer = setInterval( () => {
            if (output !== undefined) {
                wrapper.update();
                expect(wrapper.find('.imageWrapper img').prop('src')).toBe(output.imgUrl);
                expect(wrapper.find('.imageContainer').prop('className')).not.toContain('fa-picture-o');
                clearTimeout(timeout);
                done();
            }
        }, 10);
        let timeout = setInterval(() => {
            expect(0).toBe(1);
            done();
        }, 1000);
  });
});