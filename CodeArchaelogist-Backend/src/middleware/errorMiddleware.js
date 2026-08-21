export function notFound(req, res, next) {
    res.status(404).json({
        message: `Route not found: ${req.originalUrl}`,
    });
}

export function errorHandler(err, req, res, next) {
    console.error(err);

    const statusCode =
        err.statusCode && err.statusCode >= 400
            ? err.statusCode
            : 500;

    res.status(statusCode).json({
        message:
            err.publicMessage ||
            err.message ||
            "Internal server error",

        ...(process.env.NODE_ENV !== "production" && {
            stack: err.stack,
        }),
    });
}