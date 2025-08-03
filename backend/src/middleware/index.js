import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { apiLimiter } from './auth.js';

export const setupMiddleware = (app) => {
  // Security headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false
  }));

  // Enable CORS with security considerations
  app.use(cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      const allowedOrigins = process.env.NODE_ENV === 'production' 
        ? (process.env.ALLOWED_ORIGINS || '').split(',')
        : ['http://localhost:3000', 'http://localhost:8081', 'http://localhost:19006']; // React and Expo dev servers
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    maxAge: 86400 // 24 hours
  }));

  // Rate limiting for all API requests
  app.use('/api', async (req, res, next) => {
    try {
      await apiLimiter.consume(req.ip);
      next();
    } catch (error) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.',
        retryAfter: Math.round(error.msBeforeNext / 1000)
      });
    }
  });

  // Parse JSON bodies with size limit
  app.use(express.json({ 
    limit: '10mb',
    verify: (req, res, buf) => {
      // Store raw body for webhook signature verification if needed
      req.rawBody = buf;
    }
  }));
  
  // Parse URL-encoded bodies
  app.use(express.urlencoded({ 
    extended: true,
    limit: '10mb'
  }));

  // Security middleware to prevent parameter pollution
  app.use((req, res, next) => {
    // Clean up query parameters
    for (const key in req.query) {
      if (Array.isArray(req.query[key])) {
        req.query[key] = req.query[key][req.query[key].length - 1];
      }
    }
    next();
  });

  // Request logging middleware with security considerations
  app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.path;
    const ip = req.ip || req.connection.remoteAddress;
    
    // Don't log sensitive data
    const sanitizedUrl = url.replace(/password=[^&]+/gi, 'password=***');
    
    console.log(`${timestamp} - ${ip} - ${method} ${sanitizedUrl}`);
    next();
  });

  // Disable X-Powered-By header
  app.disable('x-powered-by');

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error('Error:', {
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.path,
      ip: req.ip
    });

    // Don't leak error details in production
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    res.status(err.status || 500).json({
      success: false,
      message: isDevelopment ? err.message : 'Internal server error',
      ...(isDevelopment && { 
        stack: err.stack,
        details: err.details 
      })
    });
  });
};
