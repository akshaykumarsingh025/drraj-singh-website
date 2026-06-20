@echo off
echo Starting local server (caching disabled so fresh edits always show)...
echo Open http://localhost:8080 in your browser
echo Press Ctrl+C to stop
npx serve . -p 8080 --no-clipboard --no-port-switching
