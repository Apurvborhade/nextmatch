import { initializeServices } from '@/app/lib/init';
let initialized = false;
export function ServiceInitializer() {
    if(initialized) return;
    if (typeof window == 'undefined') {
        console.log("Initializing services...");
        initializeServices().catch((error) => {
            console.error("Failed to initialize services:", error);
        });
        initialized = true;
    }
    return null;
}