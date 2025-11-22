import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Readable } from 'stream';
import * as http from 'http';
import * as https from 'https';

@Injectable()
export class DohService {
    private readonly dohEndpoint: string;
    private readonly dohJsonEndpoint: string;
    private readonly axiosInstance: AxiosInstance;

    constructor() {
        this.dohEndpoint = process.env.DOH_ENDPOINT || 'https://security.cloudflare-dns.com/dns-query';
        this.dohJsonEndpoint = process.env.DOH_JSON_ENDPOINT || 'https://security.cloudflare-dns.com/dns-query';

        // Configure Axios with connection pooling and keep-alive
        this.axiosInstance = axios.create({
            timeout: 5000, // 5 second timeout
            maxRedirects: 0,
            httpAgent: new http.Agent({
                keepAlive: true,
                maxSockets: 100,
                maxFreeSockets: 10,
                timeout: 60000,
                keepAliveMsecs: 30000,
            }),
            httpsAgent: new https.Agent({
                keepAlive: true,
                maxSockets: 100,
                maxFreeSockets: 10,
                timeout: 60000,
                keepAliveMsecs: 30000,
            }),
        });
    }

    /**
     * Handle GET request with DNS query parameter (wireformat)
     */
    async handleGetDnsWireformat(dnsParam: string): Promise<AxiosResponse<Buffer>> {
        return this.axiosInstance.get(this.dohEndpoint, {
            params: { dns: dnsParam },
            headers: {
                'Accept': 'application/dns-message',
            },
            responseType: 'arraybuffer',
        });
    }

    /**
     * Handle POST request with DNS body (wireformat with streaming)
     */
    async handlePostDnsWireformat(body: Buffer | Readable): Promise<AxiosResponse<Buffer>> {
        return this.axiosInstance.post(this.dohEndpoint, body, {
            headers: {
                'Accept': 'application/dns-message',
                'Content-Type': 'application/dns-message',
            },
            responseType: 'arraybuffer',
            maxBodyLength: Infinity,
            maxContentLength: Infinity,
        });
    }

    /**
     * Handle GET request with JSON Accept header
     */
    async handleGetJson(queryParams: string): Promise<AxiosResponse> {
        const url = `${this.dohJsonEndpoint}${queryParams}`;
        return this.axiosInstance.get(url, {
            headers: {
                'Accept': 'application/dns-json',
            },
        });
    }
}
