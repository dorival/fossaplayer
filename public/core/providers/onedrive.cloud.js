const constants = require('../constants');
const { ipcMain } = require('electron');
const { PublicClientApplication } = require('msal-electron-poc');
const { PublicCommunication } = require('../base/public-communication');
const keytar = require('keytar');
const fetch = require("electron-fetch").default;
const isObject = require('lodash.isobject');

// --- this will leave once build processes can inject proper ClientId
const fs = require('fs');
const path = require('path');

let rawdata = fs.readFileSync(path.resolve(__dirname, '../keys.secret'));
console.log(path.resolve(__dirname, '../keys.secret'));
let config = JSON.parse(rawdata);
// ---


/**
 * Manages all interaction between the player and Microsoft OneDrive Cloud Storage
 */
class OneDriveProvider extends PublicCommunication {
  /**
   * Provider Name
   */
  name = constants.ONEDRIVE;

  /**
   * Base API URI
   */
  api = 'https://graph.microsoft.com/v1.0';
  
  constructor(parentWindow) {
    super(parentWindow);

    // Token
    ipcMain.on('user.pub.' + constants.ONEDRIVE_REQUEST_ACCESSTOKEN, () => { this.getAccessToken(); });

    // Profile
    ipcMain.on('user.pub.' + constants.ONEDRIVE_REQUEST_USERPROFILE, () => { this.showUserInfo(); });
  }

  /**
   * Get the OneDrive Access Token to execute requests
   */
  async getAccessToken() {

    let accessToken = await keytar.getPassword(constants.KEYCHAIN_SERVICE, constants.ONEDRIVE_KEYCHAIN_ACCOUNT);
    if (accessToken) {
      this.publish(constants.ONEDRIVE_EVENT_ISAUTHENTICATED, true);
      return;
    }

    const msal = new PublicClientApplication({
      clientId: config.clientId
    });

    const tokenRequest = {
      // Fossa Player only requires read access to user files and
      // basic profile information access
      scopes: ['user.read', 'files.read'],
    };
  
    try {
      const accessToken = await msal.acquireToken(tokenRequest);
      await keytar.setPassword(constants.KEYCHAIN_SERVICE, constants.ONEDRIVE_KEYCHAIN_ACCOUNT, accessToken);
      this.publish(constants.ONEDRIVE_EVENT_ISAUTHENTICATED, true);
    } catch (error) {
      this.publish(constants.ONEDRIVE_EVENT_ISAUTHENTICATED, false);
      console.error(error);
    }
  }

  async showUserInfo() {
    
    const accessToken = await keytar.getPassword(
      constants.KEYCHAIN_SERVICE, 
      constants.ONEDRIVE_KEYCHAIN_ACCOUNT);

    fetch(`${this.api}/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        if (response && response.ok === true) {
          response.json().then((body) => {
            const userInfo = {
              provider: this.name,
              username: `${body.displayName} (${body.userPrincipalName})`,
            };
            this.publish(constants.ONEDRIVE_EVENT_USERPROFILE, userInfo)
          });
        } else {
          this.publish(constants.ONEDRIVE_EVENT_USERPROFILE, {
            username: 'Not Authenticated',
          });
        }
      })
      .catch((error) => {
        this.publish(constants.ONEDRIVE_EVENT_USERPROFILE, { username: error.description });
      });
  }

  /**
   * Publish messages to the Renderer Process
   *
   * @param {string} path Path (or topic) of the message
   * @param {*} payload Content of the message
   * @override
   */
  publish(path, payload) {
    const content = isObject(payload)
      ? { provider: constants.ONEDRIVE, ...payload }
      : payload;

      super.publish('user', path, content);
  }

}

module.exports = { OneDriveProvider }