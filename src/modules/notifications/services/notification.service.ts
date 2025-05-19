import { Injectable } from '@nestjs/common';
import { SendEmailDto } from '../dto/send-email.dto';
import axios from 'axios';
import { ErrorManager } from 'src/utils/errorManager.util';

@Injectable()
export class NotificationService {
  async sendEmail(dto: SendEmailDto) {
    try {
      const URL = this.getUrl() + '/messaging/send-email';
      console.log('dto', dto);

      axios({
        url: URL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          to: dto.to,
          subject: dto.subject,
          body: dto.text,
        },
      });
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  getReservationPendingTemplate(dto: {
    names: string;
    reservationName: string;
    reservationType: string;
    startTime: string;
    endTime: string;
    duration: string;
    quantity: string;
    price: string;
    reservationId: string;
    reservationStatus: string;
  }) {
    // Templae in plain text

    return `Hola su reserva ha sido creada con exito, se encuentra en estado ${dto.reservationStatus}, le contactaremos para confirmar la reserva`;

    // return `<!DOCTYPE html>
    //   <html lang="en">
    //     <head>
    //       <meta charset="UTF-8" />
    //       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    //       <title>Reservation Confirmation</title>
    //     </head>
    //     <body>
    //       <h1>Reservation Confirmation</h1>
    //       <p>Dear ${dto.names},</p>
    //       <p>Your reservation for ${dto.reservationName} has been confirmed.</p>
    //       <p>Details:</p>
    //       <ul>
    //         <li>Type: ${dto.reservationType}</li>
    //         <li>Start Time: ${dto.startTime}</li>
    //         <li>End Time: ${dto.endTime}</li>
    //         <li>Duration: ${dto.duration}</li>
    //         <li>Quantity: ${dto.quantity}</li>
    //         <li>Total Price: ${dto.price}</li>
    //         <li>Status: ${dto.reservationStatus}</li>
    //       </ul>
    //     </body>
    //   </html>`;
  }

  private getUrl() {
    const host = process.env.EMAIL_API_HOST;
    const port = process.env.EMAIL_API_PORT;
    const path = process.env.EMAIL_API_PATH;

    const URL = host + (port ? ':' + port : '') + '/' + path;

    return URL;
  }
}
