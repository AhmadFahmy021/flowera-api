import { Injectable, BadRequestException } from '@nestjs/common';

export interface Destination {
  id: number;
  label: string;
  province_name: string;
  city_name: string;
  district_name: string;
  subdistrict_name: string;
  zip_code: string;
}

export interface ShippingCostResponse {
  name: string;
  code: string;
  service: string;
  description: string;
  cost: number;
  etd: string;
}

@Injectable()
export class ShippingService {
  private readonly baseUrl = 'https://rajaongkir.komerce.id/api/v1';

  // ─────────────────────────────────────
  // Search Destinations
  // ─────────────────────────────────────
  async searchDestinations(
    search: string,
    limit: number = 100,
    offset: number = 0,
  ): Promise<Destination[]> {
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      params.set('limit', String(limit));
      params.set('offset', String(offset));

      const url = `${this.baseUrl}/destination/domestic-destination?${params.toString()}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'key': 'CNZu6Hxfc186b26354a2be2bXnCxcicV'
        },
      });

      if (!response.ok) {
        throw new BadRequestException(
          `RajaOngkir API error: ${response.status} ${response.statusText}`,
        );
      }

      const result = await response.json();

      if (result.meta?.code !== 200) {
        throw new BadRequestException(
          result.meta?.message ?? 'Failed to fetch destinations',
        );
      }

      return (result.data ?? []) as Destination[];
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException(
        `Failed to fetch destinations: ${(error as Error).message}`,
      );
    }
  }

  // ─────────────────────────────────────
  // Calculate Domestic Shipping Cost
  // ─────────────────────────────────────
  async calculateCost(
    origin: string,
    destination: string,
    weight: number,
    courier: string,
    price?: string,
  ): Promise<ShippingCostResponse[]> {
    try {
      const body = new URLSearchParams();
      body.set('origin', origin);
      body.set('destination', destination);
      body.set('weight', String(weight));
      body.set('courier', courier);
      if (price) body.set('price', price);

      console.log(body);
      

      const url = `${this.baseUrl}/calculate/domestic-cost`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'key': 'CNZu6Hxfc186b26354a2be2bXnCxcicV'
        },
        body: body.toString(),
      });

      console.log(response);
      

      if (!response.ok) {
        throw new BadRequestException(
          `RajaOngkir API error: ${response.status} ${response.statusText}`,
        );
      }

      const result = await response.json();

      if (result.meta?.code !== 200) {
        throw new BadRequestException(
          result.meta?.message ?? 'Failed to calculate shipping cost',
        );
      }

      return (result.data ?? []) as ShippingCostResponse[];
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException(
        `Failed to calculate shipping cost: ${(error as Error).message}`,
      );
    }
  }
}