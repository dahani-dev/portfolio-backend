import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

const CURRENT_TIMESTAMP = 'CURRENT_TIMESTAMP(6)';

// name: 'projects' is mean:
// It specifies the **table name** in the database that this entity will map to.
// Without this, the table name would be the same as the class name by default ('Project' → 'project').
// By using name: 'projects', we explicitly tell TypeORM to use the table name 'projects'.
@Entity({ name: 'projects' })
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  image: string;

  @Column()
  category: string;

  @Column()
  link: string;

  @Column()
  github: string;

  // @CreateDateColumn() is mean:
  // This decorator is used to automatically store the creation date of a record.
  // It inserts the current timestamp ONLY when the row is first created.

  // type: 'timestamp' is mean:
  // The database column type will be 'timestamp' (date and time format).

  // default: () => CURRENT_TIMESTAMP is mean:
  // When a new record is inserted, the default value for this column will be the current date and time.

  // CURRENT_TIMESTAMP is mean:
  // It's a SQL function that returns the current date and time from the database server.

  @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  createdAt: Date;

  // @UpdateDateColumn() is mean:
  // This decorator is used to automatically store the last updated date of a record.
  // It updates the column value automatically whenever the row is updated.

  // onUpdate: CURRENT_TIMESTAMP is mean:
  // Every time the record is updated, the database will automatically set this field to the current date and time.

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => CURRENT_TIMESTAMP,
    onUpdate: CURRENT_TIMESTAMP,
  })
  updatedAt: Date;
}
