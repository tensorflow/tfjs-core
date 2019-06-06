/**
 * Copyright (c) xzh <https://github.com/Adherentman>
 * project: https://github.com/Adherentman/Typescript-wxApi.d.ts
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Common Types
interface string2AnyMap {
  [key: string]: any;
}

interface string2stringMap {
  [key: string]: string | null;
}

type ZeroParamVoidFunc = () => void;

interface ReturnCallBack {
  (res: ZeroParamVoidFunc): any;
}
interface createLiveObj extends WxApiCallback {}

// App Types
interface AppReferrerInfo {
  appId: string;
  extraData: any;
}

interface AppLaunchShowFuncOpts {
  path: string;
  query: string2stringMap;
  scene: number;
  shareTicket: string;
  referrerInfo: AppReferrerInfo;
}

type AppLaunchShowFunc = (options: AppLaunchShowFuncOpts) => void;

interface AppOpts {
  onLaunch?: AppLaunchShowFunc;
  onShow?: AppLaunchShowFunc;
  onHide?: ZeroParamVoidFunc;
  onError?: (msg: string) => void;

  [key: string]: any;
}

interface IApp extends AppOpts {}

// Page Types
interface PageOpts<Data = {}> {
  data?: Data;
  onLoad?: (options: string2stringMap) => void;
  onReady?: ZeroParamVoidFunc;
  onShow?: ZeroParamVoidFunc;
  onHide?: ZeroParamVoidFunc;
  onUnload?: ZeroParamVoidFunc;
  /**
   * 在 Page 中定义 onPullDownRefresh 处理函数，监听该页面用户下拉刷新事件。
   */
  onPullDownRefresh?: ZeroParamVoidFunc;
  onReachBottom?: ZeroParamVoidFunc;
  /**
   * 在 Page 中定义 onShareAppMessage 事件处理函数，自定义该页面的转发内容。
   */
  onShareAppMessage?: ZeroParamVoidFunc;
  onPageScroll?: ZeroParamVoidFunc;
  onTabItemTap?: (item: any) => void;

  [key: string]: any;
}

interface IPage<Data = {}> extends PageOpts<Data> {
  setData: (data: string2AnyMap) => void;
}

// Component Types
interface IComponent {}

interface WxApiCallback<Res = undefined> {
  success?: (res: Res) => void;
  fail?: (err: any) => void;
  complete?: (obj: any) => void;
}

/**
 * Network APIs
 */
// 发起请求
type NetworkRequestData = string | object | ArrayBuffer;

interface NetworkRequestRes {
  data: NetworkRequestData;
  statusCode: number;
  header: string2stringMap;
}

interface NetworkRequestOpts extends WxApiCallback<NetworkRequestRes> {
  url: string;
  data?: NetworkRequestData;
  header?: string2stringMap;
  method?:
    | "OPTIONS"
    | "GET"
    | "HEAD"
    | "POST"
    | "PUT"
    | "DELETE"
    | "TRACE"
    | "CONNECT";
  dataType?: string;
  responseType?: "text" | "arraybuffer";
}

interface requestTask {
  abort: ZeroParamVoidFunc;
}

// 上传
interface uploadFileRes {
  data: string;
  statusCode: number;
}

interface uploadFileOpts extends WxApiCallback<uploadFileRes> {
  url: string;
  filePath: string;
  name: string;
  header?: object;
  formData?: object;
}

interface onProgressUpdateRes {
  progress: number;
  totalBytesSent: number;
  totalBytesExpectedToWrite: number;
}

interface onProgressUpdateCallback {
  (res: onProgressUpdateRes): void;
}
interface uploadTask {
  onProgressUpdate(res: onProgressUpdateCallback): void;
  abort: ZeroParamVoidFunc;
}

// 下载
interface downloadRes {
  tempFilePath: string;
  statusCode: number;
}

interface downloadFileOpts extends WxApiCallback<downloadRes> {
  url: string;
  header?: object;
  filePath: string;
}

interface downloadTask {
  onProgressUpdate(res: onProgressUpdateCallback): void;
  abort: ZeroParamVoidFunc;
}

// Webscoket connectSocket
interface connectSocketOpts extends WxApiCallback {
  url: string;
  header?: object;
  method?: string;
  protocols?: string[];
}

// 监听WebSocket连接打开事件。
interface onSocketOpenRes {
  header?: object;
}
interface onSocketOpenCallBack {
  (res: onSocketOpenRes): void;
}

interface onSocketErrorCallBack {
  (res: any): void;
}
// sendSocketMessage
interface sendSocketMessageOpts extends WxApiCallback<sendSocketMessageRes> {}

interface sendSocketMessageRes {
  data: string | ArrayBuffer;
}

//onSocketMessage
interface onSocketMessageRes {
  data: string | ArrayBuffer;
}
interface onSocketMessageCallback {
  (res: onSocketMessageRes): void;
}

//closeSocket
interface closeSocketOpts extends WxApiCallback<closeSocketRes> {}

interface closeSocketRes {
  code?: number;
  reason?: string;
}

interface onSocketCloseCallBack {
  (res: any): void;
}

interface NetworkAPIs {
  // 发起请求
  request: (options: NetworkRequestOpts) => requestTask;
  // 上传、下载
  uploadFile: (options: uploadFileOpts) => uploadTask;
  downloadFile: (options: downloadFileOpts) => downloadTask;
  // WebSocket
  connectSocket: (options: connectSocketOpts) => void;
  onSocketOpen: (callback: onSocketOpenCallBack) => void;
  onSocketError: (callback: onSocketErrorCallBack) => void;
  sendSocketMessage: (options: sendSocketMessageOpts) => void;
  onSocketMessage: (options: onSocketMessageCallback) => void;
  closeSocket: (options: closeSocketOpts) => void;
  onSocketClose: (callback: onSocketCloseCallBack) => void;
}

/**
 * SocketTask APIs
 */
//send
interface sendOpts extends WxApiCallback<sendRes> {}

interface sendRes {
  data?: string | ArrayBuffer;
}

interface onOpenRes {
  header: object;
}

interface onOpenCallBack {
  (res: onOpenRes): void;
}
//close
interface closeOpts extends WxApiCallback<closeRes> {}

interface closeRes {
  code?: number;
  reason?: string;
}

// onClose
interface onCloseCallBack {
  (res: any): void;
}

//onError
interface onErrorOpts {
  errMsg?: string;
}

interface onErrorCallBack {
  (res: onErrorOpts): void;
}

//onMessage
interface onMessageOpts {
  data?: string | ArrayBuffer;
}

interface onMessageCallBack {
  (res: onMessageOpts): void;
}
interface SocketTaskAPIs {
  send: (options?: sendOpts) => void;
  close: (options?: closeOpts) => void;
  onOpen: (res: onOpenCallBack) => void;
  onClose: (res: onCloseCallBack) => void;
  onError: (res: onErrorCallBack) => void;
  onMessage: (res: onMessageCallBack) => void;
}

/**
 * Media APIs
 */
// picture 图片
interface tempFilesStruct {
  path: string;
  size: number;
}

interface chooseImageRes {
  tempFilePaths: string[];
  tempFiles: tempFilesStruct;
}

interface chooseImageOpts extends WxApiCallback<chooseImageRes> {
  count?: number;
  sizeType?: string[];
  sourceType?: string[];
}

interface previewImageOpts extends WxApiCallback {
  current?: string;
  urls: string[];
}

interface getImageInfoRes {
  width: number;
  height: number;
  path: string;
  /**
   * 1.9.90
   */
  orientation:
    | "up"
    | "down"
    | "left"
    | "right"
    | "up-mirrored"
    | "down-mirrored"
    | "left-mirrored"
    | "right-mirrored";
  /**
   * 1.9.90
   */
  type: string;
}

interface getImageInfoOpts extends WxApiCallback<getImageInfoRes> {
  src: string;
}

interface saveImageToPhotosAlbumRes {
  errMsg: string;
}

interface saveImageToPhotosAlbumOpts extends WxApiCallback {
  filePath: string;
}

// Record 录音
interface startRecordRes {
  tempFilePath: string;
}

interface startRecordOpts extends WxApiCallback<startRecordRes> {}

interface RecordStartOpts {
  duration?: number;
  sampleRate?: number;
  /**
   * numberOfChannels有效值 1/2
   */
  numberOfChannels?: number;
  encodeBitRate?: number;
  /**
   * format有效值aac/mp3
   */
  format?: string;
  frameSize?: number;
  audioSource?: string;
}

interface RecordOnStopRes {
  tempFilePath: string;
}

interface RecordOnStopCallBack {
  (res: RecordOnStopRes): void;
}

interface onFrameRecordedRes {
  frameBuffer: ArrayBuffer;
  isLastFrame: boolean;
}

interface onFrameRecordedCallBack {
  (res: onFrameRecordedRes): void;
}

interface RecordOnErrorRes {
  errMsg: string;
}

interface RecordOnErrorCallBack {
  (res: RecordOnErrorRes): void;
}

interface getRecorderManagerOpts {
  /**
   * 开始录音
   */
  start: (options: RecordStartOpts) => void;
  /**
   * 暂停录音
   */
  pause: ZeroParamVoidFunc;
  /**
   * 继续录音
   */
  resume: ZeroParamVoidFunc;
  /**
   *  停止录音
   */
  stop: ZeroParamVoidFunc;
  /**
   * 监听录音开始事件
   */
  onStart: ReturnCallBack;
  /**
   * 监听录音继续事件
   */
  onResume: ReturnCallBack;
  /**
   * 监听录音暂停事件
   */
  onPause: ReturnCallBack;
  /**
   * 监听录音结束事件
   */
  onStop: (res: RecordOnStopCallBack) => void;
  /**
   * 监听已录制完指定帧大小的文件事件。如果设置了 frameSize，则会回调此事件。
   */
  onFrameRecorded: (res: onFrameRecordedRes) => void;
  /**
   * 监听录音错误事件
   */
  onError: (res: RecordOnErrorCallBack) => void;
  /**
   * 监听录音因为受到系统占用而被中断开始事件。
   */
  onInterruptionBegin: ReturnCallBack;
  /**
   * 监听录音中断结束事件。
   */
  onInterruptionEnd: ReturnCallBack;
}

// Voice 音频
interface playVoiceOpts extends WxApiCallback {
  filePath: string;
  duration?: number;
}

interface getBackgroundAudioPlayerStateRes {
  duration: number;
  currentPosition: number;
  status: "2" | "1" | "0";
  downloadPercent: number;
  dataUrl: string;
}

interface getBackgroundAudioPlayerStateOpts
  extends WxApiCallback<getBackgroundAudioPlayerStateRes> {}

interface playBackgroundAudioOpts extends WxApiCallback {
  dataUrl: string;
  title?: string;
  coverImgUrl?: string;
}

interface seekBackgroundAudioOpts extends WxApiCallback {
  position: number;
}

interface getBackgroundAudioManagerOpts {
  duration: number;
  currentTime: number;
  paused: boolean;
  src: string;
  startTime: number;
  buffered: number;
  title: string;
  epname: string;
  singer: string;
  coverImgUrl: string;
  webUrl: string;
  /**
   * 支持版本1.9.94
   */
  protocol: string;
  play: ZeroParamVoidFunc;
  pause: ZeroParamVoidFunc;
  stop: ZeroParamVoidFunc;
  seek: (position: any) => void;
  onCanplay: (callback: ReturnCallBack) => void;
  onPlay: (callback: ReturnCallBack) => void;
  onPause: (callback: ReturnCallBack) => void;
  onStop: (callback: ReturnCallBack) => void;
  onEnded: (callback: ReturnCallBack) => void;
  onTimeUpdate: (callback: ReturnCallBack) => void;
  onPrev: (callback: ReturnCallBack) => void;
  onNext: (callback: ReturnCallBack) => void;
  onError: (callback: ReturnCallBack) => void;
  onWaiting: (callback: ReturnCallBack) => void;
}

interface createInnerAudioContextonErrorRes {
  errMsg: any;
  errCode: any;
}
interface createInnerAudioContextonErrorCallBack {
  (callback: createInnerAudioContextonErrorRes): any;
}
interface createInnerAudioContextOpts {
  src: string;
  startTime: number;
  autoplay: boolean;
  loop: boolean;
  obeyMuteSwitch: boolean;
  duration: number;
  currentTime: number;
  paused: boolean;
  buffered: number;
  /**
   * 支持版本1.9.90
   */
  volume: number;
  play: ZeroParamVoidFunc;
  pause: ZeroParamVoidFunc;
  stop: ZeroParamVoidFunc;
  seek: (position: any) => void;
  destroy: ZeroParamVoidFunc;
  onCanplay: (callback: ReturnCallBack) => void;
  onPlay: (callback: ReturnCallBack) => void;
  onPause: (callback: ReturnCallBack) => void;
  onStop: (callback: ReturnCallBack) => void;
  onEnded: (callback: ReturnCallBack) => void;
  onTimeUpdate: (callback: ReturnCallBack) => void;
  onError: (callback: createInnerAudioContextonErrorCallBack) => void;
  onWaiting: (callback: ReturnCallBack) => void;
  onSeeking: (callback: ReturnCallBack) => void;
  onSeeked: (callback: ReturnCallBack) => void;
  /**
   * 以下方法支持的版本为1.9.0
   */
  offCanplay: (callback: ReturnCallBack) => void;
  offPlay: (callback: ReturnCallBack) => void;
  offPause: (callback: ReturnCallBack) => void;
  offStop: (callback: ReturnCallBack) => void;
  offEnded: (callback: ReturnCallBack) => void;
  offTimeUpdate: (callback: ReturnCallBack) => void;
  offError: (callback: ReturnCallBack) => void;
  offWaiting: (callback: ReturnCallBack) => void;
  offSeeking: (callback: ReturnCallBack) => void;
  offSeeked: (callback: ReturnCallBack) => void;
}

interface getAvailableAudioSourcesRes {
  audioSources: string[];
}

interface getAvailableAudioSourcesOpts
  extends WxApiCallback<getAvailableAudioSourcesRes> {}

// Video 视频

interface chooseVideoRes {
  tempFilePath: string;
  duration: number;
  size: string;
  height: number;
  width: number;
}

interface chooseVideoOpts extends WxApiCallback<chooseImageRes> {
  sourceType?: string[];
  compressed?: boolean;
  maxDuration?: number;
}

interface saveVideoToPhotosAlbumRes {
  errMsg: string;
}

interface saveVideoToPhotosAlbumOpts
  extends WxApiCallback<saveImageToPhotosAlbumRes> {
  filePath: string;
}

interface Videodanmu {
  text: string;
  color: string;
}

interface createVideoContextOpts {
  play: ZeroParamVoidFunc;
  pause: ZeroParamVoidFunc;
  seek: (position: any) => void;
  sendDanmu: (danmu: Videodanmu) => void;
  playbackRate: (rate: any) => void;
  requestFullScreen: ZeroParamVoidFunc;
  exitFullScreen: ZeroParamVoidFunc;
  /**
   * 2.1.0仅在iOS全屏下有效
   */
  showStatusBar: ZeroParamVoidFunc;
  hideStatusBar: ZeroParamVoidFunc;
}

interface takePhotoObj extends WxApiCallback {
  quality?: "high" | "normal" | "low";
}

interface startRecordObj extends WxApiCallback {
  timeoutCallback?: ZeroParamVoidFunc;
}

interface stopRecordObj extends WxApiCallback {}

interface createCameraContextOpts {
  takePhoto: (options: takePhotoObj) => void;
  startRecord: (options: startRecordObj) => void;
  stopRecord: (options: stopRecordObj) => void;
}

interface requestFullScreenObj extends WxApiCallback {
  direction: number;
}

interface exitFullScreen extends WxApiCallback {}

interface createLivePlayerContextOpts {
  play: (options: createLiveObj) => void;
  stop: (options: createLiveObj) => void;
  mute: (options: createLiveObj) => void;
  /**
   * pause, resume只支持在版本1.9.90
   */
  pause: (options: createLiveObj) => void;
  resume: (options: createLiveObj) => void;
  requestFullScreen: (options: requestFullScreenObj) => void;
  exitFullScreen: (options: createLiveObj) => void;
}

interface createLivePusherContextOpts {
  start: (options: createLiveObj) => void;
  stop: (options: createLiveObj) => void;
  pause: (options: createLiveObj) => void;
  resume: (options: createLiveObj) => void;
  switchCamera: (options: createLiveObj) => void;
  snapshot: (options: createLiveObj) => void;
  toggleTorch: (options: createLiveObj) => void;
}

interface LoadFontFaceDesc {
  style: any;
  weight: any;
  variant: any;
}
interface loadFontFaceRes {
  status: any;
}

interface loadFontFaceOpts extends WxApiCallback<loadFontFaceRes> {
  family: string;
  source: string;
  desc?: LoadFontFaceDesc;
}
interface MediaAPIs {
  chooseImage: (options: chooseImageOpts) => void;
  previewImage: (options: previewImageOpts) => void;
  getImageInfo: (options: getImageInfoOpts) => void;
  saveImageToPhotosAlbum: (options: saveImageToPhotosAlbumOpts) => void;
  startRecord: (options: startRecordOpts) => void;
  stopRecord: ZeroParamVoidFunc;
  getRecorderManager: () => getRecorderManagerOpts;
  /**
   * 注意：1.6.0 版本开始，本接口不再维护。建议使用能力更强的 wx.createInnerAudioContext 接口
   */
  playVoice: (options: playVoiceOpts) => void;
  /**
   * 注意：1.6.0 版本开始，本接口不再维护。建议使用能力更强的 wx.createInnerAudioContext 接口
   */

  pauseVoice: ZeroParamVoidFunc;
  /**
   * 注意：1.6.0 版本开始，本接口不再维护。建议使用能力更强的 wx.createInnerAudioContext 接口
   */
  stopVoice: ZeroParamVoidFunc;
  /**
   * 注意：1.2.0 版本开始，本接口不再维护。建议使用能力更强的 wx.getBackgroundAudioManager 接口
   */
  getBackgroundAudioPlayerState: (
    options: getBackgroundAudioPlayerStateOpts
  ) => void;
  /**
   * 注意：1.2.0 版本开始，本接口不再维护。建议使用能力更强的 wx.getBackgroundAudioManager 接口
   */
  playBackgroundAudio: (options: playBackgroundAudioOpts) => void;
  /**
   * 注意：1.2.0 版本开始，本接口不再维护。建议使用能力更强的 wx.getBackgroundAudioManager 接口
   */
  pauseBackgroundAudio: ZeroParamVoidFunc;
  /**
   * 注意：1.2.0 版本开始，本接口不再维护。建议使用能力更强的 wx.getBackgroundAudioManager 接口
   */
  seekBackgroundAudio: (options: seekBackgroundAudioOpts) => void;
  /**
   * 注意：1.2.0 版本开始，本接口不再维护。建议使用能力更强的 wx.getBackgroundAudioManager 接口
  //callback
   */
  stopBackgroundAudio: ZeroParamVoidFunc;
  /**
   * 注意：1.2.0 版本开始，本接口不再维护。建议使用能力更强的 wx.getBackgroundAudioManager 接口
   */
  onBackgroundAudioPlay: (callback: ReturnCallBack) => void;
  /**
   * 注意：1.2.0 版本开始，本接口不再维护。建议使用能力更强的 wx.getBackgroundAudioManager 接口
   */
  onBackgroundAudioPause: (callback: ReturnCallBack) => void;
  /**
   * 注意：1.2.0 版本开始，本接口不再维护。建议使用能力更强的 wx.getBackgroundAudioManager 接口
   */
  onBackgroundAudioStop: (callback: ReturnCallBack) => void;
  getBackgroundAudioManager: () => getBackgroundAudioManagerOpts;
  /**
   * 注意：1.6.0 版本开始，本接口不再维护。建议使用能力更强的 wx.createInnerAudioContext 接口
   */
  createAudioContext: (audioId: string, that?: IComponent) => void;
  createInnerAudioContext: () => createInnerAudioContextOpts;
  /**
   * 2.1.0开始支持
   */
  getAvailableAudioSources: (options: getAvailableAudioSourcesOpts) => void;
  chooseVideo: (options: chooseVideoOpts) => void;
  saveVideoToPhotosAlbum: (options: saveVideoToPhotosAlbumOpts) => void;
  createVideoContext: (
    audioId: string,
    that?: IComponent
  ) => createVideoContextOpts;
  createCameraContext: () => createCameraContextOpts;
  createLivePlayerContext: (domid: string) => createLivePlayerContextOpts;
  createLivePusherContext: () => createLivePusherContextOpts;
  loadFontFace: (options: loadFontFaceOpts) => void;
}

// File APIs

// save
interface saveFileRes {
  savedFilePath: string;
}

interface saveFileOpts extends WxApiCallback<saveFileRes> {
  tempFilePath: string;
}

//getFileInfo
interface getFileInfoRes {
  size: number;
  digest: string;
  errMsg: string;
}

interface getFileInfoOpts extends WxApiCallback<getFileInfoRes> {
  filePath: string;
  digestAlgorithm?: string;
}

// getSavedFileList
interface fileListOpts {
  filePath: string;
  createTime: number;
  size: number;
}

interface getSavedFileListRes {
  errMsg: string;
  fileList: fileListOpts;
}

interface getSavedFileListOpts extends WxApiCallback<getSavedFileListRes> {}

// getSavedFileInfo
interface getSavedFileInfoRes {
  errMsg: string;
  size: number;
  createTime: number;
}

interface getSavedFileInfoOpts extends WxApiCallback<getSavedFileInfoRes> {
  filePath: string;
}

// removeSavedFile
interface removeSavedFileOpts extends WxApiCallback {
  filePath: string;
}

// openDocument
interface openDocumentOpts extends WxApiCallback {
  filePath: string;
  fileType?: string;
}

/**
 * 更新于2018年9月14日
 */
interface mkdirOpts extends WxApiCallback {
  dirPath: string;
  recursive: boolean;
}

interface fileListObject {
  filePath: string;
  size: string;
  createTime: string;
}

interface FileSystemManagerGetSavedFileListRes {
  fileList: fileListObject[];
}

interface FileSystemManagerGetSavedFileListOpts
  extends WxApiCallback<FileSystemManagerGetSavedFileListRes> {}

interface FileSystemManagerSaveFileRes {
  savedFilePath: string;
  errMsg: string;
}

interface FileSystemManagerSaveFileOpts
  extends WxApiCallback<FileSystemManagerSaveFileRes> {
  tempFilePath: string;
  filePath: string;
}

interface FileSystemManagerRemoveSavedFileRes {
  errMsg: string;
}

interface FileSystemManagerRemoveSavedFileOpts
  extends WxApiCallback<FileSystemManagerRemoveSavedFileRes> {
  filePath: string;
}

interface copyFileRes {
  errMsg: string;
}

interface copyFileOpts extends WxApiCallback<copyFileRes> {
  srcPath: string;
  destPath: string;
}

interface FileSystemManagerGetFileInfoRes {
  size: number;
  errMsg: string;
}

interface FileSystemManagerGetFileInfoOpts
  extends WxApiCallback<FileSystemManagerGetFileInfoRes> {
  filePath: string;
}

interface accessRes {
  errMsg: string;
}

interface accessOpts extends WxApiCallback<accessRes> {
  path: string;
}

interface appendFileRes {
  errMsg: string;
}
interface appendFileOpts extends WxApiCallback<appendFileRes> {
  filePath: string;
  data: string | ArrayBuffer;
  encoding: string;
}

interface readFileRes {
  data: string | ArrayBuffer;
  errMsg: string;
}

interface readFileOpts extends WxApiCallback<readFileRes> {
  filePath: string;
  encoding: string;
}

interface readdirRes {
  files: string[];
  errMsg: string;
}

interface readdirOpts extends WxApiCallback<readdirRes> {
  dirPath: string;
}

interface renameRes {
  errMsg: string;
}

interface renameOpts extends WxApiCallback<renameRes> {
  oldPath: string;
  newPath: string;
}

interface rmdirRes {
  errMsg: string;
}

interface rmdirOpts extends WxApiCallback<rmdirRes> {
  dirPath: string;
  recursive: boolean;
}

interface statRes {
  stat: Stats;
  errMsg: string;
}

interface statOpts extends WxApiCallback<statRes> {
  path: string;
  recursive: boolean;
}

interface unlinkRes {
  errMsg: string;
}

interface unlinkOpts extends WxApiCallback<unlinkRes> {
  filePath: string;
}

interface unzipRes {
  errMsg: string;
}

interface unzipOpts extends WxApiCallback<unzipRes> {
  zipFilePath: string;
  targetPath: string;
}

interface writeFileRes {
  errMsg: string;
}

interface writeFileOpts extends WxApiCallback<writeFileRes> {
  filePath: string;
  data: string | ArrayBuffer;
  encoding: string;
}

interface getFileSystemManagerOpts {
  mkdir: (opts: mkdirOpts) => void;
  getSavedFileList: (opts: FileSystemManagerGetSavedFileListOpts) => void;
  appendFileSync: (
    filePath: string,
    data: string | ArrayBuffer,
    encoding: string
  ) => void;
  saveFile: (opts: FileSystemManagerSaveFileOpts) => void;
  removeSavedFile: (opts: FileSystemManagerRemoveSavedFileOpts) => void;
  saveFileSync: (tempFilePath: string, filePath: string) => number;
  copyFile: (opts: copyFileOpts) => void;
  copyFileSync: (srcPath: string, destPath: string) => void;
  getFileInfo: (opts: FileSystemManagerGetFileInfoOpts) => void;
  access: (opts: accessOpts) => void;
  appendFile: (opts: appendFileOpts) => void;
  accessSync: (path: string) => void;
  mkdirSync: (dirPath: string, recursive: boolean) => void;
  readFile: (opts: readFileOpts) => void;
  readFileSync: (filePath: string, encoding: string) => void;
  readdir: (opts: readdirOpts) => void;
  readdirSync: (dirPath: string) => void;
  rename: (opts: renameOpts) => void;
  renameSync: (oldPath: string, newPath: string) => void;
  rmdir: (opts: rmdirOpts) => void;
  rmdirSync: (dirPath: string, recursive: boolean) => void;
  stat: (opts: statOpts) => Stats;
  statSync: (path: string, recursive: boolean) => void;
  unlink: (opts: unlinkOpts) => void;
  unlinkSync: (filePath: string) => void;
  unzip: (opts: unzipOpts) => void;
  writeFile: (opts: writeFileOpts) => void;
  writeFileSync: (
    filePath: string,
    data: string | ArrayBuffer,
    encoding: string
  ) => void;
}

interface Stats {
  isDirectory: () => boolean;
  isFile: () => boolean;
}

interface FileAPIs {
  saveFile: (options: saveFileOpts) => void;
  getFileInfo: (options: getFileInfoOpts) => void;
  getSavedFileList: (options: getSavedFileListOpts) => void;
  getSavedFileInfoRes: (options: getSavedFileInfoOpts) => void;
  removeSavedFile: (options: removeSavedFileOpts) => void;
  openDocument: (options: openDocumentOpts) => void;
  getFileSystemManager: () => getFileSystemManagerOpts;
}

// Location APIs

//获取位置
// getLocation
interface getLocationRes {
  latitude: number;
  longitude: number;
  speed: number;
  accuracy: number;
  altitude: number;
  verticalAccuracy: number;
  horizontalAccuracy: number;
}

interface getLocationOpts extends WxApiCallback<getLocationRes> {
  type?: string;
  altitude?: boolean;
}

interface chooseLocationRes {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface chooseLocationOpts extends WxApiCallback<chooseLocationRes> {}

/**
 * 查看位置
 */
interface openLocationOpts extends WxApiCallback {
  latitude: number;
  longitude: number;
  scale?: number;
  name?: string;
  address?: string;
}

interface translateMarkerOpts {
  markerId: number;
  destination: { latitude: number; longitude: number };
  autoRotate: boolean;
  rotate: number;
  duration: number;
  animationEnd: () => void;
  fail?: (err: any) => void;
}

interface includePointsOpts {
  points: any;
  padding: any;
}

interface createMapContextOpts {
  /**
   * 获取当前地图中心的经纬度，返回的是 gcj02 坐标系，可以用于 wx.openLocation
   */
  getCenterLocation: (opts: WxApiCallback) => void;
  /**
   * 将地图中心移动到当前定位点，需要配合map组件的show-location使用
   */
  moveToLocation: () => void;
  /**
   * 	平移marker，带动画
   */
  translateMarker: (opts: translateMarkerOpts) => void;
  /**
   * 缩放视野展示所有经纬度
   */
  includePoints: (object: includePointsOpts) => void;
  /**
   * 获取当前地图的视野范围
   */
  getRegion: (opts: WxApiCallback) => void;
  /**
   * 获取当前地图的缩放级别
   */
  getScale: (opts: WxApiCallback) => void;
}

/**
 * 位置APIs
 * updateTime: 2018-09-17
 */
interface LocationAPIs {
  /**
   * 获取当前的地理位置、速度
   */
  getLocation: (options: getLocationOpts) => void;
  /**
   * 打开地图选择位置
   */
  chooseLocation: (options: chooseLocationOpts) => void;
  /**
   * ​使用微信内置地图查看位置
   */
  openLocation: (options: openLocationOpts) => void;
  /**
   * 创建并返回 map 上下文 mapContext 对象
   */
  createMapContext: (key: string) => createMapContextOpts;
}

/**
 * 数据缓存 Storage APIs
 * updateTime: 2018-09-16
 */
interface SetStorageOpts extends WxApiCallback {
  key: string;
  data: object | string;
}

interface GetStorageRes {
  data: object | string;
}

interface GetStorageOpts extends WxApiCallback<GetStorageRes> {
  key: string;
}

interface GetStorageInfoRes {
  keys: string[];
  currentSize: number;
  limitSize: number;
}

interface GetStorageInfoOpts extends WxApiCallback<GetStorageInfoRes> {}

type RemoveStorageOpts = GetStorageOpts;

interface ClearStorageOpts extends WxApiCallback {}

/**
 * 本地数据存储的大小限制为 10MB
 */
interface StorageAPIs {
  /**
   * 将数据存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容，这是一个异步接口
   */
  setStorage: (options: SetStorageOpts) => void;
  /**
   * 将 data 存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容，这是一个同步接口。
   */
  setStorageSync: (key: string, data: object | string) => void;
  /**
   * 从本地缓存中异步获取指定 key 对应的内容。
   */
  getStorage: (options: GetStorageOpts) => void;
  /**
   * 从本地缓存中同步获取指定 key 对应的内容。
   */
  getStorageSync: (key: string) => object | string;
  /**
   * 异步获取当前storage的相关信息
   */
  getStorageInfo: (options: GetStorageInfoOpts) => void;
  /**
   * 同步获取当前storage的相关信息
   */
  getStorageInfoSync: () => GetStorageInfoRes;
  /**
   * 从本地缓存中异步移除指定 key 。
   */
  removeStorage: (options: RemoveStorageOpts) => void;
  /**
   * 从本地缓存中同步移除指定 key 。
   */
  removeStorageSync: (key: string) => object | string;
  /**
   * 清理本地数据缓存。
   */
  clearStorage: () => void;
  /**
   * 同步清理本地数据缓存
   */
  clearStorageSync: () => void;
}

//  Device APIs

/**
 * 系统信息
 */

// getSystemInfo
interface getSystemInfoRes {
  brand: string;
  model: string;
  pixelRatio: any;
  screenWidth: number;
  screenHeight: number;
  windowWidth: number;
  windowHeight: number;
  statusBarHeight: number;
  language: string;
  version: number;
  system: any;
  platform: string;
  fontSizeSetting: number;
  SDKVersion: any;
}

interface getSystemInfoOpts extends WxApiCallback<getSystemInfoRes> {}

// getSystemInfoSync
interface getSystemInfoSyncRes {
  brand: string;
  model: string;
  pixelRatio: any;
  screenWidth: number;
  screenHeight: number;
  windowWidth: number;
  windowHeight: number;
  statusBarHeight: number;
  language: string;
  version: number;
  system: any;
  platform: string;
  fontSizeSetting: number;
  SDKVersion: any;
}

/**
 * 网络状态
 */
// getNetworkType
interface getNetworkTypeRes {
  networkType: string;
}

interface getNetworkTypeOpts extends WxApiCallback<getNetworkTypeRes> {}

// onNetworkStatusChange
interface onNetworkStatusChangeCallBack {
  isConnected: boolean;
  networkType: string;
}
interface onNetworkStatusChangeOpts {
  (res: onNetworkStatusChangeCallBack): void;
}

/**
 * 加速度计
 */
interface onAccelerometerChangeOpts {
  x: number;
  y: number;
  z: number;
}

interface onAccelerometerChangeCallback {
  (res: onAccelerometerChangeOpts): void;
}

interface startAccelerometerOpts extends WxApiCallback {
  /**
   * 基础库2.1.0开始支持。
   * 监听加速度数据回调函数的执行频率。game约为20ms/次，ui约为60ms/次，normal约为200ms/次
   */
  interval?: string;
}

//罗盘
interface onCompassChangeOpts {
  direction: number;
}
interface onCompassChangeCallBack {
  (res: onCompassChangeOpts): void;
}

// 拨打电话
interface makePhoneCallOpts extends WxApiCallback {
  phoneNumber: string;
}

// 扫码
interface scanCodeRes {
  result: string;
  scanType: string;
  charSet: string;
  path: string;
}

interface scanCodeOpts extends WxApiCallback<scanCodeRes> {
  onlyFromCamera?: boolean;
  scanType?: any[];
}

// 剪贴板
interface setClipboardDataOpts extends WxApiCallback {
  data: string;
}

interface getClipboardDataRes {
  data: string;
}

interface getClipboardDataOpts extends WxApiCallback<getClipboardDataRes> {}

// 蓝牙
interface getBluetoothAdapterStateRes {
  discovering: boolean;
  available: boolean;
  errMsg: string;
}

interface getBluetoothAdapterStateOpts
  extends WxApiCallback<getBluetoothAdapterStateRes> {}

interface onBluetoothAdapterStateChangeCb {
  available: boolean;
  discovering: boolean;
}
interface onBluetoothAdapterStateChangeOpts {
  (res: onBluetoothAdapterStateChangeCb): void;
}

interface startBluetoothDevicesDiscoveryRes {
  errMsg: string;
}

interface startBluetoothDevicesDiscoveryOpts
  extends WxApiCallback<startBluetoothDevicesDiscoveryRes> {
  services?: any[];
  allowDuplicatesKey?: boolean;
  interval?: number;
}

interface stopBluetoothDevicesDiscoveryRes {
  errMsg: string;
}

interface stopBluetoothDevicesDiscoveryOpts
  extends WxApiCallback<stopBluetoothDevicesDiscoveryRes> {}

interface devicesArray {
  [key: string]: any;
  name: string;
  deviceld: string;
  RSSI: number;
  advertisData: ArrayBuffer;
  advertisServiceUUIDs: any[];
  localName: string;
  serviceData: ArrayBuffer;
}

interface getBluetoothDevicesRes {
  devices: devicesArray[];
  errMsg: string;
}

interface getBluetoothDevicesOpts
  extends WxApiCallback<getBluetoothDevicesRes> {}

interface onBluetoothDeviceFoundOpts {
  devices: devicesArray[];
}

interface onBluetoothDeviceFoundCallBack {
  (res: onBluetoothDeviceFoundOpts): void;
}
interface getConnectedBluetoothDevicesArray {
  name: string;
  deviceld: string;
}

interface getConnectedBluetoothDevicesRes {
  devices: getConnectedBluetoothDevicesArray[];
  errMsg: string;
}

interface getConnectedBluetoothDevicesOpts
  extends WxApiCallback<getConnectedBluetoothDevicesRes> {
  services: any[];
}

interface createBLEConnectionRes {
  errMsg: string;
}

interface createBLEConnectionOpts
  extends WxApiCallback<createBLEConnectionRes> {
  deviceId: string;
}

interface closeBLEConnectionRes {
  errMsg: string;
}

interface closeBLEConnectionOpts extends WxApiCallback<closeBLEConnectionRes> {
  deviceId: string;
}

interface BLEDeviceService {
  uuid: string;
  isPrimary: boolean;
}
interface getBLEDeviceServicesRes {
  services: BLEDeviceService[];
  errMsg: string;
}

interface getBLEDeviceServicesOpts
  extends WxApiCallback<getBLEDeviceServicesRes> {
  deviceId: string;
}

interface getBLEDeviceCharacteristicsRes {
  characteristics: BLEDeviceCharacteristic[];
  errMsg: string;
}

interface BLEDeviceCharacteristic {
  /**
   * 蓝牙设备特征值的uuid
   */
  uuid: string;
  /**
   * 该特征值支持的操作类型
   */
  properties: BLEDeviceCharasteristicProperties;
}

interface BLEDeviceCharasteristicProperties {
  read: boolean;
  write: boolean;
  notify: boolean;
  indicate: boolean;
}

interface getBLEDeviceCharacteristicsOpts
  extends WxApiCallback<getBLEDeviceCharacteristicsRes> {
  deviceId: string;
  serviceId: string;
}

interface readBLECharacteristicValueRes {
  errCode: number;
  errMsg: string;
}

interface readBLECharacteristicValueOpts
  extends WxApiCallback<readBLECharacteristicValueRes> {
  deviceId: string;
  serviceId: string;
  characteristicId: string;
}

interface writeBLECharacteristicValueRes {
  errMsg: string;
}

interface writeBLECharacteristicValueOpts
  extends WxApiCallback<writeBLECharacteristicValueRes> {
  deviceId: string;
  serviceId: string;
  characteristicId: string;
  value: ArrayBuffer;
}

interface notifyBLECharacteristicValueChangeRes {
  errMsg: string;
}

interface notifyBLECharacteristicValueChangeOpts
  extends WxApiCallback<notifyBLECharacteristicValueChangeRes> {
  deviceId: string;
  serviceId: string;
  characteristicId: string;
  state: boolean;
}

interface onBLEConnectionStateChangeOpts {
  deviceId: string;
  connected: boolean;
}

interface onBLEConnectionStateChangeCallback {
  (res: onBLEConnectionStateChangeOpts): void;
}

interface onBLECharacteristicValueChangeOpts {
  deviceId: string;
  serviceId: string;
  characteristicId: string;
  value: ArrayBuffer;
}

interface onBLECharacteristicValueChangeCallback {
  (res: onBLECharacteristicValueChangeOpts): void;
}

// iBeacon
interface startBeaconDiscoveryRes {
  errMsg: string;
}

interface startBeaconDiscoveryOpts
  extends WxApiCallback<startBeaconDiscoveryRes> {
  uuid: any[];
}

interface stopBeaconDiscoveryRes {
  errMsg: string;
}

interface stopBeaconDiscoveryOpts
  extends WxApiCallback<stopBeaconDiscoveryRes> {}

interface beaconsObject {
  [key: string]: string | number;
  uuid: string;
  major: string;
  minor: string;
  proximity: number;
  accuracy: number;
  rssi: number;
}

interface getBeaconsRes {
  beacons: beaconsObject[];
  errMsg: string;
}

interface getBeaconsOpts extends WxApiCallback<getBeaconsRes> {}

interface onBeaconUpdateOpts {
  beacons: beaconsObject[];
}

interface onBeaconUpdateCallback {
  (res: onBeaconUpdateOpts): void;
}

interface onBeaconServiceChangeOpts {
  avaliable: boolean;
  discovering: boolean;
}

interface onBeaconServiceChangeCallBack {
  (res: onBeaconServiceChangeOpts): void;
}
// 屏幕亮度
interface setScreenBrightnessOpts extends WxApiCallback {
  value: number;
}

interface getScreenBrightnessRes {
  value: number;
}

interface getScreenBrightnessOpts
  extends WxApiCallback<getScreenBrightnessRes> {}

interface setKeepScreenOnRes {
  errMsg: string;
}
interface setKeepScreenOnOpts extends WxApiCallback<setKeepScreenOnRes> {
  keepScreenOn: boolean;
}

// 震动
interface vibrateLongOpts extends WxApiCallback {}

interface vibrateShortOpts extends WxApiCallback {}

//手机联系人
interface addPhoneContactOpts extends WxApiCallback {
  photoFilePath: string;
  nickName: string;
  lastName: string;
  middleName: string;
  firstName: string;
  remark: string;
  mobilePhoneNumber: string;
  weChatNumber: string;
  addressCountry: string;
  addressState: string;
  addressCity: string;
  addressStreet: string;
  addressPostalCode: string;
  organization: string;
  title: string;
  workFaxNumber: string;
  workPhoneNumber: string;
  hostNumber: string;
  email: string;
  url: string;
  workAddressCountry: string;
  workAddressState: string;
  workAddressCity: string;
  workAddressStreet: string;
  workAddressPostalCode: string;
  homeFaxNumber: string;
  homePhoneNumber: string;
  homeAddressCountry: string;
  homeAddressState: string;
  homeAddressCity: string;
  homeAddressStreet: string;
  homeAddressPostalCode: string;
}

// NFC
interface getHCEStateRes {
  errMsg: string;
  errCode: number;
}

interface getHCEStateOpts extends WxApiCallback<getHCEStateRes> {}

interface startHCERes {
  errMsg: string;
  errCode: number;
}

interface startHCEOpts extends WxApiCallback<startHCERes> {
  aid_list: any[];
}

interface stopHCERes {
  errMsg: string;
  errCode: number;
}

interface stopHCEOpts extends WxApiCallback<stopHCERes> {}

interface onHCEMessageOpts {
  messageType: number;
  data: ArrayBuffer;
  reason: number;
}

interface onHCEMessageCallBack {
  (res: onHCEMessageOpts): void;
}

interface sendHCEMessageRes {
  errMsg: string;
  errCode: number;
}

interface sendHCEMessageOpts extends WxApiCallback<sendHCEMessageRes> {
  data: ArrayBuffer;
}

// Wifi
interface startWifiOpts extends WxApiCallback {}

interface stopWifiOpts extends WxApiCallback {}

interface connectWifiOpts extends WxApiCallback {
  SSID: string;
  BSSID: string;
  password?: string;
}

interface getWifiListOpts extends WxApiCallback {}

interface wifiLs {
  SSID: string;
  BSSID: string;
  secure: boolean;
  signalStrength: number;
}

interface onGetWifiListOpts {
  wifiList: wifiLs[];
}

interface onGetWifiListCallBack {
  (res: onGetWifiListOpts): void;
}

interface setWifiListArray {
  SSID: string;
  BSSID: string;
  password: string;
}

interface setWifiListOpts extends WxApiCallback {
  wifiList: setWifiListArray[];
}

interface wifiInfo {
  SSID: string;
  BSSID: string;
  secure: boolean;
  signalStrength: number;
}

interface onWifiConnectedOpts {
  wifi: wifiInfo;
}

interface onWifiConnectedCb {
  (res: onWifiConnectedOpts): void;
}

interface onMemoryWarningOpts {
  level: number;
}

interface onMemoryWarningCallBack {
  (res: onMemoryWarningOpts): void;
}

interface getConnectedWifiRes {
  wifi: wifiInfo;
}

interface getConnectedWifiOpts extends WxApiCallback<getConnectedWifiRes> {}

interface DeviceAPIs {
  /**
   * 获取系统信息
   */
  getSystemInfo: (options: getSystemInfoOpts) => void;
  /**
   * 获取系统信息同步接口
   */
  getSystemInfoSync: () => getSystemInfoSyncRes;
  /**
   * 判断小程序的API，回调，参数，组件等是否在当前版本可用
   */
  canIUse: (string: any) => void;
  /**
   * 监听内存不足的告警事件，Android下有告警等级划分，只有LOW和CRITICAL会回调开发者；iOS无等级划分。
   */
  onMemoryWarning: (cb: onMemoryWarningCallBack) => void;
  /**
   * 获取网络类型
   */
  getNetworkType: (options: getNetworkTypeOpts) => void;
  /**
   * 监听网络状态变化。
   */
  onNetworkStatusChange: (cb: onNetworkStatusChangeOpts) => void;
  /**
   * 监听加速度数据，频率：5次/秒，接口调用后会自动开始监听，可使用 wx.stopAccelerometer 停止监听
   */
  onAccelerometerChange: (cb: onAccelerometerChangeCallback) => void;
  /**
   * 开始监听加速度数据。
   */
  startAccelerometer: (options: startAccelerometerOpts) => void;
  /**
   * 停止监听加速度数据
   */
  stopAccelerometer: (options: WxApiCallback) => void;
  /**
   * 监听罗盘数据，频率：5次/秒，接口调用后会自动开始监听，可使用wx.stopCompass停止监听。
   */
  onCompassChange: (cb: onCompassChangeCallBack) => void;
  /**
   * 开始监听罗盘数据。
   */
  startCompass: (options: WxApiCallback) => void;
  /**
   * 停止监听罗盘数据。
   */
  stopCompass: (options: WxApiCallback) => void;
  /**
   *  拨打电话
   */
  makePhoneCall: (options: makePhoneCallOpts) => void;
  /**
   * 调起客户端扫码界面，扫码成功后返回对应的结果
   */
  scanCode: (options: scanCodeOpts) => void;
  /**
   * 设置系统剪贴板的内容
   */
  setClipboardData: (options: setClipboardDataOpts) => void;
  /**
   * 获取系统剪贴板内容
   */
  getClipboardData: (options: getClipboardDataOpts) => void;
  /**
   * 初始化小程序蓝牙模块，生效周期为调用wx.openBluetoothAdapter至调用wx.closeBluetoothAdapter或小程序被销毁为止。
   */
  openBluetoothAdapter: (options: WxApiCallback) => void;
  /**
   * 关闭蓝牙模块，使其进入未初始化状态。调用该方法将断开所有已建立的链接并释放系统资源。建议在使用小程序蓝牙流程后调用，与wx.openBluetoothAdapter成对调用。
   */
  closeBluetoothAdapter: (options: WxApiCallback) => void;
  /**
   * 获取本机蓝牙适配器状态
   */
  getBluetoothAdapterState: (options: getBluetoothAdapterStateOpts) => void;
  /**
   * 监听蓝牙适配器状态变化事件
   */
  onBluetoothAdapterStateChange: (
    cb: onBluetoothAdapterStateChangeOpts
  ) => void;
  /**
   * 开始搜寻附近的蓝牙外围设备
   */
  startBluetoothDevicesDiscovery: (
    options: startBluetoothDevicesDiscoveryOpts
  ) => void;
  /**
   * 停止搜寻附近的蓝牙外围设备。若已经找到需要的蓝牙设备并不需要继续搜索时，建议调用该接口停止蓝牙搜索。
   */
  stopBluetoothDevicesDiscovery: (
    options: stopBluetoothDevicesDiscoveryOpts
  ) => void;
  /**
   * 获取在小程序蓝牙模块生效期间所有已发现的蓝牙设备，包括已经和本机处于连接状态的设备。
   */
  getBluetoothDevices: (options: getBluetoothDevicesRes) => void;
  /**
   * 根据 uuid 获取处于已连接状态的设备
   */
  getConnectedBluetoothDevices: (
    options: getConnectedBluetoothDevicesOpts
  ) => void;
  /**
   * 监听寻找到新设备的事件
   */
  onBluetoothDeviceFound: (cb: onBluetoothDeviceFoundCallBack) => void;
  /**
   * 连接低功耗蓝牙设备。
   */
  createBLEConnection: (options: createBLEConnectionOpts) => void;
  /**
   * 断开与低功耗蓝牙设备的连接
   */
  closeBLEConnection: (options: closeBLEConnectionOpts) => void;
  /**
   * 获取蓝牙设备所有 service（服务）
   */
  getBLEDeviceServices: (options: getBLEDeviceServicesOpts) => void;
  /**
   * 获取蓝牙设备某个服务中的所有 characteristic（特征值）
   */
  getBLEDeviceCharacteristics: (
    options: getBLEDeviceCharacteristicsOpts
  ) => void;
  /**
   * 读取低功耗蓝牙设备的特征值的二进制数据值。注意：必须设备的特征值支持read才可以成功调用，具体参照 characteristic 的 properties 属性
   */
  readBLECharacteristicValue: (options: readBLECharacteristicValueOpts) => void;
  /**
   * 向低功耗蓝牙设备特征值中写入二进制数据。注意：必须设备的特征值支持write才可以成功调用，具体参照 characteristic 的 properties 属性
   */
  writeBLECharacteristicValue: (
    options: writeBLECharacteristicValueOpts
  ) => void;
  /**
   * 启用低功耗蓝牙设备特征值变化时的 notify 功能，订阅特征值。注意：必须设备的特征值支持notify或者indicate才可以成功调用，具体参照 characteristic 的 properties 属性
   * 另外，必须先启用notify才能监听到设备 characteristicValueChange 事件
   */
  notifyBLECharacteristicValueChange: (
    options: notifyBLECharacteristicValueChangeOpts
  ) => void;
  /**
   * 监听低功耗蓝牙连接状态的改变事件，包括开发者主动连接或断开连接，设备丢失，连接异常断开等等
   */
  onBLEConnectionStateChange: (
    callback: onBLEConnectionStateChangeCallback
  ) => void;
  /**
   * 监听低功耗蓝牙设备的特征值变化。必须先启用notify接口才能接收到设备推送的notification。
   */
  onBLECharacteristicValueChange: (
    callback: onBLECharacteristicValueChangeCallback
  ) => void;
  /**
   * 开始搜索附近的iBeacon设备
   */
  startBeaconDiscovery: (options: startBeaconDiscoveryOpts) => void;
  /**
   * 停止搜索附近的iBeacon设备
   */
  stopBeaconDiscovery: (options: stopBeaconDiscoveryOpts) => void;
  /**
   * 获取所有已搜索到的iBeacon设备
   */
  getBeacons: (options: getBeaconsOpts) => void;
  /**
   * 监听 iBeacon 设备的更新事件
   */
  onBeaconUpdate: (cb: onBeaconUpdateCallback) => void;
  /**
   * 监听 iBeacon 服务的状态变化
   */
  onBeaconServiceChange: (cb: onBeaconServiceChangeCallBack) => void;
  /**
   * 设置屏幕亮度
   */
  setScreenBrightness: (options: setScreenBrightnessOpts) => void;
  /**
   * 获取屏幕亮度。
   */
  getScreenBrightness: (options: getScreenBrightnessOpts) => void;
  /**
   * 设置是否保持常亮状态。仅在当前小程序生效，离开小程序后设置失效
   */
  setKeepScreenOn: (options: setKeepScreenOnOpts) => void;
  /**
   * 监听用户主动截屏事件，用户使用系统截屏按键截屏时触发此事件
   */
  onUserCaptureScreen: () => void;
  /**
   * 使手机发生较长时间的振动（400ms）
   */
  vibrateLong: (options: vibrateLongOpts) => void;
  /**
   * 使手机发生较短时间的振动（15ms）
   */
  vibrateShort: (options: vibrateShortOpts) => void;
  /**
   * 调用后，用户可以选择将该表单以“新增联系人”或“添加到已有联系人”的方式，写入手机系统通讯录，完成手机通讯录联系人和联系方式的增加。
   */
  addPhoneContact: (options: addPhoneContactOpts) => void;
  /**
   * 判断当前设备是否支持 HCE 能力。
   */
  getHCEState: (options: getHCEStateOpts) => void;
  /**
   * 初始化 NFC 模块。
   */
  startHCE: (options: startHCEOpts) => void;
  /**
   * 关闭 NFC 模块
   */
  stopHCE: (options: stopHCEOpts) => void;
  /**
   * 监听 NFC 设备的消息回调，并在回调中处理。返回参数中 messageType 表示消息类型，目前有如下值：
   * 1：消息为HCE Apdu Command类型，小程序需对此指令进行处理，并调用 sendHCEMessage 接口返回处理指令；
   * 2：消息为设备离场事件
   */
  onHCEMessage: (cb: onHCEMessageCallBack) => void;
  /**
   * 发送 NFC 消息。仅在安卓系统下有效。
   */
  sendHCEMessage: (options: sendHCEMessageOpts) => void;
  /**
   * 初始化 Wi-Fi 模块。
   */
  startWifi: (options: startWifiOpts) => void;
  /**
   * 关闭 Wi-Fi 模块。
   */
  stopWifi: (options: stopWifiOpts) => void;
  /**
   * 连接 Wi-Fi。若已知 Wi-Fi 信息，可以直接利用该接口连接。仅 Android 与 iOS 11 以上版本支持。
   */
  connectWifi: (options: connectWifiOpts) => void;
  /**
   * 请求获取 Wi-Fi 列表，在 onGetWifiList 注册的回调中返回 wifiList 数据。iOS 将跳转到系统的 Wi-Fi 界面，Android 不会跳转。 iOS 11.0 及 iOS 11.1 两个版本因系统问题，该方法失效。但在 iOS 11.2 中已修复。
   */
  getWifiList: (options: getWifiListOpts) => void;
  /**
   * 监听在获取到 Wi-Fi 列表数据时的事件，在回调中将返回 wifiList。
   */
  onGetWifiList: (cb: onGetWifiListCallBack) => void;
  /**
   * OS特有接口 在 onGetWifiList 回调后，利用接口设置 wifiList 中 AP 的相关信息。
   */
  setWifiList: (options: setWifiListOpts) => void;
  /**
   * 监听连接上 Wi-Fi 的事件。
   */
  onWifiConnected: (cb: onWifiConnectedCb) => void;
  /**
   * 获取已连接中的 Wi-Fi 信息
   */
  getConnectedWifi: (options: getConnectedWifiOpts) => void;
}

/**
 * UI APIs
 */
// Interactive feedback 交互反馈
interface ShowToastOpts extends WxApiCallback {
  title: string;
  icon?: string;
  image?: string;
  duration?: number;
  mask?: boolean;
}

interface ShowLoadingOpts extends WxApiCallback {
  title: string;
  mask?: boolean;
}

interface ShowModalRes {
  confirm: boolean;
  cancel: boolean;
}

interface ShowModalOpts extends WxApiCallback<ShowModalRes> {
  title: string;
  content: string;
  showCancel?: boolean;
  cancelText?: string;
  cancelColor?: string;
  confirmText?: string;
  confirmColor?: string;
}

interface ShowActionSheetRes {
  tapIndex: number;
}

interface ShowActionSheetOpts extends WxApiCallback<ShowActionSheetRes> {
  itemList: string[];
  itemColor?: any;
}

// Navigation bar 设置导航条

interface setTopBarTextOpts extends WxApiCallback {
  text: string;
}

interface setNavigationBarTitleOpts extends WxApiCallback {
  title: string;
}

interface setNavigationBarColorRes {
  errMsg: string;
}

interface animationOpts {
  duration?: number;
  timingFunc?: string;
}

interface setNavigationBarColorOpts
  extends WxApiCallback<setNavigationBarColorRes> {
  frontColor: string;
  backgroundColor: string;
  animation?: animationOpts;
}

// TabBar 设置tabBar

interface setTabBarBadgeOpts extends WxApiCallback {
  index: number;
  text: string;
}

interface removeTabBarBadgeOpts extends WxApiCallback {
  index: number;
}

interface showTabBarRedDotOpts extends WxApiCallback {
  index: number;
}

interface hideTabBarRedDotOpts extends WxApiCallback {
  index: number;
}

interface setTabBarStyleOpts extends WxApiCallback {
  color?: any;
  selectedColor?: any;
  backgroundColor?: any;
  borderStyle?: string;
}

interface setTabBarItemOpts extends WxApiCallback {
  index: number;
  text?: string;
  iconPath?: string;
  selectedIconPath?: string;
}

interface showTabBarOpts extends WxApiCallback {
  animation?: boolean;
}

interface hideTabBarOpts extends WxApiCallback {
  animation?: boolean;
}

interface setBackgroundColorOpts {
  backgroundColor: string;
  backgroundColorTop: string;
  backgroundColorBottom: string;
}

interface setBackgroundTextStyleOpts {
  textStyle: string;
}

// navigate 导航

interface navigateOpts extends WxApiCallback {
  url: string;
}

// animation 动画

interface createAnimationOpts {
  duration?: number;
  timingFunction?: string;
  delay?: number;
  transformOrigin?: string;
}
// todo animation实例
interface animationObject {}

interface pageScrollToOpts extends WxApiCallback {
  scrollTop?: number;
  duration?: number;
}
interface startPullDownRefreshRes {
  errMsg: string;
}

interface startPullDownRefreshOpts
  extends WxApiCallback<startPullDownRefreshRes> {}

// WXML节点信息

interface createSelectorQueryOpts {
  in: any;
  select: any;
  selectAll: any;
  selectViewport: any;
  exec: any;
  boundingClientRect: any;
  scrollOffset: any;
  fields: any;
}

interface createIntersectionObserverAPIs {
  relativeTo: any;
  relativeToViewport: any;
  observe: any;
  disconnect: any;
}

interface UIAPIs {
  /**
   * 显示消息提示框
   */
  showToast: (options: ShowToastOpts) => void;
  /**
   * 显示 loading 提示框, 需主动调用 wx.hideLoading 才能关闭提示框
   */
  showLoading: (options: ShowLoadingOpts) => void;
  /**
   * 隐藏消息提示框
   */
  hideToast: ZeroParamVoidFunc;
  /**
   * 隐藏 loading 提示框
   */
  hideLoading: ZeroParamVoidFunc;
  /**
   * 显示模态弹窗
   */
  showModal: (options: ShowModalOpts) => void;
  /**
   * 显示操作菜单
   */
  showActionSheet: (options: ShowActionSheetOpts) => void;
  /**
   * 动态设置当前页面的标题
   */
  setNavigationBarTitle: (options: setNavigationBarTitleOpts) => void;
  /**
   * 在当前页面显示导航条加载动画。
   */
  showNavigationBarLoading: ZeroParamVoidFunc;
  /**
   * 隐藏导航条加载动画。
   */
  hideNavigationBarLoading: ZeroParamVoidFunc;
  /**
   * 设置导航条的颜色
   */
  setNavigationBarColor: (options: setNavigationBarColorOpts) => void;
  /**
   * 为 tabBar 某一项的右上角添加文本
   */
  setTabBarBadge: (options: setTabBarBadgeOpts) => void; //1.9.0
  /**
   * 移除 tabBar 某一项右上角的文本
   */
  removeTabBarBadge: (options: removeTabBarBadgeOpts) => void; //1.9.0
  /**
   * 显示 tabBar 某一项的右上角的红点
   */
  showTabBarRedDot: (options: showTabBarRedDotOpts) => void; //1.9.0
  /**
   * 隐藏 tabBar 某一项的右上角的红点
   */
  hideTabBarRedDot: (options: hideTabBarRedDotOpts) => void; //1.9.0
  /**
   * 动态设置 tabBar 的整体样式
   */
  setTabBarStyle: (options: setTabBarStyleOpts) => void; //1.9.0
  /**
   * 动态设置 tabBar 某一项的内容
   */
  setTabBarItem: (options: setTabBarItemOpts) => void; //1.9.0
  /**
   * 显示 tabBar
   */
  showTabBar: (options: showTabBarOpts) => void; //1.9.0
  /**
   * 隐藏 tabBar
   */
  hideTabBar: (options: hideTabBarOpts) => void; //1.9.0
  /**
   * 动态设置窗口的背景色
   */
  setBackgroundColor: (options: setBackgroundColorOpts) => void;
  /**
   * 动态设置下拉背景字体、loading 图的样式
   */
  setBackgroundTextStyle: (options: setBackgroundTextStyleOpts) => void;
  /**
   * 动态设置置顶栏文字内容，只有当前小程序被置顶时能生效，如果当前小程序没有被置顶，也能调用成功，但是不会立即生效，只有在用户将这个小程序置顶后才换上设置的文字内容
   */
  setTopBarText: (options: setTopBarTextOpts) => void;
  /**
   * 保留当前页面，跳转到应用内的某个页面，使用wx.navigateBack可以返回到原页面。
   */
  navigateTo: (options: navigateOpts) => void;
  /**
   * 关闭当前页面，跳转到应用内的某个页面。
   */
  redirectTo: (options: navigateOpts) => void;
  /**
   * 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
   */
  switchTab: (options: navigateOpts) => void;
  /**
   * 关闭当前页面，返回上一页面或多级页面。可通过 getCurrentPages() 获取当前的页面栈，决定需要返回几层。
   */
  navigateBack: (delta: number) => void;
  /**
   * 关闭所有页面，打开到应用内的某个页面。
   */
  reLaunch: (options: navigateOpts) => void;
  /**
   * TOdo：
   * 链式调用
   * 创建一个动画实例animation。调用实例的方法来描述动画。最后通过动画实例的export方法导出动画数据传递给组件的animation属性。
   */
  createAnimation: (options: createAnimationOpts) => void;
  /**
   * 将页面滚动到目标位置。
   */
  pageScrollTo: (options: pageScrollToOpts) => void;
  //todo 绘图
  createCanvasContext: any;
  createLinearGradient: any;
  createContext: any; // 不推荐使用
  drawCanvas: any; // 不推荐使用
  canvasToTempFilePath: any;
  canvasGetImageData: any;
  canvasPutImageData: any;
  /**
   * 开始下拉刷新，调用后触发下拉刷新动画，效果与用户手动下拉刷新一致
   */
  startPullDownRefresh: (options: startPullDownRefreshOpts) => void;
  /**
   * 停止当前页面下拉刷新。
   */
  stopPullDownRefresh: ZeroParamVoidFunc;
  /**
   * 返回一个SelectorQuery对象实例。可以在这个实例上使用select等方法选择节点，并使用boundingClientRect等方法选择需要查询的信息。
   */
  createSelectorQuery: () => createSelectorQueryOpts;
  /**
   * 节点布局交叉状态API可用于监听两个或多个组件节点在布局位置上的相交状态。这一组API常常可以用于推断某些节点是否可以被用户看见、有多大比例可以被用户看见。
   */
  createIntersectionObserver: () => createIntersectionObserverAPIs;
  nextTick: (c: Function) => void;
}

interface canvasContextApi {
  setFillStyle: any;
  setStrokeStyle: any;
  setShadow: any;
  createLinearGradient: any;
  createCircularGradient: any;
  addColorStop: any;
  setLineWidth: any;
  setLineCap: any;
  setLineJoin: any;
  setMiterLimit: any;
  rect: any;
  fillRect: any;
  strokeRect: any;
  clearRect: any;
  fill: any;
  stroke: any;
  beginPath: any;
  closePath: any;
  moveTo: any;
  lineTo: any;
  arc: any;
  quadraticCurveTo: any;
  bezierCurveTo: any;
  scale: any;
  rotate: any;
  translate: any;
  fillText: any;
  setFontSize: any;
  setTextBaseline: any;
  setTextAlign: any;
  drawImage: any;
  setGlobalAlpha: any;
  save: any;
  restore: any;
  draw: any;
  getActions: any; //不推荐使用
  clearActions: any; //不推荐使用
  measureText: any;
  globalCompositeOperation: any;
  arcTo: any;
  strokeText: any;
  lineDashOffset: any;
  createPattern: any;
  font: any;
  setTransform: any;
}

/**
 * Third party APIs
 */
interface getExtConfigRes {
  errMsg: string;
  extConfig: any;
}
interface getExtConfigOpts extends WxApiCallback<getExtConfigRes> {}

interface ThirdPartyAPIs {
  getExtConfig: (options: getExtConfigOpts) => void;
  getExtConfigSync: (extConfig: any) => void;
}

/**
 *  Open Interface APIs
 */
interface LoginRes {
  errMsg?: string;
  code?: string;
}

interface LoginOpts extends WxApiCallback<LoginRes> {
  timeout?: number;
}

interface CheckSessionOpts extends WxApiCallback {}

interface AuthorizeRes {
  errMsg: string;
}

interface AuthorizeOpts extends WxApiCallback<AuthorizeRes> {
  scope:
    | "scope.userInfo"
    | "scope.userLocation"
    | "scope.address"
    | "wx.chooseAddress"
    | "scope.invoiceTitle"
    | "wx.chooseInvoiceTitle"
    | "scope.werun"
    | "wx.getWeRunData"
    | "scope.record"
    | "wx.startRecord"
    | "scope.writePhotosAlbum"
    | "wx.saveImageToPhotosAlbum"
    | "wx.saveVideoToPhotosAlbum"
    | "scope.camera";
}

//用户信息
// getUserInfo
interface userInfoOpts {
  nickName: string;
  avatarUrl: string;
  gender: string;
  city: string;
  province: string;
  country: string;
  language: string;
}

interface getUserInfoRes {
  userInfo: userInfoOpts;
  rawData: string;
  signature: string;
  encryptedData: string;
  iv: string;
}

interface getUserInfoOpts extends WxApiCallback<getUserInfoRes> {
  withCredentials?: boolean;
  lang?: string;
  timeout?: number;
}

// 微信支付
interface requestPaymentOpts extends WxApiCallback {
  timeStamp: string;
  nonceStr: string;
  package: string;
  signType: string;
  paySign: string;
}

interface showShareMenuOpts extends WxApiCallback {
  withShareTicket?: boolean;
}

interface updateShareMenuOpts extends WxApiCallback {
  withShareTicket?: boolean;
}

interface getShareInfoOpts extends WxApiCallback {
  shareTicket: string;
  timeout?: number;
}

interface chooseAddressRes {
  errMsg: string;
  userName: string;
  postalCode: string;
  provinceName: string;
  cityName: string;
  countyName: string;
  detailInfo: string;
  nationalCode: string;
  telNumber: string;
}
interface chooseAddressOpts extends WxApiCallback<chooseAddressRes> {}

interface openSettingRes {
  authSetting: any;
}

interface openSettingOpts extends WxApiCallback<openSettingRes> {}

interface getSettingRes {
  authSetting: any;
}

interface getSettingOpts extends WxApiCallback<getSettingRes> {}

interface getWeRunDataRes {
  errMsg: string;
  encryptedData: string;
  iv: string;
}

interface getWeRunDataOpts extends WxApiCallback<getWeRunDataRes> {
  timeout?: number;
}

interface navigateToMiniProgramRes {
  errMsg: string;
}

interface extraDataOpts {
  encrypt_card_id: string;
  outer_str: string;
  biz: string;
}

interface navigateToMiniProgramOpts
  extends WxApiCallback<navigateToMiniProgramRes> {
  appId: string;
  extraData: extraDataOpts[];
  path: string;
  envVersion: string;
}
interface navigateBackMiniProgramRes {
  errMsg: string;
}
interface navigateBackMiniProgramOpts
  extends WxApiCallback<navigateBackMiniProgramRes> {
  extraData: any;
}

interface chooseInvoiceTitleRes {
  type: string;
  title: string;
  taxNumber: string;
  companyAddress: string;
  telephone: string;
  bankName: string;
  bankAccount: string;
  errMsg: string;
}

interface chooseInvoiceTitleOpts extends WxApiCallback<chooseInvoiceTitleRes> {}

interface checkIsSupportSoterAuthenticationRes {
  supportMode: string[]; // 人脸识别（暂未支持）声纹识别（暂未支持）
  errMsg: string;
}

interface checkIsSupportSoterAuthenticationOpts
  extends WxApiCallback<checkIsSupportSoterAuthenticationRes> {}

interface startSoterAuthenticationRes {
  errCode: number;
  authMode: string;
  resultJSON: string;
  resultJSONSignature: string;
  errMsg: string;
}

interface startSoterAuthenticationOpts
  extends WxApiCallback<startSoterAuthenticationRes> {
  requestAuthMode: string[];
  challenge: string;
  authContent: string;
}

interface checkIsSoterEnrolledInDeviceRes {
  inEnrolled: boolean;
  errMsg: string;
}

interface checkIsSoterEnrolledInDeviceOpts
  extends WxApiCallback<checkIsSoterEnrolledInDeviceRes> {
  checkAuthMode: string;
}

interface cardListOpts {
  cardId: string;
  cardExt: string;
}

interface addCardOpts extends WxApiCallback {
  cardList: cardListOpts[];
}

interface openCardListOpts {
  cardId: string;
  code: string;
}

interface openCardOpts extends WxApiCallback {
  cardList: openCardListOpts[];
}

interface miniProgramObj {
  appId: string;
}

interface pluginObj {
  appid: string;
  version: string;
}

interface getAccountInfoSyncOpts {
  miniProgram: miniProgramObj;
  plugin: pluginObj;
}

interface OpenInterfaceAPIs {
  /**
   * 调用接口wx.login() 获取临时登录凭证（code）
   */
  login: (options: LoginOpts) => void;
  /**
   * 校验用户当前session_key是否有效。
   */
  checkSession: (options: CheckSessionOpts) => void;
  /**
   * 提前向用户发起授权请求。调用后会立刻弹窗询问用户是否同意授权小程序使用某项功能或获取用户的某些数据，
   * 但不会实际调用对应接口。
   * 如果用户之前已经同意授权，则不会出现弹窗，直接返回成功。
   */
  authorize: (optiona: AuthorizeOpts) => void;
  /**
   * 当用户未授权过，调用该接口将直接进入fail回调
   * 当用户授权过，可以使用该接口获取用户信息
   */
  getUserInfo: (options: getUserInfoOpts) => void;
  /**
   * 获取微信用户绑定的手机号，需先调用login接口。
   */
  getPhoneNumber: (e: any) => void;
  /**
   * 发起微信支付
   */
  requestPayment: (options: requestPaymentOpts) => void;
  /**
   * 显示当前页面的转发按钮
   */
  showShareMenu: (options: showShareMenuOpts) => void;
  /**
   * 隐藏转发按钮
   */
  hideShareMenu: (optinos: WxApiCallback) => void;
  /**
   * 更新转发属性
   */
  updateShareMenu: (options: updateShareMenuOpts) => void;
  /**
   * 获取转发详细信息
   */
  getShareInfo: (options: getShareInfoOpts) => void;
  /**
   * 调起用户编辑收货地址原生界面，并在编辑完成后返回用户选择的地址。
   */
  chooseAddress: (options: chooseAddressOpts) => void;
  /**
   * 批量添加卡券。
   */
  addCard: (options: addCardOpts) => void;
  /**
   * 查看微信卡包中的卡券。
   */
  openCard: (options: openCardOpts) => void;
  /**
   * 调起客户端小程序设置界面，返回用户设置的操作结果。
   */
  openSetting: (options: openSettingOpts) => void;
  /**
   * 获取用户的当前设置。
   */
  getSetting: (options: getSettingOpts) => void;
  /**
   * 获取用户过去三十天微信运动步数，需要先调用 wx.login 接口。
   */
  getWeRunData: (options: getWeRunDataOpts) => void;
  /**
   * 访问当前小程序或插件帐号信息。
   */
  getAccountInfoSync: (options: getAccountInfoSyncOpts) => void;
  /**
   * 开发者可以在小程序内调用该接口拉起会员开卡组件，方便用户快速填写会员注册信息并领卡。
   */
  navigateToMiniProgram: (options: navigateToMiniProgramOpts) => void;
  /**
   * 返回到上一个小程序，只有在当前小程序是被其他小程序打开时可以调用成功
   */
  navigateBackMiniProgram: (options: navigateBackMiniProgramOpts) => void;
  /**
   * 选择用户的发票抬头。
   */
  chooseInvoiceTitle: (options: chooseInvoiceTitleOpts) => void;
  /**
   * 获取本机支持的 SOTER 生物认证方式
   */
  checkIsSupportSoterAuthentication: (
    options: checkIsSupportSoterAuthenticationOpts
  ) => void;
  /**
   * 开始 SOTER 生物认证
   */
  startSoterAuthentication: (options: startSoterAuthenticationOpts) => void;
  /**
   * 获取设备内是否录入如指纹等生物信息的接口
   */
  checkIsSoterEnrolledInDevice: (
    options: checkIsSoterEnrolledInDeviceOpts
  ) => void;
}

/**
 * Data APIs
 */
interface reportAnalyticsOpts {
  eventName: string;
  data: any;
}

interface DataAPIs {
  reportAnalytics: (options: reportAnalyticsOpts) => void;
}

/**
 * Update APIs
 */
interface UpdateAPIs {
  getUpdateManager: () => updateManagerAPIs;
}

interface updateManagerAPIs {
  /**
   * 监听向微信后台请求检查更新结果事件。微信在小程序冷启动时自动检查更新，不需由开发者主动触发。
   */
  onCheckForUpdate: any;
  /**
   * 监听小程序有版本更新事件。客户端主动触发下载（无需开发者触发），下载成功后回调
   */
  onUpdateReady: any;
  /**
   * 监听小程序更新失败事件。小程序有新版本，客户端主动触发下载（无需开发者触发），下载失败（可能是网络原因等）后回调
   */
  onUpdateFailed: any;
  /**
   * 当小程序新版本下载完成后（即收到 onUpdateReady 回调），强制小程序重启并使用新版本
   */
  applyUpdate: any;
}

/**
 * Multithreading APIs
 */
interface MultithreadingAPIs {
  /**
   * 创建一个 Worker 线程，并返回 Worker 实例，目前限制最多只能创建一个 Worker，创建下一个 Worker 前请调用 Worker.terminate。
   */
  createWorker: (scriptPath: string) => workerAPIs;
}

interface workerAPIs {
  postMessage: any;
  onMessage: ZeroParamVoidFunc;
  terminate: ZeroParamVoidFunc;
}

interface MonitorAPIs {
  /**
   * 自定义业务数据监控上报接口。
   */
  reportMonitor: (name: string, value: number) => void;
}

/**
 * Debugging APIs
 */
interface setEnableDebugRes {
  errMsg: string;
}

interface setEnableDebugOpts extends WxApiCallback<setEnableDebugRes> {
  enableDebug: boolean;
}
interface DebuggingAPIs {
  /**
   * 设置是否打开调试开关，此开关对正式版也能生效。
   */
  setEnableDebug: (options: setEnableDebugOpts) => void;
}

interface LogManager {
  log: any;
  info: any;
  warn: any;
  debug: any;
}

interface LogApis {
  /**
   * 获取日志管理器 logManager 对象。
   */
  getLogManager: () => LogManager;
}

// Declares
declare let wx: NetworkAPIs &
  MediaAPIs &
  FileAPIs &
  StorageAPIs &
  LocationAPIs &
  DeviceAPIs &
  UIAPIs &
  ThirdPartyAPIs &
  OpenInterfaceAPIs &
  DataAPIs &
  UpdateAPIs &
  MultithreadingAPIs &
  MonitorAPIs &
  DebuggingAPIs &
  LogApis;

declare let SocketTask: SocketTaskAPIs;
// declare let nodesRef: nodesRefAPIs;
// declare let worker: workerAPIs;
declare let canvasContext: canvasContextApi;

declare function App(app: AppOpts): void;
declare function Page(page: PageOpts): void;
declare function getApp(): IApp;
declare function getCurrentPages(): IPage[];
