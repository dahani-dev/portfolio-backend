import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AdminUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;
}
