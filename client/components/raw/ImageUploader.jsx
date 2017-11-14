import './ImageUploader.less'

import React from 'react'
import { resize } from 'UTILS/image.js'

export default class ImageUploader extends React.Component {
  constructor(props) {
    super()
    this.state = {
      imageUrl: props.opts.imageUrl ? props.opts.imageUrl : '',
      fileName: '',
    }
  }

  handleNewFile(evt) {
    let reader = new FileReader(),
      input = evt.target

    resize(input.files[0], { width: 200, height: 200 })
      .then(file => {
        let objectUrl = URL.createObjectURL(file)
        this.setState(
          {
            imageUrl: objectUrl,
          },
          () => this.props.callback(file, objectUrl),
        )
      })
      .catch(err => {
        console.log('error resizing image' + err)
      })
  }

  render() {
    let id = new Date()
      .getTime()
      .toString()
      .slice(4, -2)
    return (
      <div>
        <input type="file" name="exerciseImage" id={'imageUploader:' + id} className="hidden" onChange={evt => this.handleNewFile(evt)} />
        <div className="imageWrapper">
          <div className={(this.state.imageUrl.length ? '' : 'fa-picture-o ') + ' imageContainer fa'}>
            <img src={this.state.imageUrl} />
          </div>
          <label htmlFor={'imageUploader:' + id} className="labelButton uploadButtonIcon fa fa-upload margin-top pointer">
            Bild hochladen
          </label>
        </div>
      </div>
    )
  }
}
