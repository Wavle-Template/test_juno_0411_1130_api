import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import SettingConfig from '@app/setting'
import { getMockDbConnection } from '@test/utils/mock-db';
import { UserArchiveEntity } from '@app/entity/user/archive/user-archive.entity';
import { UserSuspenedLogEntity } from '@app/entity/user/log/suspended.entity';
import { SleeperEntity } from '@app/entity/user/sleeper/sleeper.entity';
import { UserSocialEntity } from '@app/entity';
import { UserSocialModule } from '../../social.module';
import { UserSocialAppleLoginModule } from '../apple-login.module';
import { APPLE_JWKS_CLIENT } from '../apple-login.const';
import { JwksClient } from 'jwks-rsa';
import { UserSocialAppleLoginResolver } from '../apple-login.resolver';
import { UserSocialAppleLoginService } from '../apple-login.service';


describe('Apple-Login-Integration-Test', () => {
    let module: TestingModule
    let connection;

    beforeAll(async () => {

        connection = await getMockDbConnection([
            UserSocialEntity, UserArchiveEntity, SleeperEntity, UserSuspenedLogEntity
        ])
        module = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    load: [SettingConfig]
                }),
                TypeOrmModule.forRoot(),
                UserSocialAppleLoginModule
            ],
        }).overrideProvider(Connection)
            .useValue(connection)
            .compile();

    });

    it('should be defined UserSocialAppleLoginService', () => {
        expect(module.get<UserSocialAppleLoginService>(UserSocialAppleLoginService)).toBeDefined();
    });

    it('should be defined APPLE_JWKS_CLIENT', () => {
        expect(module.get<JwksClient>(APPLE_JWKS_CLIENT)).toBeDefined();
    });

    it('should be defined UserSocialModule', () => {
        expect(module.get<UserSocialModule>(UserSocialModule)).toBeDefined();
    });

    it('should be defined UserSocialAppleLoginResolver', () => {
        expect(module.get<UserSocialAppleLoginResolver>(UserSocialAppleLoginResolver)).toBeDefined();
    });

    it('should be defined module', () => {
        expect(module.get<UserSocialAppleLoginModule>(UserSocialAppleLoginModule)).toBeDefined();
    });

    afterAll(async () => {
        if (module) await module.close();
        if (connection) await connection.close();
    })


});
