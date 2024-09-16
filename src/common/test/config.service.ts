import { ConfigService } from '@nestjs/config';

export class MockConfigService extends ConfigService {
  getOrThrow(propertyPath: string) {
    return propertyPath;
  }
}
