import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthGuard } from './auth.guard';
import { APP_GUARD } from '@nestjs/core'; // 1. Impor token APP_GUARD

@Module({
  imports: [],
  controllers: [AppController],
  // 2. Kita akan mengubah cara mendaftarkan provider untuk AuthGuard
  providers: [
    AppService,
    // 3. Gunakan sintaks ini untuk menjadikan AuthGuard sebagai Global Guard
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
