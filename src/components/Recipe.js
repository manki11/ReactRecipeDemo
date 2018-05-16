import React, {Component} from 'react';
import '../style/Recipe.css'

class Recipe extends Component {
    render() {
        const {title, instructions, img, id, onDelete} = this.props;
        const ingredients = this.props.ingredients.map((ing, index) => (<li key={index}>{ing}</li>));
        return (
            <div className="recipe-card">
                <div className="recipe-img">
                    <img src={img} alt=""/>
                </div>
                <div className="recipe-card-content">
                    <h3 className="recipe-title">{title}</h3>
                    <h4>Ingredients:</h4>
                    <ul>{ingredients}</ul>
                    <h4>Instructions:</h4>
                    <p>{instructions}</p>
                    <button type="button" onClick={()=> onDelete(id)}>DELETE</button>
                </div>
            </div>
        );
    }
}

export default Recipe;