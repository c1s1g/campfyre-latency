const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 3000;

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

app.use(express.json());

// Basic health check
app.get('/', (req, res) => {
  res.json({
    message: 'Railway-Supabase Latency Test Server',
    timestamp: new Date().toISOString(),
    region: process.env.RAILWAY_REGION || 'unknown'
  });
});

// Test simple Supabase connection
app.get('/test/connection', async (req, res) => {
  try {
    const start = performance.now();
    
    // Simple query to test connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    const latency = Math.round(performance.now() - start);
    
    if (error) {
      return res.json({
        success: false,
        error: error.message,
        latency: `${latency}ms`,
        timestamp: new Date().toISOString()
      });
    }
    
    res.json({
      success: true,
      latency: `${latency}ms`,
      timestamp: new Date().toISOString(),
      note: 'Simple connection test'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Test multiple query types
app.get('/test/comprehensive', async (req, res) => {
  const results = [];
  
  try {
    // Test 1: Simple select
    let start = performance.now();
    await supabase.from('users').select('id').limit(1);
    results.push({
      test: 'Simple SELECT',
      latency: `${Math.round(performance.now() - start)}ms`
    });
    
    // Test 2: Count query
    start = performance.now();
    await supabase.from('users').select('*', { count: 'exact', head: true });
    results.push({
      test: 'COUNT query',
      latency: `${Math.round(performance.now() - start)}ms`
    });
    
    // Test 3: Auth check (if you have auth enabled)
    start = performance.now();
    await supabase.auth.getSession();
    results.push({
      test: 'Auth session check',
      latency: `${Math.round(performance.now() - start)}ms`
    });
    
    // Calculate average
    const latencies = results.map(r => parseInt(r.latency));
    const average = Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length);
    
    res.json({
      success: true,
      results,
      averageLatency: `${average}ms`,
      timestamp: new Date().toISOString(),
      railwayRegion: process.env.RAILWAY_REGION || 'unknown'
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      results,
      timestamp: new Date().toISOString()
    });
  }
});

// Stress test - multiple rapid queries
app.get('/test/stress/:count?', async (req, res) => {
  const queryCount = parseInt(req.params.count) || 10;
  const results = [];
  
  try {
    console.log(`Running ${queryCount} rapid queries...`);
    
    for (let i = 0; i < queryCount; i++) {
      const start = performance.now();
      await supabase.from('users').select('id').limit(1);
      const latency = Math.round(performance.now() - start);
      results.push(latency);
    }
    
    const average = Math.round(results.reduce((a, b) => a + b, 0) / results.length);
    const min = Math.min(...results);
    const max = Math.max(...results);
    
    res.json({
      success: true,
      queryCount,
      results: results.map(r => `${r}ms`),
      statistics: {
        average: `${average}ms`,
        min: `${min}ms`,
        max: `${max}ms`
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      completedQueries: results.length,
      timestamp: new Date().toISOString()
    });
  }
});

// Network info
app.get('/test/network', (req, res) => {
  res.json({
    headers: req.headers,
    ip: req.ip,
    ips: req.ips,
    hostname: req.hostname,
    railwayRegion: process.env.RAILWAY_REGION || 'unknown',
    timestamp: new Date().toISOString()
  });
});

app.listen(port, () => {
  console.log(`Latency test server running on port ${port}`);
  console.log(`Railway Region: ${process.env.RAILWAY_REGION || 'unknown'}`);
  console.log(`Supabase URL: ${process.env.SUPABASE_URL || 'not set'}`);
});