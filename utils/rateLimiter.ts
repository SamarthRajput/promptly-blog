interface RateLimiterOptions {
  maxRequests: number;
  windowMs: number;
  name?: string;
}

class RateLimiter {
    private requests: number[] = [];
    private maxRequests: number;
    private windowMs: number;
    private name: string;

    constructor(options: RateLimiterOptions) {
        this.maxRequests = options.maxRequests;
        this.windowMs = options.windowMs;
        this.name = options.name || 'RateLimiter';
    }

    async check(): Promise<boolean> {
        const now = Date.now();
        
        this.requests = this.requests.filter(
            timestamp => now - timestamp < this.windowMs
        );

        if (this.requests.length >= this.maxRequests) {
            console.log(`[${this.name}] Rate limit exceeded: ${this.requests.length}/${this.maxRequests}`);
            return false;
        }
        
        this.requests.push(now);
        return true;
    }

    async acquire(): Promise<void> {
        const now = Date.now();
        
        this.requests = this.requests.filter(time => now - time < this.windowMs);

        if (this.requests.length >= this.maxRequests) {
            const oldestRequest = this.requests[0];
            const waitTime = this.windowMs - (now - oldestRequest) + 100;
        
            console.log(`[${this.name}] Rate limit reached. Waiting ${waitTime}ms...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
        
            return this.acquire();
        }

        this.requests.push(now);
    }

    getRemaining(): number {
        const now = Date.now();
        this.requests = this.requests.filter(time => now - time < this.windowMs);
        return Math.max(0, this.maxRequests - this.requests.length);
    }

    getTimeUntilReset(): number {
        const now = Date.now();
        this.requests = this.requests.filter(time => now - time < this.windowMs);
        
        if (this.requests.length === 0) return 0;
        
        const oldestRequest = this.requests[0];
        return Math.max(0, this.windowMs - (now - oldestRequest));
    }


    reset(): void {
        this.requests = [];
        console.log(`[${this.name}] Rate limiter reset`);
    }
}

export const geminiRateLimiter = new RateLimiter({
  maxRequests: 60,  
  windowMs: 60000, 
  name: 'Gemini API'
});

export const imagenRateLimiter = new RateLimiter({
  maxRequests: 30,  
  windowMs: 60000, 
  name: 'Imagen API'
});

export const unsplashRateLimiter = new RateLimiter({
  maxRequests: 50,  
  windowMs: 3600000, 
  name: 'Unsplash API'
});

export { RateLimiter };
