
module.exports = {
  /**
   * Channels that the IPC are allowed to communicate between Main and Renderer
   */
  CLEARANCE_CHANNEL: /(user|os)\.pub\..+/,
  ONEDRIVE: 'onedrive',
  ONEDRIVE_EVENT_ISAUTHENTICATED: 'onedrive.event.is-authenticated',
  ONEDRIVE_EVENT_USERPROFILE: 'onedrive.event.user-profile',
  ONEDRIVE_REQUEST_USERPROFILE: 'onedrive.request.user-profile',
  ONEDRIVE_REQUEST_ACCESSTOKEN: 'onedrive.request.access-token',
  ONEDRIVE_KEYCHAIN_ACCOUNT: 'OneDriveKey',

  KEYCHAIN_SERVICE: 'Fossa Player',
}