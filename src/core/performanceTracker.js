export class PerformanceTracker {
  constructor() {
    this.metrics = {
      agentCalls: {},
      responseTimes: [],
      memoryUsage: []
    };
    this.startTime = performance.now();
  }

  trackAgentCall(agentName) {
    if (!this.metrics.agentCalls[agentName]) {
      this.metrics.agentCalls[agentName] = 0;
    }
    this.metrics.agentCalls[agentName]++;
  }

  trackResponseTime(startTime) {
    const duration = performance.now() - startTime;
    this.metrics.responseTimes.push(duration);
    return duration;
  }

  trackMemoryUsage() {
    if (performance.memory) {
      this.metrics.memoryUsage.push(performance.memory.usedJSHeapSize);
    }
  }

  getSummary() {
    const totalTime = performance.now() - this.startTime;
    const avgResponseTime = this.metrics.responseTimes.length > 0 
      ? this.metrics.responseTimes.reduce((a, b) => a + b, 0) / this.metrics.responseTimes.length
      : 0;

    return {
      totalTime,
      avgResponseTime,
      agentCalls: this.metrics.agentCalls,
      memoryUsage: this.metrics.memoryUsage
    };
  }

  reset() {
    this.metrics = {
      agentCalls: {},
      responseTimes: [],
      memoryUsage: []
    };
    this.startTime = performance.now();
  }
}