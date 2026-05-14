import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { BaseResponse } from '../../shared/infrastructure/base-response';
import { UserResource } from './user-response';
import { UserAssembler } from './user-assembler';
import { User } from '../domain/model/user.entity';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserApiEndpoint extends BaseApiEndpoint<User, UserResource, BaseResponse, UserAssembler> {
  constructor(http: HttpClient, assembler: UserAssembler) {
    super(http, `${environment.apiBaseUrl}${environment.usersEndpointPath}`, assembler);
  }
}
