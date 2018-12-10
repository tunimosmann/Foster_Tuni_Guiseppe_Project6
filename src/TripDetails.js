import React, { Component } from 'react';
import './App.css';
import activitiesArray from './activitiesArray.js'

class Test extends Component {
    constructor() {
        super();
        this.state = {
            groupMembers: [],
            friendEmail: "",
            cities: [
                {
                    city: "",
                    type: "",
                    votes: 1
                }
            ],
            typeChoices: activitiesArray,
            citySuggestion: "",
            typeSuggestion: "",
            selectedCities: []
        }
    }

    //handle change
    //couldn't figure out how to make it work as a prop, added here
    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };

    //add city
    //adding a city to our cities array
    addCity = event => {
        event.preventDefault();

        //cloning the array
        const newCities = Array.from(this.state.cities)

        //adding the new city
        newCities.push({
            city: this.state.citySuggestion,
            type: this.state.typeSuggestion,
            votes: 1
        });

        //updating the array
        this.setState({
            cities: newCities
        })

        //reseting
        this.setState({
            citySuggestion: "",
            typeSuggestion: ""
        })
    }

    //add vote
    //adding votes until it reaches the majority of votes
    addVote = (event) => {

        //creating a variable for how many votes it has
        //MAKE THIS IN A WAY THAT WORKS BETTER FOR EVERY BOARD
        const totalVotes = this.state.cities[event.target.className].votes;

        //creating a variable to determine majority of votes
        const stopVotes = Math.floor(this.state.groupMembers.length / 2 + 1);

        if (totalVotes < stopVotes) {

            //cloning the array
            const addingVote = Array.from(this.state.cities)

            //adding a vote to the array
            addingVote[event.target.className].votes++

            //updating the array
            this.setState({
                cities: addingVote
            })

            this.addSelecteddCity()
        }
    }

    //subtract vote
    //subtract votes until it reaches the majority of votes
    subtractVote = (event) => {

        //creating a variable for how many votes it has
        //MAKE THIS IN A WAY THAT WORKS BETTER FOR EVERY BOARD
        const totalVotes = this.state.cities[event.target.className].votes;

        //creating a variable to determine majority of votes
        const stopVotes = Math.floor(this.state.groupMembers.length / 2 + 1);

        if (totalVotes < stopVotes && totalVotes > 1) {

            //cloning the array
            const subtractingVote = Array.from(this.state.cities)

            //subtracting a vote from the array
            subtractingVote[event.target.className].votes--

            //updating the array
            this.setState({
                cities: subtractingVote
            })
        }
    }

    addSelecteddCity = () => {

        //creating a variable to determine majority of votes
        const stopVotes = Math.floor(this.state.groupMembers.length / 2 + 1);

        //identifying the cities that were selected
        const selectedCity = this.state.cities.filter((item) => {
            return item.votes === stopVotes;
        })

        //cloning the array
        const newSelectedCities = Array.from(this.state.selectedCities)

        //concat the old array and the new array
        const combinedArray = newSelectedCities.concat(selectedCity);

        //updating the array
        this.setState({
            selectedCities: combinedArray
        })
    }

    render() {
        return (
            <div className="tripDetails">
                <header className="tripDetails__header header">
                    {/* displaying the country and the type of trip that the user chose */}
                    <h2 className="header__heading header__heading--h2">Trip to {this.props.country}</h2>

                    <h3 className="header__heading header__heading--h3">{this.props.type}</h3>
                </header>

                <aside>
                    {/* mapping through this group members array to display them one by one, with photo and name */}
                    {this.state.groupMembers.map(member => {
                        return (
                            <div className="group__member user">
                                <div className="user__photoContainer">
                                    {/* keys will come from the user object that aith will provide */}
                                    <img src={member.photoURL} alt={member.name} className="user__photo" />
                                </div>

                                <p className="user__name">{member.name}</p>
                            </div>
                        )
                    })}

                    {/* button to activate a pop up window to add friends to that group */}
                    <button onClick={this.props.popUp} className="group__button">Add a Friend</button>

                    {
                        this.props.popUpButton
                            ? (
                                <div className="popUp">
                                    <h3 className="popUp__heading">Invite a Friend</h3>

                                    <p className="popUp__text">Send an invitation to join this group:</p>

                                    {/* calling the function that will send invites */}
                                    <form onSubmit={this.props.inviteFriend} className="popUp__form" action="">
                                        <label htmlFor="friendEmail" className="popUp__label visuallyhidden">Type your friend's email.</label>
                                        <input
                                            type="email"
                                            id="friendEmail"
                                            className="popUp__input"
                                            placeholder="Your friend's email"
                                            onChange={this.handleChange}
                                            value={this.state.friendEmail}
                                        />

                                        <input type="submit" value="Invite" className="popUp__submit" />
                                    </form>

                                    {/* stretch goal: add by username */}
                                    {/* make into component, add button to send and then go back to the form */}

                                    {/* button to close the pop up window */}
                                    <div className="popUp__close">
                                        <img onClick={this.props.popUp} src="http://www.clker.com/cliparts/x/W/f/4/C/s/close-button-th.png" alt="" className="popUp__icon" />
                                    </div>
                                </div>
                            )
                            :
                            (
                                <div className="popUp popUp--hidden">
                                </div>
                            )
                    }
                </aside>

                <div className="boards">
                    <div className="boards__board">
                        <h4 className="boards__heading boards__heading--h4">Where are we going?</h4>

                        <div className="boards__voting">
                            {//display every city/type inside cities array in state so users can vote
                                this.state.cities.map((item, i) => {

                                    //creating a variable to determine majority of votes
                                    const stopVotes = Math.floor(this.state.groupMembers.length / 2 + 1);

                                    if (this.state.cities[i].votes === stopVotes) {

                                        return (
                                            <div className="boards__option option">
                                                <p className="option__title option__title--selected">{item.city}</p>

                                                <p className="option__type option__type--selected">{item.type}</p>
                                            </div>
                                        )
                                    } else {
                                        return (
                                            <div className="boards__option option">
                                                <p className="option__title">{item.city}</p>

                                                {/* +1 voting button */}
                                                <div className="option__addVote">
                                                    <img onClick={this.addVote} src="https://cdn0.iconfinder.com/data/icons/large-glossy-icons/64/Apply.png" alt="" className={i}
                                                        key={i}
                                                    />
                                                </div>

                                                <p className="option__type">{item.type}</p>

                                                {/* -1 voting button */}
                                                <div className="option__subtractVote">
                                                    <img onClick={this.subtractVote} src="http://www.clker.com/cliparts/x/W/f/4/C/s/close-button-th.png" alt="" alt="" className={i}
                                                        key={i}
                                                    />
                                                </div>

                                                <p className="option__votes">{item.votes}</p>
                                            </div>
                                        )
                                    }
                                })
                            }
                        </div>

                        {/* ADD OPTION START */}
                        <div className="boards__add add">
                            <p className="add__text">Add city to be voted:</p>

                            <form onSubmit={this.addCity} action="" className="add__form">
                                <label htmlFor="citySuggestion" className="add__label visuallyhidden">Suggest a city to visit.</label>
                                <input
                                    type="text"
                                    id="citySuggestion"
                                    className="add__city"
                                    placeholder="City"
                                    onChange={this.handleChange}
                                    value={this.state.citySuggestion}
                                />

                                <label htmlFor="typeSuggestion">Choose the type of trip you wish to take:</label>
                                <select
                                    defaultValue="typeSuggestion"
                                    name="typeSuggestion"
                                    id="typeSuggestion"
                                    className="add__type"
                                    onChange={this.handleChange}
                                    required>
                                    <option disabled="disabled" selected="selected" value="typeSuggestion">--Type of trip--</option>
                                    {this.state.typeChoices.map((type) => {
                                        return (
                                            <option key={type} value={type}>{type}</option>
                                        )
                                    })}
                                </select>

                                <input type="submit" value="Add" className="add__submit" />
                            </form>
                        </div>
                        {/* ADD OPTION END */}

                    </div>
                </div>
            </div>
        )
    }

    componentDidMount() {



        // //creating a variable to determine majority of votes
        // const stopVotes = Math.floor(this.state.groupMembers.length / 2 + 1);

        // if (this.state.cities[i].votes == stopVotes) {
        //     const votedCity = Array.from(this.state.votedCities)

        //     //adding the new city
        //     votedCity.push({
        //         city: item.city,
        //         type: item.type
        //     })

        //     //updating the array
        //     this.setState({
        //         votedCities: votedCity
        //     })                           
        // }                     


        this.setState({
            // adding the initial group members to this component array
            groupMembers: this.props.groupMembers,
            //adding the city that the group creator chose in the first form, it has to be an array
            cities: [
                {
                    city: this.props.city,
                    type: this.props.type,
                    votes: 1
                }
            ]
        })
    }
}

export default Test;

//////////////////////////////////////////
//ON APP STATE

// this.state = {
//     userChoice: {
//         country: "",
//         city: "",
//         type: ""
//     },
//     groupMembers: [ //info that auth is returning about members
//         {
//             name: "",
//             photoURL: ""
//         }
//     ],
//     popUpButton: false
// }

//////////////////////////////////////////
//APP FUNCTIONS

//Pop Up
// function to make a pop up appear when a button is clicked
// initial state in main app should be: false
// this will be used to add user in TripDetails and open the new trip form in TripDashboard

// popUp = event => {
//     event.preventDefault();

//     if (this.state.popUpButton === false) {
//         this.setState({
//             popUpButton: true
//         })
//     } else if (this.state.popUpButton === true) {
//         this.setState({
//             popUpButton: false
//         })
//     }
// }

//Invite Friend
//use same functionality as add friends from when you create a group

// inviteFriend = (event) => {
//     //preventing the form from refreshing the page
//     event.preventDefault();

//     console.log("I will work in the future!")
//     //this function should send an email invitation
//     //after the user sign up, add him to this group
// }

//////////////////////////////////////////
//ON APP RENDER

/* <TripDetails
    country={this.state.userChoice.country}
    city={this.state.userChoice.city}
    type={this.state.userChoice.type}
    groupMembers={this.state.groupMembers}
    popUp={this.popUp}
    popUpButton={this.state.popUpButton}
    inviteFriend={this.inviteFriend}
/> */