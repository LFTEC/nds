import logger from "./logger";
import { esTransport } from "./logger";

class ProcessManager {
  private initialized = false;

  public constructor(){
  }

  public initialize(): void {
    if(this.initialized) return;
    console.log(process.env.NEXT_RUNTIME);
    console.log('Initializing process manager...');

    const gracefulShutdown = async (signal: string): Promise<void> =>{
      console.log(`\nReceived ${signal}. Starting graceful shutdown...`);
      try {
        logger.info('Application shutting down...', {signal});
        await esTransport.flush();
        console.log('Graceful shutdown completed.');
        process.exit(0);
      } catch (error) {
        console.error('Error during graceful shutdown:', error);
        process.exit(1);
      }
      
    }

    process.on("SIGINT", async ()=> { await gracefulShutdown("SIGINT"); });
    process.on("SIGUSR2", async ()=> { await gracefulShutdown("SIGUSR2"); });
    process.on("SIGTERM", async ()=> { await gracefulShutdown("SIGTERM"); });

    this.initialized = true;
    console.log("Process manager initialized.");
  }
}

const globalForProcessManager = global as unknown as {
  processManager: ProcessManager;
}

const processManager = globalForProcessManager.processManager || new ProcessManager();
if(process.env.NODE_ENV !== "production") {
  globalForProcessManager.processManager = processManager;
}

export default processManager;