import React, {Component} from 'react';
import Navbar from './Navbar'
import activity from 'lib/sugar-web/activity/activity'
import env from 'lib/sugar-web/env'
import presencepalette from 'lib/sugar-web/graphics/presencepalette'
import RecipeList from './RecipeList'
import '../style/RecipeApp.css';
import RecipeInput from "./RecipeInput";

class RecipeApp extends Component {

    isHost= false;
    presence= null;

    constructor(props){
        super(props);
        this.state={
            recipes: [
                {
                    id:0,
                    title: 'Spaghetti',
                    instructions: "Open jar of Spaghetti sauce.  Bring to simmer.  Boil water.  Cook pasta until done.  Combine pasta and sauce",
                    ingredients: ["pasta", "8 cups water", "1 box spaghetti"],
                    img: "https://www.cookingclassy.com/wp-content/uploads/2012/11/spaghetti+with+meat+sauce11.jpg"
                },
                {
                    id:1,
                    title: "Milkshake",
                    instructions: "Combine ice cream and milk.  Blend until creamy",
                    ingredients: ["2 Scoops Ice cream", "8 ounces milk"],
                    img: "https://fthmb.tqn.com/sHI14VwgA58daPo0TSY-ishRJk8=/2122x1415/filters:fill(auto,1)/172192393-56a20fea3df78cf7727188b7.jpg"
                },
                {
                    id:2,
                    title: "Avocado Toast",
                    instructions: "Toast bread.  Slice avocado and spread on bread.  Add salt, oil, and pepper to taste.",
                    ingredients: ["2 slices of bread", "1 avocado", "1 tablespoon olive oil", "1 pinch of salt", "pepper"],
                    img: "https://food.fnr.sndimg.com/content/dam/images/food/fullset/2015/12/11/0/FNK_All-the-Avocado-Toast_s4x3.jpg.rend.hgtvcom.616.462.suffix/1450059496131.jpeg"
                }
            ],
            nextRecipeId:3,
            isForm: false
        };

        this.handleSave= this.handleSave.bind(this);
        this.onDelete= this.onDelete.bind(this);
    }

    componentDidMount(){
        activity.setup();

        let currentenv;
        let isHost = false;
        let temp= this;
        env.getEnvironment(function(err, environment) {
            currentenv = environment;

            // Set current language to Sugarizer
            // let defaultLanguage = (typeof chrome != 'undefined' && chrome.app && chrome.app.runtime) ? chrome.i18n.getUILanguage() : navigator.language;
            // let language = environment.user ? environment.user.language : defaultLanguage;
            // webL10n.language.code = language;

            // Load from datastore
            if (!environment.objectId) {
                console.log("New instance");
            } else {
                activity.getDatastoreObject().loadAsText(function(error, metadata, data) {
                    if (error===null && data!==null) {
                        console.log("object found!");
                        let state= JSON.parse(data);
                        temp.setState(state);
                    }
                });
            }

            // Shared instances
            if (environment.sharedId) {
                console.log("Shared instance");
                temp.presence = activity.getPresenceObject(function(error, network) {
                    network.onDataReceived(temp.onNetworkDataReceived);
                    network.onSharedActivityUserChanged(temp.onNetworkUserChanged);
                });
            }
        });

        let palette = new presencepalette.PresencePalette(document.getElementById("network-button"), undefined);
        palette.addEventListener('shared', function() {
            palette.popDown();
            console.log("Want to share");
            temp.presence = activity.getPresenceObject(function(error, network) {
                if (error) {
                    console.log("Sharing error");
                    return;
                }
                network.createSharedActivity('org.sugarlabs.Demo', function(groupId) {
                    console.log("Activity shared");
                    isHost= true;
                });
                network.onDataReceived(temp.onNetworkDataReceived);
                network.onSharedActivityUserChanged(temp.onNetworkUserChanged);
            });
        });

        this.isHost= isHost;
    }

    onNetworkDataReceived= function (msg) {
        if (this.presence.getUserInfo().networkId === msg.user.networkId) {
            return;
        }
        switch (msg.content.action) {
            case 'init':
                console.log("init data wtf");
                break;
            case 'update':
                console.log("update data wtf");
                break;
        }
    };

    onNetworkUserChanged=(msg)=>{
        if (this.isHost) {
                console.log("i am host");
            }
        console.log("User "+msg.user.name+" "+(msg.move === 1 ? "join": "leave"));
    };

    handleSave(recipe){
        this.setState((prevState, props) => {
            const newRecipe = {...recipe, id: this.state.nextRecipeId};
            return {
                nextRecipeId: prevState.nextRecipeId+1,
                recipes: [...this.state.recipes, newRecipe],
                isForm: false
            }
        })
    }

    onDelete(id){
        const recipes= this.state.recipes.filter(r => r.id!== id);
        this.setState({recipes});
    }

    stopActivity(){
        console.log("writing...");
        let json= this.state;
        let jsonData = JSON.stringify(json);
        activity.getDatastoreObject().setDataAsText(jsonData);
        activity.getDatastoreObject().save(function (error) {
            if (error === null) {
                console.log("write done.");
            } else {
                console.log("write failed.");
            }
        });
    }

    render() {
        const {isForm}= this.state;
        return (
            <div>
                <Navbar onStop={()=> this.stopActivity()} onShowForm={()=> this.setState({isForm: true})}/>
                {isForm ? <RecipeInput
                    onSave={this.handleSave}
                    onClose={()=> this.setState({isForm: false})}
                />: null}
                <RecipeList onDelete={this.onDelete} recipes={this.state.recipes}/>
            </div>
        );
    }

}

export default RecipeApp;
