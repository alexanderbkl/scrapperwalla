const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    // Handle worker exit
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died. Restarting...`);
        cluster.fork();
    });

} else {
    const workerId = cluster.worker.id;
    const start = (workerId - 1) * 100 + 1;
    const end = workerId * 100;

    for (let i = start; i <= end; i++) {
        console.log(i);
    }
}