import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "node:crypto";
import { CompanyEntity } from "../createCompany/model";

export class CompanyService {
    private readonly TABLE_NAME = 'Companies';
    private readonly ddbDocClient: DynamoDBDocumentClient;

    constructor() {
        const client = new DynamoDBClient({});
        this.ddbDocClient = DynamoDBDocumentClient.from(client);
    }

    async save(companyEntity: CompanyEntity): Promise<CompanyEntity> {
        companyEntity.id = randomUUID();

        const command = new PutCommand({
            TableName: this.TABLE_NAME,
            Item: companyEntity
        });

        await this.ddbDocClient.send(command);
        return companyEntity;
    }

    async companyExists(cuit: string): Promise<boolean> {
        const command = new GetCommand({
            TableName: this.TABLE_NAME,
            Key: { cuit }
        });

        const result = await this.ddbDocClient.send(command);
        return !!result.Item;
    }
}