import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { PaymentService } from "./payment.service";

@Injectable()
export class PaymentScheduler {

    private readonly logger =
        new Logger(PaymentScheduler.name);

    constructor(

        private readonly paymentService: PaymentService,

    ) {}

    @Cron("*/5 * * * *")
    async syncPendingPayments() {

        this.logger.log(
            "Sync Pending Payment..."
        );

        await this.paymentService.syncPendingPayments();

    }

}