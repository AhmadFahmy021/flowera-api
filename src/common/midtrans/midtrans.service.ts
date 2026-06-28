import { Injectable } from '@nestjs/common';
import * as midtransClient from 'midtrans-client';

@Injectable()
export class MidtransService {

    private snap: midtransClient.Snap;

    constructor(){

        this.snap = new midtransClient.Snap({

            isProduction:false,

            serverKey:process.env.MIDTRANS_SERVER_KEY,

            clientKey:process.env.MIDTRANS_CLIENT_KEY

        });

    }

    getSnap(){

        return this.snap;

    }

}