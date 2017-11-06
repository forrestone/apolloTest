import React from 'react';
import axios from 'axios';
import clientConfig from '../config.json';

class ImageUpload extends React.Component {
    constructor(props) {
      super(props);
      this.state = {file: '',imagePreviewUrl: ''};

    }
  
    _handleSubmit(e) {
      let file = this.state.file;
      return this.props.submitAction(file)
    }
  
    _handleImageChange(e) {
      e.preventDefault();
  
      let reader = new FileReader();
      let file = e.target.files[0];
  
      reader.onloadend = () => {
        this.setState({
          file: file,
          imagePreviewUrl: reader.result
        });
      }
  
      reader.readAsDataURL(file)
    }
  
    render() {
      let {imagePreviewUrl} = this.state;
      let $imagePreview = null;
      if (imagePreviewUrl) {
        $imagePreview = (<img src={imagePreviewUrl} />);
      } else {
        $imagePreview = (<div className="previewText">Please select an Image for Preview</div>);
      }
  
      return (
        <div className="previewComponent">
            <input className="fileInput" 
              type="file" 
              onChange={(e)=>this._handleImageChange(e)} />
            <button className="submitButton"
              onClick={(e)=>this._handleSubmit(e)}>Upload Image</button>
          <div className="imgPreview">
            {$imagePreview}
          </div>
        </div>
      )
    }
  }
  
  export default ImageUpload;