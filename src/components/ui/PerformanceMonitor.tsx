'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  AnimationPerformanceMonitor, 
  PerformanceMetrics, 
  PerformanceInsights,
  AnimationQualitySettings 
} from '@/utils/animations/performance';

interface PerformanceMonitorProps {
  visible?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  showDetails?: boolean;
  enableAlerts?: boolean;
  onPerformanceIssue?: (issue: string) => void;
}

interface FrameHistory {
  timestamp: number;
  fps: number;
  frameTime: number;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  visible = false,
  position = 'top-right',
  showDetails = false,
  enableAlerts = true,
  onPerformanceIssue,
}) => {
  const [fps, setFps] = useState(0);
  const [frameTime, setFrameTime] = useState(0);
  const [memoryUsage, setMemoryUsage] = useState(0);
  const [performanceScore, setPerformanceScore] = useState(100);
  const [currentQuality, setCurrentQuality] = useState<AnimationQualitySettings | null>(null);
  const [frameHistory, setFrameHistory] = useState<FrameHistory[]>([]);
  const [alerts, setAlerts] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const monitorRef = useRef<AnimationPerformanceMonitor | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);
  const maxHistorySize = 60; // Store last 60 frames
  
  // Initialize performance monitor
  useEffect(() => {
    monitorRef.current = AnimationPerformanceMonitor.getInstance();
    
    // Start monitoring
    monitorRef.current.startMonitoring('performance-monitor');
    
    return () => {
      if (monitorRef.current) {
        monitorRef.current.stopMonitoring('performance-monitor');
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);
  
  // Update performance metrics
  const updateMetrics = useCallback(() => {
    if (!monitorRef.current) return;
    
    const now = performance.now();
    const deltaTime = now - lastUpdateRef.current;
    
    // Update every 100ms
    if (deltaTime >= 100) {
      const currentFps = monitorRef.current.getCurrentFrameRate();
      const currentFrameTime = 1000 / currentFps || 0;
      const currentMemory = monitorRef.current.getMemoryUsage();
      const insights = monitorRef.current.getInsights();
      const quality = monitorRef.current.getCurrentQuality();
      
      setFps(Math.round(currentFps));
      setFrameTime(Math.round(currentFrameTime * 100) / 100);
      setMemoryUsage(Math.round(currentMemory * 100) / 100);
      setPerformanceScore(insights.performanceScore);
      setCurrentQuality(quality);
      
      // Update frame history
      setFrameHistory(prev => {
        const newHistory = [...prev, {
          timestamp: now,
          fps: currentFps,
          frameTime: currentFrameTime,
        }];
        
        // Keep only the last maxHistorySize frames
        return newHistory.slice(-maxHistorySize);
      });
      
      // Check for performance issues
      if (enableAlerts) {
        checkPerformanceIssues(currentFps, currentFrameTime, insights);
      }
      
      lastUpdateRef.current = now;
    }
    
    animationFrameRef.current = requestAnimationFrame(updateMetrics);
  }, [enableAlerts]);
  
  // Start metrics update loop
  useEffect(() => {
    if (visible) {
      animationFrameRef.current = requestAnimationFrame(updateMetrics);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [visible, updateMetrics]);
  
  // Check for performance issues
  const checkPerformanceIssues = (
    currentFps: number, 
    currentFrameTime: number, 
    insights: PerformanceInsights
  ) => {
    const newAlerts: string[] = [];
    
    if (currentFps < 30) {
      newAlerts.push('Critical: Very low FPS detected');
    } else if (currentFps < 45) {
      newAlerts.push('Warning: Low FPS detected');
    }
    
    if (currentFrameTime > 33.33) { // 30fps threshold
      newAlerts.push('High frame time detected');
    }
    
    if (insights.slowAnimations.length > 0) {
      newAlerts.push(`${insights.slowAnimations.length} slow animation(s) detected`);
    }
    
    if (insights.performanceScore < 50) {
      newAlerts.push('Low performance score detected');
    }
    
    if (newAlerts.length > 0 && onPerformanceIssue) {
      onPerformanceIssue(newAlerts[0]);
    }
    
    setAlerts(newAlerts);
  };
  
  // Get position classes
  const getPositionClasses = () => {
    const baseClasses = 'fixed z-50 p-4 bg-black/80 backdrop-blur-md text-white rounded-lg shadow-xl';
    const positionClasses = {
      'top-left': 'top-4 left-4',
      'top-right': 'top-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'bottom-right': 'bottom-4 right-4',
    };
    
    return `${baseClasses} ${positionClasses[position]}`;
  };
  
  // Get FPS color based on performance
  const getFpsColor = () => {
    if (fps >= 55) return 'text-green-400';
    if (fps >= 30) return 'text-yellow-400';
    return 'text-red-400';
  };
  
  // Get performance score color
  const getScoreColor = () => {
    if (performanceScore >= 80) return 'text-green-400';
    if (performanceScore >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };
  
  // Get memory usage color
  const getMemoryColor = () => {
    if (memoryUsage < 50) return 'text-green-400';
    if (memoryUsage < 100) return 'text-yellow-400';
    return 'text-red-400';
  };
  
  // Render FPS graph
  const renderFpsGraph = () => {
    if (frameHistory.length < 2) return null;
    
    const maxFps = Math.max(...frameHistory.map(h => h.fps), 60);
    const minFps = 0;
    const range = maxFps - minFps;
    
    const points = frameHistory.map((frame, index) => {
      const x = (index / (maxHistorySize - 1)) * 100;
      const y = 100 - ((frame.fps - minFps) / range) * 100;
      return `${x},${y}`;
    }).join(' ');
    
    return (
      <svg width="200" height="60" className="w-full h-full">
        <polyline
          fill="none"
          stroke={fps >= 55 ? '#4ade80' : fps >= 30 ? '#facc15' : '#ef4444'}
          strokeWidth="2"
          points={points}
        />
        <line
          x1="0"
          y1="50"
          x2="100"
          y2="50"
          stroke="#ffffff30"
          strokeWidth="1"
          strokeDasharray="2,2"
        />
      </svg>
    );
  };
  
  if (!visible) return null;
  
  return (
    <div className={getPositionClasses()}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">Performance Monitor</h3>
        <div className="flex items-center gap-2">
          {alerts.length > 0 && (
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs opacity-70 hover:opacity-100 transition-opacity"
          >
            {isExpanded ? '−' : '+'}
          </button>
        </div>
      </div>
      
      {/* Main metrics */}
      <div className="grid grid-cols-2 gap-4 mb-2">
        <div>
          <div className="text-xs opacity-70">FPS</div>
          <div className={`text-lg font-bold ${getFpsColor()}`}>
            {fps}
          </div>
        </div>
        <div>
          <div className="text-xs opacity-70">Score</div>
          <div className={`text-lg font-bold ${getScoreColor()}`}>
            {performanceScore}
          </div>
        </div>
      </div>
      
      {/* FPS Graph */}
      <div className="h-15 mb-2">
        {renderFpsGraph()}
      </div>
      
      {/* Expanded details */}
      {isExpanded && showDetails && (
        <div className="space-y-2 text-xs border-t border-white/20 pt-2">
          <div className="flex justify-between">
            <span className="opacity-70">Frame Time:</span>
            <span>{frameTime}ms</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-70">Memory:</span>
            <span className={getMemoryColor()}>{memoryUsage}MB</span>
          </div>
          
          {currentQuality && (
            <div className="flex justify-between">
              <span className="opacity-70">Quality:</span>
              <span className={
                currentQuality.quality === 'high' ? 'text-green-400' :
                currentQuality.quality === 'medium' ? 'text-yellow-400' :
                'text-red-400'
              }>
                {currentQuality.quality}
              </span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span className="opacity-70">Hardware Accel:</span>
            <span className={currentQuality?.useHardwareAcceleration ? 'text-green-400' : 'text-red-400'}>
              {currentQuality?.useHardwareAcceleration ? 'ON' : 'OFF'}
            </span>
          </div>
          
          {/* Alerts */}
          {alerts.length > 0 && (
            <div className="mt-2 space-y-1">
              <div className="text-xs font-semibold text-red-400">Alerts:</div>
              {alerts.map((alert, index) => (
                <div key={index} className="text-xs text-red-300">
                  • {alert}
                </div>
              ))}
            </div>
          )}
          
          {/* Performance recommendations */}
          {monitorRef.current && (
            <div className="mt-2 space-y-1">
              <div className="text-xs font-semibold text-blue-400">Recommendations:</div>
              {monitorRef.current.getInsights().recommendations.slice(0, 3).map((rec, index) => (
                <div key={index} className="text-xs text-blue-300">
                  • {rec}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PerformanceMonitor;