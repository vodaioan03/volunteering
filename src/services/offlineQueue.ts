import { opportunityService } from "./opportunities";
const OFFLINE_QUEUE_KEY = 'offline_opportunities_queue';

type QueueItem = {
  type: 'CREATE' | 'UPDATE' | 'DELETE' | 'WITHDRAW' | 'APPLY';
  data: any;
  timestamp: number;
};
import localforage from 'localforage';

class OfflineQueue {
  private queue: QueueItem[] = [];

  constructor() {
    this.loadQueue();
  }

  private async loadQueue() {
    const saved = await localforage.getItem<string>(OFFLINE_QUEUE_KEY);
    this.queue = saved ? JSON.parse(saved) : [];
  }

  private async saveQueue() {
    await localforage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(this.queue));
  }

  public addToQueue(item: Omit<QueueItem, 'timestamp'>) {
    this.queue.push({ ...item, timestamp: Date.now() });
    this.saveQueue();
  }

  public async processQueue() {
    while (this.queue.length > 0) {
      const item = this.queue[0];
      try {
        switch (item.type) {
          case 'CREATE':
            await opportunityService.create(item.data);
            break;
          case 'UPDATE':
            await opportunityService.update(item.data.id, item.data);
            break;
          case 'DELETE':
            await opportunityService.delete(item.data.id);
            break;
        }
        this.queue.shift();
        this.saveQueue();
      } catch (error) {
        console.error('Failed to sync item:', item, error);
        break;
      }
    }
  }

  public getQueue() {
    return [...this.queue];
  }
}

export const offlineQueue = new OfflineQueue();