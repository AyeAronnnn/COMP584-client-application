import React, { useContext } from 'react';
import server from '../../config/service';
import Axios from 'axios';
import AuthContext from '../../context/AuthProvider';
import './PostbikeStyles.css';

class Postbike extends React.Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.state = {
      tags: [],
      values: {},
      formVisible: false
    };
  }

  /*Event handler that will detect which tags are being selected for form populating */
  handleTagClick = (tag) => {
    let tags = this.state.tags;
    let values = this.state.values;
    if (tags.includes(tag))
    {
      tags = tags.filter(t => t !== tag);
    }
    else
    {
      tags.push(tag);
      values[tag] = '';
    }
    this.setState({ tags });
    this.setState({ values });
  }

  /*Event handler that will generate form based off of selected tag values */
  handleCreateFormClick = () => {
    this.setState({ formVisible: true });
  }

  fieldHandler = (e) => {
    let values = this.state.values;
    values[e.target.name] = e.target.value;
    this.setState({ values });
  }

  requestHandler = e => {
    e.preventDefault();
    let token = window.localStorage.getItem("token");
    let id = window.localStorage.getItem("id");
    let values = this.state.values;
    values['id'] = id;
    let config = { headers: { Authorization: "Bearer " + token }}
    Axios.post(`${server.host}/v1/bikes`, this.state.values, config)
      .then(res => console.log(res))
      .catch(err => console.log(`Error Message: ${err.message}`));
  }

 /*Rendering the form  */
  render() {
    const { tags, formVisible, values } = this.state;
    
    /*Renders based off of tags */
      if (formVisible)
      {
        return (
            <form className="postbike-form" onSubmit={this.requestHandler}>
            { tags.map(tag => (
                <div key={tag} className="postbike-form-field">
                <label>{tag}:</label>
                <input type="text" name={tag} value={values[`${tag}`]} onChange={this.fieldHandler}/>
                </div>
            ))}
            <input type="submit" value="Submit"/>
            </form>
        );
      }
      /*Returns user back to Postbike Page to select their tags */
      else
      {
        return (
            <div className="postbike-tag-selector">
                <h1>Select tags:</h1>
                <div className="postbike-tag-buttons">
                    {['Title', 'Summary', 'Frame', 'Fork', 'Headset', 'Bottom Bracket', 'Crankset', 'Derailleurs', 'Shifters', 'Handle Bars', 'Stem', 'Seatpost', 'Saddle','Brakes', 'Brake Levers', 'Pedals', 'Tires', 'Wheels', 'Accessories'].map(tag => (
                    <button key={tag} className="postbike-tag-button" onClick={() => this.handleTagClick(tag)}>
                        {tags.includes(tag) ? <strong>{tag}</strong> : tag}
                    </button>
                    ))}
                </div>
                <p2>Selected tags: {tags.join(', ')}</p2>
                <button className="postbike-create-form-button" onClick={this.handleCreateFormClick}>Create form</button>
            </div>
        );
    }
  }
}

export default Postbike;