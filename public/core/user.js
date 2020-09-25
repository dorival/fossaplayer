const { OneDriveProvider } = require('./providers/onedrive.cloud');

const availableProviders = [
  OneDriveProvider
];

/**
 * Handles all user Requests
 */
class UserService {

  /**
   * For IPC communication
   */
  channel = 'user';

  /**
   * Reference to the main Electron window
   */
  parentWindow;

  /**
   * Providers ready to use
   */
  providers = [];
  
  /**
   * Instantiate User
   * @param {BrowserWindow} parentWindow Reference to the main electron browser window
   */
  constructor(parentWindow) {
    this.parentWindow = parentWindow;

    // Prepare Providers
    this.prepareProviders();
  }

  /**
   * Use User Module
   * @param {*} parentWindow Window where this object will derive new windows and processes
   */
  static use(parentWindow) {
    return new UserService(parentWindow);
  }

  prepareProviders() {
    availableProviders.forEach(provider => {
      this.providers.push(new provider(this.parentWindow))
    });
  }
}

module.exports = {
  UserService
}