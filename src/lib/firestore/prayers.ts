import { BaseFirestoreService } from './base';
import { Timestamp } from 'firebase/firestore';

export interface PrayerRequest {
  id: string;
  title: string;
  content: string;
  category: 'healing' | 'guidance' | 'thanksgiving' | 'protection' | 'other';
  status: 'pending' | 'approved' | 'rejected' | 'answered';
  isAnonymous: boolean;
  isPublic: boolean;
  submitterName?: string;
  submitterEmail?: string;
  submitterUserId?: string;
  approvedBy?: string;
  approvedAt?: Date;
  answeredAt?: Date;
  answerDescription?: string;
  prayerCount: number;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
  tags?: string[];
  urgency: 'low' | 'medium' | 'high';
}

export interface PrayerResponse {
  id: string;
  prayerRequestId: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  message?: string;
  type: 'prayer' | 'encouragement' | 'testimony';
  isAnonymous: boolean;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
}

export class PrayerRequestsService extends BaseFirestoreService {
  constructor() {
    super('prayer_requests');
  }

  async createPrayerRequest(
    requestData: Omit<PrayerRequest, 'id' | 'status' | 'prayerCount' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    const data = {
      ...requestData,
      status: 'pending' as const,
      prayerCount: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    // Filter out undefined values that Firestore doesn't accept
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined)
    );

    return await this.create(filteredData);
  }

  async getPrayerRequestById(requestId: string): Promise<PrayerRequest | null> {
    const request = await this.getById(requestId);
    if (!request) return null;

    return this.formatPrayerRequestData(request);
  }

  async updatePrayerRequest(requestId: string, updates: Partial<PrayerRequest>): Promise<void> {
    const { id, createdAt, ...updateData } = updates;
    await this.update(requestId, updateData);
  }

  async approvePrayerRequest(requestId: string, approvedBy: string): Promise<void> {
    await this.update(requestId, {
      status: 'approved',
      approvedBy,
      approvedAt: Timestamp.now(),
      isPublic: true,
    });
  }

  async rejectPrayerRequest(requestId: string, approvedBy: string): Promise<void> {
    await this.update(requestId, {
      status: 'rejected',
      approvedBy,
      approvedAt: Timestamp.now(),
    });
  }

  async markAsAnswered(
    requestId: string, 
    answerDescription: string, 
    answeredBy: string
  ): Promise<void> {
    await this.update(requestId, {
      status: 'answered',
      answerDescription,
      answeredAt: Timestamp.now(),
      approvedBy: answeredBy,
    });
  }

  async incrementPrayerCount(requestId: string): Promise<void> {
    const request = await this.getById(requestId);
    if (request) {
      await this.update(requestId, {
        prayerCount: (request.prayerCount || 0) + 1,
      });
    }
  }

  async getPublicPrayerRequests(options?: {
    category?: string;
    status?: 'approved' | 'answered';
    limit?: number;
    urgency?: 'low' | 'medium' | 'high';
  }): Promise<PrayerRequest[]> {
    const whereConstraints: Array<[string, any, any]> = [
      ['isPublic', '==', true],
      ['status', 'in', ['approved', 'answered']]
    ];

    if (options?.category) {
      whereConstraints.push(['category', '==', options.category]);
    }

    if (options?.status) {
      whereConstraints[1] = ['status', '==', options.status];
    }

    if (options?.urgency) {
      whereConstraints.push(['urgency', '==', options.urgency]);
    }

    const requests = await this.getAll({
      where: whereConstraints,
      orderBy: [['urgency', 'desc'], ['createdAt', 'desc']],
      limit: options?.limit,
    });

    return requests.map(request => this.formatPrayerRequestData(request));
  }

  async getAllPrayerRequests(status?: PrayerRequest['status']): Promise<PrayerRequest[]> {
    const whereConstraints: Array<[string, any, any]> = [];

    if (status) {
      whereConstraints.push(['status', '==', status]);
    }

    const requests = await this.getAll({
      where: whereConstraints.length > 0 ? whereConstraints : undefined,
      orderBy: [['createdAt', 'desc']],
    });

    return requests.map(request => this.formatPrayerRequestData(request));
  }

  async getPendingPrayerRequests(): Promise<PrayerRequest[]> {
    return await this.getAllPrayerRequests('pending');
  }

  async getAnsweredPrayerRequests(limit?: number): Promise<PrayerRequest[]> {
    const requests = await this.getAll({
      where: [['status', '==', 'answered'], ['isPublic', '==', true]],
      orderBy: [['answeredAt', 'desc']],
      limit,
    });

    return requests.map(request => this.formatPrayerRequestData(request));
  }

  async getUserPrayerRequests(userId: string): Promise<PrayerRequest[]> {
    const requests = await this.getAll({
      where: [['submitterUserId', '==', userId]],
      orderBy: [['createdAt', 'desc']],
    });

    return requests.map(request => this.formatPrayerRequestData(request));
  }

  async searchPrayerRequests(searchTerm: string): Promise<PrayerRequest[]> {
    const [titleResults, contentResults] = await Promise.all([
      this.getAll({
        where: [
          ['isPublic', '==', true],
          ['status', 'in', ['approved', 'answered']],
          ['title', '>=', searchTerm],
          ['title', '<=', searchTerm + '\uf8ff']
        ],
        orderBy: [['title', 'asc']],
        limit: 10,
      }),
      this.getAll({
        where: [
          ['isPublic', '==', true],
          ['status', 'in', ['approved', 'answered']],
          ['tags', 'array-contains-any', [searchTerm]]
        ],
        limit: 10,
      }),
    ]);

    const allResults = [...titleResults, ...contentResults];
    const uniqueResults = allResults.filter((request, index, array) => 
      array.findIndex(r => r.id === request.id) === index
    );

    return uniqueResults.map(request => this.formatPrayerRequestData(request));
  }

  async deletePrayerRequest(requestId: string): Promise<void> {
    await this.delete(requestId);
  }

  async getPrayerStats(): Promise<{
    totalRequests: number;
    pendingRequests: number;
    approvedRequests: number;
    answeredRequests: number;
    totalPrayers: number;
  }> {
    const allRequests = await this.getAll();
    
    const stats = allRequests.reduce((acc, request) => {
      acc.totalRequests++;
      switch (request.status) {
        case 'pending':
          acc.pendingRequests++;
          break;
        case 'approved':
          acc.approvedRequests++;
          break;
        case 'answered':
          acc.answeredRequests++;
          break;
      }
      acc.totalPrayers += request.prayerCount || 0;
      return acc;
    }, {
      totalRequests: 0,
      pendingRequests: 0,
      approvedRequests: 0,
      answeredRequests: 0,
      totalPrayers: 0,
    });

    return stats;
  }

  async getExpiredRequests(): Promise<PrayerRequest[]> {
    const now = Timestamp.now();
    const requests = await this.getAll({
      where: [['expiresAt', '<=', now], ['status', '!=', 'answered']],
    });

    return requests.map(request => this.formatPrayerRequestData(request));
  }

  private formatPrayerRequestData(requestData: any): PrayerRequest {
    return {
      id: requestData.id,
      title: requestData.title || '',
      content: requestData.content || '',
      category: requestData.category || 'other',
      status: requestData.status || 'pending',
      isAnonymous: requestData.isAnonymous || false,
      isPublic: requestData.isPublic || false,
      submitterName: requestData.submitterName,
      submitterEmail: requestData.submitterEmail,
      submitterUserId: requestData.submitterUserId,
      approvedBy: requestData.approvedBy,
      answerDescription: requestData.answerDescription,
      prayerCount: requestData.prayerCount || 0,
      tags: requestData.tags || [],
      urgency: requestData.urgency || 'medium',
      createdAt: this.timestampToDate(requestData.createdAt) || new Date(),
      updatedAt: this.timestampToDate(requestData.updatedAt) || new Date(),
      approvedAt: this.timestampToDate(requestData.approvedAt) || undefined,
      answeredAt: this.timestampToDate(requestData.answeredAt) || undefined,
      expiresAt: this.timestampToDate(requestData.expiresAt) || undefined,
    };
  }
}

export class PrayerResponsesService extends BaseFirestoreService {
  constructor() {
    super('prayer_responses');
  }

  async createResponse(
    responseData: Omit<PrayerResponse, 'id' | 'status' | 'createdAt'>
  ): Promise<string> {
    const data = {
      ...responseData,
      status: 'pending' as const,
      createdAt: Timestamp.now(),
    };

    return await this.create(data);
  }

  async getResponsesForPrayer(prayerRequestId: string): Promise<PrayerResponse[]> {
    const responses = await this.getAll({
      where: [['prayerRequestId', '==', prayerRequestId], ['status', '==', 'approved']],
      orderBy: [['createdAt', 'asc']],
    });

    return responses.map(response => this.formatResponseData(response));
  }

  async approveResponse(responseId: string, approvedBy: string): Promise<void> {
    await this.update(responseId, {
      status: 'approved',
      approvedBy,
      approvedAt: Timestamp.now(),
    });
  }

  async rejectResponse(responseId: string): Promise<void> {
    await this.update(responseId, {
      status: 'rejected',
    });
  }

  async getPendingResponses(): Promise<PrayerResponse[]> {
    const responses = await this.getAll({
      where: [['status', '==', 'pending']],
      orderBy: [['createdAt', 'desc']],
    });

    return responses.map(response => this.formatResponseData(response));
  }

  private formatResponseData(responseData: any): PrayerResponse {
    return {
      id: responseData.id,
      prayerRequestId: responseData.prayerRequestId || '',
      userId: responseData.userId,
      userName: responseData.userName,
      userEmail: responseData.userEmail,
      message: responseData.message,
      type: responseData.type || 'prayer',
      isAnonymous: responseData.isAnonymous || false,
      status: responseData.status || 'pending',
      approvedBy: responseData.approvedBy,
      createdAt: this.timestampToDate(responseData.createdAt) || new Date(),
      approvedAt: this.timestampToDate(responseData.approvedAt) || undefined,
    };
  }
}

export const prayerRequestsService = new PrayerRequestsService();
export const prayerResponsesService = new PrayerResponsesService();