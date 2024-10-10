import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { RedisService } from './data/redis/redis.service';

@Injectable()
export class AppService {
  apiURL: string;
  apiToken: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {
    this.apiURL = this.configService.get('IMAGES_API');
    this.apiToken = this.configService.get('IMAGES_API_TOKEN');
  }

  async getImages() {
    const images = await axios
      .get(`${this.apiURL}/photos/random`, {
        params: {
          count: 30,
          collections: 1028299, // Restaurants
        },
        headers: {
          Authorization: `Client-ID ${this.apiToken}`,
        },
      })
      .then(({ data }) => {
        const processedImages: any[] = data.map((item) => ({
          id: item.id,
          image: item.urls.raw,
        }));

        processedImages.forEach((pi) => {
          this.redisService.set(pi.id, pi);
        });

        return processedImages;
      })
      .catch(() => {
        return this.redisService.getAll();
      });

    return images.slice(0, 30);
  }
}
