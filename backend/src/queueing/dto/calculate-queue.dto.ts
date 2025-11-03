import {
  IsInt,
  IsNumber,
  IsPositive,
  IsOptional,
  IsEnum,
  Min,
} from 'class-validator';

export enum DisciplinaAtendimento {
  FIFO = 'FIFO',
  LIFO = 'LIFO',
}

export class CalculateQueueDto {
  @IsNumber()
  @IsPositive({
    message: 'A taxa de chegada ($lambda$) deve ser um número positivo.',
  })
  taxaDeChegada: number;

  @IsNumber()
  @IsPositive({
    message: 'A taxa de serviço ($mu$) deve ser um número positivo.',
  })
  taxaDeServico: number;

  @IsInt()
  @Min(1, { message: 'O número de servidores ($c$) deve ser pelo menos 1.' })
  numeroDeServidores: number;

  @IsEnum(DisciplinaAtendimento, {
    message: 'Disciplina de atendimento inválida. Suportado: "FIFO", "LIFO".',
  })
  disciplinaDeAtendimento: DisciplinaAtendimento;

  @IsOptional()
  @IsInt()
  @Min(1, {
    message: 'A capacidade máxima ($K$), se fornecida, deve ser pelo menos 1.',
  })
  capacidadeMaximaSistema?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  numeroInicialDeClientes?: number;
}
