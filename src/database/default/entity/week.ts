import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BaseTimestamp } from "./baseTimestamp";
import Shift from "./shift";

@Entity()
export default class Week extends BaseTimestamp {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "date",
  })
  startDate: string; // Start of the week (Monday)

  @Column({
    type: "date",
  })
  endDate: string; // End of the week (Sunday)

  @Column({
    type: "boolean",
    default: false,
  })
  isPublished: boolean;

  @Column({
    type: "timestamp",
    nullable: true,
  })
  publishedAt: Date | null;

  @OneToMany(() => Shift, (shift) => shift.week)
  shifts: Shift[];

  constructor(startDate: string, endDate: string) {
    super();
    this.startDate = startDate;
    this.endDate = endDate;
    this.isPublished = false;
    this.publishedAt = null;
  }
}

