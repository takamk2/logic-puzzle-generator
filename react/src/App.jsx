
import React, { useState } from 'react';
import LogicPuzzleGenerator from './components/LogicPuzzleGenerator';
import LogicPuzzleAnalyzer from './components/LogicPuzzleAnalyzer';
import './App.css';

function App() {
  const [page, setPage] = useState('generator');

  return (
    <div id="app">
      <div className="buttons">
        <button
          disabled={page === 'generator'}
          onClick={() => setPage('generator')}
        >
          Generator
        </button>
        <button
          disabled={page === 'analyzer'}
          onClick={() => setPage('analyzer')}
        >
          Analyzer
        </button>
      </div>

      {page === 'generator' && (
        <div>
          <h1>LogicPuzzleGenerator</h1>
          <LogicPuzzleGenerator />
        </div>
      )}

      {page === 'analyzer' && (
        <div>
          <h1>LogicPuzzleAnalyzer</h1>
          <LogicPuzzleAnalyzer />
        </div>
      )}
    </div>
  );
}

export default App;
