// ========== DEPENDENCIES ========== //
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { axiosWithAuth } from '../utilities/axiosWithAuth.js';
import axios from 'axios';
// ========== IMPORTED COMPONENTS ========== //
import UserProfileTabs from './UserProfile_Tabs';
// ========== STYLES ========== //
import '../SASS/UserProfile.scss';

class UserProfile_LI extends Component {
  constructor(props) {
    super(props);
    this.state = {
      followers: [],
      following: [],
      userId: this.props.match.params.id,
      userData: []
    };
  }

  // API CALL FUNCTIONS TO RECEIVE USER'S PROFILE DATA
  fetch() {
    console.log('hello from fetch');
    const userId = this.state.userId;
    function getFollowingCount() {
      return axiosWithAuth().get(`/api/v1/followers/count/following/${userId}`);
    }
    function getFollowerCount() {
      return axiosWithAuth().get(`/api/v1/followers/count/followers/${userId}`);
    }
    function getUserData() {
      return axiosWithAuth().get(`/api/v1/users/${userId}`);
    }
    return axios
      .all([getFollowingCount(), getFollowerCount(), getUserData()])
      .then(
        axios.spread((a, b, c) => {
          console.log(a);
          this.setState(
            {
              following: a.data[0].count,
              followers: b.data[0].count,
              userData: c.data[0]
            },
            () => {
              console.log('HIIIIIII!');
            }
          );
        })
      )
      .catch(err => err);
  }

  componentDidMount() {
    this.fetch();
    this.props.history.push(
      `/profile/${this.props.match.params.id}/${this.state.userData.username}`
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.userId !== prevProps.match.params.id) {
      console.log('UPDATE OVER HERE');
      this.fetch();
    }
  }

  render() {
    const userData = this.state.userData;
    return (
      <div className="user-profile-container">
        <div className="user-header">
          <img src={userData.avatar} className="avatar" alt="avatar" />
          <div className="user-info">
            <h1 className="userFLname">
              {userData.firstName} {userData.lastName}
            </h1>
            <h2 className="username">{userData.username}</h2>
            <p className="bio">{userData.bio}</p>
            <div className="user-info-location-website">
              <p>{userData.location}</p>
              <a
                href={userData.website}
                target="_blank"
                rel="noopener noreferrer"
                className="website"
              >
                {userData.website}
              </a>
            </div>
          </div>
          <div className="user-data-container">
            <div className="user-data">
              <div className="count-flex">
                <h6>Projects</h6>
                <p>12</p>
              </div>
              <div className="count-flex">
                <h6>Followers</h6>
                <p>{this.state.followers}</p>
              </div>
              <div className="count-flex">
                <h6>Following</h6>
                <p>{this.state.following}</p>
              </div>
              <div className="count-flex">
                <h6>Starred</h6>
                <p>143</p>
              </div>
            </div>
            <div className="teams-container">
              <div className="teams">
                {/* <h6>Teams</h6>
                {teams.teams.map(team => (
                  <img
                    key={team.avatar}
                    src={team.avatar}
                    className="team-avatar"
                    alt="team avatars"
                  />
                ))} */}
              </div>
              <div>
                <Link to="/settings">
                  <button className="edit-profile-btn">Edit Profile</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <UserProfileTabs />
      </div>
    );
  }
}

export default UserProfile_LI;
