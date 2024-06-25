import { Request, Response, NextFunction } from "express";
import logger from "../config/logger";

const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    logger.error(err.stack);
    res.status(500).send({ message: "Internal Server Error" })
};

export default errorHandler 