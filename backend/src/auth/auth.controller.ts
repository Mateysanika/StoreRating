import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRole } from '../users/user.entity';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post('signup')
  async signup(

    @Body('email') email: string,
    @Body('password') password: string,
    @Body('role') role: UserRole,
    @Body('name') name: string,
    @Body('address') address: string,

  ) {
    
    return this.authService.signup(email, password, role, name, address);
  }

  @Post('login')
  async login(

    @Body('email') email: string,
    @Body('password') password: string,

  ) {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      return { error: 'Invalid credentials' };

    }
    return this.authService.login(user);
    
  }
}
