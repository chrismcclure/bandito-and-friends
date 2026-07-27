/**
 * Browser entry point.
 * Loads styles and hands off to app.js, which boots PixiJS and routes to the
 * correct scene based on URL params (?scene=episode, ?shot=5, etc.).
 */
import './style.css';
import { createApp } from './app.js';

const container = document.querySelector('#app');
await createApp(container);
