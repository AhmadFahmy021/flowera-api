import slugify from 'slugify';

export class SlugHelper {
  static generate(value: string): string {
    return slugify(value, {
      lower: true,
      strict: true,
      trim: true,
    });
  }

  static generateWithTimestamp(
    value: string,
  ): string {
    return `${this.generate(value)}-${Date.now()}`;
  }
}