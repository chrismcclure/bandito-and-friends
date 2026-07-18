import './style.css';
import { createApp } from './app.js';

const container = document.querySelector('#app');
await createApp(container);
