import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../database/entities/user.entity';
import { Admin } from '../database/entities/admin.entity';
import { Seller } from '../database/entities/seller.entity';
import { ConfigService } from '@nestjs/config';

describe('AuthService', () => {
  let service: AuthService;

  const mockUserRepository = {
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };

  const mockAdminRepository = {
    findOne: jest.fn(),
  };

  const mockSellerRepository = {
    findOne: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'JWT_ACCESS_PRIVATE_KEY') return 'keys/private.pem';
      if (key === 'JWT_REFRESH_PRIVATE_KEY') return 'keys/private.pem';
      if (key === 'JWT_ACCESS_EXPIRES') return '15m';
      if (key === 'JWT_REFRESH_EXPIRES') return '7d';
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Admin),
          useValue: mockAdminRepository,
        },
        {
          provide: getRepositoryToken(Seller),
          useValue: mockSellerRepository,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('googleLogin', () => {
    it('should register a new user and generate a unique username if email prefix is unique', async () => {
      const googleUser = {
        googleId: '12345',
        name: 'Jane Doe',
        email: 'jane@gmail.com',
        avatar: 'http://avatar.url',
      };

      // Mock repository return values
      mockUserRepository.findOneBy.mockImplementation((query) => {
        if (query.email) return null; // Email not registered
        if (query.username) return null; // Username unique
        return null;
      });

      mockUserRepository.create.mockImplementation((dto) => ({
        id: 1,
        ...dto,
      }));

      mockUserRepository.save.mockImplementation((user) => Promise.resolve(user));
      mockUserRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.googleLogin(googleUser);

      expect(mockUserRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: googleUser.name,
          email: googleUser.email,
          username: 'jane',
          googleId: googleUser.googleId,
          avatar: googleUser.avatar,
        }),
      );
      expect(mockUserRepository.save).toHaveBeenCalled();
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('should append a differentiator suffix to the username if the initial email prefix username is already taken', async () => {
      const googleUser = {
        googleId: '67890',
        name: 'John Doe',
        email: 'john@gmail.com',
        avatar: 'http://avatar.url',
      };

      // Mock username check: 'john' is already taken
      mockUserRepository.findOneBy.mockImplementation((query) => {
        if (query.email) return null; // Email not registered
        if (query.username === 'john') {
          return { id: 2, username: 'john', email: 'other@gmail.com' };
        }
        return null; // Any other username (like john123) is unique
      });

      mockUserRepository.create.mockImplementation((dto) => ({
        id: 3,
        ...dto,
      }));

      mockUserRepository.save.mockImplementation((user) => Promise.resolve(user));
      mockUserRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.googleLogin(googleUser);

      expect(mockUserRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: googleUser.name,
          email: googleUser.email,
          username: expect.stringMatching(/^john\d{3}$/), // Must contain jane/john prefix + 3 digit suffix differentiator
          googleId: googleUser.googleId,
          avatar: googleUser.avatar,
        }),
      );
      expect(mockUserRepository.save).toHaveBeenCalled();
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('should successfully login and return tokens if user already exists by email', async () => {
      const googleUser = {
        googleId: '12345',
        name: 'Jane Doe',
        email: 'jane@gmail.com',
        avatar: 'http://avatar.url',
      };

      const existingUser = {
        id: 10,
        name: 'Jane Doe',
        email: 'jane@gmail.com',
        username: 'jane',
        googleId: '12345',
        avatar: 'http://avatar.url',
      };

      mockUserRepository.findOneBy.mockImplementation((query) => {
        if (query.email === googleUser.email) return existingUser;
        return null;
      });

      mockUserRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.googleLogin(googleUser);

      expect(mockUserRepository.create).not.toHaveBeenCalled();
      expect(mockUserRepository.save).not.toHaveBeenCalled();
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });
  });
});
