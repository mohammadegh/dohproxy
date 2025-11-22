import { Controller, Get, Post, Query, Headers, Req, Res, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { DohService } from './doh.service';

const CONTENT_TYPE_DNS = 'application/dns-message';
const CONTENT_TYPE_JSON = 'application/dns-json';
const PATH_PREFIX = process.env.PATH_PREFIX || '';

@Controller(PATH_PREFIX)
export class DohController {
    constructor(private readonly dohService: DohService) { }

    /**
     * Handle GET request with DNS query parameter
     * Example: /?dns=AAABAAABAAAAAAAAA3d3dwdleGFtcGxlA2NvbQAAAQAB
     */
    @Get()
    async handleGet(
        @Query('dns') dnsParam: string,
        @Headers('accept') acceptHeader: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        // Check if this is a DNS wireformat request
        if (dnsParam) {
            try {
                const response = await this.dohService.handleGetDnsWireformat(dnsParam);

                res.status(response.status);
                res.set('Content-Type', CONTENT_TYPE_DNS);

                // Copy relevant headers from upstream
                if (response.headers['cache-control']) {
                    res.set('Cache-Control', response.headers['cache-control']);
                }

                return res.send(Buffer.from(response.data));
            } catch (error) {
                return res.status(HttpStatus.BAD_GATEWAY).send();
            }
        }

        // Check if this is a JSON format request
        if (acceptHeader === CONTENT_TYPE_JSON) {
            try {
                const queryString = req.url.substring(req.url.indexOf('?'));
                const response = await this.dohService.handleGetJson(queryString);

                res.status(response.status);
                res.set('Content-Type', CONTENT_TYPE_JSON);

                // Copy relevant headers from upstream
                if (response.headers['cache-control']) {
                    res.set('Cache-Control', response.headers['cache-control']);
                }

                return res.json(response.data);
            } catch (error) {
                return res.status(HttpStatus.BAD_GATEWAY).send();
            }
        }

        // No valid request found
        return res.status(HttpStatus.NOT_FOUND).send();
    }

    /**
     * Handle POST request with DNS body (wireformat)
     * Content-Type: application/dns-message
     */
    @Post()
    async handlePost(
        @Headers('content-type') contentType: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        // Only accept DNS wireformat
        if (contentType !== CONTENT_TYPE_DNS) {
            return res.status(HttpStatus.NOT_FOUND).send();
        }

        try {
            // Collect the body as a buffer for streaming
            const chunks: Buffer[] = [];

            for await (const chunk of req) {
                chunks.push(Buffer.from(chunk));
            }

            const body = Buffer.concat(chunks);

            const response = await this.dohService.handlePostDnsWireformat(body);

            res.status(response.status);
            res.set('Content-Type', CONTENT_TYPE_DNS);

            // Copy relevant headers from upstream
            if (response.headers['cache-control']) {
                res.set('Cache-Control', response.headers['cache-control']);
            }

            return res.send(Buffer.from(response.data));
        } catch (error) {
            return res.status(HttpStatus.BAD_GATEWAY).send();
        }
    }
}
