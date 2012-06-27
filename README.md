# pickup - pipe podcast RSS to JSON

    npm install -g jsontool
    git clone git://github.com/michaelnisi/pickup.git
    cd pickup
    
    curl -sS http://feeds.feedburner.com/back2work | node example/stdin.js | json
    
    node example/stdout.js | json
    
    node example/proxy.js
    curl -sS http://127.0.0.1:8080/?uri=http://feeds.feedburner.com/back2work
