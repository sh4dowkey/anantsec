// src/main.jsx
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import React from 'react';

// Performance monitoring
let frameCount = 0;
let lastTime = performance.now();
let fps = 60;

function updateFPS() {
  frameCount++;
  const now = performance.now();
  const delta = now - lastTime;
  
  if (delta >= 1000) {
    fps = Math.round((frameCount * 1000) / delta);
    frameCount = 0;
    lastTime = now;
    
    // Update performance indicator
    const perfIndicator = document.getElementById('performance-indicator');
    if (perfIndicator && window.__DEV_MODE__) {
      perfIndicator.textContent = `FPS: ${fps}`;
      perfIndicator.classList.add('visible');
      
      // Warn if FPS is too low
      if (fps < 30) {
        perfIndicator.style.color = '#ff6b6b';
      } else if (fps < 45) {
        perfIndicator.style.color = '#ffa500';
      } else {
        perfIndicator.style.color = '#6dd4ff';
      }
    }
  }
  
  requestAnimationFrame(updateFPS);
}

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error Boundary caught:', error, errorInfo);
    
    // Show error screen
    const loadingScreen = document.getElementById('loading-screen');
    const errorScreen = document.getElementById('error-screen');
    const errorDetails = document.getElementById('error-details');
    
    if (loadingScreen) loadingScreen.classList.add('hidden');
    if (errorScreen) errorScreen.classList.add('visible');
    if (errorDetails) {
      errorDetails.textContent = `${error.message}\n\nComponent Stack:\n${errorInfo.componentStack}`;
    }
  }

  render() {
    if (this.state.hasError) {
      return null; // Error screen is shown via DOM manipulation
    }
    return this.props.children;
  }
}

// Initialize app
async function initializeApp() {
  try {
    const rootElement = document.getElementById('root');
    
    if (!rootElement) {
      throw new Error('Root element not found');
    }
    
    // Check if WebGL is supported (should already be checked in HTML, but double-check)
    if (!window.__DEVICE_CAPABILITIES__?.supportsWebGL) {
      throw new Error('WebGL not supported');
    }
    
    // Small delay to ensure everything is loaded
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const root = createRoot(rootElement);
    
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>
    );
    
    // Hide loading screen after render
    setTimeout(() => {
      const loadingScreen = document.getElementById('loading-screen');
      if (loadingScreen) {
        loadingScreen.classList.add('hidden');
      }
    }, 1000);
    
    // Start FPS monitoring in dev mode
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      window.__DEV_MODE__ = true;
      updateFPS();
    }
    
    console.log('✅ 3D Badge initialized successfully');
    
  } catch (error) {
    console.error('❌ Failed to initialize app:', error);
    
    const loadingScreen = document.getElementById('loading-screen');
    const errorScreen = document.getElementById('error-screen');
    const errorDetails = document.getElementById('error-details');
    
    if (loadingScreen) loadingScreen.classList.add('hidden');
    if (errorScreen) errorScreen.classList.add('visible');
    if (errorDetails) errorDetails.textContent = error.message || 'Unknown error';
  }
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}