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
    window.api.receive('IsAuthenticated', (isAuthenticated) => {
      console.log('[IsAuthenticated] Received response', isAuthenticated);
      if(isAuthenticated) {
        window.api.send('AcquireUserInfo');
      } else {
        console.log('Cant authenticate...')
      }
    });

    window.api.receive('UserInfo', (userInfo) => {
      this.setState({
        username: userInfo.username
      });
    });
  }

  handleClick() {
    window.api.send('AcquireToken');
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