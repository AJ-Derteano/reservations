import { Injectable } from '@nestjs/common';
import { SendEmailDto } from '../dto/send-email.dto';
import { ErrorManager } from 'src/utils/errorManager.util';
import { Resend } from 'resend';

@Injectable()
export class NotificationService {
  async sendEmail(dto: SendEmailDto) {
    try {
      const resend = new Resend(process.env.EMAIL_API_KEY);
      const { data, error } = await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: ['delivered@resend.dev'],
        subject: 'Hello World',
        html: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Confirmación de reserva</title>
  </head>
  <body style="margin:0; padding:0; font-family:Arial,Helvetica,sans-serif; background-color:#f5f6fa;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#f5f6fa; padding:24px 0;">
      <tr>
        <td align="center">
          <!-- Card -->
          <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
            <!-- Header -->
            <tr>
              <td align="center" style="background:#2b6cb0; padding:24px;">
                <h1 style="color:#ffffff; margin:0; font-size:24px;">¡Reserva confirmada!</h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:32px;">
                <p style="margin:0 0 16px; font-size:16px; color:#333333;">
                  Hola <strong>{{customerName}}</strong>,
                </p>

                <p style="margin:0 0 16px; font-size:16px; color:#333333;">
                  Gracias por reservar con <strong>{{companyName}}</strong>. A continuación encontrarás los detalles de tu reserva:
                </p>

                <table cellpadding="0" cellspacing="0" role="presentation" style="width:100%; border-collapse:collapse; font-size:14px; color:#333333;">
                  <tr>
                    <td style="padding:8px 0; width:150px;"><strong>Recurso:</strong></td>
                    <td style="padding:8px 0;">{{resourceName}}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;"><strong>Tipo:</strong></td>
                    <td style="padding:8px 0;">{{reservationType}}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;"><strong>Fecha inicio:</strong></td>
                    <td style="padding:8px 0;">{{startDateTime}}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;"><strong>Fecha fin:</strong></td>
                    <td style="padding:8px 0;">{{endDateTime}}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;"><strong>Cantidad:</strong></td>
                    <td style="padding:8px 0;">{{quantity}}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;"><strong>Precio total:</strong></td>
                    <td style="padding:8px 0;">S/ {{totalPrice}}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;"><strong>Estado pago:</strong></td>
                    <td style="padding:8px 0;">{{paymentStatus}}</td>
                  </tr>
                </table>

                <p style="margin:24px 0 0; font-size:16px; color:#333333;">
                  Si tienes alguna pregunta, responde a este correo o contáctanos en <a href="mailto:{{supportEmail}}" style="color:#2b6cb0;">{{supportEmail}}</a>.
                </p>

                <p style="margin:24px 0 0; font-size:16px; color:#333333;">
                  ¡Esperamos verte pronto!
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="background:#f0f0f0; padding:16px; font-size:12px; color:#666666;">
                © {{currentYear}} {{companyName}}. Todos los derechos reservados.
              </td>
            </tr>
          </table>
          <!-- End Card -->
        </td>
      </tr>
    </table>
  </body>
</html>
`,
      });

      if (error) {
        new ErrorManager({ type: 'BAD_REQUEST', message: 'Error send email' });
      }

      return data;
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
