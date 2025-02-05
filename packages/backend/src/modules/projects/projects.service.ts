import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project, ProjectStatus } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async create(
    createProjectDto: CreateProjectDto,
    user: User,
  ): Promise<Project> {
    const project = this.projectsRepository.create({
      ...createProjectDto,
      owner: user,
      ownerId: user.id,
      status: ProjectStatus.ACTIVE,
    });

    return this.projectsRepository.save(project);
  }

  async findAll(user: User): Promise<Project[]> {
    return this.projectsRepository.find({
      where: { ownerId: user.id },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, user: User): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.ownerId !== user.id) {
      throw new ForbiddenException('You do not have access to this project');
    }

    return project;
  }

  async update(
    id: string,
    updateProjectDto: Partial<CreateProjectDto>,
    user: User,
  ): Promise<Project> {
    const project = await this.findOne(id, user);

    Object.assign(project, updateProjectDto);
    return this.projectsRepository.save(project);
  }

  async delete(id: string, user: User): Promise<void> {
    const project = await this.findOne(id, user);

    // Check if project has any members (this will be implemented later when we add project members)
    // For now, we'll just delete the project
    await this.projectsRepository.remove(project);
  }

  async deactivate(id: string, user: User): Promise<Project> {
    const project = await this.findOne(id, user);
    project.status = ProjectStatus.DEACTIVATED;
    return this.projectsRepository.save(project);
  }
}
