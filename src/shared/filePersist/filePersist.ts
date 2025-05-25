import * as path from 'path';
import * as fs from 'fs';

export class FilePersist {
    private filePath: string;

    async init(fileName: string) { 
        if (this.filePath) {
            throw new Error("FilePersist was initialized");
        }

        this.filePath = path.join(process.cwd(), 'assets', 'iodata', fileName);

        const dataDir = path.dirname(this.filePath);
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
    }

    async load(): Promise<unknown[]> {
        let dataArray: unknown[] = [];
        try {
            if (fs.existsSync(this.filePath)) {
                const data = await fs.promises.readFile(this.filePath, 'utf8');
                dataArray = JSON.parse(data) as unknown[];
                console.log(`Data loaded from ${this.filePath}`);
            } else {
                await this.save();
                console.log(`No data file found, created empty file at ${this.filePath}`);
            }
        } catch (error) {
            console.error(`Error loading data from file ${this.filePath}:`, error);
        }
        return dataArray;
    }

    async save(dataArray?: unknown[]): Promise<void> {
        if (!dataArray) {
            dataArray = [];
        }
        try { 
            const data = JSON.stringify(dataArray, null, 2); // 'null, 2' para formato legible
            await fs.promises.writeFile(this.filePath, data, 'utf8');
            console.log(`Data saved to ${this.filePath}`);
        } catch (error) {
            console.error(`Error saving data to file ${this.filePath}:`, error);
        }
    }
}
