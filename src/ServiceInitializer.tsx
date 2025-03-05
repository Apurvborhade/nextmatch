import { initializeServices } from '@/app/lib/init';

// This will only run once during server startup, not on client-side navigation
let initialized = false;
export function ServiceInitializer() {
    if (typeof window === 'undefined' && !initialized) {
        console.log("Initializing services...");
        initializeServices().catch((error) => {
            console.error("Failed to initialize services:", error);
        });
        initialized = true;
    }
    return null;
}