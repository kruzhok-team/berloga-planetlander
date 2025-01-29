"use strict";

class AudioClass {
  constructor() {
    this.initialized = false;
    this.filterindex = 0;
  }

  async Init() {
    this.audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();

    this.bufferSize = 2 * this.audioContext.sampleRate; // 2 seconds of noise
    this.noiseBuffer = this.CreateNoiseBuffer();
    this.whiteNoise = this.CreateWhiteNoiseSource(this.noiseBuffer);

    this.windnodes = Array.from({ length: 4 }, () => this.CreateNoiseNodes());
    this.explosion = this.CreateNoiseNodes();
    this.thrust = this.CreateNoiseNodes();
    this.beep = this.CreateNodesforBeep();
    this.initialized = true;
  }

  CreateNoiseBuffer() {
    const buffer = this.audioContext.createBuffer(
      1,
      this.bufferSize,
      this.audioContext.sampleRate,
    );
    const output = buffer.getChannelData(0);
    for (let i = 0; i < this.bufferSize; i++) output[i] = Math.random() * 2 - 1;
    return buffer;
  }

  CreateWhiteNoiseSource(buffer) {
    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.start(0);
    return source;
  }

  CreateNoiseNodes() {
    const biquadFilter = this.audioContext.createBiquadFilter();
    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = 0;
    this.whiteNoise.connect(biquadFilter);
    biquadFilter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    return { gain: gainNode, filter: biquadFilter };
  }

  CreateNodesforBeep() {
    const osc = this.audioContext.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 500;
    osc.start();

    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = 0;
    osc.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    return { gain: gainNode };
  }

  Beep() {
    if (!this.initialized) return;
    const { gain } = this.beep;
    const now = this.audioContext.currentTime;
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.setValueAtTime(0, now + 0.2);
  }

  SingleWind() {
    if (!this.initialized) return;
    const nodes = this.windnodes[this.filterindex];
    this.filterindex = (this.filterindex + 1) % 4;

    nodes.gain.gain.value = 0;
    nodes.filter.type = "bandpass";
    nodes.filter.frequency.value = 400 + Math.random() * 300;
    nodes.filter.Q.value = 10;

    const attackTime = Math.random() * 5 + 2;
    const releaseTime = Math.random() * 3 + 5;
    const now = this.audioContext.currentTime;

    nodes.filter.detune.cancelScheduledValues(now);
    nodes.filter.detune.setValueAtTime(0, now);
    nodes.filter.detune.linearRampToValueAtTime(
      Math.random() * 200 - 100,
      now + attackTime + releaseTime,
    );

    nodes.gain.gain.cancelScheduledValues(now);
    nodes.gain.gain.setValueAtTime(0, now + 0.01);
    nodes.gain.gain.linearRampToValueAtTime(
      Math.random() * 0.5 + 0.3,
      now + attackTime,
    );
    nodes.gain.gain.linearRampToValueAtTime(0, now + attackTime + releaseTime);
  }

  Wind() {
    if (!this.initialized) return;
    this.SingleWind();
    this.SingleWind();
    setInterval(() => this.SingleWind(), 5000);
  }

  Stop() {
    this.initialized = false;
  }

  Explosion() {
    if (!this.initialized) return;
    const { gain, filter } = this.explosion;
    const now = this.audioContext.currentTime;

    filter.frequency.value = 100;
    filter.Q.value = 1;
    filter.type = "lowpass";

    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(20, now);
    gain.gain.linearRampToValueAtTime(0, now + 3);
  }

  ThrustOn() {
    if (!this.initialized) return;
    const { gain, filter } = this.thrust;

    filter.type = "bandpass";
    filter.frequency.value = 100;
    filter.Q.value = 3;
    gain.gain.value = 5;
  }

  ThrustOff() {
    if (!this.initialized) return;
    const { gain } = this.thrust;
    gain.gain.value = 0;
  }

    Enable() {
    if (!this.initialized) return;
    if (this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }
  }

    Disable() {
    if (!this.initialized) return;
    if (this.audioContext.state === "running") {
      this.audioContext.suspend();
    }
  }


  EnableDisable() {
    if (!this.initialized) return;
    if (this.audioContext.state === "running") {
      this.audioContext.suspend();
    } else if (this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }
  }
}

// Usage
//const audio = new AudioClass();
