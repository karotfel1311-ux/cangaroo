/**
 * Data types for downloader integration
 */

export interface SingleItem {
  id: string;
  externalId: string;
  fileName: string;
  status: string;
  bytesLoaded: string;
  bytesTotal: string;
  eta: string;
}

export interface Task {
  id: string;
  externalId: string;
  title: string;
  status: string;
  items: Array<SingleItem>;
}

export interface CreateTaskData {
  catalogName: string;
  links: Array<string>;
  password: string;
}

export interface CreateTaskOptions {
  password?: string;
  id: string;
}

/**
 * Abstract base class for all downloader implementations.
 * Provides a common interface for different download services.
 */
export abstract class Downloader {
  /**
   * Initialize integration internals (credentials/secrets/config)
   */
  abstract init(): Promise<void>;

  /**
   * Connect to the downloader service
   */
  abstract connect(): Promise<void>;

  /**
   * Disconnect from the downloader service
   */
  abstract disconnect(): Promise<void>;

  /**
   * Check if downloader is connected and available
   */
  abstract isConnected(): Promise<boolean>;

  /**
   * Fetch all active tasks from the downloader
   */
  abstract fetchTasks(): Promise<any>;

  /**
   * Create a new download task
   */
  abstract createTask(
    links: string[],
    options: CreateTaskOptions,
  ): Promise<any>;
}
