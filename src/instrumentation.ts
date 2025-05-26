
export async function register() {
  if(process.env.NEXT_RUNTIME === "nodejs") {
    const {default: processManager} = await import("@/lib/process-manager");
    processManager.initialize();
  }  
}

