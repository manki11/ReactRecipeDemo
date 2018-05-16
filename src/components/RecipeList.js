import React, {Component} from 'react';
import Recipe from './Recipe'
import '../style/RecipeList.css'

class RecipeList extends Component {

    render() {
        const {onDelete}= this.props;
        const recipes = this.props.recipes.map((r, index) => (<Recipe onDelete={onDelete} key={r.id} {...r}/>));

        return (
            <div className="recipe-list">
                {recipes}
            </div>
        );
    }
}


export default RecipeList;