import axios from 'axios';
import axiosCookieJarSupport from 'axios-cookiejar-support';
import * as cheerio from 'cheerio';
import * as querystring from 'querystring';
import tough = require('tough-cookie');
import { Summary } from './model/summary';
import Grid from './utils/grid';

export class Kingoloto {
  private uri = {
    connect: '/include/login.php',
    playUri: '/play.php',
    gridUri: '/urlCdv.php',
  };

  private axiosInstance = axios.create({
    baseURL: 'https://www.kingoloto.com',
    withCredentials: true,
  });

  private constructor(private email: string, private password: string) {
    axiosCookieJarSupport(this.axiosInstance);
    this.axiosInstance.defaults.jar = new tough.CookieJar();
  }

  public static async init(email: string, password: string): Promise<Kingoloto> {
    const self = new Kingoloto(email, password);
    return self.connect();
  }

  public async playGrid(): Promise<boolean> {
    const token = await this.fetchGridToken();
    if (undefined === token) {
      return false;
    }
    return this.postGrid(token);
  }

  private async fetchGridToken(): Promise<string> {
    const response = await this.axiosInstance.get(this.uri.playUri);
    const $ = cheerio.load(response.data);
    return $('#gridBtn').data('token');
  }

  private async postGrid(token: string): Promise<boolean> {
    const postData = querystring.stringify({
      favoris: 'false',
      'grid-token': token,
      liste: Grid.generate,
    });
    const axiosConfig = {
      headers: {
        'Content-Length': postData.length,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    const response = await this.axiosInstance.post(this.uri.gridUri, postData, axiosConfig);
    return response.status === 200;
  }

  public async summary(): Promise<Summary> {
    const response = await this.axiosInstance.get(this.uri.playUri);
    const $ = cheerio.load(response.data);
    const user = new Summary();

    const img = $('.play-summary img').attr('src');
    if (img !== undefined) {
      const gridFinder = img.match(/([0-9]+)\.gif/);
      if (gridFinder) {
        user.grid = Number(gridFinder[1]);
      }
    }

    const stats = $('.account-summary');
    user.cash = parseFloat($(stats[0]).text().replace(',', '.'));
    user.point = parseFloat($(stats[1]).text().replace(' ', ''));

    return user;
  }

  private async connect(): Promise<Kingoloto> {
    const postData = querystring.stringify({
      email: this.email,
      pass: this.password,
    });
    const axiosConfig = {
      headers: {
        'Content-Length': postData.length,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    const connected = await this.axiosInstance.post(this.uri.connect, postData, axiosConfig).then((response) => {
      return response.status === 200;
    });

    if (!connected) {
      throw new Error('cannot connect');
    }

    return this;
  }
}
