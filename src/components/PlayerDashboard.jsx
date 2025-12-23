import React from 'react';
import './PlayerDashboard.css';

export default function PlayerDashboard({ playerState, isAI = false }) {
  return (
    <div className={`player-dashboard ${isAI ? 'ai-dashboard' : 'player-dashboard'}`}>
      <div className="dashboard-header">
        <h3>{isAI ? '🤖 AI Opponent' : '👤 Player'}</h3>
        <div className="faction-name">{playerState.faction}</div>
      </div>

      <div className="resources-section">
        <h4>Resources</h4>
        <div className="resources-grid">
          <div className="resource-item">
            <span className="resource-icon">💰</span>
            <span className="resource-label">Coins</span>
            <span className="resource-value">{playerState.resources.coin}</span>
          </div>
          <div className="resource-item">
            <span className="resource-icon">⚡</span>
            <span className="resource-label">Power</span>
            <span className="resource-value">{playerState.resources.power}</span>
          </div>
          <div className="resource-item">
            <span className="resource-icon">❤️</span>
            <span className="resource-label">Popularity</span>
            <span className="resource-value">{playerState.resources.popularity}</span>
          </div>
          <div className="resource-item">
            <span className="resource-icon">🪵</span>
            <span className="resource-label">Wood</span>
            <span className="resource-value">{playerState.resources.wood}</span>
          </div>
          <div className="resource-item">
            <span className="resource-icon">🌾</span>
            <span className="resource-label">Food</span>
            <span className="resource-value">{playerState.resources.food}</span>
          </div>
          <div className="resource-item">
            <span className="resource-icon">⚙️</span>
            <span className="resource-label">Metal</span>
            <span className="resource-value">{playerState.resources.metal}</span>
          </div>
          <div className="resource-item">
            <span className="resource-icon">🛢️</span>
            <span className="resource-label">Oil</span>
            <span className="resource-value">{playerState.resources.oil}</span>
          </div>
        </div>
      </div>

      <div className="stats-section">
        <div className="stat-item">
          <span className="stat-icon">⭐</span>
          <span className="stat-label">Stars</span>
          <span className="stat-value">{playerState.stars}</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">🏛️</span>
          <span className="stat-label">Buildings</span>
          <span className="stat-value">{playerState.buildings.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">📍</span>
          <span className="stat-label">Position</span>
          <span className="stat-value">({playerState.position.x}, {playerState.position.y})</span>
        </div>
      </div>
    </div>
  );
}
