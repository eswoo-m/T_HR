import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import { RegisterAssetDto } from './dto/register-asset.dto';
import { RegisterAssetTypeDto } from './dto/register-assetType.dto';
import { GetAssetsDto } from '@modules/asset/dto/get-assets.dto';
import { UpdateAssetDto } from '@modules/asset/dto/update-asset.dto';

@Injectable()
export class AssetService {
  private prisma = new PrismaClient();

  // --- 자산 유형 등록 ---
  async createAssetType(dto: RegisterAssetTypeDto) {
    return this.prisma.assetType.create({
      data: {
        name: dto.name,
        description: dto.description || '',
      },
    });
  }

  // --- 자산 실물 등록 ---
  async registerAsset(dto: RegisterAssetDto) {
    return this.prisma.asset.create({
      data: {
        name: dto.name,
        vendor: dto.vendor,
        model: dto.model,
        serialNo: dto.serialNo,
        number: dto.number,
        status: dto.status,
        remarks: dto.remarks,
        assignDate: dto.assignDate ? new Date(dto.assignDate) : undefined,

        purchaseDate: new Date(dto.purchaseDate),
        purchaseAmount: new Prisma.Decimal(dto.purchaseAmount || 0),
        warrantyDate: dto.warrantyDate ? new Date(dto.warrantyDate) : undefined,

        assetType: { connect: { id: dto.typeId } },
        ...(dto.employeeId && { employee: { connect: { id: dto.employeeId } } }),
        ...(dto.teamId && { team: { connect: { id: dto.teamId } } }),
      },
    });
  }

  async getAssetTypes() {
    return this.prisma.assetType.findMany({
      where: { isActive: true },
      orderBy: { id: 'asc' },
    });
  }

  async toggleTypeStatus(id: number, isActive: boolean) {
    const assetType = await this.prisma.assetType.findUnique({
      where: { id },
    });

    if (!assetType) {
      throw new NotFoundException('해당 자산 유형을 찾을 수 없습니다.');
    }

    return this.prisma.assetType.update({
      where: { id },
      data: { isActive },
    });
  }

  async getAssets(dto: GetAssetsDto) {
    const { status, assetTypeId, teamId, keyword, dept, team } = dto;

    const where: Prisma.AssetWhereInput = {
      AND: [
        (assetTypeId ? { typeId: Number(assetTypeId) } : {}) as Prisma.AssetWhereInput,
        (status && status !== 'all' ? { status } : {}) as Prisma.AssetWhereInput,
        (dept && dept !== 'all' ? { team: { parent: { name: dept } } } : {}) as Prisma.AssetWhereInput,
        (team && team !== 'all' ? { team: { name: team } } : {}) as Prisma.AssetWhereInput,
        (teamId ? { teamId: Number(teamId) } : {}) as Prisma.AssetWhereInput,

        (keyword
          ? {
              OR: [{ name: { contains: keyword, mode: 'insensitive' } }, { number: { contains: keyword, mode: 'insensitive' } }, { serialNo: { contains: keyword, mode: 'insensitive' } }, { employee: { nameKr: { contains: keyword, mode: 'insensitive' } } }],
            }
          : {}) as Prisma.AssetWhereInput,
      ],
    };

    const [list, total] = await Promise.all([
      this.prisma.asset.findMany({
        where,
        include: {
          assetType: true,
          team: true,
          employee: true,
        },
        // 💡 정렬도 DTO에서 받아서 처리하면 더 좋겠죠? ㅋ
        orderBy: dto.sortField ? { [dto.sortField]: dto.sortOrder || 'desc' } : { registDate: 'desc' },
      }),
      this.prisma.asset.count({ where }),
    ]);

    return { list, total };
  }

  async getAssetById(id: number) {
    const asset = await this.prisma.asset.findUnique({
      where: { id },
      include: {
        assetType: true,
        team: true,
        employee: true,
        assetHistories: {
          orderBy: {
            regTime: 'desc',
          },
        },
      },
    });

    // console.log('--- [Asset Data 로드 완료] ---');
    // console.log(JSON.stringify(asset, null, 2)); // 2는 들여쓰기 칸수입니다. ㅋ
    // console.log('----------------------------');

    if (!asset) {
      throw new NotFoundException(`ID가 ${id}인 자산을 찾을 수 없어요! ㅋ`);
    }

    return {
      ...asset,
      assetHistory: asset.assetHistories.filter((h) => h.category === 'ASSIGNMENT' || h.category == 'MOVE'),
      maintenanceHistory: asset.assetHistories.filter((h) => !(h.category === 'ASSIGNMENT' || h.category === 'MOVE')),
    };
  }

  async updateAssetWithHistory(id: number, dto: UpdateAssetDto) {
    return this.prisma.$transaction(async (tx) => {
      const updatedAsset = await tx.asset.update({
        where: { id },
        data: {
          employeeId: dto.employeeId,
          teamId: dto.teamId,
          status: dto.status,
          remarks: dto.remarks,
          assignDate: dto.assignDate,
        },
      });

      if (dto.assetHistories && dto.assetHistories.length > 0) {
        await tx.assetHistory.createMany({
          data: dto.assetHistories.map((h) => ({
            assetId: id,

            category: h.category,
            cost: h.cost,
            actorName: h.actorName,
            remarks: h.remarks,
            content: h.content,
            regTime: h.regTime ? new Date(h.regTime) : new Date(),
          })),
        });
      }

      return {
        success: true,
        message: '자산 업데이트 및 이력 저장 완료!',
        data: updatedAsset,
      };
    });
  }
}
