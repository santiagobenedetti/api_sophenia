import { config } from 'dotenv';
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as hbs from 'handlebars';
import { promises } from 'fs';
const { readFile } = promises;
config();

@Injectable()
export class NotificatorService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });
  }

  /**
   * Send notifications by email
   *
   * @param to
   * @param subject
   * @param templateName
   * @param templateParams
   */
  async send(
    to: string,
    subject: string,
    templateName: string,
    templateParams: any,
  ) {
    try {
      const html = await this.getTemplate(templateName, templateParams);
      await this.transporter.sendMail(this.getEmailConfig(subject, to, html));
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Error sending email ' + error.message);
    }
  }

  /**
   * Send notifications by email, batch method
   *
   * @param to
   * @param subject
   * @param templateName
   * @param templateParams
   */
  async sendBatch(
    to: string[],
    subject: string,
    templateName: string,
    templateParams: any,
  ) {
    const sendPromises = to.map((mail) =>
      this.send(mail, subject, templateName, templateParams),
    );
    await Promise.all(sendPromises);
  }

  /**
   * Get an HTML template and replace params
   * Templates in ./templates (Handlebars)
   *
   * @param templateName
   * @param templateParams
   */
  async getTemplate(templateName, templateParams) {
    try {
      const path =
        process.cwd() + `/src/notificator/templates/${templateName}.hbs`;
      const content = await readFile(path, { encoding: 'utf8' });
      const template = hbs.compile(content);
      const html = template(templateParams);
      return html;
    } catch (error) {
      console.error('Error obtaining template:', error);
      throw new Error('Error obtaining template');
    }
  }

  /**
   * Returns email configuration
   *
   * @param subject
   * @param to
   * @param html
   */
  getEmailConfig(subject: string, to: string, html: string) {
    return {
      from: process.env.EMAIL_SENDER,
      to: to,
      subject: subject,
      html: html,
    };
  }
}
