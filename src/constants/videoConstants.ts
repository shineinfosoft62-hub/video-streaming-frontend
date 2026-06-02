export const SHAKA_CONTROL_PANEL_ELEMENTS = [
  'play_pause',
  'rewind',
  'fast_forward',
  'mute',
  'volume',
  'time_and_duration',
  'spacer',
  'overflow_menu',
  'fullscreen',
]

export const SHAKA_OVERFLOW_MENU_BUTTONS = [
  'captions',
  'captions-position',
  'captions-size',
  'quality',
  'language',
  'mute',
  'loop',
  'picture_in_picture',
  'playback_rate',
  'save_video_frame',
]

export const SHAKA_PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 2]

export const SHAKA_UI_CONFIG = {
  addSeekBar: true,
  controlPanelElements: SHAKA_CONTROL_PANEL_ELEMENTS,
  overflowMenuButtons: SHAKA_OVERFLOW_MENU_BUTTONS,
  contextMenuElements: [],
  customContextMenu: false,
  playbackRates: SHAKA_PLAYBACK_RATES,
  fastForwardRates: [2, 4, 8, 1],
  rewindRates: [-1, -2, -4, -8],
  keyboardSeekDistance: 10,
  tapSeekDistance: 10,
  seekOnTaps: true,
  alwaysShowVolumeBar: true,
  clearBufferOnQualityChange: true,
  enableTooltips: true,
  doubleClickForFullscreen: true,
  singleClickForPlayAndPause: true,
  showUIOnPaused: true,
  showAudioCodec: false,
  showVideoCodec: false,
}

export const SHAKA_PLAYER_CONFIG = {
  abr: {
    enabled: true,
    switchInterval: 4,
  },
  streaming: {
    bufferingGoal: 12,
    rebufferingGoal: 3,
    bufferBehind: 30,
    segmentPrefetchLimit: 2,
    preloadNextUrlWindow: 8,
    disableAudioPrefetch: false,
    disableVideoPrefetch: false,
    disableTextPrefetch: true,
    stopFetchingOnPause: false,
  },
  manifest: {
    dash: {
      ignoreMinBufferTime: false,
    },
  },
}
