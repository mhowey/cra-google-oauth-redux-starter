import React from 'react'
import { connect } from 'react-redux'
import { signIn, signOut } from '../actions'

class GoogleAuth extends React.Component {
  componentDidMount() {
    console.log('GoogleAuth Mounted')
    // load provides a callback..
    window.gapi.load('client:auth2', () => {
      window.gapi.client
        // init returns a promise..
        .init({
          clientId:
            '1013610839934-57c0rqb74hv1b0dkhg2ta8c3etd2616s.apps.googleusercontent.com',
          scope: 'email',
        })
        // when the promise returns then...
        .then(() => {
          // this.auth is our component reference to the auth object
          this.auth = window.gapi.auth2.getAuthInstance()

          // set the signed in state based on the isSignedIn.get prototype method
          // this.setState({ isSignedIn: this.auth.isSignedIn.get() })

          // by calling onAuthChange() it will set the state of isSignedIn correctly for us
          this.onAuthChange(this.auth.isSignedIn.get())

          // use the isSignedIn.listen prototype method to fire our onAuthChange method
          this.auth.isSignedIn.listen(this.onAuthChange)
        })
    })
  }

  // when the auth change is fired, set the isSignedIn state to the value from the auth api
  onAuthChange = isSignedIn => {
    // this.setState({ isSignedIn: this.auth.isSignedIn.get() })
    if (isSignedIn) {
      this.props.signIn()
    } else {
      this.props.signOut()
    }
  }

  onSignInClick = () => {
    this.auth.signIn()
  }

  onSignOutClick = () => {
    this.auth.signOut()
  }

  renderAuthButton() {
    if (this.props.isSignedIn === null) {
      return <div>Checking...</div>
    } else if (this.props.isSignedIn) {
      return (
        <button onClick={this.onSignOutClick} className="ui red google button">
          <i className="google icon" />
          Sign Out.
        </button>
      )
    } else {
      return (
        <div>
          <button
            onClick={this.onSignInClick}
            className="ui green google button"
          >
            <i className="google icon" />
            Sign in with Google.
          </button>
        </div>
      )
    }
  }

  render() {
    return <div>{this.renderAuthButton()}</div>
  }
}

const mapStateToProps = state => {
  return { isSignedIn: state.auth.isSignedIn }
}

export default connect(
  mapStateToProps,
  { signIn, signOut }
)(GoogleAuth)
