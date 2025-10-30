import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db'; 

class Task extends Model {
  public id!: number;
  public title!: string;
  public description!: string;
  public status!: 'todo' | 'in progress' | 'done';
}

Task.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: true },
    status: { type: DataTypes.ENUM('todo', 'in progress', 'done'), defaultValue: 'todo' },
  },
  { sequelize, modelName: 'task' }
);

export default Task;
