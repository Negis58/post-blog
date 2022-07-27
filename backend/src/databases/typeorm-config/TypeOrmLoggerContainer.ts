import { Logger as TypeOrmLogger, QueryRunner } from 'typeorm';
import { LoggerOptions as TypeOrmLoggerOptions } from 'typeorm/logger/LoggerOptions';
import { Logger } from '@nestjs/common';

export class TypeOrmLoggerContainer implements TypeOrmLogger {
  static ForConnection(connectionName: string, options: TypeOrmLoggerOptions) {
    const logger = new Logger(`TypeORM[${connectionName}]`);
    return new TypeOrmLoggerContainer(logger, options);
  }

  constructor(
    private readonly logger: Logger,
    private readonly options: TypeOrmLoggerOptions,
  ) {}

  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    if (
      this.options === 'all' ||
      this.options === true ||
      (this.options instanceof Array && this.options.indexOf('query') !== -1)
    ) {
      const sql =
        query +
        (parameters && parameters.length
          ? ' -- PARAMETERS: ' + this.stringifyParams(parameters)
          : '');
      this.logger.log('query' + ': ' + sql);
    }
  }

  logQueryError(
    error: string,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ) {
    if (
      this.options === 'all' ||
      this.options === true ||
      (this.options instanceof Array && this.options.indexOf('error') !== -1)
    ) {
      const sql =
        query +
        (parameters && parameters.length
          ? ' -- PARAMETERS: ' + this.stringifyParams(parameters)
          : '');
      this.logger.error(`query failed: ` + sql);
      this.logger.error(`error:`, error);
    }
  }

  logQuerySlow(
    time: number,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ) {
    const sql =
      query +
      (parameters && parameters.length
        ? ' -- PARAMETERS: ' + this.stringifyParams(parameters)
        : '');
    this.logger.log(`query is slow: ` + sql);
    this.logger.log(`execution time: ` + time);
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner) {
    if (
      this.options === 'all' ||
      (this.options instanceof Array && this.options.indexOf('schema') !== -1)
    ) {
      this.logger.log(message);
    }
  }

  logMigration(message: string, queryRunner?: QueryRunner) {
    this.logger.log(message);
  }

  log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner) {
    switch (level) {
      case 'log':
        if (
          this.options === 'all' ||
          (this.options instanceof Array && this.options.indexOf('log') !== -1)
        )
          this.logger.log(message);
        break;
      case 'info':
        if (
          this.options === 'all' ||
          (this.options instanceof Array && this.options.indexOf('info') !== -1)
        )
          this.logger.debug(message);
        break;
      case 'warn':
        if (
          this.options === 'all' ||
          (this.options instanceof Array && this.options.indexOf('warn') !== -1)
        )
          this.logger.warn(message);
        break;
    }
  }

  protected stringifyParams(parameters: any[]) {
    try {
      return JSON.stringify(parameters);
    } catch (error) {
      return parameters;
    }
  }
}
