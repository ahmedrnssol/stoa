/*******************************************************************************

    This file contain the Exchange class.

    Copyright:
        Copyright (c) 2021 BOSAGORA Foundation
        All rights reserved.

    License:
        MIT License. See LICENSE for details.

*******************************************************************************/
import sgMail from '@sendgrid/mail';
import { Config } from './Config';
import moment from 'moment';
import { logger } from './Logger';
import { Operation, Status } from './LogOperation';
import { HeightManager } from './HeightManager';

const config = Config.createWithArgument();
export const mailer = async (operation: string, message?: any): Promise<void> => {
    return new Promise<void>(async (resolve, reject) => {
        if (config.sendgrid.api_key === "" || config.sendgrid.email === "" || config.sendgrid.receiver_email === "") {
            logger.info(`Sendgrid API or email not provided`, {
                operation: Operation.connection,
                height: HeightManager.height.toString(),
                status: Status.Error,
                responseTime: Number(moment().utc().unix() * 1000),
            });
            return resolve();
        }
        const mailOptions = {
            to: config.sendgrid.receiver_email,
            from: config.sendgrid.email, // email of the sender
            subject: "Error caught",
            html: `Dear Admin \n\n 
                                Error has been occurred while ${operation} on ${moment().utc().toISOString()} . \n\n <br>
                                ${message ? message : ''}
                                `,
        };
        sgMail
            .send(mailOptions).then(() => {
                return resolve();
            }).catch((err) => {
                logger.error(`Error While sending Email: ${err}`, {
                    operation: Operation.connection,
                    height: HeightManager.height.toString(),
                    status: Status.Error,
                    responseTime: Number(moment().utc().unix() * 1000),
                });
                return reject(`Error While sending Email: ${err}`);
            });
    });
}
