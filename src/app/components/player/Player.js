import React from 'react';

class Player extends React.Component {

  constructor() {
    super();
    this.state = {
      username: 'Anon'
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    window.api.receive('user.pub.onedrive.event.is-authenticated', (isAuthenticated) => {
      console.log('[IsAuthenticated] Received response', isAuthenticated);
      if(isAuthenticated) {
        window.api.send('user.pub.onedrive.request.user-profile');
      } else {
        console.log('Cant authenticate...')
      }
    });

    window.api.receive('user.pub.onedrive.event.user-profile', (userInfo) => {
      this.setState({
        username: userInfo.username
      });
    });
  }

  handleClick() {
    window.api.send('user.pub.onedrive.request.access-token');
  }

  render() {
    return (
      <>
        <h1>Hello {this.state.username}!</h1>
        <button onClick={this.handleClick}>Authenticate</button>
      </>
    );
  }
}

export default Player;