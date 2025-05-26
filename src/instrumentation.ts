import processManager from "./lib/process-manager";

export function register() {
  if(process.env.NEXT_RUNTIME === "nodejs") {
    processManager.initialize();
  }  
}