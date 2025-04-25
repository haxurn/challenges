"use client";
import { useState, useEffect } from "react";

export function AmbientAudio() {
  useEffect(() => {
    const audio = new Audio('/assets/audio/cyber.mp3');
    audio.loop = true;
    audio.volume = 0.099;
    audio.play().catch(() => {
      const resume = () => {
        audio.play().catch(() => {});
        window.removeEventListener('click', resume);
      };
      window.addEventListener('click', resume);
    });
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);
  return null;
}

