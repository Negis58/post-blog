import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import UserEntity from '../../user/user.entity';

@Entity()
export class RefreshSessionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.refreshSessions, {
    eager: true,
  })
  user: UserEntity;

  @Column({ type: 'uuid' })
  refreshToken: string;

  @Column()
  expiresIn: string;

  @Column({ type: 'time with time zone', default: () => 'NOW()' })
  createdAt: Date;
}
