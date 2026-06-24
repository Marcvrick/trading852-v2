#\!/bin/bash
cd "$(dirname "$0")"
command -v node >/dev/null && [ -f build.js ] && node build.js
PORT=8799
URL="http://localhost:$PORT/analyses/market-thesis"
echo "Trading852 preview -> $URL  (Ctrl+C to stop)"
( sleep 1; open "$URL" ) &
python3 -m http.server "$PORT" --directory dist
