import {
  Controller,
  Patch,
  Param,
  Sse,
} from '@nestjs/common';
import { PreparationsService } from '../services/preparations.service';
import { Observable, from, interval, map, switchMap } from 'rxjs';

@Controller('preparations')
export class PreparationsController {
  constructor(private readonly preparationsService: PreparationsService) {}

  // GET METHODS //

  // @Get('/all')
  // async getAllPreparations() {
  //   return await this.preparationsService.getAllPreparations();
  // }

  @Sse('/all')
  sse(): Observable<MessageEvent> {
    return interval(10000).pipe(
      switchMap(() => from(this.preparationsService.getAllPreparations())),
      map((data) => {
        return { data } as MessageEvent;
      }),
    );
  }

  // PATH METHODS //

  @Patch('/releaseQuota/:id')
  async releaseQuota( @Param ("id") id: string) {
    return await this.preparationsService.releaseQuota(id);
  }

}
