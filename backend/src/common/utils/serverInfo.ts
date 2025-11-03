import chalk from 'chalk';
import { FastifyInstance } from 'fastify';
import os from 'os';

function getLocalIpAddress(): string {
    const interfaces = os.networkInterfaces();

    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]!) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

export function logServerInfo(port: number, env: string) {
    const environmentMap: Record<string, string> = {
        dev: 'Development',
        test: 'Test',
        prod: 'Production'
    };

    const resolvedEnv = environmentMap[env] || env;
    // const ip = getLocalIpAddress(); <- isso aqui vai mostrar o IP do PC
    const ip = "localhost"; // Por enquanto fica assim só para não mostrar o ip

    console.log(chalk.greenBright(`
 __  __          _____                       _            _ 
|  \\/  | ___    | ____|_ __   ___ ___  _ __ | |_ _ __ ___(_)
| |\\/| |/ _ \\   |  _| | '_ \\ / __/ _ \\| '_ \\| __| '__/ _ \\ |
| |  | |  __/   | |___| | | | (_| (_) | | | | |_| | |  __/ |
|_|  |_|\\___|___|_____|_| |_|\\___\\___/|_| |_|\\__|_|  \\___|_|
    `));
    console.log('');
    console.log(chalk.green.bold('✅ Server started successfully!'));
    console.log(chalk.blue(`🌐 Running at: `) + chalk.underline(`http://${ip}:${port}`));
    console.log(chalk.magenta(`🛠️  Environment:`), resolvedEnv);
    console.log(chalk.yellow(`👥 Team:`), 'Luís Artur Vieira Junqueira, Natanael Menezes Martins e Guilherme Gonçalves.');
    console.log('');
}

export function logServerError(err: unknown, app: FastifyInstance) {
    console.log(chalk.bgRed.white.bold(' ERROR '));
    if (err instanceof Error) {
        console.log(chalk.red.bold('Message: ') + chalk.red(err.message));
        if (err.stack) {
            console.log(chalk.gray('Stack trace:\n') + chalk.gray(err.stack));
        }
        app.log.error(err, 'Error starting the server');
    } else {
        console.log(chalk.red('Unknown error:'), err);
        app.log.error('Unknown error', err);
    }
}