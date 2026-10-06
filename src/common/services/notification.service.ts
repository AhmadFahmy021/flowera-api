import { Injectable } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class NotificationService {

    async orderFinished(data: any) {

        await axios.post(
            `${process.env.NOTIFICATION_URL}/notification/order-finished`,
            data,
        );

    }

    async orderFinishedImage(data: any) {

        await axios.post(
            `${process.env.NOTIFICATION_URL}/notification/order-finished-image`,
            data,
        );

    }


    async orderRevisiUser(data: any) {

        await axios.post(
            `${process.env.NOTIFICATION_URL}/notification/order-revision-email`,
            data,
        );

    }

}