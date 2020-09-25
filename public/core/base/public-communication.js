class PublicCommunication {
  /**
   * Reference to the main Electron window
   */
  parentWindow;
  
  /**
   * Instantiate User
   * @param {BrowserWindow} parentWindow Reference to the main electron browser window
   */
  constructor(parentWindow) {
    this.parentWindow = parentWindow;
  }

  /**
   * Publish messages to the Renderer Process
   *
   * @param {string} channel Domain of the message used to build the namespace
   * @param {string} path Path (or topic) of the message
   * @param {*} payload Content of the message
   */
  publish(channel, path, payload) {
    this.parentWindow.webContents.send(`${channel}.pub.${path}`, payload);
  }
}

module.exports = {
  PublicCommunication
}