import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Register from './components/Register/Register';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import './App.css';

const app = new Clarifai.App({
    apiKey: 'c80eaf24dc8941a7a098132670234738'
});

const particlesOptions = {
    particles: {
        number: {
            value: 70,
            density: {
                enable: true,
                value_area: 400             
                }

        },

        interactivity: {
            detect_on:"canvas",
            events: {
                onhover: {
                    enable: true,
                    mode: "grab"
                },
                onclick: {
                    enable: true,
                    mode:"push"
                },
                resize:true
         
            }
        }
    }
}
class App extends Component {
    constructor(){
        super();
        this.state = {
            input: '',
            imageUrl: '',
            box: {},
            route:'signin'
        }
    }
    calculateFaceLocation = (data) => {
        const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
        const image = document.getElementById('inputimage');
        const width = Number(image.width);
        const height = Number(image.height);
        return {
            leftCol: clarifaiFace.left_col * width,
            topRow: clarifaiFace.top_row * height,
            rightCol: width - (clarifaiFace.right_col * width),
            bottomRow: height - (clarifaiFace.bottom_row * height)

        }
    }

    displayFaceBox = (box) => {
        console.log(box);
        this.setState({ box: box });
    }
    onInputChange = (event) => {
        this.setState({ input: event.target.value });
    }
    onButtonSubmit = () => {
        this.setState({ imageUrl: this.state.input });
        app.models.predict("a403429f2ddf4b49b307e318f00e528b", this.state.input)
            .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
                .catch(err => console.log(err));
        }
          /*  function (err) {
                // there was an error
            } */
    onRouteChange = (route) => {
        this.setState({ route: route });

    }


    render() {
    return(
        <div className="App">
              <Particles className='particles'
                params={particlesOptions} />
            <Navigation onRouteChange={this.onRouteChange} />
            { this.state.route === 'home'
              ? <div>
                    <Logo />
                    <Rank />
                    <ImageLinkForm
                      onInputChange={this.onInputChange}
                      onButtonSubmit={this.onButtonSubmit}
                     />
                    <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} /> 
                </div>
                : (
                    this.state.route === 'signin'
                        ? <Signin onRouteChange={this.onRouteChange} />
                        : <Register onRouteChange={this.onRouteChange} />
                )
            }
        </div>
      );
    }
}
export default App;
