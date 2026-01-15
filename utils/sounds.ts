export const SOUNDS = {
  LOCK: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',      // Mechanical Click
  CORRECT: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3',   // Success Chime
  WRONG: 'https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3',     // Error Tone
  TICK: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',      // Clock Tick
  WIN: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3',       // Victory Fanfare
  LOSE: 'https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3',      // Defeat Drone
  LIFELINE: 'https://assets.mixkit.co/active_storage/sfx/2578/2578-preview.mp3',  // Sci-fi Swipe
  MENU_CLICK: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3' // Soft Tick
};

export const playSound = (url: string) => {
  try {
    const audio = new Audio(url);
    audio.volume = 0.5;
    audio.play().catch(e => console.warn("Audio play failed (interaction required first):", e));
  } catch (e) {
    console.warn("Audio error:", e);
  }
};