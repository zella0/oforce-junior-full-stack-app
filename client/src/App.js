import React, { Component } from "react";

import { faQuoteLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Loader } from "semantic-ui-react";
import StarRatings from 'react-star-ratings';

import "./App.css";

import axios from "axios";

class App extends Component {
  state = {
    quote: "",
    quoteSize: "md",
    buffering: false,
    rating: 0,
    quoteAvgRating: 0
  };

  componentDidMount(){
    axios.get('https://ipapi.co/json/')
    .then((res)=>{
      this.setState({
        ip_address: res.data.ip
      })
    })
  }

  fetchRandomQuote = () => {
    axios.get(`http://localhost:8000/quotes?quoteSize=${this.state.quoteSize}`)
      .then(res => {
        if (res.data.isCorrectLength === false) {
          this.setState({ 
            buffering: true,
            rating: 0
          });
          this.fetchRandomQuote();
        } else {
          axios.get(`http://localhost:8000/quotes/${res.data[0].id}`)
          .then((quoteRatingResponse) => {
            this.setState({
              quote: res.data[0].content,
              quote_id: res.data[0].id,
              quoteAvgRating: quoteRatingResponse.data.quoteAvgRating === null ? 0 : Number(quoteRatingResponse.data.quoteAvgRating),
              buffering: false
            });
          })
        }
      });
  };

  changeQuoteSize = size => {
    this.setState({ quoteSize: size });
  };

  changeRating = newRating => {
    axios.post(`http://localhost:8000/quotes/${this.state.quote_id}`, {
      ip_address: this.state.ip_address,
      newRating,
    }).then((res)=>{
      this.setState({
        rating: newRating
      })
    })
  }

  renderQuote = () => {
    return (
      <div>
        <div style={{ padding: ' 20px 100px',  }}>
          <h1 style={{fontSize: '4rem', color: 'rgb(160, 57, 1)'}}>{this.state.quote}</h1>
          <h5 style={{fontSize: '1rem', color: 'grey', fontWeight: '100' }}>{ this.state.quote && '- Ron Swanson'}</h5>
        </div>
      </div>
    );
  };

  render() {
    return (
      <div className="App">
        <div>
          <FontAwesomeIcon size="4x" icon={faQuoteLeft} style={{ margin: '20px 0' }} />
          <div>
          {this.state.buffering ? <Loader active inline /> : this.renderQuote() }
          </div>
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px' }}>
            <span style={{ marginRight: '50px' }}>
              <label style={{ fontSize: '20px', marginRight: '10px' }}>Your Rating</label>
              <StarRatings
              rating={this.state.rating ? this.state.rating : this.state.quoteAvgRating}
              starHoverColor={"rgb(221, 159, 13)"}
              starRatedColor={"rgb(221, 159, 13)"}
              changeRating={this.changeRating}
              numberOfStars={5}
              name='rating'
              />
            </span>
            <br/>
            <label style={{ fontSize: '20px', marginRight: '10px' }}>
              Average Rating: {this.state.quoteAvgRating ? this.state.quoteAvgRating.toFixed(1) : 0 } / 5.0 
            </label>
            <span style={{ marginLeft: '50px' }}>
              <label style={{ fontSize: '20px', marginRight: '10px' }}>Quote Size</label>
              <Button.Group>
                <Button
                  active={this.state.quoteSize === "sm"}
                  onClick={() => this.changeQuoteSize("sm")}
                >
                  Small
                </Button>
                <Button
                  active={this.state.quoteSize === "md"}
                  onClick={() => this.changeQuoteSize("md")}
                >
                  Medium
                </Button>
                <Button
                  active={this.state.quoteSize === "lg"}
                  onClick={() => this.changeQuoteSize("lg")}
                >
                  Large
                </Button>
              </Button.Group>
            </span>
          </div>
          <Button
            style={{ marginTop: '20px', fontWeight: '900', fontSize: '20px' }}
            onClick={() => this.fetchRandomQuote()}
            disabled={this.state.buffering}
          >
            Get Random Quote
          </Button>
        </div>
      </div>
    );
  }
}

export default App;
